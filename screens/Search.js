import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";

import { COLORS, MAX_CANDIDATES, SIZES } from "../constants";
import { useInferenceContext } from "../utils/InferenceContext";
import {
  useDatasetContext,
  useAuthenticationContext,
  useUserInfoContext,
} from "../utils/DatasetContext";
import {
  FocusedStatusBar,
  ImagePickerCard,
  Candidates,
  RectButton,
} from "../components";

import { decode as atob, encode as btoa } from "base-64";

import { matchObjectsAsync, getFeatureAsync } from "../utils/Recognition";

function _base64ToArrayBuffer(base64) {
  var binary_string = atob(base64);
  var fLen = binary_string.length / Float32Array.BYTES_PER_ELEMENT;
  var dView = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
  var fAry = new Float32Array(fLen);
  var p = 0;

  for (var i = 0; i < fLen; i++) {
    p = i * 4;
    dView.setUint8(0, binary_string.charCodeAt(p));
    dView.setUint8(1, binary_string.charCodeAt(p + 1));
    dView.setUint8(2, binary_string.charCodeAt(p + 2));
    dView.setUint8(3, binary_string.charCodeAt(p + 3));
    fAry[i] = dView.getFloat32(0, true);
  }
  return fAry;
}

function _Float32ArrayToBase64String(fAry) {
  let uint = new Uint8Array(fAry.buffer);
  let str = btoa(String.fromCharCode.apply(null, uint));
  return str;
}

const Search = () => {
  const { gorillaData } = useDatasetContext();
  const { userInfo } = useUserInfoContext();
  const [galleryFeatures, setGalleryFeatures] = useState([]);
  const [pickedImage, setPickedImage] = useState(null);
  const [cropped, setCropped] = useState(null);
  const [candidates, setCandidates] = useState(null);
  const [imageFeature, setImageFeature] = useState(null);
  const [displaySize, setDisplaySize] = useState(320);
  const [doRestart, setDoRestart] = useState(false);

  const { isModelReady, recognitionModel } = useInferenceContext();

  const restart = () => {
    setDoRestart(true);
    setPickedImage(null);
    setCropped(null);
    setCandidates(null);
    setImageFeature(null);
    setDisplaySize(320);
  };

  useEffect(() => {
    if (gorillaData) {
      async function getGalleryFeatures() {
        let k = [];
        await gorillaData.reduce(async (promise, item) => {
          await promise;
          k.push(_base64ToArrayBuffer(item.feature).slice(0, 512));
        }, Promise.resolve());
        return k;
      }
      getGalleryFeatures().then((features) => {
        setGalleryFeatures(features);
      });
    }
  }, [gorillaData]);

  let decor = (v, i) => [v, i]; // set index to value
  let undecor = (a) => a[1]; // leave only index
  let argsort = (arr) =>
    arr.map(decor).sort().map(undecor).reverse().slice(0, MAX_CANDIDATES);

  useEffect(() => {
    if (isModelReady && galleryFeatures && cropped) {
      getFeatureAsync(recognitionModel, cropped).then((queryFeature) => {
        setImageFeature(_Float32ArrayToBase64String(queryFeature));
        matchObjectsAsync(queryFeature, galleryFeatures).then((scores) => {
          let sortedIdx = argsort(scores);
          let candidates = sortedIdx.map((i) => ({ score: scores[i], idx: i }));
          setCandidates(candidates);
        });
      });
    }
  }, [cropped]);

  return (
    <View style={{ flex: 1 }}>
      <FocusedStatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />
      {!isModelReady ? (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: SIZES.large,
              marginBottom: SIZES.font,
            }}
          >
            Models are loading...
          </Text>
          <Text
            style={{
              color: "gray",
              fontSize: SIZES.medium,
              marginBottom: SIZES.extraLarge,
            }}
          >
            Please wait for a few seconds.
          </Text>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            height: "100%",
            alignItems: "center",
          }}
        >
          {cropped && (
            <RectButton
              text={"Search Again"}
              minWidth={170}
              fontSize={SIZES.large}
              marginTop={SIZES.extraLarge}
              backgroundColor={COLORS.primary}
              handlePress={restart}
            />
          )}
          <ImagePickerCard
            text={"Pick image"}
            croppedImageFn={setCropped}
            displaySize={displaySize}
            restart={doRestart}
            restartFn={setDoRestart}
          />

          {candidates && (
            <Candidates
              userInfo={userInfo}
              feature={imageFeature}
              cropped={cropped}
              candidates={candidates}
              data={gorillaData}
              setDisplaySize={setDisplaySize}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default Search;
