export default interface Lap {
  id: string;
  runnerId: string;
  timestamp: {
    nanoseconds: number;
    seconds: number;
  };
}
