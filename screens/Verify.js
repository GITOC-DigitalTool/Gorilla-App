import { View, SafeAreaView, ActivityIndicator, Text } from "react-native";
import React, { useEffect, useState } from "react";

import { useInferenceContext } from "../utils/InferenceContext";

import { COLORS, VERIFICATION_THRESHOLD, SIZES, FONTS } from "../constants";

import { FocusedStatusBar, ImagePickerCard } from "../components";
import { verifyObjectsAsync } from "../utils/Recognition";

const Verify = () => {
  const [firstCropped, setFirstCropped] = useState(null);
  const [secondCropped, setSecondCropped] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [firstRunning, setFirstRunning] = useState(false);
  const [secondRunning, setSecondRunning] = useState(false);

  const { isModelReady, recognitionModel } = useInferenceContext();

  useEffect(() => {
    if (firstCropped && secondCropped) {
      verifyObjectsAsync(recognitionModel, firstCropped, secondCropped).then(
        (score) => {
          setFirstRunning(false);
          setSecondRunning(false);
          setSimilarity(score);
        }
      );
    }
  }, [firstCropped, secondCropped]);

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
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <ImagePickerCard
            text={"Pick first image"}
            croppedImageFn={setFirstCropped}
            displaySize={320}
            runningFn={setFirstRunning}
          />

          {!firstRunning &&
            !secondRunning &&
            similarity &&
            (similarity > VERIFICATION_THRESHOLD ? (
              <Text
                style={{
                  marginBottom: SIZES.base / 2,
                  fontSize: SIZES.large,
                  color: COLORS.green,
                  fontFamily: FONTS.bold,
                }}
              >
                Match ✅
              </Text>
            ) : (
              <Text
                style={{
                  marginBottom: SIZES.base / 2,
                  fontSize: SIZES.large,
                  color: COLORS.red,
                  fontFamily: FONTS.bold,
                }}
              >
                Non-Match ❌
              </Text>
            ))}
          <ImagePickerCard
            text={"Pick second image"}
            croppedImageFn={setSecondCropped}
            displaySize={320}
            runningFn={setSecondRunning}
          />
        </View>
      )}
    </View>
  );
};

export default Verify;
