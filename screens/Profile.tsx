import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { Avatar, Button, useTheme } from "react-native-paper";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  Layout,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { Input } from "../components/StyledInputs";
import { ProfileScreenProps } from "./Home";
import { MaterialIcons } from "@expo/vector-icons";
import { ApiSocket } from "../utils/clientSocketProvider";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { setAlert } from "../redux/actions/alert";
import { updateProfile } from "../redux/actions/auth";

enum Placeholder {
  FirstName = "Enter your First Name",
  LastName = "Enter your Last Name",
}

const webApp = Platform.select({ web: true, default: false });

const Profile = ({ navigation, route }: ProfileScreenProps) => {
  const theme = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  const [firstName, lastName] = user?.name.split(" ")!;

  const methods = useForm();
  const [editProfile, seteditProfile] = useState(false);

  const dispatch = useAppDispatch();

  const saveChanges = methods.handleSubmit((data) => {
    console.log("Submitting...");
    console.log(data);
    ApiSocket?.emit("api:editProfile", data, (res: any) => {
      if (res.status === 200) {
        seteditProfile(false);
        dispatch(updateProfile(`${data.firstName} ${data.lastName}`));
        dispatch(setAlert(res.msg, "success"));
      } else {
        dispatch(setAlert(res.msg, "error"));
      }
    });
  });

  return (
    <Animated.View
      entering={FadeIn}
      layout={Layout}
      style={[styles.containerStyles]}
    >
      <Animated.View
        entering={ZoomIn}
        style={[
          {
            width: "100%",
            alignItems: "center",
          },
        ]}
      >
        <Avatar.Image
          style={{
            marginTop: 10,
          }}
          size={140}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
          }}
        />
      </Animated.View>
      <View>
        <Text style={[styles.textStyles, { color: theme.colors.text }]}>
          {firstName}
        </Text>
        <Text
          style={[
            styles.textStyles,
            {
              fontSize: 35,
              fontWeight: "100",
              color: theme.colors.text,
              transform: [{ translateY: -15 }],
            },
          ]}
        >
          {lastName}
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: webApp ? "50%" : "100%" }}
        contentContainerStyle={{ width: "100%", alignItems: "center" }}
      >
        <FormProvider {...methods}>
          <Input
            viewStyles={{ backgroundColor: theme.dark ? "black" : "#E9ECEF" }}
            textStyles={{ color: theme.colors.text }}
            rules={{ required: "First Name Can't be empty" }}
            placeholder={editProfile ? "" : firstName}
            name="firstName"
            label={editProfile ? Placeholder.FirstName : "First Name"}
            editable={editProfile}
          />
          <Input
            viewStyles={{ backgroundColor: theme.dark ? "black" : "#E9ECEF" }}
            textStyles={{ color: theme.colors.text }}
            rules={{ required: "Last Name Can't be empty" }}
            placeholder={editProfile ? "" : lastName}
            name="lastName"
            label={editProfile ? Placeholder.LastName : "Last Name"}
            editable={editProfile}
          />
          <Input
            placeholder={user?.email}
            viewStyles={{ backgroundColor: theme.dark ? "black" : "#E9ECEF" }}
            name="email"
            label="Email"
            editable={false}
          />
        </FormProvider>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
            flexDirection: "row",
          }}
        >
          <Button
            disabled={editProfile}
            onPress={() => {
              seteditProfile(true);
            }}
            color="#53D8FB"
            style={{
              display: editProfile ? "none" : "flex",
              borderRadius: 100,
            }}
          >
            <Text>Edit Profile</Text>
          </Button>

          {editProfile ? (
            <Animated.View entering={FadeIn} style={{ flexDirection: "row" }}>
              <Button
                color="red"
                icon={(props) => <MaterialIcons name="cancel" {...props} />}
                contentStyle={{ flexDirection: "row-reverse" }}
                disabled={!editProfile}
                onPress={() => {
                  seteditProfile(false);
                  methods.reset();
                  methods.clearErrors();
                }}
                style={{ borderRadius: 100 }}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                icon={(props) => <MaterialIcons name="done-all" {...props} />}
                contentStyle={{ flexDirection: "row-reverse" }}
                onPress={saveChanges}
                color="#95E214"
                style={{
                  borderRadius: 100,
                }}
              >
                <Text>Save Changes</Text>
              </Button>
            </Animated.View>
          ) : null}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    alignItems: "center",
  },
  textStyles: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "SourceSansProRegular",
  },
});

export default Profile;
