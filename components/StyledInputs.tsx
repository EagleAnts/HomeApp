import React, { PropsWithChildren, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";

import { Error } from "./Error";

import { FontAwesome } from "@expo/vector-icons";
import {
  Control,
  Controller,
  FieldValues,
  //   FormProvider,
  //   useForm,
  useFormContext,
} from "react-hook-form";

export const PasswordInput = (props: any) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  return (
    <>
      <TextInput secureTextEntry={passwordVisibility} {...props} />
      <Pressable onPress={() => setPasswordVisibility(!passwordVisibility)}>
        <FontAwesome
          name={!passwordVisibility ? "eye" : "eye-slash"}
          size={24}
          color="black"
        />
      </Pressable>
    </>
  );
};

export const Input = (
  props: PropsWithChildren<any> & Control<FieldValues, object>
) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { label, rules, ...textInputProps } = props;

  const inputTextStyle: any = [styles.textInput];

  if (Platform.OS === "web") inputTextStyle.push({ outlineStyle: "none" });

  // console.log(errors)
  return (
    <View
      style={{
        backgroundColor: "#D9D8D9",
        margin: 10,
        borderRadius: 10,
      }}
    >
      <Text style={styles.inputHeader}>{label}</Text>
      <View style={styles.row}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Controller
            control={control}
            rules={rules}
            render={({ field: { onChange, onBlur, value } }) =>
              label === "Password" || label === "Confirm Password" ? (
                <PasswordInput
                  style={inputTextStyle}
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor="gray"
                  selectionColor="#7b40f2"
                  autoComplete={Platform.OS === "web" ? "none" : "off"}
                  {...textInputProps}
                />
              ) : (
                <TextInput
                  style={inputTextStyle}
                  value={value || ""}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor="gray"
                  selectionColor="#7b40f2"
                  autoComplete={Platform.OS === "web" ? "none" : "off"}
                  {...textInputProps}
                />
              )
            }
            name={label}
          />
        </View>

        {errors[label] && <Error errorMsg={errors[label]?.message} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  inputHeader: {
    width: "100%",
    color: "gray",
    fontSize: 12,
    paddingLeft: 10,
    paddingTop: 10,
  },
  textInput: {
    color: "black",
    paddingLeft: 5,
    alignSelf: "center",
    height: 40,
    width: "90%",
  },
});
