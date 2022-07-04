import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  createContext,
} from "react";

import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { fetch } from "@tensorflow/tfjs-react-native";

export const InferenceContext = createContext();

export function useInferenceContext() {
  return useContext(InferenceContext);
}

export const InferenceProvider = ({ children }) => {
  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);

  const [detectorModel, setDetectorModel] = useState(null);
  const [recognitionModel, setRecognitionModel] = useState(null);

  useEffect(() => {
    const initializeTfAsync = async () => {
      await tf.ready();
      setIsTfReady(true);
    };
    const initializeModelAsync = async () => {
      const detectorJSON = require("../assets/models/detector_quant.json");
      const detectorWeights = require("../assets/models/detector_quant.bin");
      const recognitionJSON = require("../assets/models/serve.json");
      const recognitionWeights = require("../assets/models/serve.bin");

      setDetectorModel(
        await tf
          .loadGraphModel(bundleResourceIO(detectorJSON, detectorWeights))
          .catch((e) => console.log(e))
      );
      console.log("Detector loaded!");

      setRecognitionModel(
        await tf
          .loadGraphModel(bundleResourceIO(recognitionJSON, recognitionWeights))
          .catch((e) => console.log(e))
      );
      console.log("Feature Extractor loaded!");

      setIsModelReady(true);
    };
    initializeTfAsync();
    initializeModelAsync();
  }, []);

  const values = {
    isTfReady,
    isModelReady,
    detectorModel,
    recognitionModel,
  };

  return (
    <InferenceContext.Provider value={values}>
      {children}
    </InferenceContext.Provider>
  );
};

export default InferenceContext;
