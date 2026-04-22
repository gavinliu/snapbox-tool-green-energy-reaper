import { Platform, ToastAndroid } from "react-native";

export function showToast(
  message: string,
  duration: "short" | "long" = "short",
): void {
  if (Platform.OS === "android") {
    ToastAndroid.show(
      message,
      duration === "long" ? ToastAndroid.LONG : ToastAndroid.SHORT,
    );
  } else {
    console.log("[Toast]", message);
  }
}

export function showSuccessToast(message: string): void {
  showToast(`✓ ${message}`);
}

export function showErrorToast(message: string): void {
  showToast(`✗ ${message}`, "long");
}

export function showInfoToast(message: string): void {
  showToast(`ℹ ${message}`);
}
