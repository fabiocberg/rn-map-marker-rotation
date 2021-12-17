import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import MapView, {
  AnimatedRegion,
  MarkerAnimated,
  PROVIDER_GOOGLE,
} from "react-native-maps";

// @ts-ignore
import carIcon from "./assets/car.png";

type Position = {
  latitude: number;
  longitude: number;
};

const positions: Position[] = [
  { latitude: -27.593066, longitude: -48.549793 },
  { latitude: -27.592933, longitude: -48.55106 },
  { latitude: -27.592864, longitude: -48.55197 },
  { latitude: -27.593375, longitude: -48.551891 },
  { latitude: -27.593758, longitude: -48.551762 },
  { latitude: -27.593752, longitude: -48.551125 },
  { latitude: -27.593749, longitude: -48.550606 },
  { latitude: -27.59375, longitude: -48.550152 },
  { latitude: -27.594069, longitude: -48.550223 },
  { latitude: -27.594522, longitude: -48.550324 },
];

const initialRegion = {
  latitude: positions[0].latitude,
  longitude: positions[0].longitude,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function App() {
  const marker = useRef<MarkerAnimated | null>();
  const [coordinate, setCoordinate] = useState(
    new AnimatedRegion(initialRegion)
  );
  const [curPos, setCurPos] = useState(0);
  const [curRot, setCurRot] = useState(0);

  const getRotation = (cPos: Position, nPos: Position) => {
    if (!cPos || !nPos) {
      return 0;
    }
    const latDiff = cPos.latitude - nPos.latitude;
    const lngDiff = cPos.longitude - nPos.longitude;
    return (Math.atan2(lngDiff, latDiff) * 180.0) / Math.PI;
  };

  const animate = (newCurPos: number) => {
    const newRot = getRotation(positions[curPos], positions[newCurPos]);
    setCurRot(newRot);
    const newCoordinate = positions[newCurPos];
    setCurPos(newCurPos);
    if (Platform.OS === "android") {
      marker.current?.animateMarkerToCoordinate(newCoordinate, 500);
    } else {
      coordinate.timing({ ...newCoordinate, useNativeDriver: true }).start();
    }
  };

  const doUpdate = () => {
    const newCurPos = curPos + 1;
    if (newCurPos > positions.length) return;

    animate(newCurPos);
  };

  useEffect(() => {
    setTimeout(() => {
      doUpdate();
    }, 1500);
  }, [curPos]);
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        minZoomLevel={17.5}
        initialRegion={initialRegion}
        style={styles.map}
      >
        <MarkerAnimated
          ref={(el) => (marker.current = el)}
          image={carIcon}
          rotation={curRot}
          coordinate={coordinate}
          anchor={{ x: 0.5, y: 0.5 }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
