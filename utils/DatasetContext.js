import React, { useContext, useState, useEffect, createContext } from "react";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import features from "../assets/features.json";

export const DatasetContext = createContext();
export const DatasetUpdateContext = createContext();

export function useDatasetContext() {
  return useContext(DatasetContext);
}

export function useDatasetUpdateContext() {
  return useContext(DatasetUpdateContext);
}

export const DatasetProvider = ({ children }) => {
  const [gorillaData, setGorillaData] = useState([]);
  const [galleryFeatures, setGalleryFeatures] = useState([]);

  const [firestore, setFirestore] = useState(null);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyByH1BEjF9heS2hfyzLfBXJ_kvZ6K_ovsU",
      authDomain: "lens-gorillafr.firebaseapp.com",
      projectId: "lens-gorillafr",
      storageBucket: "lens-gorillafr.appspot.com",
      messagingSenderId: "937281353699",
      appId: "1:937281353699:web:ef63dc86b6c7a4021f12d6",
      measurementId: "G-76D9G19E6L",
    };
    initializeApp(firebaseConfig);
    setFirestore(getFirestore());
  }, []);

  useEffect(() => {
    if (firestore) {
      updateDatabase();
    }
  }, [firestore]);

  const updateDatabase = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "lens-gorillafr")
    );
    setGorillaData(querySnapshot.docs.map((doc) => doc.data()));
  };

  const updateField = async ({ docName, valuesToUpdate }) => {
    console.log("UPDATE CALLED ON ", docName, " , ", valuesToUpdate);
    const gorillaDoc = await getDoc(doc(firestore, "lens-gorillafr", docName));
    updateDoc(gorillaDoc.ref, valuesToUpdate).then(async () => {
      await updateDatabase();
    });
  };

  const updateFeatures = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "lens-gorillafr")
    );
    let count = 0;
    querySnapshot.forEach((doc) => {
      console.log(count, doc.data().name);
      updateDoc(doc.ref, {
        feature: features[count],
      });
      count += 1;
    });
  };

  const values = {
    gorillaData,
  };

  return (
    <DatasetContext.Provider value={values}>
      <DatasetUpdateContext.Provider value={updateField}>
        {children}
      </DatasetUpdateContext.Provider>
    </DatasetContext.Provider>
  );
};

export default DatasetContext;
