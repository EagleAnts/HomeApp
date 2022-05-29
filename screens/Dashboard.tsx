import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import NetInfo from "@react-native-community/netinfo";
import {
  View,
  Text,
  Platform,
  ScrollView,
  StyleSheet,
  ViewComponent,
  ImageBackground,
  useWindowDimensions,
  Button,
  PermissionsAndroid,
  Pressable,
  RefreshControl,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Card,
  FAB,
  IconButton,
  Paragraph,
  Surface,
  Title,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logout } from "../redux/actions/auth";
import { RootState } from "../store";
import { DashboardScreenProps } from "./Home";

import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  BounceIn,
  FadeIn,
  FadeInDown,
  FadeOut,
  JumpingTransition,
  SequencedTransition,
  SlideInDown,
  SlideInUp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { TABBAR_HEIGHT } from "../components/CustomTabBar";
import { CustomOption } from "../components/CustomOptions";
import { InfoCard } from "../components/Card";
import {
  BottomSheet,
  BottomSheetRefProps,
  PisBottomSheet,
} from "../components/BottomSheet";
import {
  connectPi,
  disconnectPi,
  getRaspberryPisAndDevices,
  selectRaspi,
  showSetupLoading,
} from "../redux/actions/dashboard";
import { CredentialsPopUp } from "../components/CredentialsPopup";
import { setAlert } from "../redux/actions/alert";
import { useRoute } from "@react-navigation/native";
import AnimatedPressable from "../components/AnimatedPressable";
import {
  RaspiSocket,
  ApiSocket,
  ClientSocketContext,
} from "../utils/clientSocketProvider";
import { UserDevices } from "../components/UserDevices";
import { WeatherGraph } from "../components/WeatherGraph/WeatherGraph";
import { InfoText } from "../components/InfoText";
// import CustomChart, { BarChart } from "../components/CustomChart";
import { FontAwesome } from "@expo/vector-icons";
import { SimpleLoading } from "../components/Loading";
import { TemperatureDataProvider } from "../components/WeatherGraph/data";

type ContextType = {
  translateX: number;
  translateY: number;
};

type WelcomeScreenProps = {
  userName: string;
};

const WelcomMessage = ({ userName }: WelcomeScreenProps) => {
  const theme = useTheme();

  return (
    <Animated.View
      style={{
        width: "95%",
        height: 160,
        alignItems: "center",
        borderRadius: 24,
        margin: 5,
      }}
    >
      <Card style={[styles.cardStyles]}>
        <ImageBackground
          blurRadius={5}
          resizeMode="cover"
          imageStyle={{ opacity: 0.8, borderRadius: 24 }}
          style={[styles.weatherBackground]}
          source={require("../assets/weather-assests/rain.jpg")}
        >
          <Card.Title
            titleStyle={[styles.textStyles]}
            title={`Hello, ${userName}`}
            left={() => (
              <Avatar.Image
                size={50}
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
                }}
              />
            )}
          />

          <Card.Content>
            <Title style={[styles.textStyles]}>Welcome Home,</Title>
            <Paragraph style={[styles.textStyles, { fontSize: 15 }]}>
              The Air Quality is good & fresh you can go out today
            </Paragraph>
          </Card.Content>
        </ImageBackground>
      </Card>
    </Animated.View>
  );
};

