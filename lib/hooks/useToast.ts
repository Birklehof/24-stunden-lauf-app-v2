import { ToastOptions, ToastPromiseParams, toast } from "react-toastify";
import useTheme from "./useTheme";

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
        success: {
          // @ts-ignore
          ...success,
          icon: "✅", // Maybe not a good idea
        },
        error: {
          // @ts-ignore
          ...error,
          icon: "🔥",
        },
      },
      {
        ...options,
        theme: theme === "light" ? "light" : "dark",
      }
    );
  }

  return { promiseToast };
}
