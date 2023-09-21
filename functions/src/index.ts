import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';

initializeApp();

/**
 * Error that is thrown when a lap is created
 * less than 2 minutes after the last lap.
 */
class LapTooEarlyError extends Error {
  /**
   * @param {sting} msg - The error message (never used)
   */
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, LapTooEarlyError.prototype);
  }
}

export const createLap = onCall(
  {
    region: 'europe-west1',
    minInstances: 4, // FIXME: Set to 0 after release
    maxInstances: 10,
  },
  async (request) => {
    // Check if the user is authenticated
    if (!request.auth || request.auth.token.role !== 'assistant') {
      throw new HttpsError('unauthenticated', 'Authentication required.');
    }

    // Ensure the request contains the 'number' field
    const number = request.data.number as number;
    if (!number) {
      throw new HttpsError('invalid-argument', 'Missing field: number');
    }

    const now = new Date();

    const firestore = getFirestore();

    // Check if there is a runner with the specified number
    const runnerQuery = await firestore
      .collection('apps/24-stunden-lauf/runners')
      .where('number', '==', number)
      .limit(1)
      .get();

    if (runnerQuery.empty) {
      throw new HttpsError('not-found', 'Läufer nicht gefunden.');
    }

    const runner = {
      id: runnerQuery.docs[0].id,
      ...runnerQuery.docs[0].data(),
    };

    const runnerRef = firestore.doc(
      `apps/24-stunden-lauf/runners/${runner.id}`
    );

    try {
      const newLap = await firestore.runTransaction(async (transaction) => {
        const runnerDoc = await transaction.get(runnerRef);

        const lastLapCreatedAt = runnerDoc.data()?.lastLapCreatedAt;

        // Check if the last lap was less than 2 minutes ago
        if (lastLapCreatedAt) {
          const lastLapDate = lastLapCreatedAt.toDate();

          if (now.getTime() - lastLapDate.getTime() < 2 * 60 * 1000) {
            throw new LapTooEarlyError('Last lap less than 2 minutes ago.');
          }
        }

        // Create a new lap
        const newLap = {
          runnerId: runner.id,
          createdAt: now,
        };

        // Add the new lap
        const newLapRef = firestore
          .collection('apps/24-stunden-lauf/laps')
          .doc();
        transaction.set(newLapRef, newLap);

        // Update the runner
        transaction.update(runnerRef, {
          lastLapCreatedAt: now,
        });

        // Return the new lap
        return {
          id: newLapRef.id,
          ...newLap,
        };
      });

      return newLap;
    } catch (err) {
      if (err instanceof LapTooEarlyError) {
        throw new HttpsError(
          'failed-precondition',
          'Letzte Runde weniger als 2 Minuten her.'
        );
      } else {
        logger.error(err);
        throw new HttpsError('internal', 'Internal server error');
      }
    }
  }
);

export const resetLastLapCreatedAt = onDocumentDeleted(
  'apps/24-stunden-lauf/laps/{lapId}',
  async (event) => {
    const firestore = getFirestore();
    const snapshot = event.data;

    if (!snapshot) {
      return;
    }
    const data = snapshot.data();

    const runnerId = data.runnerId;

    if (!runnerId) {
      return;
    }

    await firestore.doc(`apps/24-stunden-lauf/runners/${runnerId}`).update({
      lastLapCreatedAt: null,
    });
  }
);
