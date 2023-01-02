/**
 * @interface Runner
 * @property {string} id - unique ID (document ID in Firestore), automatically assigned by Firestore
 * @property {number} number - number the runner wears during the race, automatically assigned on creation
 * @property {string} name - real name of the runner, imported or manually entered
 * @property {string} email - email of the runner (only for students), used for showing the information to the runner and notifying them of new laps, imported or manually entered
 * @property {string} studentId - student ID of the runner, only for students, needed for further processing of the results, imported or manually entered
 */

export interface Runner {
  id: string;
  number: number;
  name: string;
  email?: string;
  studentId?: string;
}
