import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { HomeStackParamList, ModalScreenProps, RootHomeProps } from "./Home";
import {
  View,
  ImageBackground,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useAppSelector } from "../hooks/reduxHooks";
import { setAlert } from "../redux/actions/alert";
import {
  getRaspberryPisAndDevices,
  showSetupLoading,
} from "../redux/actions/dashboard";
import { Button, Portal, TextInput, useTheme } from "react-native-paper";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../components/StyledInputs";
import { useNavigation, useRoute } from "@react-navigation/native";
import Constants from "expo-constants";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch } from "../hooks/reduxHooks";
import { CredentialsPopUp } from "../components/CredentialsPopup";
import { connectToPi } from "../utils/clientRaspiConnHandler";
import { LottieLoading } from "../components/Loading";
import { ApiSocket, RaspiSocket } from "../utils/clientSocketProvider";
import { Socket } from "socket.io-client";

const serverAddress = `http://${Constants.manifest?.extra?.serverUrl}:5000`;
// const serverAddress = `${Constants.manifest?.extra?.serverAddress}`;

let RaspiClient: Socket | null = null;

enum Placeholder {
  piName = "E.g. raspi1",
  username = "E.g. rpiadmin",
  password = "password",
}

type PiDetails = {
  piName: string | null;
  rpipassword: string | null;
  rpiusername: string | null;
};

