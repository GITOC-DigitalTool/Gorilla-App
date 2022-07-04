import { View, SafeAreaView, ActivityIndicator, Text } from "react-native";
import React, { useEffect, useState } from "react";

import { useInferenceContext } from "../utils/InferenceContext";

import { COLORS, VERIFICATION_THRESHOLD } from "../constants";

import { FocusedStatusBar, ImagePickerCard } from "../components";
import { verifyObjectsAsync } from "../utils/Recognition";

const Verify = () => {
  const [firstCropped, setFirstCropped] = useState(null);
  const [secondCropped, setSecondCropped] = useState(null);
  const [similarity, setSimilarity] = useState(null);

  const { isModelReady, recognitionModel } = useInferenceContext();

  useEffect(() => {
    if (firstCropped && secondCropped) {
      verifyObjectsAsync(recognitionModel, firstCropped, secondCropped).then(
        (score) => setSimilarity(score)
      );
    }
  }, [firstCropped, secondCropped]);

  return (
    <SafeAreaView>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View
        style={{
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ImagePickerCard
          text={"Pick first image"}
          croppedImageFn={setFirstCropped}
          displaySize={320}
        />
        {!isModelReady && <ActivityIndicator size="small" />}
        {/* {firstCropped && secondCropped && matchObjectsAsync()} */}
        {similarity &&
          (similarity > VERIFICATION_THRESHOLD ? (
            <Text>Match</Text>
          ) : (
            <Text>Non-Match</Text>
          ))}
        <ImagePickerCard
          text={"Pick second image"}
          croppedImageFn={setSecondCropped}
          displaySize={320}
        />
      </View>
    </SafeAreaView>
  );
};

export default Verify;
