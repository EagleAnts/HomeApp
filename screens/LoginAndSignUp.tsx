import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View,
  ImageBackground,
  useWindowDimensions,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "../components/StyledInputs";
import { onSubmit } from "../utils/submitForm";

// import { DevTool } from "@hookform/devtools";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { RootState } from "../store";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const webApp = Platform.select({ web: true, default: false });

const loginBg =
  Platform.OS in ["web", "macos", "windows"]
    ? require("../assets/loginBg.png")
    : require("../assets/loginBgPhone.png");

const LoginAndSignUpPage = () => {
  useEffect(() => {
    console.log("Login Rendered");
  }, []);

  const { height, width } = useWindowDimensions();
  const dispatch = useAppDispatch();
  const methods = useForm();
  const [signUp, setsignUp] = useState(false);
  const loading = useAppSelector((state) => state.loadingStatus.loading);

  const lastNameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  const handleOnPress = () => {
    scale.value = withSequence(withSpring(0.8), withSpring(1));

    setsignUp(!signUp);
  };

  const scale = useSharedValue(1);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const submitForm = methods.handleSubmit((data) => {
    console.log("Submitting");
    Keyboard.dismiss();
    onSubmit({
      type: !signUp ? "login" : "signup",
      dispatch,
      data,
    });
  });

  return (
    <>
      <ImageBackground
        source={loginBg}
        resizeMode="cover"
        style={[
          styles.backgroudImage,
          {
            height,
            width,
          },
        ]}
      />
      <ScrollView
        contentContainerStyle={{
          height,
          alignItems: "center",
          justifyContent: "center",
        }}
        removeClippedSubviews
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.body,
            {
              width: width > 500 ? 400 : 0.8 * width,
            },
            animatedStyles,
          ]}
        >
          <View style={styles.formHeader}>
            <Text style={styles.baseText}>{signUp ? "SignUp" : "Login"}</Text>
          </View>
          <FormProvider {...methods}>
            {signUp ? (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  rules={{ required: "Your First Name is Required" }}
                  placeholder={Placeholder.FirstName}
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  ref={lastNameRef}
                  rules={{ required: "Your Last Name is Required" }}
                  placeholder={Placeholder.LastName}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </>
            ) : null}
            <Input
              rules={{
                required: "Email is Required",
                pattern: {
                  value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Invalid Email Address",
                },
              }}
              label="Email"
              name="email"
              placeholder={Placeholder.Email}
              returnKeyType="next"
              ref={emailRef}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <Input
              label="Password"
              name="password"
              isPasswordField={true}
              ref={passwordRef}
              rules={{
                required: "Password is Required",
                minLength: {
                  value: 8,
                  message: "Password length must be atleast 8 characters",
                },
                maxLength: {
                  value: 15,
                  message: "Password length must not exceed 15 characters",
                },
              }}
              placeholder={Placeholder.Password}
              onSubmitEditing={() => {
                if (signUp) confirmPasswordRef.current?.focus();
                else submitForm();
              }}
            />
            {signUp ? (
              <Input
                ref={confirmPasswordRef}
                name="confirmPassword"
                label="Confirm Password"
                isPasswordField={true}
                placeholder={Placeholder.ConfirmPassword}
                rules={{
                  required: "Password is Required",
                  validate: (value: {}) =>
                    value === methods.getValues("password") ||
                    "Password Didn't Matched",
                }}
                onSubmitEditing={submitForm}
              />
            ) : null}
          </FormProvider>
          <View style={{ alignItems: "flex-end" }}>
            <TouchableOpacity activeOpacity={1} onPress={handleOnPress}>
              <Text
                style={{
                  width: "100%",
                  color: "hsl(0,0%,40%)",
                  fontWeight: "bold",
                  marginVertical: 10,
                  fontSize: 15,
                  textDecorationLine: "underline",
                }}
              >
                {!signUp ? "New User? Signup" : "Already a User? Login"}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              disabled={loading}
              onPress={submitForm}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator size={24} color="white" />
              ) : (
                <Text style={{ color: "white" }}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* {webApp ? <DevTool control={methods.control} /> : null} */}
        {/* </ImageBackground> */}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    height: 800,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
    margin: 5,
  },
  backgroudImage: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
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
  LastName = "Your Last Name",
  Email = "someone@example.com",
  Password = "Enter your password",
  ConfirmPassword = "Confirm Your Password",
}

export default LoginAndSignUpPage;
