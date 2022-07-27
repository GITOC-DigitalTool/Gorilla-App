import {
  View,
  Text,
  Modal,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

import { useAuthenticationContext } from "../utils/DatasetContext";

import Toast from "react-native-root-toast";

import { MaterialIcons } from "@expo/vector-icons";

import { COLORS, FONTS, SIZES, SHADOWS, SEARCH_THRESHOLD } from "../constants";

import {
  GorillaCard,
  CandidateCard,
  RectButton,
  AddImageToGorilla,
  AddIndividual,
} from "../components";

const CandidateView = ({ candidates, numCandidates, data }) => {
  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <FlatList
        data={candidates.slice(0, numCandidates)}
        renderItem={({ item }) => <CandidateCard data={data[item.idx]} />}
        keyExtractor={(item) => item.idx}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const Candidates = ({
  userInfo,
  feature,
  cropped,
  data,
  candidates,
  setDisplaySize,
}) => {
  const [matchFound, setMatchFound] = useState(false);

  const [addNewPhoto, setAddNewPhoto] = useState(false);
  const [successAddNewPhoto, setSuccessAddNewPhoto] = useState(false);
  const [showAddNewPhotoToast, setShowAddNewPhotoToast] = useState(false);

  const [addNewIndividual, setAddNewIndividual] = useState(false);
  const [successAddNewIndividual, setSuccessAddNewIndividual] = useState(false);
  const [showAddNewIndividualToast, setShowAddNewIndividualToast] =
    useState(false);
  const [updating, setUpdating] = useState(false);

  const loginFn = useAuthenticationContext();

  useEffect(() => {
    if (candidates[0].score > SEARCH_THRESHOLD) {
      setMatchFound(true);
      setDisplaySize(160);
    } else {
      setMatchFound(false);
      setDisplaySize(320);
    }
  }, []);

  useEffect(() => {
    if (successAddNewPhoto) {
      setShowAddNewPhotoToast(true);
      setTimeout(() => setShowAddNewPhotoToast(false), 2500);
    }
    if (successAddNewIndividual) {
      setShowAddNewIndividualToast(true);
      setTimeout(() => setShowAddNewIndividualToast(false), 2500);
    }
  }, [successAddNewPhoto, successAddNewIndividual]);

  return (
    <>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {matchFound ? (
          <>
            <Modal visible={addNewPhoto} transparent animationType="slide">
              <SafeAreaView
                style={{
                  flex: 1,
                  margin: 20,
                  marginTop: 50,
                  marginBottom: 50,
                  backgroundColor: !updating ? "white" : "#bbb",
                  borderRadius: 20,
                  padding: 35,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 100,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    padding: SIZES.extraLarge,
                  }}
                >
                  <MaterialIcons
                    name="close"
                    size={32}
                    transparent={true}
                    onPress={() => setAddNewPhoto(false)}
                    style={{
                      alignSelf: "flex-end",
                      marginBottom: SIZES.extraLarge,
                      ...SHADOWS.dark,
                    }}
                  />
                  <AddImageToGorilla
                    userInfo={userInfo}
                    feature={feature}
                    data={data[candidates[0]["idx"]]}
                    cropped={cropped}
                    candidates={candidates}
                    updatingFn={setUpdating}
                    onFinish={setAddNewPhoto}
                    onSuccess={setSuccessAddNewPhoto}
                  />
                  {updating && (
                    <View
                      style={{
                        bottom: "50%",
                      }}
                    >
                      <ActivityIndicator size="large" />
                    </View>
                  )}
                </View>
              </SafeAreaView>
            </Modal>

            <Modal visible={addNewIndividual} transparent animationType="slide">
              <SafeAreaView
                style={{
                  flex: 1,
                  margin: 20,
                  marginTop: 50,
                  marginBottom: 50,
                  backgroundColor: !updating ? "white" : "#bbb",
                  borderRadius: 20,
                  padding: 35,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 100,
                  elevation: 5,
                }}
              >
                <View
                  style={{
                    padding: SIZES.extraLarge,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottomWidth: "1px",
                      marginBottom: SIZES.base,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: SIZES.large,
                        fontFamily: FONTS.bold,
                        color: COLORS.primary,
                        alignSelf: "center",
                        marginBottom: SIZES.base / 2,
                      }}
                    >
                      Add New Gorilla
                    </Text>
                    <MaterialIcons
                      name="close"
                      size={32}
                      transparent={true}
                      onPress={() => setAddNewIndividual(false)}
                      style={{
                        marginBottom: SIZES.base / 2,
                        ...SHADOWS.dark,
                      }}
                    />
                  </View>
                  <AddIndividual
                    userInfo={userInfo}
                    feature={feature}
                    data={data[candidates[0]["idx"]]}
                    cropped={cropped}
                    candidates={candidates}
                    updatingFn={setUpdating}
                    onFinish={setAddNewIndividual}
                    onSuccess={setSuccessAddNewIndividual}
                  />

                  {updating && (
                    <View
                      style={{
                        bottom: "50%",
                      }}
                    >
                      <ActivityIndicator size="large" />
                    </View>
                  )}
                </View>
              </SafeAreaView>
            </Modal>

            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: SIZES.extraLarge,
                color: COLORS.green,
                marginBottom: SIZES.small,
              }}
            >
              Found Gorilla 🎉
            </Text>
            <CandidateView
              candidates={candidates}
              data={data}
              numCandidates={1}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {matchFound &&
                userInfo &&
                !successAddNewPhoto &&
                !successAddNewIndividual && (
                  <View style={{ padding: SIZES.small }}>
                    <RectButton
                      text={`Add New Photo`}
                      minWidth={170}
                      fontSize={SIZES.large}
                      backgroundColor={COLORS.primary}
                      {...SHADOWS.light}
                      handlePress={() => setAddNewPhoto(true)}
                    />
                  </View>
                )}
              {!successAddNewPhoto && !successAddNewIndividual ? (
                <View style={{ padding: SIZES.small }}>
                  <RectButton
                    text={
                      userInfo
                        ? "Add New Gorilla"
                        : "Log in to use this feature"
                    }
                    minWidth={170}
                    fontSize={SIZES.large}
                    backgroundColor={userInfo ? COLORS.primary : COLORS.gray}
                    {...SHADOWS.light}
                    handlePress={() => {
                      userInfo ? setAddNewIndividual(true) : loginFn();
                    }}
                  />
                </View>
              ) : successAddNewPhoto ? (
                <Text
                  style={{
                    marginTop: SIZES.extraLarge,
                    fontSize: SIZES.large,
                    color: COLORS.green,
                    fontFamily: FONTS.bold,
                  }}
                >
                  Already added photo to {data[candidates[0].idx].name}'s
                  gallery
                </Text>
              ) : (
                <Text
                  style={{
                    marginTop: SIZES.extraLarge,
                    fontSize: SIZES.large,
                    color: COLORS.green,
                    fontFamily: FONTS.bold,
                  }}
                >
                  Already added individual: {data[candidates[0].idx].name}
                </Text>
              )}
            </View>
          </>
        ) : (
          <>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: SIZES.large,
                color: COLORS.red,
                marginBottom: SIZES.base,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              No gorilla found
            </Text>
            <Text
              style={{
                fontFamily: FONTS.semiBold,
                fontSize: SIZES.medium,
                color: COLORS.red,
                marginBottom: SIZES.base,
              }}
            >
              Closest matches:
            </Text>
            <CandidateView
              candidates={candidates}
              data={data}
              numCandidates={3}
            />
          </>
        )}
        <Toast visible={showAddNewPhotoToast} hideOnPress={true}>
          Successfully added new photo! 🎉
        </Toast>
        <Toast visible={showAddNewIndividualToast} hideOnPress={true}>
          Successfully added new individual! 🎉
        </Toast>
      </View>
    </>
  );
};

export default Candidates;
