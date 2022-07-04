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
      {/* <Text style={styles.itemText}>{item.text}</Text> */}
    </View>
  );
};

const CandidateCard = ({ data }) => {
  const imageSize = 80;
  const maxToShow = 10;
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: SIZES.font,
        marginBottom: SIZES.font,
        margin: SIZES.base,
        ...SHADOWS.medium,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FlatList
        horizontal
        data={data.thumbnail.slice(0, maxToShow)}
        renderItem={({ item }) => (
          <>
            {console.log(item.url)}
            <Image
              source={{ uri: item.url }}
              resizeMode="cover"
              style={{
                width: imageSize,
                height: imageSize,
                margin: SIZES.base / 8,
                borderRadius: SIZES.font,
              }}
            />
          </>
        )}
      />
      <Text
        style={{
          fontFamily: FONTS.semiBold,
          fontSize: SIZES.large,
          color: COLORS.primary,
          margin: SIZES.base,
        }}
      >
        {data.name}
      </Text>
    </View>
  );
};

export default CandidateCard;
