import React, { useEffect, useState } from "react";
import { View, SafeAreaView, FlatList } from "react-native";

import { useDatasetContext } from "../utils/DatasetContext";

import { COLORS, GorillaData } from "../constants";
import { useNavigation } from "@react-navigation/native";
import {
  GorillaCard,
  HomeHeader,
  FocusedStatusBar,
  BottomBar,
} from "../components";

const Home = () => {
  const { gorillaData } = useDatasetContext();

  const navigation = useNavigation();

  useEffect(() => {
    console.log("Refresh Details data");
    navigation.navigate("Home");
    setDisplayData(gorillaData);
  }, [gorillaData]);

  const [displayData, setDisplayData] = useState(gorillaData);

  const handleSearch = (value) => {
    if (!value.length) return setDisplayData(gorillaData);
    const filteredData = gorillaData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    if (filteredData.length) {
      setDisplayData(filteredData);
    } else {
      setDisplayData(gorillaData);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar backgroundColor={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          {gorillaData && (
            <FlatList
              data={displayData}
              renderItem={({ item }) => <GorillaCard data={item} />}
              keyExtractor={(item) => item.name}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<HomeHeader onSearch={handleSearch} />}
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
          <View style={{ height: 300, backgroundColor: COLORS.primary }} />
          <View style={{ flex: 1, backgroundColor: COLORS.white }} />
          <View />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
