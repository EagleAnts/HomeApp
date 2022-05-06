import React, {
  PropsWithChildren,
  RefAttributes,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ViewStyle,
  TextStyle,
  TextInputProps,
  ViewProps,
  ScrollView,
} from "react-native";

import { Error } from "./Error";

import { FontAwesome } from "@expo/vector-icons";
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
  //   FormProvider,
  //   useForm,
  useFormContext,
} from "react-hook-form";
import {
  Portal,
  Provider,
  useTheme,
  TouchableRipple,
} from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const webApp = Platform.select({ web: true, default: false });

export const PasswordInput = React.forwardRef((props: any, ref) => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  return (
    <>
      <TextInput ref={ref} secureTextEntry={passwordVisibility} {...props} />
      <Pressable
        style={{ width: "10%", alignSelf: "center" }}
        onPress={() => setPasswordVisibility(!passwordVisibility)}
      >
        <FontAwesome
          name={!passwordVisibility ? "eye" : "eye-slash"}
          size={25}
          color="black"
        />
      </Pressable>
    </>
  );
});

const SearchableDropdown = ({
  data,
  error,
}: {
  data?: Array<{}>;
  error: boolean;
}) => {
  const theme = useTheme();
  const { setValue, watch, getValues } = useFormContext();
  const [searchableData, setSearchableData] = useState<Array<any> | null>(null);
  const [filteredData, setfilteredData] = useState<Array<any> | null>(null);

  const keyword = watch("device_type");

  const handleTouchablePress = (el: string) => {
    setValue("device_type", el, { shouldValidate: true });
  };

  const height = useSharedValue(0);
  const rStyles = useAnimatedStyle(() => {
    return {
      height: error
        ? withDelay(800, withTiming(height.value, { duration: 1000 }))
        : withTiming(height.value, { duration: 1000 }),
    };
  }, []);

  useEffect(() => {
    if (data && !searchableData) {
      setSearchableData(data);
    }

    if (!keyword || searchableData?.find((el) => el === keyword)) {
      height.value = 0;
      setfilteredData(null);
    } else if (searchableData && keyword) {
      height.value = 150;
      const filteredData = searchableData.filter((el) => {
        const lcaseKeyword = keyword.toLowerCase();
        return el.toLowerCase().includes(lcaseKeyword);
      });

      setfilteredData(filteredData);
    }
  }, [keyword]);

  return (
    <Animated.View
      style={[rStyles, { flex: !filteredData ? 0 : 1 }]}
      layout={Layout}
    >
      <ScrollView
        nestedScrollEnabled
        keyboardShouldPersistTaps="always"
        style={{
          backgroundColor: theme.colors.background,
        }}
      >
        {filteredData?.map((el) => (
          <TouchableRipple
            onPress={() => handleTouchablePress(el)}
            key={el}
            style={{
              margin: 10,
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: theme.colors.text }}>{el}</Text>
          </TouchableRipple>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

export type InputType =
  | Partial<TextInputProps | ControllerProps>
  | ({
      name: string;
      label: string;
      isPasswordField?: boolean;
      viewStyles?: ViewStyle;
      textStyles?: TextStyle;
      searchable?: boolean;
      data?: Array<{}>;
    } & RefAttributes<unknown>);

export const Input: React.ForwardRefExoticComponent<InputType> =
  React.forwardRef((props: any, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();

    const theme = useTheme();

    const {
      label,
      name,
      rules,
      viewStyles = { backgroundColor: "#D9D8D9" },
      textStyles,
      isPasswordField = false,
      searchable = false,
      data,
      ...textInputProps
    } = props;

    const inputTextStyle: Array<Object> = [styles.textInput, textStyles];

    const customRules = {
      validate: (value: string) => {
        if (value) return !!value.trim() || "Please fill out this field!";
      },
      ...rules,
    };

    if (webApp)
      inputTextStyle.push({
        outlineStyle: "none",
        WebkitBoxShadow: `0 0 0 30px ${viewStyles.backgroundColor}  inset`,
      });

    // const animation = useSharedValue(0);
    // const animatedStyles = useAnimatedStyle(() => {
    //   return {
    //     display: animation.value ? "flex" : "none",
    //   };
    // }, []);

    // console.log(errors)
    return (
      <View
        style={[
          viewStyles,
          {
            // width: "80%",
            margin: 10,
            borderRadius: 10,
            borderBottomStartRadius: searchable ? 0 : 10,
            borderBottomEndRadius: searchable ? 0 : 10,
          },
        ]}
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
              rules={customRules}
              render={({ field: { onChange, onBlur, value } }) =>
                isPasswordField ? (
                  <PasswordInput
                    ref={ref}
                    style={[inputTextStyle, { width: "90%" }]}
                    value={value || ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="gray"
                    selectionColor={theme.colors.primary}
                    autoComplete={webApp ? "none" : "off"}
                    {...textInputProps}
                  />
                ) : (
                  <TextInput
                    ref={ref}
                    style={[inputTextStyle]}
                    value={value || ""}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholderTextColor="gray"
                    selectionColor={theme.colors.primary}
                    autoComplete={webApp ? "none" : "off"}
                    {...textInputProps}
                  />
                )
              }
              name={name}
            />
          </View>
          <Error
            showError={errors[name] ? true : false}
            errorMsg={errors[name]?.message}
          />
        </View>
        {searchable ? (
          <SearchableDropdown data={data} error={errors[name] ? true : false} />
        ) : null}
      </View>
    );
  });

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
    width: "100%",
  },
});
