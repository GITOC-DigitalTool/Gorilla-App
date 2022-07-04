import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";

import { COLORS, FONTS, SIZES, SHADOWS, SEARCH_THRESHOLD } from "../constants";

import { GorillaCard, CandidateCard, RectButton } from "../components";

const CandidateView = ({ candidates, numCandidates, data }) => {
  return (
    <View
      style={{
        width: "100%",
      }}
    >
      <FlatList
        data={candidates.slice(0, numCandidates)}
        renderItem={({ item }) => <CandidateCard data={data[item.idx]} />}
        keyExtractor={(item) => item.idx}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const Candidates = ({ data, candidates, setDisplaySize }) => {
  const [matchFound, setMatchFound] = useState(false);
  useEffect(() => {
    if (candidates[0].score > SEARCH_THRESHOLD) {
      setMatchFound(true);
      setDisplaySize(160);
    } else {
      setMatchFound(false);
      setDisplaySize(320);
    }
  }, []);

  return (
    <>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {matchFound ? (
          <>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: SIZES.extraLarge,
                color: COLORS.green,
                marginBottom: SIZES.large,
              }}
            >
              Found Gorilla
            </Text>
            <CandidateView
              candidates={candidates}
              data={data}
              numCandidates={1}
            />
          </>
        ) : (
          <>
            <Text
              style={{
                fontFamily: FONTS.bold,
                fontSize: SIZES.large,
                color: COLORS.red,
                marginBottom: SIZES.base,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              Could not find gorilla
            </Text>
            <Text
              style={{
                fontFamily: FONTS.semiBold,
                fontSize: SIZES.medium,
                color: COLORS.red,
                marginBottom: SIZES.base,
              }}
            >
              Closest matches:
            </Text>
            <CandidateView
              candidates={candidates}
              data={data}
              numCandidates={3}
            />
          </>
        )}
      </View>
      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingVertical: SIZES.font,
          justifyContent: matchFound ? "space-between" : "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          zIndex: 1,
          flexDirection: "row",
          paddingHorizontal: SIZES.small,
        }}
      >
        {matchFound && (
          <RectButton
            text={`Add New Photo`}
            minWidth={170}
            fontSize={SIZES.large}
            {...SHADOWS.light}
          />
        )}
        <RectButton
          text={"Add New Gorilla"}
          minWidth={170}
          fontSize={SIZES.large}
          {...SHADOWS.light}
        />
      </View>
    </>
  );
};

export default Candidates;
