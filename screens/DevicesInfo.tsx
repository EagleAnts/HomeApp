import { useRoute } from "@react-navigation/native";
import React, {
  LegacyRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  Image,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Button,
  Dialog,
  Headline,
  IconButton,
  Paragraph,
  Portal,
  Provider,
  Subheading,
  Surface,
  Switch,
  Title,
  useTheme,
} from "react-native-paper";
import Animated, {
  BounceIn,
  BounceOut,
  Extrapolate,
  FadeIn,
  FadeOut,
  FadingTransition,
  interpolate,
  JumpingTransition,
  Layout,
  SequencedTransition,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { InfoText } from "../components/InfoText";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  deleteDevice,
  device_Type,
  piSelect,
  // saveDeviceStatus,
  toggleStatus,
} from "../redux/actions/devices";
import { DeviceListType } from "../redux/reducers/dashboardReducer";
import { ApiSocket, RaspiSocket } from "../utils/clientSocketProvider";
import { DevicesInfoType, Props } from "./Devices";

const { createAnimatedComponent } = Animated;

const AnimatedScrollView = createAnimatedComponent(ScrollView);

const DevicesInfo = ({
  navigation,
  route,
}: {
  navigation: Props["navigation"];
  route: DevicesInfoType["route"];
}) => {
  const piSelected = useAppSelector((state) => state.Devices.piSelected);
  const devices = useAppSelector((state) => {
    Animated.View;
    if (state.Devices.roomsList) {
      return state.Devices.roomsList[route.params.title];
    }
  });

  const translateX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x;
  });

  const { width: DEVICE_WIDTH } = useWindowDimensions();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    console.log("Device Info View");
    if (devices) {
      console.log("Devices List : ", devices);
    }
    if (!devices) navigation.goBack();
  }, [devices]);

  const theme = useTheme();
  return (
    <Portal.Host>
      <AnimatedScrollView
        ref={scrollViewRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onContentSizeChange={(width, height) => {
          // console.log("Scrollview Width and Height : ", width, height);
          scrollViewRef.current?.scrollTo({
            x: translateX.value,
            animated: true,
          });
        }}
        pagingEnabled
        style={{ flex: 1 }}
        horizontal
        contentContainerStyle={[]}
      >
        {devices
          ? devices.map((el, index) => (
              <DeviceView
                key={el._id}
                device={el}
                piSelected={piSelected!}
                index={index}
                translateX={translateX}
              />
            ))
          : null}
      </AnimatedScrollView>
    </Portal.Host>
  );
};

let count = 0;
const DeviceView = ({
  device,
  index,
  translateX,
  piSelected,
}: {
  device: DeviceListType;
  index: number;
  translateX: Animated.SharedValue<number>;
  piSelected: piSelect;
}) => {
  const deviceStatus = useAppSelector(
    (state) =>
      state.Devices.deviceStatus?.filter((el) => el._id === device._id)[0]
  );

  const route = useRoute<DevicesInfoType["route"]>();

  const dispatch = useAppDispatch();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const piConnected = useAppSelector((state) =>
    state.Dashboard.connectedPis?.some((el) => el.piID === piSelected.piID)
  );

  const handleDelete = () => {
    console.log("Deleting this Device...");
    dispatch(
      deleteDevice({
        piID: piSelected.piID,
        deviceID: device._id,
        roomName: device.area,
      })
    );
    ApiSocket?.emit(
      "api:deleteDevice",
      { piID: piSelected.piID, deviceID: device._id },
      (res: any) => {
        console.log(res);
      }
    );
    setShowDeleteDialog(false);
  };
  const toggleDeviceEvent = () => {
    RaspiSocket?.emit("raspberrypi:sendPrivately", {
      event: "toggleDevice",
      to: piSelected.piID,
      networkID: piSelected.networkID,
      deviceID: device._id,
      gpio: device.gpio,
      count,
      content: {
        type: `${device.name}`,
        msg: `Hello From ${route.params.userName}`,
      },
      from: route.params.userName,
    });
    count++;

    dispatch(toggleStatus(device._id));
  };

  const { height, width } = useWindowDimensions();

  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const theme = useTheme();
  return (
    <Animated.View
      layout={SequencedTransition}
      entering={ZoomIn}
      exiting={ZoomOut}
      style={[
        {
          width,
          height: "100%",
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          style={{ width: width * 0.9 }}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          {/* <Dialog.Title>Alert</Dialog.Title> */}
          <Dialog.Content>
            <Paragraph>Are you sure? You want to Delete this Device</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDelete}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <IconButton
        style={{ alignSelf: "flex-end" }}
        icon="delete"
        color="red"
        onPress={() => setShowDeleteDialog(true)}
      />

      <ScrollView
        style={{ height: height }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <Animated.Image
          style={[
            {
              alignSelf: "center",
              height: 250,
              width: 250,
            },
            rStyle,
          ]}
          source={{
            uri: device.deviceType.icon,
          }}
        />
        <Title
          style={{
            textAlign: "center",
            fontSize: 30,
            fontFamily: "SourceSansProRegular",
            fontWeight: "bold",
          }}
        >
          {device.name}
        </Title>
        <Surface
          style={[
            styles.CardStyles,
            {
              opacity: 0.8,
              backgroundColor: theme.colors.background,
            },
          ]}
        >
          <InfoText label="Device Type : " value={device.deviceType.type} />

          <InfoText
            label="Device Description : "
            value={device.deviceType.description}
          />

          <InfoText label="Device GPIO : " value={device.gpio} />
          <InfoText label="Device Status : ">
            <Switch
              disabled={!piConnected}
              thumbColor={theme.colors.primary}
              trackColor={{
                false: "#ccc",
                true: theme.colors.primary,
              }}
              value={deviceStatus?.status}
              onValueChange={() => toggleDeviceEvent()}
            />
          </InfoText>
        </Surface>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  CardStyles: {
    alignSelf: "center",
    elevation: 4,
    borderRadius: 15,
    width: "90%",
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 20,
  },
});

export default DevicesInfo;
<Text style={{ textAlign: "right" }}>Hello</Text>;
