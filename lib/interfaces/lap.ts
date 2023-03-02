import { Timestamp } from "firebase/firestore";

export default interface Lap {
  id: string;
  runnerId: string;
  timestamp: Timestamp;
}
