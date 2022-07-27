import React, { Component } from "react";
import { Image, Text, View, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { COLORS, SIZES, SHADOWS, FONTS, assets } from "../constants";

import { CircleButton, RectButton } from "./Button";

import { SubInfo, EthPrice, Title } from "./SubInfo";

const ListItem = ({ item }) => {
  return (
    <View>
      <Image
        source={{
          uri: item.url,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

const CandidateCard = ({ data }) => {
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
      <View
        style={{
          width: "100%",
          height: 150,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={{ uri: data.thumbnail.at(0).url }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "100%",
            borderTopLeftRadius: SIZES.font,
            borderTopRightRadius: SIZES.font,
          }}
        />
      </View>
      <View style={{ width: "100%", padding: SIZES.font }}>
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
            marginTop: SIZES.font,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <EthPrice sex={data.sex} />

          <RectButton
            text={"Learn More"}
            minWidth={120}
            fontSize={SIZES.font}
            backgroundColor={COLORS.primary}
            handlePress={() =>
              navigation.navigate("Details", { data, back: "Search" })
            }
          />
        </View>
      </View>
    </View>
  );
};

export default CandidateCard;
