import React, { useRef, useState } from "react";
import GlobalStyles from "./GlobalStyles";
import { StatusBar } from "expo-status-bar";
import {
  // Dimensions,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View,
  ImageBackground,
  useWindowDimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as Animatable from "react-native-animatable";
import {
  // Control,
  // Controller,
  // FieldValues,
  FormProvider,
  useForm,
  // useFormContext,
} from "react-hook-form";
import { Input } from "../components/StyledInputs";
import { onSubmit } from "../utils/submitForm";

import { DevTool } from "@hookform/devtools";
// const deviceHeight = Dimensions.get("screen").height;
// const deviceWidth = Dimensions.get("screen").width;

const loginBg =
  Platform.OS in ["web", "macos", "windows"]
    ? require("../assets/loginBg.png")
    : require("../assets/loginBgPhone.png");

const SignUpPage = () => {
  return (
    <>
      <Input
        label="First Name"
        rules={{ required: "Your First Name is Required" }}
        placeholder={Placeholder.FirstName}
      />
      <Input
        label="Last Name"
        rules={{ required: "Your Last Name is Required" }}
        placeholder={Placeholder.LastName}
      />
    </>
  );
};

const LoginAndSignUpPage = () => {
  const { height, width } = useWindowDimensions();

  const methods = useForm({ mode: "onChange" });
  const [signUp, setsignUp] = useState(false);

  const formRef = useRef<Animatable.View & View>(null);

  return (
    <SafeAreaView style={GlobalStyles.droidSafeArea}>
      <StatusBar style="dark" />
      <ImageBackground
        source={loginBg}
        resizeMode="cover"
        style={styles.backgroudImage}
      >
        <ScrollView
          style={{ height: "100%", width: "100%" }}
          // behavior="padding"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <View style={[styles.body, { height }]}>
            <Animatable.View
              ref={formRef}
              style={[
                styles.body,
                {
                  width: width > 500 ? 400 : 0.8 * width,
                },
              ]}
            >
              <View style={styles.formHeader}>
                <Text style={styles.baseText}>
                  {signUp ? "SignUp" : "Login"}
                </Text>
              </View>
              <FormProvider {...methods}>
                {signUp ? <SignUpPage /> : null}
                <Input
                  rules={{
                    required: "Email is Required",
                    pattern: {
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Invalid Email Address",
                    },
                  }}
                  label="Email"
                  placeholder={Placeholder.Email}
                />
                <Input
                  label="Password"
                  rules={{
                    required: "Password is Required",
                    pattern: {
                      value:
                        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
                      message:
                        "Password must contain One Lowercase, Uppercase and a Special Character",
                    },
                  }}
                  placeholder={Placeholder.Password}
                />
                {signUp ? (
                  <Input
                    label="Confirm Password"
                    placeholder={Placeholder.ConfirmPassword}
                    rules={{
                      required: "Password is Required",
                      validate: (value: {}) =>
                        value === methods.getValues("Password") ||
                        "Password Didn't Matched",
                    }}
                  />
                ) : null}
              </FormProvider>
              <Animatable.View style={{ alignItems: "flex-end" }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    // formRef.current.fadeIn(800);
                    setsignUp(!signUp);
                  }}
                >
                  <Text
                    style={{
                      width: "100%",
                      color: "hsl(0,0%,40%)",
                      fontWeight: "bold",
                      margin: 10,
                      fontSize: 15,
                      textDecorationLine: "underline",
                    }}
                  >
                    {!signUp ? "New User? Signup" : "Already a User? Login"}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
              <View>
                <TouchableOpacity
                  onPress={methods.handleSubmit((data) =>
                    onSubmit({
                      type: !signUp ? "Login" : "Signup",
                      data,
                    })
                  )}
                  style={styles.submitButton}
                >
                  <Text style={{ color: "white" }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </View>
          {Platform.OS === "web" ? <DevTool control={methods.control} /> : null}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  backgroudImage: {
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  row: {
    marginHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  baseText: {
    textAlign: "center",
    color: "hsl(0,0%,40%)",
    fontSize: 30,
    fontWeight: "bold",
  },
  inputHeader: {
    width: "100%",
    color: "gray",
    fontSize: 12,
    paddingLeft: 10,
    paddingTop: 10,
  },
  formHeader: {
    margin: 10,
    width: "100%",
    alignSelf: "center",
  },
  textInput: {
    color: "black",
    paddingLeft: 5,
    alignSelf: "center",
    height: 40,
    width: "90%",
  },

  submitButton: {
    width: 200,
    alignSelf: "center",
    alignItems: "center",
    margin: 10,
    padding: 10,
    fontSize: 10,
    backgroundColor: "#7b40f2",
    borderRadius: 10,
  },
});

enum Placeholder {
  FirstName = "Your First Name",
  MiddleName = "Your Middle Name",
  LastName = "Your Last Name",
  Email = "someone@example.com",
  Password = "Enter your password",
  ConfirmPassword = "Confirm Your Password",
}

export default LoginAndSignUpPage;
