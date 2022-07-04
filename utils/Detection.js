import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { fetch } from "@tensorflow/tfjs-react-native";

import * as FileSystem from "expo-file-system";
import * as jpeg from "jpeg-js";

import { Image } from "react-native";

function toBBox(values, threshold, width, height) {
  let bboxes = [];
  let scores = [];
  const column_width = 1;
  for (let i = 0; i < values.length; i += 6) {
    if (values[i * column_width + 4] >= threshold) {
      const bbox = [
        values[i * column_width],
        values[i * column_width + 1],
        values[i * column_width + 2],
        values[i * column_width + 3],
      ];
      bbox[0] = bbox[0] * width;
      bbox[1] = bbox[1] * height;
      bbox[2] = bbox[2] * width;
      bbox[3] = bbox[3] * height;
      bboxes.push(bbox);
      scores.push(values[i * column_width + 4]);
    }
  }
  const boxes = tf.tensor2d(bboxes);
  const detection_scores = tf.tensor1d(scores);
  return { boxes, detection_scores };
}

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
  // console.log(height, width);
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

export const detectObjectsAsync = async (detectorModel, source, bbFn) => {
  try {
    const imageAssetPath = Image.resolveAssetSource(source);
    const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
    const rawImageData = await response.arrayBuffer();
    const imageTensor = imageToTensor(rawImageData).div(255.0).expandDims(0);
    const outputTensor = await tf.squeeze(detectorModel.predict(imageTensor));
    const outputValues = outputTensor.dataSync();
    const detection_results = toBBox(outputValues, 0.3, 640, 640);
    const res = await tf.image.nonMaxSuppressionAsync(
      detection_results["boxes"],
      detection_results["detection_scores"],
      1,
      0.3,
      0.3
    );
    const result = res.dataSync();
    const box = detection_results["boxes"].arraySync()[result];

    // console.log("=== Detect objects predictions: ===");
    // console.log(box);

    const xywh_box = [
      box[0] - box[2] / 2,
      box[1] - box[3] / 2,
      box[0] + box[2] / 2,
      box[1] + box[3] / 2,
    ];
    xywh_box[2] = xywh_box[2] - xywh_box[0];
    xywh_box[3] = xywh_box[3] - xywh_box[1];
    bbFn(xywh_box);
  } catch (error) {
    console.log("Exception Error: ", error);
  }
};
