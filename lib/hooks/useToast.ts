import { ToastOptions, ToastPromiseParams, toast } from "react-toastify";
import useTheme from "./useTheme";

export default function useToast() {
  const { theme } = useTheme();

  function promiseToast(
    promise: Promise<any> | (() => Promise<any>),
    { pending, error, success }: ToastPromiseParams<any, unknown, unknown>,
    options?: ToastOptions<{}> | undefined
  ) {
    toast.promise(
      promise,
      {
        pending,
        success,
        error,
      },
      {
        ...options,
        theme: theme === "light" ? "light" : "dark",
      }
    );
  }

  return { promiseToast };
}
