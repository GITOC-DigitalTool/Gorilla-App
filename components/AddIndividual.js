import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Formik } from "formik";
import { FloatingLabelInput, RectButton } from "../components";
import { SIZES, COLORS } from "../constants";

import * as Location from "expo-location";

import {
  useDatasetCreateContext,
  useDatasetUploadThumbnailContext,
} from "../utils/DatasetContext";

import DateTimePicker from "@react-native-community/datetimepicker";

const AddIndividual = ({
  userInfo,
  feature,
  cropped,
  data,
  candidates,
  updatingFn,
  onFinish,
  onSuccess,
}) => {
  const [location, setLocation] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [formValues, setFormValues] = useState(null);

  const [showError, setShowError] = useState("");
  const [displayToast, setDisplayToast] = useState(false);

  const createDatabase = useDatasetCreateContext();
  const uploadThumbnail = useDatasetUploadThumbnailContext();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("ERROR: ", "LOCATION PERMISSION NOT GIVEN!");
        return;
      }
      await Location.getCurrentPositionAsync({}).then((location) => {
        setLocation(location);
      });
    })();
  }, []);

  const getDateString = (d) => {
    let date = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();
    let hr = d.getHours();
    let min = d.getMinutes();
    let sec = d.getSeconds();
    month += 1;
    date = date.toString();
    month = month.toString();
    year = year.toString();
    hr = hr.toString();
    min = min.toString();
    sec = sec.toString();
    if (month <= 9) {
      month = "0" + month;
    }
    if (date <= 9) {
      date = "0" + date;
    }
    if (hr <= 9) {
      hr = "0" + hr;
    }
    if (min <= 9) {
      min = "0" + min;
    }
    if (sec <= 9) {
      sec = "0" + sec;
    }
    return date + "-" + month + "-" + year + "-" + hr + ":" + min + ":" + sec;
  };

  const date = new Date();
  const originalValues = () => {
    return {
      name: "",
      specie: "",
      sex: "",
      dob: "",
      pob: "",
      loc: "",
      facility: "",
      comment: "",
      feature: feature,
      created_by: userInfo.given_name + " " + userInfo.family_name,
      thumbnail: [
        {
          date_added: getDateString(date),
          date_taken: "",
          loc_taken: "",
          loc_added: location
            ? String(location["coords"]["latitude"]) +
              ", " +
              String(location["coords"]["longitude"])
            : "",
          posted_by: userInfo.given_name + " " + userInfo.family_name,
          source: "",
          url: "",
          feature: feature,
        },
      ],
    };
  };

  useEffect(() => {
    if (thumbnailUrl && formValues) {
      formValues.thumbnail[0].url = thumbnailUrl;
      async function upload() {
        await createDatabase({
          docName: formValues.name,
          valuesToCreate: formValues,
        }).then(() => {
          updatingFn(false);
          onFinish(false);
          onSuccess(true);
        });
      }
      upload();
    }
  }, [thumbnailUrl]);

  useEffect(() => {
    if (showError) {
      setDisplayToast(true);
      setTimeout(() => {
        setShowError("");
        setDisplayToast(false);
      }, 2500);
    }
  }, [showError]);

  const initialValues = originalValues();
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        const docName = values.name;
        if (!values.name) {
          setShowError("Name is required");
          return;
        }
        if (!values.specie) {
          setShowError("Specie is required");
          return;
        }
        if (!values.sex) {
          values.sex = "Unknown";
        }
        if (!values.dob) {
          values.dob = "Unknown";
        }
        if (!values.pob) {
          values.pob = "Unknown";
        }
        if (!values.loc) {
          values.loc = "Unknown";
        }
        if (!values.facility) {
          values.facility = "Unknown";
        }
        if (!values.thumbnail[0].loc_taken) {
          values.thumbnail[0].loc_taken = "Unknown";
        }
        if (!values.thumbnail[0].source) {
          values.thumbnail[0].source = "Unknown";
        }
        const valuesToCreate = values;
        setFormValues(valuesToCreate);
        updatingFn(true);
        await uploadThumbnail({
          subject: docName,
          image: cropped,
          setFn: setThumbnailUrl,
        });
      }}
    >
      {(props) => (
        <ScrollView
          style={{
            height: "100%",
          }}
        >
          <KeyboardAvoidingView
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
            behavior={"position"}
            keyboardVerticalOffset={50}
          >
            <FloatingLabelInput
              label="Name (Required)"
              onChangeText={props.handleChange("name")}
              value={props.values.name}
            />
            <FloatingLabelInput
              label="Specie (Required)"
              onChangeText={props.handleChange("specie")}
              value={props.values.specie}
            />
            <FloatingLabelInput
              label="Sex"
              onChangeText={props.handleChange("sex")}
              value={props.values.sex}
            />
            <FloatingLabelInput
              label="Date of Birth"
              onChangeText={props.handleChange("dob")}
              value={props.values.dob}
            />
            <FloatingLabelInput
              label="Place of Birth"
              onChangeText={props.handleChange("pob")}
              value={props.values.pob}
            />
            <FloatingLabelInput
              label="Location of Birth"
              onChangeText={props.handleChange("loc")}
              value={props.values.loc}
            />
            <FloatingLabelInput
              label="Facility"
              onChangeText={props.handleChange("facility")}
              value={props.values.facility}
            />
            <FloatingLabelInput
              label="Comments"
              multiline
              onChangeText={props.handleChange("comment")}
              value={props.values.comment}
            />
            <FloatingLabelInput
              label="Location where photo was taken"
              onChangeText={props.handleChange("thumbnail[0].loc_taken")}
              value={props.values.thumbnail[0].loc_taken}
            />
            <Text
              style={{
                fontSize: 16,
                marginTop: 20,
                marginBottom: SIZES.base,
                color: "#888",
              }}
            >
              Date when photo was taken
            </Text>
            <DateTimePicker
              style={{
                alignContent: "center",
                alignItems: "center",
                alignSelf: "center",
                left: -20,
                width: 100,
                height: "5%",
              }}
              testID="dateTimePicker"
              value={date}
              mode={"date"}
              is24Hour={true}
              onChange={(e, new_date) => {
                props.values.thumbnail[0].date_taken = getDateString(new_date);
              }}
            />
            <FloatingLabelInput
              label="Source"
              onChangeText={props.handleChange("thumbnail[0].source")}
              value={props.values.thumbnail[0].source}
            />
            {location ? (
              <RectButton
                text={"Submit"}
                minWidth={170}
                fontSize={SIZES.large}
                marginTop={SIZES.extraLarge * 1.2}
                backgroundColor={COLORS.primary}
                handlePress={props.handleSubmit}
              />
            ) : (
              <View
                style={{
                  marginTop: SIZES.extraLarge,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  padding: SIZES.small,
                }}
              >
                <Text
                  style={{
                    fontSize: SIZES.medium,
                  }}
                >
                  Identifying GPS location
                </Text>
                <ActivityIndicator size="small" />
              </View>
            )}
            {Object.keys(props.errors).length > 0 &&
              setShowError(props.errors[Object.keys(props.errors)[0]])}

            {displayToast && (
              <Text
                style={{
                  marginTop: SIZES.extraLarge,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  color: COLORS.red,
                  fontSize: SIZES.large,
                }}
              >
                {showError}
              </Text>
            )}
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  );
};

export default AddIndividual;
