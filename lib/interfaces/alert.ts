export default interface Alert {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "info";
}
