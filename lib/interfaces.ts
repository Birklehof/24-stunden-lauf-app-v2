import { Timestamp } from 'firebase/firestore';

export interface Lap {
  id: string;
  runnerId: string;
  createdAt: Timestamp;
}

export interface Runner {
  id: string;
  number: number;
  name: string;
  type: string;
  email?: string;

  // Attributes that only runners of type "student" have
  studentId?: string;
  house?: string;
  class?: string;
}

export interface RunnerWithLapCount extends Runner {
  lapCount: number;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Student {
  id: string;
  number: number;
  firstName: string;
  lastName: string;
  email: string;
  house: string;
  class: string;
}

export interface User {
  photoURL?: string;
  displayName?: string;
  uid: string;
  email: string;
  accessToken: string;
  role: string;
}
