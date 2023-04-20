import { useEffect, useState } from "react";
import Alert from "@/lib/interfaces/alert";

export default function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  async function addAlert(
    title: string,
    message?: string,
    type: "success" | "error" | "info" = "success"
  ) {
    console.log(alerts);

    const alert: Alert = {
      id: new Date().getTime().toString(),
      title,
      message,
      type,
    };

    await setAlerts([...alerts, alert]);
  }

  // async function addAlert({
  //   title,
  //   message,
  //   type,
  // }: {
  //   title: string;
  //   message?: string;
  //   type: "success" | "error" | "info";
  // }) {
  //   const alert: Alert = {
  //     id: new Date().getTime().toString(),
  //     title,
  //     message,
  //     type,
  //   };
  //   await setAlerts([...alerts, alert]);
  //   console.log(alerts);
  // }

  // async function removeAlert(id: string) {
  //   setAlerts(alerts.filter((alert) => alert.id !== id));
  // }

  return { alerts, addAlert };
}
