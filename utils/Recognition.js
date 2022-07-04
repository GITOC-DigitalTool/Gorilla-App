import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { fetch } from "@tensorflow/tfjs-react-native";

import * as FileSystem from "expo-file-system";
import * as jpeg from "jpeg-js";

import { Image } from "react-native";

const imageToTensor = (rawImageData) => {
  // console.log("here!");
  const { width, height, data } = jpeg.decode(rawImageData, {
    useTArray: true,
  });

  // Drop the alpha channel info for mobilenet
  const buffer = new Uint8Array(width * height * 3);
  let offset = 0; // offset into original data
  for (let i = 0; i < buffer.length; i += 3) {
    buffer[i] = data[offset];
    buffer[i + 1] = data[offset + 1];
    buffer[i + 2] = data[offset + 2];

    offset += 4;
  }

  return tf.tensor3d(buffer, [height, width, 3]);
};

const encodeJpeg = async (tensor) => {
  const height = tensor.shape[0];
  const width = tensor.shape[1];
  const data = Buffer.from(
    // concat with an extra alpha channel and slice up to 4 channels to handle 3 and 4 channels tensors
    tf
      .concat([tensor, tf.ones([height, width, 1]).mul(255)], [-1])
      .slice([0], [height, width, 4])
      .dataSync()
  );
  const rawImageData = { data, width, height };
  const jpegImageData = jpeg.encode(rawImageData, 100);

  const imgBase64 = tf.util.decodeString(jpegImageData.data, "base64");
  const salt = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const uri = FileSystem.documentDirectory + `tensor-${salt}.jpg`;
  await FileSystem.writeAsStringAsync(uri, imgBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { uri, width, height };
};

export const cropImage = async (source, boundingBox, originalSize, newSize) => {
  const imageAssetPath = Image.resolveAssetSource(source);
  const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
  const rawImage1Data = await response.arrayBuffer();

  const bbox = [
    boundingBox[1] / originalSize,
    boundingBox[0] / originalSize,
    (boundingBox[3] + boundingBox[1]) / originalSize,
    (boundingBox[2] + boundingBox[0]) / originalSize,
  ];

  const cropped = tf.image.resizeBilinear(
    imageToTensor(rawImage1Data).expandDims(0),
    [originalSize, originalSize]
  );

  const imageTensor1 = tf.image.cropAndResize(
    cropped.div(255),
    tf.tensor2d([bbox]),
    tf.tensor1d([0], "int32"),
    [newSize, newSize]
  );

  const k = await encodeJpeg(tf.squeeze(imageTensor1).mul(255));
  // console.log("done cropping", k);
  return { uri: k["uri"] };
};

export async function infer(recognitionModel, source) {
  const imageAssetPath = Image.resolveAssetSource(source);
  const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
  const rawImageData = await response.arrayBuffer();

  const imageTensor = imageToTensor(rawImageData);

  let processedImg = imageTensor
    .div(255)
    .sub([0.485, 0.456, 0.406])
    .div([0.229, 0.9224, 0.225])
    .expandDims();
  const outputTensor = await tf.squeeze(recognitionModel.predict(processedImg));
  const outputValues = outputTensor.dataSync();
  return outputValues;
}

function cosineSimilarity(A, B) {
  var dotproduct = 0;
  var mA = 0;
  var mB = 0;
  for (let i = 0; i < A.length; i++) {
    dotproduct += A[i] * B[i];
    mA += A[i] * A[i];
    mB += B[i] * B[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  // console.log(mA * mA, mB * mB);
  var similarity = dotproduct / (mA * mB);
  return similarity;
}

export const verifyObjectsAsync = async (
  recognitionModel,
  source1,
  source2
) => {
  try {
    const feature1 = await infer(recognitionModel, source1);
    const feature2 = await infer(recognitionModel, source2);
    // console.log(feature1.length, feature2.length);
    return cosineSimilarity(feature1, feature2);
  } catch (error) {
    console.log("Exception Error: ", error);
  }
};

export const matchObjectsAsync = async (
  recognitionModel,
  source,
  galleryFeatures
) => {
  try {
    const queryFeature = await infer(recognitionModel, source);
    // console.log(queryFeature.length, galleryFeatures[0].length);
    var scores = [];
    galleryFeatures.forEach((feature) => {
      var score = cosineSimilarity(feature, queryFeature);
      scores.push(score);
    });
    // var scores = [cosineSimilarity(galleryFeatures[0], queryFeature)];
    // console.log("=== Query ===");
    // console.log(queryFeature);
    // console.log("score : ", scores);
    return scores;
  } catch (error) {
    console.log("Exception Error: ", error);
  }
};
