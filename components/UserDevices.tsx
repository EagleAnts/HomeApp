import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Image,
  ScrollView,
} from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { toggleStatus } from "../redux/actions/devices";
import { DeviceListType } from "../redux/reducers/dashboardReducer";
import { DashboardScreenProps } from "../screens/Home";
import { ApiSocket, RaspiSocket } from "../utils/socketHandler";
import { InfoCard } from "./Card";

const divColors = [
  ["#7D61CE", "#DB947E", "#F4C426", "#CB207C"],
  ["#3ACBE8", "#29388B", "#E4C0D2", "#A13480"],
  ["#2C5533", "#7C839A", "#65A5AB", "#C6C116"],
  ["#31EE97", "#FF9160", "#FEB6B8", "#28A2C9"],
];
// const generateRandomColors = (index: number) => {
//   const color =
//     divColors[index][Math.floor(Math.random() * divColors[index].length)];

//   return color;
// };

const DeviceCard = ({
  device,
  index,
  piSelected,
}: {
  device: DeviceListType;
  index: number;
  piSelected: { piID: string; piName: string };
}) => {
  const deviceStatus = useAppSelector((state) =>
    state.Devices.deviceStatus?.find((el) => el._id === device._id)
  );

  const route = useRoute<DashboardScreenProps["route"]>();

  const toggleDevice = () => {
    RaspiSocket?.emit("raspberrypi:send", {
      event: "toggleDevice",
      toRoom: piSelected.piID,
      content: {
        type: `${device.name} ${deviceStatus?.status}`,
        msg: `Hello From ${route.params.userName}`,
      },
      from: route.params.userName,
    });
  };

  const toggleSwitch = (deviceID: string) => {
    ApiSocket?.emit(
      "api:toggleStatus",
      { deviceID, status: !deviceStatus?.status },
      (res: any) => {
        console.log(res);
      }
    );
    toggleDevice();

    dispatch(toggleStatus(deviceID));
  };

  const dispatch = useAppDispatch();
  return (
    <View
      style={[
        styles.deviceCard,
        {
          backgroundColor: divColors[0][index],
          opacity: deviceStatus?.status ? 1 : 0.7,
        },
      ]}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text
          numberOfLines={4}
          style={{
            color: "white",
            fontSize: 20,
            textAlign: "center",
            width: "100%",
            textTransform: "capitalize",
          }}
        >
          {device.name}
        </Text>
        <Image
          source={{ uri: device.deviceType.icon }}
          style={{ height: 80, width: 80 }}
        />
      </View>
      <View style={{ flex: 1, alignSelf: "center" }}>
        <Switch
          thumbColor="lightgreen"
          trackColor={{ false: "white", true: "lightgreen" }}
          value={deviceStatus?.status}
          onValueChange={() => toggleSwitch(device._id)}
          style={{
            transform: [{ rotate: "-90deg" }, { scale: 1.2 }],
          }}
        />
      </View>
    </View>
  );
};

export const UserDevices = ({
  piSelected,
  userDetails,
}: {
  piSelected: { piID: string; piName: string };
  userDetails: { userName: string; email: string };
}) => {
  const theme = useTheme();

  const devices = useAppSelector(
    (state) =>
      state.Dashboard.raspiList?.filter((el) => el.piID === piSelected.piID)[0]
        .deviceList
  );

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {devices?.slice(0, 4).map((el, index) => (
        <DeviceCard
          key={index}
          device={el}
          index={index}
          piSelected={piSelected}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  deviceCard: {
    width: 150,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 12,
    padding: 8,
    margin: 5,
  },
});
