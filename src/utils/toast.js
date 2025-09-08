import Toast from "react-native-toast-message";

export const _toastVariants = {
  Success: "success",
  Error: "error",
  Warn: "warn",
};

export const showMessage = ({ message, variant }) => {
  Toast.show({ type: variant || "info", text1: message });
};
