import React, { useState } from "react";
import {
  useWindowDimensions,
  Text,
  StyleSheet,
  View,
  Keyboard,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import {
  Button,
  useTheme,
  Modal,
  Portal,
  Provider,
  TextInput,
} from "react-native-paper";
import { useAppSelector } from "../hooks/reduxHooks";

type CredentialsProps = {
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  label?: {
    l1: string;
    l2: string;
  };
  placeholder?: {
    p1: string;
    p2: string;
  };
  onPress: (e: any) => void;
};

type TextInputProps = {
  label?: {
    l1?: string;
    l2?: string;
  };
  placeholder?: {
    p1?: string;
    p2?: string;
  };
  onPress: (e: any) => void;
};

const TextInputView = ({
  label = { l1: "Email", l2: "Password" },
  placeholder = { p1: "Enter your email", p2: "Enter your password" },
  onPress,
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const theme = useTheme();
  const loading = useAppSelector((state) => state.Dashboard.setupLoading);

  return (
    <View>
      <Text
        style={{
          color: theme.colors.text,
          alignSelf: "center",
          fontFamily: "SourceSansProRegular",
          fontSize: 18,
        }}
      >
        Please Verify Your Credentials
      </Text>

      <TextInput
        mode="outlined"
        autoCapitalize="none"
        right={() => <MaterialIcons name="email" size={24} />}
        style={{
          margin: 10,
          color: theme.colors.text,
        }}
        label={label.l1}
        placeholder={placeholder.p1}
        autoComplete={false}
        value={email}
        onChangeText={(email) => setemail(email)}
      />
      <TextInput
        mode="outlined"
        autoCapitalize="none"
        style={{ margin: 10 }}
        label={label.l2}
        placeholder={placeholder.p2}
        right={
          <TextInput.Icon
            name={!showPassword ? "eye-off" : "eye"}
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          />
        }
        autoComplete={false}
        value={password}
        secureTextEntry={!showPassword}
        onChangeText={(password) => setpassword(password)}
      />

      <Button
        loading={loading}
        disabled={email && password && !loading ? false : true}
        onPress={() => {
          Keyboard.dismiss();
          const userDetails = {
            [`${label.l1?.toLowerCase()}`]: email,
            [`${label.l2?.toLowerCase()}`]: password,
          };
          onPress.bind(this, userDetails)();
        }}
        style={{
          borderRadius: 10,
          margin: 10,
          width: 100,
          alignSelf: "center",
        }}
        contentStyle={{ padding: 5 }}
      >
        Submit
      </Button>
    </View>
  );
};

export const CredentialsPopUp = ({
  visible,
  setVisible,
  label,
  placeholder,
  onPress,
}: CredentialsProps) => {
  const { width, height } = useWindowDimensions();
  const theme = useTheme();

  const hideModal = () => setVisible(false);

  return (
    <Portal
      theme={{
        colors: {
          primary: theme.colors.onSurface,
          placeholder: theme.colors.onSurface,
          // backdrop: "rgba(0,0,0,0.5)",
        },
      }}
    >
      <Modal
        visible={visible}
        onDismiss={hideModal}
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={{
          backgroundColor: theme.colors.background,
          borderRadius: 10,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(105,105,105,1)",
          padding: 10,
          height: height * 0.5,
          width: "90%",
          alignSelf: "center",
        }}
      >
        <TextInputView
          label={label}
          placeholder={placeholder}
          onPress={onPress}
        />
      </Modal>
    </Portal>
  );
};
