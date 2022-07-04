import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  FlatList,
  Modal,
  ActivityIndicator,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { COLORS, SIZES, SHADOWS, FONTS, assets } from "../constants";
import {
  CircleButton,
  RectButton,
  SubInfo,
  FocusedStatusBar,
  DetailsDescription,
  DetailsBid,
  EditDetailsForm,
} from "../components";

import { MaterialIcons } from "@expo/vector-icons";

import { FlatGrid } from "react-native-super-grid";

const DetailsHeader = ({ data, navigation, galleryFn }) => (
  <View style={{ width: "100%", height: 373 }}>
    <TouchableHighlight
      onPress={() => {
        galleryFn(true);
      }}
    >
      <Image
        source={{ uri: data.thumbnail.at(0).url }}
        resizeMode="cover"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </TouchableHighlight>
    <CircleButton
      imgUrl={assets.left}
      handlePress={() => navigation.goBack()}
      left={15}
      top={StatusBar.currentHeight + 10}
    />
    <CircleButton
      imgUrl={assets.heart}
      right={15}
      top={StatusBar.currentHeight + 10}
    />
  </View>
);

const Details = ({ route, navigation }) => {
  const { data } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingVertical: SIZES.font,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          zIndex: 1,
        }}
      >
        <Modal visible={showGallery} transparent animationType="fade">
          <SafeAreaView
            style={{
              flex: 1,
              margin: 20,
              marginTop: 50,
              marginBottom: 50,
              backgroundColor: !updating ? "white" : "#bbb",
              borderRadius: 20,
              padding: 35,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 1,
              shadowRadius: 100,
              elevation: 5,
            }}
          >
            <View
              style={{
                padding: SIZES.extraLarge,
              }}
            >
              <MaterialIcons
                name="close"
                size={32}
                transparent={true}
                onPress={() => setShowGallery(false)}
                style={{
                  alignSelf: "flex-end",
                  marginBottom: SIZES.extraLarge,
                  ...SHADOWS.dark,
                }}
              />

              <FlatGrid
                itemDimension={130}
                data={data.thumbnail}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{
                      height: 120,
                      backgroundColor: COLORS.white,
                      borderRadius: SIZES.font,
                      ...SHADOWS.light,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={{
                        uri: item.url,
                        height: 110,
                        width: 110,
                        borderRadius: SIZES.font,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
                style={{ marginBottom: 50 }}
              />

              {/* {console.log(data.thumbnail.map((t) => t.url))} */}
            </View>
          </SafeAreaView>
        </Modal>

        <Modal visible={modalVisible} transparent animationType="slide">
          <SafeAreaView
            style={{
              flex: 1,
              margin: 20,
              marginTop: 50,
              marginBottom: 50,
              backgroundColor: !updating ? "white" : "#bbb",
              borderRadius: 20,
              padding: 35,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 1,
              shadowRadius: 100,
              elevation: 5,
            }}
          >
            <View
              style={{
                padding: SIZES.extraLarge,
              }}
            >
              <MaterialIcons
                name="close"
                size={32}
                transparent={true}
                onPress={() => setModalVisible(false)}
                style={{
                  alignSelf: "flex-end",
                  marginBottom: SIZES.extraLarge,
                  ...SHADOWS.dark,
                }}
              />
              <EditDetailsForm data={data} updatingFn={setUpdating} />

              {updating && (
                <View
                  style={{
                    bottom: "50%",
                  }}
                >
                  <ActivityIndicator size="large" />
                </View>
              )}
            </View>
          </SafeAreaView>
        </Modal>

        <RectButton
          text={"Edit"}
          minWidth={170}
          fontSize={SIZES.large}
          {...SHADOWS.dark}
          handlePress={() => setModalVisible(true)}
        />
      </View>
      <FlatList
        data={data.bids}
        renderItem={({ item }) => <DetailsBid bid={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SIZES.extraLarge * 3 }}
        ListHeaderComponent={() => (
          <React.Fragment>
            <DetailsHeader
              data={data}
              navigation={navigation}
              galleryFn={setShowGallery}
            />
            <SubInfo />
            <View style={{ padding: SIZES.font }}>
              <DetailsDescription data={data} />
            </View>
          </React.Fragment>
        )}
      />
    </SafeAreaView>
  );
};

export default Details;
