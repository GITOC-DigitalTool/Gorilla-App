import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";

import { Formik } from "formik";
import { FloatingLabelInput, RectButton } from "../components";
import { SIZES, SHADOWS, COLORS } from "../constants";

import { useDatasetUpdateContext } from "../utils/DatasetContext";

const EditDetailsForm = ({ data, updatingFn }) => {
  const originalValues = () => {
    if (data) {
      return {
        name: data.name,
        specie: data.specie,
        sex: data.sex,
        dob: data.dob,
        pob: data.pob,
        loc: data.loc,
        facility: data.facility,
        comment: data.comment,
      };
    }
    return {
      name: "",
      specie: "",
      sex: "",
      dob: "",
      pob: "",
      loc: "",
      facility: "",
      comment: "",
    };
  };

  const updateDatabase = useDatasetUpdateContext();
  const initialValues = originalValues();

  return (
    <View>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values) => {
          const docName = values.name;
          const valuesToUpdate = Object.entries(values).reduce(
            (acc, [key, value]) => {
              const hasChanged = initialValues[key] != value;
              if (hasChanged) {
                acc[key] = value;
              }
              return acc;
            },
            {}
          );
          if (Object.keys(valuesToUpdate).length > 0) {
            updatingFn(true);
            await updateDatabase({ docName, valuesToUpdate });
          }
        }}
      >
        {(props) => (
          <ScrollView>
            <KeyboardAvoidingView
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
              }}
              behavior={"position"}
              keyboardVerticalOffset={150}
            >
              <FloatingLabelInput
                label="Name"
                onChangeText={props.handleChange("name")}
                value={props.values.name}
              />
              <FloatingLabelInput
                label="Specie"
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
              <RectButton
                text={"Submit"}
                minWidth={170}
                fontSize={SIZES.large}
                marginTop={20}
                backgroundColor={COLORS.primary}
                handlePress={props.handleSubmit}
              />
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

export default EditDetailsForm;
