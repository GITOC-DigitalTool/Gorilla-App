import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Formik } from "formik";
import { FloatingLabelInput, RectButton } from "../components";
import { SIZES, SHADOWS, COLORS } from "../constants";

import * as Location from "expo-location";

import {
  useDatasetUpdateContext,
  useDatasetUploadThumbnailContext,
} from "../utils/DatasetContext";

import DateTimePicker from "@react-native-community/datetimepicker";

const AddImageToGorilla = ({
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

  const updateDatabase = useDatasetUpdateContext();
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
    };
  };

  useEffect(() => {
    if (thumbnailUrl && formValues) {
      async function upload() {
        formValues.url = thumbnailUrl;
        if (!formValues.loc_taken) {
          formValues.loc_taken = "Unknown";
        }
        if (!formValues.source) {
          formValues.source = "Unknown";
        }
        let valuesToUpdate = { thumbnail: data.thumbnail.concat(formValues) };
        const docName = data.name;
        await updateDatabase({ docName, valuesToUpdate }).then(() => {
          updatingFn(false);
          onFinish(false);
          onSuccess(true);
        });
      }
      upload();
    }
  }, [thumbnailUrl]);

  const initialValues = originalValues();
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={async (values) => {
        if (!values.date_taken) {
          values.date_taken = getDateString(date);
        }
        setFormValues(values);
        updatingFn(true);
        await uploadThumbnail({
          subject: data.name,
          image: cropped,
          setFn: setThumbnailUrl,
        });
      }}
    >
      {(props) => (
        <ScrollView>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
            }}
            behavior={"position"}
            keyboardVerticalOffset={50}
          >
            <Image
              source={{ uri: cropped.uri }}
              style={{
                width: 160,
                height: 160,
                alignSelf: "center",
                marginBottom: SIZES.base,
              }}
            />
            <FloatingLabelInput
              label="Location where photo was taken"
              onChangeText={props.handleChange("loc_taken")}
              value={props.values.loc_taken}
            />
            <Text
              style={{
                fontSize: 16,
                marginBottom: 18,
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
              }}
              testID="dateTimePicker"
              value={date}
              mode={"date"}
              is24Hour={true}
              onChange={(e, new_date) => {
                props.values.date_taken = getDateString(new_date);
              }}
            />
            <FloatingLabelInput
              label="Source"
              onChangeText={props.handleChange("source")}
              value={props.values.source}
            />
            {location ? (
              <RectButton
                text={"Submit"}
                minWidth={170}
                fontSize={SIZES.large}
                marginTop={SIZES.extraLarge}
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
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </Formik>
  );
};

export default AddImageToGorilla;