const FloatingAddButton = ({ navigation, route }: DashboardScreenProps) => {
  const theme = useTheme();

  const user = useAppSelector((state: RootState) => state.auth.user);

  const { width, height } = useWindowDimensions();

  const [showOptions, setshowOptions] = useState(false);

  const rotate = useDerivedValue(() => {
    return showOptions
      ? withTiming(45, { duration: 300 })
      : withTiming(0, { duration: 300 });
  });

  const addButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.floatingButton]}
    >
      <Animated.View
        style={{
          display: showOptions ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <CustomOption
          label="Setup a new Raspberr Pi"
          onPress={() => {
            setshowOptions(false);
            navigation.getParent()?.navigate("Modal", {
              id: "Setup",
              headerTitle: "Setup Raspberry Pi",
              email: user?.email,
            });
          }}
        />
        <CustomOption
          label="Add an existing Raspberry Pi"
          onPress={() => {
            setshowOptions(false);
            navigation.getParent()?.navigate("Modal", {
              id: "Add",
              headerTitle: "Add Raspberry Pi",
              email: user?.email,
            });
          }}
        />
      </Animated.View>
      <Animated.View style={[addButtonStyles]}>
        <IconButton
          icon="plus"
          size={35}
          color="white"
          onPress={() => {
            setshowOptions(!showOptions);
          }}
          style={{
            margin: 0,
            backgroundColor: theme.colors.primary,
          }}
        />
      </Animated.View>
    </Animated.View>
  );
};

