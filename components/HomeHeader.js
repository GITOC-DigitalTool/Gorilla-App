import React, { Component } from "react";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";

import { COLORS, FONTS, SIZES, assets } from "../constants";

const HomeHeader = ({ onSearch, userInfo, loginFn }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.primary,
        padding: SIZES.font,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          source={assets.logo}
          resizeMode="contain"
          style={{ width: 200, height: 32 }}
        />
        <View style={{ width: 45, height: 45 }}>
          {userInfo ? (
            <Image
              source={{ url: userInfo.picture }}
              resizeMode="contain"
              style={{ width: "100%", height: "100%", borderRadius: 40 }}
            />
          ) : (
            <TouchableOpacity onPress={() => loginFn()}>
              <Image
                source={assets.login}
                resizeMode="contain"
                style={{ width: "100%", height: "100%" }}
              />
            </TouchableOpacity>
          )}
          {/* <Image
            source={assets.badge}
            resizeMode="contain"
            style={{
              position: "absolute",
              width: 15,
              height: 15,
              bottom: 0,
              right: 0,
            }}
          /> */}
        </View>
      </View>
      <View style={{ marginVertical: SIZES.font }}>
        {userInfo ? (
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: SIZES.large,
              color: COLORS.white,
              marginTop: SIZES.base / 2,
            }}
          >
            Hello, {userInfo.given_name} 👋
          </Text>
        ) : (
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: SIZES.large,
              color: COLORS.white,
              marginTop: SIZES.base / 2,
            }}
          >
            Tap top right button to log in 🚀
          </Text>
        )}
        {/* <Text
          style={{
            fontFamily: FONTS.bold,
            fontSize: SIZES.large,
            color: COLORS.white,
            marginTop: SIZES.base / 2,
          }}
        >
          
        </Text> */}
      </View>

      <View style={{ marginTop: SIZES.font }}>
        <View
          style={{
            width: "100%",
            borderRadius: SIZES.font,
            backgroundColor: COLORS.gray,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.small - 2,
          }}
        >
          <Image
            source={assets.search}
            resizeMode="contain"
            style={{ width: 20, height: 20, marginRight: SIZES.base }}
          />
          <TextInput
            placeholder="Let's find a gorilla 🦍"
            placeholderTextColor="#ccc"
            style={{
              flex: 1,
              fontSize: SIZES.large,
              color: COLORS.white,
            }}
            onChangeText={onSearch}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
