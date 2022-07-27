import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useEffect } from "react";

import { COLORS, FONTS, SIZES, SHADOWS, assets } from "../constants";

import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import { useInferenceContext } from "../utils/InferenceContext";
import { cropImage, detectObjectsAsync } from "../utils/Detection";

const ImagePickerCard = ({
  text,
  displaySize,
  boundingBoxFn,
  boundingBox,
  pickedImageFn,
  pickedImage,
  croppedImageFn,
  restart,
  restartFn,
  runningFn,
}) => {
  const borderColors = ["blue", "green", "orange", "pink", "purple"];
  let scalingFactor = displaySize / 640;

  const { detectorModel } = useInferenceContext();

  if (!boundingBoxFn) {
    [boundingBox, boundingBoxFn] = useState(null);
  }
  if (!pickedImageFn) {
    [pickedImage, pickedImageFn] = useState(null);
  }

  useEffect(() => {
    const getPermissionAsync = async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    };
    getPermissionAsync();
  }, []);

  useEffect(() => {
    if (restart) {
      pickedImageFn(null);
      croppedImageFn(null);
      boundingBoxFn(null);
      restartFn(false);
    }
  }, [restart]);

  const selectImageAsync = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!response.cancelled) {
        const manipResponse = await ImageManipulator.manipulateAsync(
          response.uri,
          [{ resize: { width: 640, height: 640 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        const source = { uri: manipResponse.uri };
        pickedImageFn(source);
        if (runningFn) runningFn(true);
        if (boundingBox) {
          boundingBoxFn(null);
        }
        await detectObjectsAsync(detectorModel, source, boundingBoxFn);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (pickedImage && boundingBox && boundingBox.length > 0) {
      cropImage(pickedImage, boundingBox, 640, 160).then((img) => {
        croppedImageFn(img);
      });
    }
  }, [boundingBox]);

  return (
    <TouchableOpacity
      onPress={selectImageAsync}
      style={{
        width: displaySize,
        height: displaySize,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        margin: SIZES.base,
        marginBottom: SIZES.medium,
        ...SHADOWS.light,
      }}
    >
      {pickedImage && (
        <Image
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: SIZES.font,
            opacity: 0.9,
          }}
          source={pickedImage}
        />
      )}
      {boundingBox &&
        (boundingBox.length > 0 ? (
          <View
            style={{
              position: "absolute",
              left: boundingBox[0] * scalingFactor,
              top: boundingBox[1] * scalingFactor,
              width: boundingBox[2] * scalingFactor,
              height: boundingBox[3] * scalingFactor,
              borderWidth: 2,
              borderRadius: 4,
              borderColor: borderColors[0],
              zIndex: 2000,
            }}
          />
        ) : (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <Text
              style={{
                fontSize: SIZES.extraLarge,
                fontFamily: FONTS.bold,
                color: COLORS.red,
                textAlign: "center",
                marginBottom: SIZES.large,
                marginTop: SIZES.large,
              }}
            >
              No gorilla face detected
            </Text>
          </View>
        ))}

      <View
        style={{
          position: "absolute",
        }}
      >
        {pickedImage ? null : (
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: SIZES.extraLarge,
              color: COLORS.primary,
            }}
          >
            {text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ImagePickerCard;
