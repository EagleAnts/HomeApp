import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Modal, Portal, useTheme } from "react-native-paper";

export const CustomModal = ({
  children,
  visible,
  handleModalDismiss,
}: {
  children: React.ReactNode;
  visible: boolean;
  handleModalDismiss: () => void;
}) => {
  const { height } = useWindowDimensions();
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleModalDismiss}
        contentContainerStyle={[
          styles.ModalContainer,
          {
            backgroundColor: theme.colors.background,
            height: 0.7 * height,
          },
        ]}
        style={{ marginBottom: 60 }}
      >
        {children}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  ModalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(105,105,105,1)",
    padding: 10,
    width: "90%",
    alignSelf: "center",
  },
});
