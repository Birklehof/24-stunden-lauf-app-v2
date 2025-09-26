/**
 * Interfaces
 *
 * @description Here you can find all interfaces that are relevant to the data model of the 24-Stunden-Lauf app. Less important interfaces are defined where they are used.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * @type Lap (Birklehofrunde)
 *
 * @property {string} id - The firestore id of the lap
 * @property {string} runnerId - The firestore id of the associated runner
 * @property {Timestamp} createdAt - Timestamp in milliseconds
 * @property {object} runnerData [optional] - Some denormalized data of the associated runner for easier access
 */
export interface Lap {
  id: string;
  runnerId: string;
  createdAt: number;
  runnerData?: {
    name: string;
    number: number;
  };
}

export interface LapWithRunner extends Lap {
  runner: Runner;
}

/**
 * @type Runner
 *
 * @property {string} id - The firestore id of the runner
 * @property {number} number - The starting number of the runner
 * @property {string} name - The full name of the runner
 * @property {string} type - The type of the runner "student", "staff" or "guest"
 * @property {string} email [optional] - The email of the runner
 * @property {Timestamp} lastLapCreatedAt [optional] - The time when the last lap of the runner was created (might be null if longer than 2 minutes ago)
 * @property {number} goal [optional] - The goal of the runner
 * @property {string} house [optional] - The boarding house of the runner (only for runners of type "student")
 * @property {string} class [optional] - The school class of the runner (only for runners of type "student")
 */
export interface Runner {
  id: string;
  number: number;
  name: string;
  type: string;
  email?: string;
  lastLapCreatedAt?: Timestamp;
  goal?: number;
  laps?: number;

  // Attributes that only runners of type "student" have
  house?: string;
  class?: string;
}
