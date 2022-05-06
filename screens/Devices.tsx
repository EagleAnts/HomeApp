import React, {
  createContext,
  createRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
  Pressable,
  useWindowDimensions,
  RefreshControl,
  Image,
  FlatList,
  SectionList,
  UIManager,
  findNodeHandle,
} from "react-native";
import {
  Appbar,
  Button,
  Card,
  Menu,
  Modal,
  Portal,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import type { BottomTabBarProps } from "./Home";
import { CustomThemeProps } from "../utils/customTheme";
import CustomFab from "../components/FloatingActionButton";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import DevicesInfo from "./DevicesInfo";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { CustomHeader } from "../components/CustomHeader";
import { State, TouchableOpacity } from "react-native-gesture-handler";
import { InfoCard } from "../components/Card";
import { BottomSheetRefProps, PisBottomSheet } from "../components/BottomSheet";
import AnimatedPressable from "../components/AnimatedPressable";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  addDevice,
  createRoomsView,
  device_Type,
  saveDeviceStatus,
  selectRaspi,
} from "../redux/actions/devices";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { getRaspberryPisAndDevices } from "../redux/actions/dashboard";
import { ApiSocket } from "../utils/socketHandler";
import { loadDeviceTypes } from "../redux/actions/devices";
import { FormProvider, useController, useForm } from "react-hook-form";
import { Input, InputType } from "../components/StyledInputs";
import { DeviceListType } from "../redux/reducers/dashboardReducer";
import { AppbarMenu } from "../components/AppBarMenu";

export type RootDeviceStackParamList = {
  MyDevices: undefined;
  DevicesInfo: {
    id: string;
    title: string;
    devices?: Array<DeviceListType>;
    userName: string;
  };
};

export type Props = NativeStackScreenProps<
  RootDeviceStackParamList,
  "MyDevices"
>;
export type DevicesInfoType = NativeStackScreenProps<
  RootDeviceStackParamList,
  "DevicesInfo"
>;
type BottomSheetView = {
  bottomSheetRef: React.RefObject<BottomSheetRefProps> | null;
};

const Stack = createNativeStackNavigator<RootDeviceStackParamList>();

const BottomSheetContext = createContext<BottomSheetView>({
  bottomSheetRef: null,
});

export const DeviceCard = ({ title }: { title: string }) => {
  const { width } = useWindowDimensions();
  const navigation: DevicesInfoType["navigation"] = useNavigation();
  const userName = useAppSelector((state) => state.auth.user?.name);

  return (
    <InfoCard
      handlePress={() => {
        navigation.navigate("DevicesInfo", {
          id: title,
          title: title,
          userName: userName!,
        });
      }}
      title={title}
      bgImg={true}
      bgImgSource={require("../assets/livingRoom.jpeg")}
      cardStyles={{ width: 0.45 * width }}
    />
  );
};

const BottomSheetView = ({ bottomSheetRef }: BottomSheetView) => {
  const rpiList = useAppSelector((state) => state.Dashboard.raspiList);
  const dispatch = useAppDispatch();

  const { height, width } = useWindowDimensions();
  return (
    <>
      {rpiList?.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>You Don't have any Raspberry Pi's registered yet!</Text>
        </View>
      ) : (
        rpiList?.map((el) => (
          <InfoCard
            key={el.piName}
            handlePress={() => {
              bottomSheetRef?.current?.scrollTo(0);
              // console.log(`Rasbperry Pi ${el.name} selected`);
              dispatch(selectRaspi({ piName: el.piName, piID: el.piID }));
            }}
            title={el.piName}
            bgImg={true}
            bgImgSource={{
              uri: "https://res.cloudinary.com/homeautomation/image/upload/v1649065662/deviceIcons/rpiimage.png",
            }}
            cardStyles={{
              width: 0.47 * width,
              backgroundColor: "#121212",
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: "rgba(105,105,105,0.5)",
            }}
          />
        ))
      )}
    </>
  );
};

