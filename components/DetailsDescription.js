import { View, Text, Image } from "react-native";
import React, { useState } from "react";

import { EthPrice, Title } from "./SubInfo";
import { COLORS, SIZES, FONTS, assets } from "../constants";

const DetailsDescription = ({ data }) => {
  const [text, setText] = useState(data.comment.slice(0, 100));
  const [readMore, setReadMore] = useState(false);
  return (
    <>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title
          title={data.name}
          specie={data.specie}
          subTitle={data.created_by}
          titleSize={SIZES.extraLarge}
          specieSize={SIZES.medium}
          subTitleSize={SIZES.font}
        />
        <EthPrice sex={data.sex} />
      </View>
      <View style={{ marginVertical: SIZES.extraLarge * 2.5 }}>
        <Text
          style={{
            fontSize: SIZES.font,
            fontFamily: FONTS.semiBold,
            color: COLORS.primary,
          }}
        >
          Description
        </Text>
        <View style={{ marginTop: SIZES.base }}>
          <Text
            style={{
              fontSize: SIZES.small,
              fontFamily: FONTS.regular,
              color: COLORS.secondary,
              lineHeight: SIZES.large,
            }}
          >
            {text}
            {!readMore && "..."}
            <Text
              style={{
                fontSize: SIZES.small,
                fontFamily: FONTS.semiBold,
                color: COLORS.primary,
              }}
              onPress={() => {
                if (!readMore) {
                  setText(data.comment);
                  setReadMore(true);
                } else {
                  setText(data.comment.slice(0, 100));
                  setReadMore(false);
                }
              }}
            >
              {readMore ? " Show Less " : " Read More "}
            </Text>
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: SIZES.base,
          paddingHorizontal: SIZES.base * 2,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: FONTS.small,
            color: COLORS.primary,
          }}
        >
          Birth
        </Text>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: SIZES.base,
            paddingHorizontal: SIZES.base * 5,
          }}
        >
          <Image
            source={assets.calendar}
            resizeMode="contain"
            style={{
              width: 24,
              height: 24,
            }}
          />
          <Text
            style={{
              fontFamily: FONTS.semiBold,
              fontSize: FONTS.small,
              color: COLORS.primary,
            }}
          >
            {data.dob}
          </Text>
          <Image
            source={assets.location}
            resizeMode="contain"
            style={{
              width: 24,
              height: 24,
            }}
          />
          <Text
            style={{
              fontFamily: FONTS.semiBold,
              fontSize: FONTS.small,
              color: COLORS.primary,
            }}
          >
            {data.pob}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: SIZES.base,
          paddingHorizontal: SIZES.base * 2,
        }}
      >
        <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: FONTS.small,
            color: COLORS.primary,
          }}
        >
          Facility
        </Text>
        <View
          style={{
            // right: '40%',
            flex: 1,
            width: "10%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: SIZES.base,
            paddingHorizontal: SIZES.base * 2,
          }}
        >
          <Image
            source={assets.location}
            resizeMode="contain"
            style={{
              width: 24,
              height: 24,
            }}
          />
          <Text>{data.facility}</Text>
        </View>
      </View>
    </>
  );
};

export default DetailsDescription;
