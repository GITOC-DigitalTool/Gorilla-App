import React, { Component } from "react";
import { Image, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { COLORS, SIZES, SHADOWS, assets } from "../constants";

import { CircleButton, RectButton } from "./Button";

import { SubInfo, EthPrice, Title } from "./SubInfo";

const GorillaCard = ({ data }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        marginBottom: SIZES.extraLarge,
        margin: SIZES.base,
        ...SHADOWS.dark,
      }}
    >
      <View style={{ width: "100%", height: 300 }}>
        <Image
          source={{ uri: data.thumbnail.at(0).url }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: SIZES.font,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              padding: SIZES.font,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderBottomLeftRadius: SIZES.font,
              borderBottomRightRadius: SIZES.font,
            }}
          >
            <View
              style={{
                // marginTop: SIZES.font,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title
                title={data.name}
                specie={data.specie}
                subTitle={data.created_by}
                titleSize={SIZES.large}
                specieSize={SIZES.font}
                subTitleSize={SIZES.small}
              />
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EthPrice sex={data.sex} />

                <RectButton
                  style={{ marginTop: SIZES.font }}
                  text={"Learn More"}
                  minWidth={120}
                  fontSize={SIZES.font}
                  backgroundColor={COLORS.primary}
                  handlePress={() =>
                    navigation.navigate("Details", { data, back: "Home" })
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GorillaCard;
