import { ToastOptions, ToastPromiseParams, toast } from "react-toastify";
import useTheme from "./useTheme";
import { useEffect } from "react";

export default function useToast() {
  const { theme } = useTheme();

  function promiseToast(
    promise: Promise<any> | (() => Promise<any>),
    { pending, error, success }: ToastPromiseParams<any, unknown, unknown>,
    options?: ToastOptions<{}> | undefined
  ) {
    return toast.promise(
      promise,
      {
        pending,
        success,
        error,
      },
      {
        ...options,
        theme: theme === "dark" ? "dark" : "light",
      }
    );
  }

  return { promiseToast };
}