const SetupModal = ({}: // setVisible,
{
  setVisible?: (arg: boolean) => void;
}) => {
  const theme = useTheme();
  const route: ModalScreenProps["route"] = useRoute();
  const navigation: RootHomeProps["navigation"] = useNavigation();

  const [ipAddr, setipAddr] = useState("http://192.168.0.118:8000");
  const [piDetails, setPiDetails] = useState<PiDetails>({
    piName: null,
    rpipassword: null,
    rpiusername: null,
  });

  const [visible, setVisible] = useState(false);
  const [connected, setconnected] = useState(false);

  const dispatch = useAppDispatch();

  const handleCredentialsOnPress = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    console.log(piDetails);
    if (RaspiClient?.disconnected) RaspiClient?.connect();
    if (RaspiClient?.connected) {
      dispatch(showSetupLoading(true));
      RaspiClient?.emit(
        "register",
        {
          ...piDetails,
          serverAddress,
          email,
          password,
        },
        (res: any) => {
          dispatch(showSetupLoading(false));
          console.log("Got Response..");
          console.log(res);

          if (res.status === 200) {
            dispatch(setAlert(res.msg, "success"));
            setVisible(false);
            setconnected(false);
            dispatch(getRaspberryPisAndDevices(ApiSocket));
            navigation.goBack();
          } else {
            if (!res.errors) {
              dispatch(setAlert(res.msg, "error"));
            } else {
              res.errors.forEach((err: any) => {
                dispatch(
                  setAlert(err.msg, res.status === 202 ? "info" : "error")
                );
              });
            }
          }
        }
      );
    }
  };

  const connectToRaspi = async () => {
    console.log(ipAddr);
    if (RaspiClient) {
      console.log("RaspiClient Exists");
      console.log(RaspiClient);
    } else {
      console.log("RaspiClient Doesn't Exists");
    }
    RaspiClient?.disconnect();

    if (!RaspiClient || !RaspiClient.connected) {
      connectToPi(ipAddr, route.params.email)
        .then((res) => {
          RaspiClient = res.socket;
          setconnected(true);
          dispatch(
            setAlert("Successfully Connected to Raspberry Pi", "success")
          );
        })
        .catch((err) => {
          setconnected(false);
          if (err.status === 502) {
            dispatch(setAlert(err.msg, "error"));
            navigation.goBack();
          } else {
            dispatch(
              setAlert(
                "Error connecting to Raspberry Pi. Please make sure IP Address is Correct and Pi is Online",
                "error"
              )
            );
          }

          console.log(err);
        });
    }
  };

  const disconnectRaspi = () => {
    RaspiClient?.disconnect();
    setconnected(false);
    dispatch(setAlert("Disconnected from Raspberry Pi", "info"));
  };

  const methods = useForm();
  const submitForm = methods.handleSubmit((data: any) => {
    setVisible(true);
    setPiDetails(data);
  });

  return (
    <>
      <TextInput
        editable={!connected}
        disabled={connected}
        style={{ width: "80%" }}
        autoComplete="none"
        mode="outlined"
        autoCapitalize="none"
        value={ipAddr}
        right={
          <TextInput.Icon
            name={connected ? "wifi-off" : "wifi"}
            onPress={connected ? disconnectRaspi : connectToRaspi}
          />
        }
        onChangeText={(ipAddr) => setipAddr(ipAddr)}
      />
      {connected ? (
        <>
          <FormProvider {...methods}>
            <Input
              autoCapitalize="none"
              rules={{
                required: "Please fill out this field!",
              }}
              name="piName"
              label="Enter any name for Raspberry Pi"
              placeholder={Placeholder.piName}
            />
            <Input
              autoCapitalize="none"
              rules={{
                required: "Please fill out this field!",
              }}
              name="rpiusername"
              label="Enter any Username for RaspberryPi"
              placeholder={Placeholder.username}
            />
            <Input
              rules={{
                required: "Please fill out this field!",
                minLength: {
                  value: 8,
                  message: "Password length must be atleast 8 characters",
                },
              }}
              name="rpipassword"
              label="Enter any Password for RaspberryPi"
              isPasswordField={true}
              placeholder={Placeholder.password}
            />
          </FormProvider>
          <Button
            onPress={submitForm}
            labelStyle={{
              paddingHorizontal: 20,
              paddingVertical: 5,
            }}
            color="white"
            style={{
              alignSelf: "center",
              width: 200,
              borderRadius: 10,
              backgroundColor: "#D32F2F",
              margin: 10,
            }}
          >
            Submit
          </Button>

          <CredentialsPopUp
            visible={visible}
            setVisible={setVisible}
            onPress={handleCredentialsOnPress}
          />
        </>
      ) : null}
    </>
  );
};
const AddModal = ({ setVisible }: { setVisible?: (arg: boolean) => void }) => {
  const dispatch = useAppDispatch();

  const route = useRoute<ModalScreenProps["route"]>();
  const theme = useTheme();
  const methods = useForm();
  const submitForm = methods.handleSubmit((data) => {
    console.log(data);
    ApiSocket?.emit(
      "api:addRaspberryPi",
      { ...data, userID: route.params.userID },
      (cbRes: { status: number; msg: string }) => {
        console.log(cbRes);
        if (cbRes.status === 200) {
          dispatch(setAlert(cbRes.msg, "success"));
        } else if (cbRes.status === 100) {
          dispatch(setAlert(cbRes.msg, "error"));
        } else {
          dispatch(setAlert(cbRes.msg, "info"));
        }
      }
    );
  });

  return (
    <>
      <FormProvider {...methods}>
        <Input
          rules={{ required: "Please fill out this field!" }}
          name="piName"
          label="Raspberry Pi Name"
          placeholder={Placeholder.piName}
        />
        <Input
          rules={{
            required: "Please fill out this field!",
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: "Invalid Email Address",
            },
          }}
          name="email"
          label="Enter User Email"
          placeholder={"Eg. abc@gmail.com"}
        />
        <Input
          rules={{
            required: "Please fill out this field!",
          }}
          name="apiKey"
          label="Enter the API Key"
          isPasswordField={true}
        />
      </FormProvider>
      <Button
        onPress={submitForm}
        color="white"
        labelStyle={{
          paddingHorizontal: 20,
          paddingVertical: 5,
        }}
        style={{
          alignSelf: "center",
          width: 200,
          borderRadius: 10,
          backgroundColor: "#D32F2F",
          margin: 10,
        }}
      >
        Submit
      </Button>
    </>
  );
};

export const AddPiScreen = ({ navigation, route }: ModalScreenProps) => {
  console.log(route.params.id);

  const showLoading = useAppSelector((state) => state.Dashboard.setupLoading);

  const { width, height } = useWindowDimensions();
  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(showSetupLoading(false));
      RaspiClient?.disconnect();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {showLoading ? (
        <Portal>
          <LottieLoading />
        </Portal>
      ) : null}
      <ImageBackground
        blurRadius={2}
        source={{
          uri: "https://res.cloudinary.com/homeautomation/image/upload/v1648128260/deviceIcons/wp10287747_ofyenc.jpg",
        }}
        style={{
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
        }}
        // resizeMode="cover"
      >
        <ScrollView
          style={{
            alignSelf: "center",
            height,
            width: width * 0.95,
            marginTop: 50,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {route.params.id === "Setup" ? <SetupModal /> : <AddModal />}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};
