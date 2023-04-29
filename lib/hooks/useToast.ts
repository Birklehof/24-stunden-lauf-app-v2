import { ToastOptions, ToastPromiseParams, toast } from "react-toastify";

export default function useToast() {
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
        theme:
          localStorage.getItem("usehooks-ts-dark-mode") === "dark"
            ? "dark"
            : "light",
      }
    );
  }

  return { promiseToast };
}