const AddDevice = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (arg: boolean) => void;
}) => {
  const methods = useForm();
  const theme = useTheme();

  const deviceTypes = useAppSelector((state) =>
    state.Devices.deviceTypes?.flatMap((el) => el.type)
  );
  const allDeviceTypes = useAppSelector((state) => state.Devices.deviceTypes);

  const piSelected = useAppSelector((state) => state.Devices.piSelected);

  const dispatch = useAppDispatch();

  const [loading, setloading] = useState(false);

  const handleSubmit = methods.handleSubmit((data) => {
    console.log("Button Pressed..");
    console.log(piSelected?.piID, data);
    setloading(true);

    const deviceTypeID = allDeviceTypes?.filter(
      (el) => el.type === data["device_type"]
    )[0];
    if (piSelected?.piID && deviceTypeID) {
      ApiSocket?.emit(
        "api:addNewDevice",
        { piID: piSelected.piID, ...data, typeID: deviceTypeID?._id },
        (data: DeviceListType) => {
          console.log("Recieved");
          setloading(false);
          setVisible(false);
          console.log(data);
          dispatch(addDevice({ device: data, piID: piSelected.piID }));
        }
      );
    }
  });

  useEffect(() => {
    // render++;
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
      }}
    >
      {/* <Text>Render : {render}</Text> */}
      <Text
        style={{
          fontFamily: "SourceSansProRegular",
          fontSize: 20,
          color: theme.colors.text,
        }}
      >
        Please Enter the Device Details
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        style={{ flex: 1, marginVertical: 10, width: "100%" }}
        contentContainerStyle={{}}
      >
        <FormProvider {...methods}>
          <Input
            label="Device Name"
            name="device_name"
            placeholder="Eg. <Company_Name> Fan | Lights"
            rules={{ required: "Device Name is Required" }}
            viewStyles={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
            textStyles={{ color: theme.colors.text }}
          />
          <Input
            label="Device Type"
            name="device_type"
            searchable={true}
            data={deviceTypes}
            placeholder="Eg. Fan | Lights"
            rules={{
              required: "Device Type is Required",
              validate: (value) => {
                return !!value.trim()
                  ? deviceTypes?.includes(value)
                    ? true
                    : "Please Select a Valid Option"
                  : "Please fill out this field!";
              },
            }}
            viewStyles={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
            textStyles={{ color: theme.colors.text }}
          />
          <Input
            label="Area"
            name="area"
            placeholder="Eg. Living Room | Bathroom"
            rules={{ required: "Area Name is Required" }}
            viewStyles={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
            textStyles={{ color: theme.colors.text }}
          />
          <Input
            label="GPIO"
            name="gpio"
            placeholder="Eg. 10 | 11 | 12"
            rules={{ required: "GPIO Pin is Required" }}
            viewStyles={{
              borderWidth: 1,
              borderColor: theme.colors.primary,
            }}
            textStyles={{ color: theme.colors.text }}
          />
          <Button loading={loading} onPress={handleSubmit}>
            Submit
          </Button>
        </FormProvider>
      </ScrollView>
    </View>
  );
};

const sortObject = (obj: any) =>
  Object.keys(obj)
    .sort()
    .reduce((res: any, key) => ((res[key] = obj[key]), res), {});

const buildRooms = (rooms: { [area: string]: Array<DeviceListType> }) => {
  console.log("Builiding Room Components...");

  const roomsComponentsList: Array<React.ReactNode> = [];
  rooms = sortObject(rooms);
  if (rooms) {
    Object.entries(rooms).forEach((room) => {
      roomsComponentsList.push(<DeviceCard key={room[0]} title={room[0]} />);
    });
  }
  return roomsComponentsList;
};

const RoomsView = () => {
  const { height, width } = useWindowDimensions();
  const theme = useTheme();

  const [visible, setVisible] = useState(false);

  const dispatch = useAppDispatch();

  const piSelected = useAppSelector((state) => state.Devices.piSelected);

  const raspiList = useAppSelector((state) => state.Dashboard.raspiList);

  const devicesList = useAppSelector((state) => state.Devices.roomsList);

  const handleAddDevice = () => {
    setVisible(true);
  };

  const handleModalDismiss = () => {
    setVisible(false);
  };

  useEffect(() => {
    console.log("Rooms View");
    if (raspiList && piSelected) {
      let roomsList: {
        [area: string]: Array<DeviceListType>;
      } = {};
      console.log("Builiding Devices List According to Rooms");
      raspiList
        .filter((el) => el.piName === piSelected.piName)[0]
        .deviceList.forEach((device) => {
          const roomExists = roomsList[device.area];
          if (roomExists) {
            roomExists.push(device);
          } else {
            roomsList[device.area] = [device];
          }
        });
      dispatch(createRoomsView(roomsList));
    }

    // console.log("Devices List : ", devicesList);
  }, [raspiList, piSelected]);

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={handleModalDismiss}
          contentContainerStyle={[
            styles.ModalContainer,
            {
              backgroundColor: theme.colors.background,
              height: 0.7 * height,
            },
          ]}
          style={{ marginBottom: 60 }}
        >
          <AddDevice visible={visible} setVisible={setVisible} />
        </Modal>
      </Portal>

      <View style={{ width: "100%", margin: 10 }}>
        <Button
          onPress={handleAddDevice}
          color={theme.colors.primary}
          icon={(props) => (
            <MaterialCommunityIcons name="sticker-plus" {...props} size={24} />
          )}
          style={{
            alignSelf: "center",
            borderRadius: 25,
            width: "50%",
          }}
          contentStyle={{ flexDirection: "row-reverse" }}
        >
          <Text>Add a Device</Text>
        </Button>
      </View>

      {devicesList && Object.keys(devicesList).length === 0 ? (
        <View
          style={{
            height: height - 200,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center" }}>
            No Devices Registered Yet! Please Add a Device
          </Text>
        </View>
      ) : devicesList ? (
        <View style={[styles.RoomsContainer]}>{buildRooms(devicesList)}</View>
      ) : null}
    </>
  );
};

// const wait = (timeout: number) => {
//   return new Promise((resolve) => setTimeout(resolve, timeout));
// };

const MyDevices = ({ route, navigation }: Props) => {
  const theme = useTheme() as CustomThemeProps;

  const piSelected = useAppSelector((state) => state.Devices.piSelected);

  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (refreshing) {
      console.log("Fetching User's RaspberryPis and their Devices ....");
      dispatch(getRaspberryPisAndDevices(ApiSocket));
      setRefreshing(false);
    }
  }, [refreshing]);

  return (
    <ScrollView
      style={{ marginBottom: 60 }}
      contentContainerStyle={[
        styles.ScrollViewContainer,
        { flex: piSelected ? 0 : 1 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!piSelected ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center" }}>
            Please Select a Raspberry Pi to View your Registered Devices
          </Text>
        </View>
      ) : (
        <RoomsView />
      )}
    </ScrollView>
  );
};

const DevicesHeader = () => {
  const theme = useTheme();

  const { height, width } = useWindowDimensions();

  const { bottomSheetRef } = useContext(BottomSheetContext);
  const onPress = useCallback(() => {
    const isActive = bottomSheetRef?.current?.isActive();
    bottomSheetRef?.current?.scrollTo(isActive ? 0 : -height);
  }, []);

  return (
    <Appbar.Header
      style={{
        height: 60,
        backgroundColor: theme.colors.background,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(105,105,105,0.5)",
      }}
      statusBarHeight={0}
    >
      <Appbar.Content title="Devices" />
      <Appbar.Action
        animated
        style={{ alignItems: "center", justifyContent: "center" }}
        icon={({ size }) => (
          <FontAwesome5
            style={{ paddingLeft: 2 }}
            name="raspberry-pi"
            size={size}
            color={theme.colors.primary}
          />
        )}
        size={30}
        onPress={onPress}
        color={theme.colors.primary}
      />
    </Appbar.Header>
  );
};

const DevicesInfoHeader = ({ navigation, route }: DevicesInfoType) => {
  const theme = useTheme();

  const [menuVisible, setmenuVisible] = useState(false);

  const openMenu = () => setmenuVisible(true);
  const closeMenu = () => setmenuVisible(false);

  return (
    <Appbar.Header
      style={{
        height: 60,
        elevation: 50,
        backgroundColor: theme.colors.background,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(105,105,105,0.5)",
      }}
      statusBarHeight={0}
    >
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content
        titleStyle={{ textTransform: "capitalize" }}
        title={route.params.title}
      />
      <Menu
        visible={menuVisible}
        contentStyle={{
          backgroundColor: theme.colors.background,
          borderRadius: 10,
        }}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            onPress={() => {
              openMenu();
            }}
          />
        }
      >
        <Menu.Item title="Item" />
        {/* <Menu.Item
          title="Delete Device"
          style={{ alignItems: "center" }}
          onPress={() => {}}
          titleStyle={{
            color: theme.colors.text,
          }}
          icon={({ size }) => (
            <MaterialCommunityIcons name="delete" color="red" size={size} />
          )}
        /> */}
      </Menu>
    </Appbar.Header>
  );
};

const Devices = ({ navigation: tabNavigation }: BottomTabBarProps) => {
  const theme = useTheme();
  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  const { height, width } = useWindowDimensions();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Devices Rendered..");
  }, []);

  return (
    <BottomSheetContext.Provider value={{ bottomSheetRef }}>
      {/* <AnimatedPressable
        title={
          !piSelected
            ? "Select a Raspberry Pi"
            : `Pi Selected : ${piSelected.rpiName}`
        }
        onPress={onPress}
        viewStyles={{ alignSelf: "center", marginTop: 10 }}
      /> */}
      <PisBottomSheet
        ref={bottomSheetRef}
        MAX_TRANSLATE_Y={-height}
        children={<BottomSheetView bottomSheetRef={bottomSheetRef} />}
      />

      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen
          name="MyDevices"
          component={MyDevices}
          options={{
            headerShown: true,
            headerTitle: "Devices",
            header: () => <DevicesHeader />,
          }}
        />
        <Stack.Screen
          name="DevicesInfo"
          component={DevicesInfo}
          listeners={{
            focus: () => {
              tabNavigation.setOptions({ tabBarStyle: { display: "none" } });
            },
            beforeRemove: () => {
              tabNavigation.setOptions({ tabBarStyle: { display: "flex" } });
            },
          }}
          options={({ navigation, route }: DevicesInfoType) => ({
            presentation: "fullScreenModal",
            header: () => (
              <DevicesInfoHeader navigation={navigation} route={route} />
            ),
            animation: "fade",
          })}
        />
      </Stack.Navigator>
    </BottomSheetContext.Provider>
  );
};

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
  },
  // floatingButton: {
  //   alignSelf: "flex-end",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   margin: 10,
  //   borderRadius: 50,
  // },

  ScrollViewContainer: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  RoomsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },

  ModalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(105,105,105,1)",
    padding: 10,
    width: "90%",
    alignSelf: "center",
  },
});

export default Devices;
