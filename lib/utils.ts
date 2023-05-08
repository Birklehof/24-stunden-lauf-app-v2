import { ToastOptions, ToastPromiseParams, toast } from "react-toastify";

export function themedPromiseToast(
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
      theme:
        localStorage.getItem("usehooks-ts-dark-mode") === "true"
          ? "dark"
          : "light",
    }
  );
}
