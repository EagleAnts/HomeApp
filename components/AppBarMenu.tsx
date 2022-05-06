import React, { useState } from "react";
import { View } from "react-native";
import { Button, Menu, Divider, Provider } from "react-native-paper";

export const AppbarMenu = ({
  anchor,
  children,
}: {
  anchor: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Provider>
      {/* <View
        style={{
          paddingTop: 50,
          flexDirection: "row",
          justifyContent: "center",
        }}
      > */}
      <Menu visible={true} onDismiss={closeMenu} anchor={anchor}>
        {children}
      </Menu>
      {/* </View> */}
    </Provider>
  );
};
