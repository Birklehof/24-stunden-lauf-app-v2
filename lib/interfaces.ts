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
 * @property {Timestamp} createdAt - The time when the lap was created
 */
export interface Lap {
  id: string;
  runnerId: string;
  createdAt: Timestamp;
}

/**
 * @type Runner
 *
 * @property {string} id - The firestore id of the runner
 * @property {number} number - The starting number of the runner
 * @property {string} name - The full name of the runner
 * @property {string} type - The type of the runner (e.g. "student" or "staff")
 * @property {string} email - The email of the runner
 * @property {Timestamp} lastLapCreatedAt - The time when the last lap of the runner was created (might be null if longer than 2 minutes ago)
 * @property {number} goal - The goal of the runner
 *
 * @property {string} studentId [optional] - The firestore id of the associated student (only for runners of type "student")
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

  // Attributes that only runners of type "student" have
  studentId?: string;
  house?: string;
  class?: string;
}

/**
 * @type RunnerWithLapCount
 *
 * @extends Runner
 *
 * @property {number} lapCount - The number of laps the runner has completed
 */
export interface RunnerWithLapCount extends Runner {
  lapCount: number;
}

/**
 * @type Staff (teachers, housekeepers, etc.)
 *
 * @property {string} id - The firestore id of the staff member
 * @property {string} firstName - The first name of the staff member
 * @property {string} lastName - The last name of the staff member
 * @property {string} email - The email of the staff member
 */
export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * @type Student
 *
 * @property {string} id - The firestore id of the student
 * @property {number} number - The student number of the student (given by the students database)
 * @property {string} firstName - The first name of the student
 * @property {string} lastName - The last name of the student
 * @property {string} email - The email of the student
 * @property {string} house - The boarding house of the student
 * @property {string} class - The school class of the student
 */
export interface Student {
  id: string;
  number: number;
  firstName: string;
  lastName: string;
  email: string;
  house: string;
  class: string;
}
