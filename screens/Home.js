import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";

import {
  useDatasetContext,
  useAuthenticationContext,
  useUserInfoContext,
} from "../utils/DatasetContext";

import { COLORS, GorillaData, SIZES } from "../constants";
import { useNavigation } from "@react-navigation/native";
import {
  GorillaCard,
  HomeHeader,
  FocusedStatusBar,
  BottomBar,
} from "../components";

const Home = () => {
  const { gorillaData } = useDatasetContext();
  const loginFn = useAuthenticationContext();
  const { userInfo } = useUserInfoContext();

  const navigation = useNavigation();

  useEffect(() => {
    navigation.navigate("Home");
    setDisplayData(gorillaData);
  }, [gorillaData]);

  useEffect(() => {}, [userInfo]);

  const [displayData, setDisplayData] = useState(gorillaData);
  const [searching, setSearching] = useState(false);

  const handleSearch = (value) => {
    if (!value.length) {
      setSearching(false);
      return setDisplayData(gorillaData);
    }
    setSearching(true);
    const filteredData = gorillaData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    if (filteredData.length) {
      setDisplayData(filteredData);
    } else {
      setDisplayData(null);
    }
  };

  const EmptyListMessage = ({ item }) => {
    return (
      <>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
            height: "100%",
            margin: SIZES.extraLarge,
          }}
        >
          <Text
            style={{
              color: item.color,
              fontSize: SIZES.large,
              marginBottom: SIZES.extraLarge,
            }}
          >
            {item.message}
          </Text>
          {item.loading ? <ActivityIndicator size="large" /> : null}
        </View>
      </>
    );
  };

  return (
    // <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "never" }}>
    <View style={{ flex: 1 }}>
      <FocusedStatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          {gorillaData && (
            <FlatList
              data={displayData}
              renderItem={({ item }) => <GorillaCard data={item} />}
              keyExtractor={(item) => item.name}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <HomeHeader
                  onSearch={handleSearch}
                  userInfo={userInfo}
                  loginFn={loginFn}
                />
              }
              ListEmptyComponent={
                <EmptyListMessage
                  item={
                    searching
                      ? {
                          message: "No Gorilla Found",
                          color: "red",
                          loading: false,
                        }
                      : {
                          message: "Loading Gorillas...",
                          color: "gray",
                          loading: true,
                        }
                  }
                />
              }
            />
          )}
        </View>
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: -1,
          }}
        >
          {/* <View style={{ height: 300, backgroundColor: COLORS.primary }} /> */}
          {/* <View style={{ flex: 1, backgroundColor: COLORS.white }} /> */}
          <View />
        </View>
      </View>
      {/* </SafeAreaView> */}
    </View>
  );
};

export default Home;
