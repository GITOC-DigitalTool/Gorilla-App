import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

import { COLORS, MAX_CANDIDATES } from "../constants";
import { useInferenceContext } from "../utils/InferenceContext";
import { useDatasetContext } from "../utils/DatasetContext";
import { FocusedStatusBar, ImagePickerCard, Candidates } from "../components";

import { decode as atob, encode as btoa } from "base-64";

import { matchObjectsAsync } from "../utils/Recognition";

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
  const [galleryFeatures, setGalleryFeatures] = useState([]);
  const [cropped, setCropped] = useState(null);
  const [candidates, setCandidates] = useState(null);
  const [displaySize, setDisplaySize] = useState(320);

  const { isModelReady, recognitionModel } = useInferenceContext();

  useEffect(() => {
    if (gorillaData) {
      async function getGalleryFeatures() {
        let k = [];
        await gorillaData.reduce(async (promise, item) => {
          await promise;
          k.push(_base64ToArrayBuffer(item.feature));
        }, Promise.resolve());
        return k;
      }
      getGalleryFeatures().then((features) => setGalleryFeatures(features));
    }
  }, [gorillaData]);

  let decor = (v, i) => [v, i]; // set index to value
  let undecor = (a) => a[1]; // leave only index
  let argsort = (arr) =>
    arr.map(decor).sort().map(undecor).reverse().slice(0, MAX_CANDIDATES);

  useEffect(() => {
    if (isModelReady && galleryFeatures && cropped) {
      matchObjectsAsync(recognitionModel, cropped, galleryFeatures).then(
        (scores) => {
          let sortedIdx = argsort(scores);
          console.log(scores.length);
          let candidates = sortedIdx.map((i) => ({ score: scores[i], idx: i }));
          setCandidates(candidates);
        }
      );
    }
  }, [cropped]);

  return (
    <SafeAreaView>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View
        style={{
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImagePickerCard
          text={"Pick image"}
          croppedImageFn={setCropped}
          displaySize={displaySize}
        />
        {!isModelReady && <ActivityIndicator size="small" />}
        {candidates && (
          <Candidates
            candidates={candidates}
            data={gorillaData}
            setDisplaySize={setDisplaySize}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Search;
