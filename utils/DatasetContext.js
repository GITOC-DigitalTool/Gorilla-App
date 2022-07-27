import React, { useContext, useState, useEffect, createContext } from "react";

import { initializeApp, firebase } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import features from "../assets/features.json";

export const DatasetContext = createContext();
export const DatasetUpdateContext = createContext();
export const DatasetCreateContext = createContext();
export const DatasetThumbnailUploadContext = createContext();
export const AuthenticationContext = createContext();
export const UserInfoContext = createContext();

export function useAuthenticationContext() {
  return useContext(AuthenticationContext);
}

export function useUserInfoContext() {
  return useContext(UserInfoContext);
}

export function useDatasetContext() {
  return useContext(DatasetContext);
}

export function useDatasetUpdateContext() {
  return useContext(DatasetUpdateContext);
}

export function useDatasetCreateContext() {
  return useContext(DatasetCreateContext);
}

export function useDatasetUploadThumbnailContext() {
  return useContext(DatasetThumbnailUploadContext);
}

export const DatasetProvider = ({ children }) => {
  /**
   * USER AUTHENTICATION
   */
  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "436209909619-vekggpcoi7eol2isfd24cej9buqt4suh.apps.googleusercontent.com",
    iosClientId:
      "436209909619-66menlpntrtgbrdbnh8lguiqi2laap7l.apps.googleusercontent.com",
    expoClientId:
      "436209909619-gt1jsjg4blrr50gu2f8nstn517a1b9tt.apps.googleusercontent.com",
    webClientId:
      "436209909619-gt1jsjg4blrr50gu2f8nstn517a1b9tt.apps.googleusercontent.com",
  });

  /**
   * DATABASE INTERACTIONS
   */
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
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);

  useEffect(() => {
    if (accessToken) {
      getUserData();
    }
  }, [accessToken]);

  const getUserData = async () => {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    userInfoResponse.json().then((data) => {
      setUserInfo(data);
    });
  };

  useEffect(() => {
    if (firestore) {
      updateDatabase();
    }
  }, [firestore]);

  const loginUser = async () => {
    promptAsync({ showInRecents: true });
  };

  const updateDatabase = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "lens-gorillafr")
    );
    setGorillaData(querySnapshot.docs.map((doc) => doc.data()));
  };

  const updateField = async ({ docName, valuesToUpdate }) => {
    const gorillaDoc = await getDoc(doc(firestore, "lens-gorillafr", docName));
    updateDoc(gorillaDoc.ref, valuesToUpdate).then(async () => {
      await updateDatabase();
    });
  };

  const createField = async ({ docName, valuesToCreate }) => {
    const gorillaDoc = await getDoc(doc(firestore, "lens-gorillafr", docName));
    setDoc(gorillaDoc.ref, valuesToCreate).then(async () => {
      await updateDatabase();
    });
  };

  const uploadThumbnail = async ({ subject, image, setFn }) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image.uri, true);
      xhr.send(null);
    });
    const fileName = uuidv4();
    const storageRef = ref(getStorage(), subject + "/" + fileName);
    await uploadBytes(storageRef, blob);
    await getDownloadURL(storageRef).then((url) => {
      setFn(url);
    });
  };

  const updateFeatures = async () => {
    const querySnapshot = await getDocs(
      collection(firestore, "lens-gorillafr")
    );
    let count = 0;
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        feature: features[count],
      });
      count += 1;
    });
  };

  const values = {
    gorillaData,
  };

  const user = {
    userInfo,
  };

  return (
    <DatasetContext.Provider value={values}>
      <AuthenticationContext.Provider value={loginUser}>
        <UserInfoContext.Provider value={user}>
          <DatasetCreateContext.Provider value={createField}>
            <DatasetUpdateContext.Provider value={updateField}>
              <DatasetThumbnailUploadContext.Provider value={uploadThumbnail}>
                {children}
              </DatasetThumbnailUploadContext.Provider>
            </DatasetUpdateContext.Provider>
          </DatasetCreateContext.Provider>
        </UserInfoContext.Provider>
      </AuthenticationContext.Provider>
    </DatasetContext.Provider>
  );
};

export default DatasetContext;