const RpiList = () => {
  const { height, width } = useWindowDimensions();
  const ref = useRef<BottomSheetRefProps>(null);

  const route: DashboardScreenProps["route"] = useRoute();

  const [askCredentials, setaskCredentials] = useState(false);

  const raspiList = useAppSelector((state) => state.Dashboard.raspiList);

  const rpiSelected = useAppSelector((state) => state.Dashboard.rpiSelected);

  const connectedPis = useAppSelector((state) => state.Dashboard.connectedPis);

  const piID =
    rpiSelected && raspiList?.length !== 0
      ? raspiList?.filter((el) => el.piName === rpiSelected.piName)[0].piID
      : null;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (raspiList?.length === 0) dispatch(selectRaspi(null));
  }, [raspiList]);

  const onPress = useCallback(() => {
    const isActive = ref.current?.isActive();
    ref.current?.scrollTo(isActive ? 0 : -height + 50);
  }, []);

  const handleConnection = () => {
    console.log(RaspiSocket?.connected);
    console.log(`Connecting to ${rpiSelected}`);

    setaskCredentials(true);
  };

  const theme = useTheme();

  return (
    <View style={{ width: "95%", alignItems: "flex-end", marginVertical: 10 }}>
      {/* {askCredentials ? (
        <CredentialsPopUp
          label={{ l1: "Username", l2: "Password" }}
          placeholder={{ p1: "Enter Rpi Username", p2: "Enter Rpi Password" }}
          visible={askCredentials}
          setVisible={setaskCredentials}
          onPress={(data) => {
            console.log(data);
            if (RaspiSocket?.connected) {
              console.log("Client is Connected to Server");
              RaspiSocket.emit(
                "join:raspberrypi",
                { piID, data },
                (res: any) => {
                  if (res.status === 200) {
                    if (piID) {
                      dispatch(connectPi({ piID, piName: rpiSelected }));
                      dispatch(setAlert(res.msg, "success"));
                      dispatch(selectRaspi(""));
                      dispatch(showSetupLoading(false));
                      setaskCredentials(false);
                    }
                  } else {
                    dispatch(setAlert(res.msg, "error"));
                  }
                }
              );
            }
          }}
        />
      ) : null} */}
      <AnimatedPressable title="See All Raspberry Pis" onPress={onPress} />
      <View
        style={{
          paddingTop: 10,
          width: "100%",
          alignSelf: "flex-start",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!raspiList ? (
          <SimpleLoading />
        ) : (
          <ScrollView
            horizontal
            style={{
              width: "100%",
            }}
            contentContainerStyle={{
              width: "100%",
            }}
          >
            {raspiList?.slice(0, 4).map((el) => (
              <InfoCard
                key={el.piID}
                title={el.piName}
                handlePress={() => {
                  dispatch(selectRaspi({ piID: el.piID, piName: el.piName }));
                }}
                cardStyles={{ width: 150 }}
                bgImg={true}
                bgImgSource={{
                  uri: "https://res.cloudinary.com/homeautomation/image/upload/v1649065662/deviceIcons/rpiimage.png",
                }}
              />
            ))}
          </ScrollView>
        )}
        {/* <Text style={[, { color: theme.colors.text }]}>
          No Raspberry Pi is Selected
        </Text> */}
        <PisBottomSheet
          MAX_TRANSLATE_Y={-height + 50}
          ref={ref}
          children={
            <>
              {raspiList?.length === 0 ? (
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
                raspiList?.map((el) => (
                  <InfoCard
                    key={el.piName}
                    handlePress={() => {
                      ref?.current?.scrollTo(0);
                      // console.log(`Rasbperry Pi ${el.name} selected`);
                      dispatch(
                        selectRaspi({ piID: el.piID, piName: el.piName })
                      );
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
          }
        />
      </View>
    </View>
  );
};

const RpiDetails = ({
  piSelected,
}: {
  piSelected: { piName: string; piID: string };
}) => {
  const theme = useTheme();
  const piDetails = useAppSelector(
    (state) =>
      state.Dashboard.connectedPis?.filter(
        (el) => el.piID === piSelected.piID
      )[0]
  );

  const opacity = useSharedValue(1);
  const rStlyes = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    console.log("PiDetails : ", piDetails);
    opacity.value = withSequence(withTiming(0), withTiming(1));
  }, [piSelected]);

  return !piDetails && !piSelected ? null : (
    <Animated.View
      style={[
        rStlyes,
        {
          width: "90%",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <Surface
        style={[
          styles.rpiDetailsCard,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <InfoText
          label="Current Status : "
          value={
            !piDetails ? (
              <Text>
                Offline <FontAwesome name="circle" color="red" />
              </Text>
            ) : (
              <Text>
                Online <FontAwesome name="circle" color="green" />
              </Text>
            )
          }
        />
        <InfoText label="Uptime : " />
        <InfoText
          label="Total Registered Devices : "
          value={piDetails?.totalDevices}
        />
        <InfoText label="Power Consumption : " />
      </Surface>
    </Animated.View>
  );
};

const Dashboard = ({ navigation, route }: DashboardScreenProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const { height, width } = useWindowDimensions();
  const theme = useTheme();

  const rpiSelected = useAppSelector((state) => state.Dashboard.rpiSelected);

  const [showFAB, setShowFAB] = useState(true);

  // const scrollHandler = useAnimatedScrollHandler((event) => {
  //   if(event)
  // });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (refreshing) {
      setRefreshing(false);
      console.log("Fetching User's RaspberryPis and their Devices ....");
      dispatch(getRaspberryPisAndDevices(ApiSocket));
    }
  }, [refreshing]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y >= 50 && showFAB) {
            setShowFAB(false);
          } else if (nativeEvent.contentOffset.y < 50 && !showFAB) {
            setShowFAB(true);
          }
        }}
        style={{ marginBottom: TABBAR_HEIGHT + 10 }}
        contentContainerStyle={[styles.containerStyles]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[theme.colors.primary]}
            onRefresh={onRefresh}
          />
        }
      >
        <WelcomMessage userName={user?.name!} />
        <RpiList />
        {rpiSelected ? <RpiDetails piSelected={rpiSelected} /> : null}
        <TemperatureDataProvider>
          <WeatherGraph />
        </TemperatureDataProvider>
      </ScrollView>
      {showFAB ? (
        <FloatingAddButton navigation={navigation} route={route} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyles: {
    paddingTop: 20,
    alignItems: "center",
  },

  floatingButton: {
    position: "absolute",
    bottom: TABBAR_HEIGHT + 20,
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
  },
  textStyles: {
    fontWeight: "bold",
    fontFamily: "SourceSansProRegular",
    color: "white",
  },
  cardStyles: {
    width: "100%",
    height: "100%",
    marginHorizontal: 50,
    elevation: 5,
    borderRadius: 24,
    backgroundColor: "black",
  },
  rpiDetailsCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(122,122,122,0.5)",
    alignSelf: "center",
    borderRadius: 15,
    width: "100%",
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  weatherBackground: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Dashboard;
