import { Runner, RunnerWithLapCount } from '@/lib/interfaces';
import { db } from '@/lib/firebase/admin';

// Used in pages/shared/ranking.tsx
export async function getRunnersWithLapCount(): Promise<RunnerWithLapCount[]> {
  const runners = await db.collection('apps/24-stunden-lauf/runners').get();

  // Get lap count for each runner
  const runnersWithLaps = await Promise.all(
    runners.docs.map(async (docs) => {
      const runner = docs.data() as RunnerWithLapCount;

      const lapCountSnapshot = await db
        .collection('apps/24-stunden-lauf/laps')
        .where('runnerId', '==', docs.id)
        .count()
        .get();

      const lapCount = lapCountSnapshot.data().count || 0;

      return {
        ...runner,
        lapCount,
      } as RunnerWithLapCount;
    })
  );

  return runnersWithLaps;
}

export async function getRunner(email: string): Promise<Runner> {
  const runner = await db.collection('apps/24-stunden-lauf/runners').where('email', '==', email).get();

  if (runner.docs.length == 0) {
    throw new Error('Runner not found');
  }

  return runner.docs[0].data() as Runner;
}
