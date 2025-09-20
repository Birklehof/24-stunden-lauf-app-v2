import { Runner, RunnerWithLapCount } from '@/lib/interfaces';
import { firebase } from '@/lib/firebase/admin';

// Used in pages/ranking.tsx
export async function getRunnersWithLapCount(): Promise<RunnerWithLapCount[]> {
  const runners = await firebase.collection('runners').get();

  // Get lap count for each runner
  const runnersWithLaps = await Promise.all(
    runners.docs.map(async (docs) => {
      const runner = {
        id: docs.id,
        name: docs.data().name,
        number: docs.data().number,
        type: docs.data().type,
        house: docs.data().house,
        class: docs.data().class,
        lapCount: docs.data().lapCount || 0,
      } as RunnerWithLapCount;

      const lapCountSnapshot = await firebase
        .collection('laps')
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

// Used in pages/runner/index.tsx
export async function getRunner(email: string): Promise<Runner> {
  const runner = await firebase
    .collection('runners')
    .where('email', '==', email)
    .limit(1)
    .get();

  if (runner.docs.length == 0) {
    throw new Error('Runner not found');
  }

  return {
    id: runner.docs[0].id,
    ...JSON.parse(JSON.stringify(runner.docs[0].data())),
  } as Runner;
}

// Used in pages/assistant/index.tsx
export async function getRunnersDict(): Promise<{ [id: string]: Runner }> {
  const runners = await firebase.collection('runners').get();

  const runnersDict: { [id: string]: Runner } = {};

  runners.docs.forEach((runner) => {
    runnersDict[runner.id] = {
      id: runner.id,
      name: runner.data().name,
      number: runner.data().number,
      type: runner.data().type,
    } as Runner;
  });

  return runnersDict;
}

// Used in pages/runner/charts.tsx
export async function getLapsInHour(fromHour: Date): Promise<number> {
  let toHour = new Date(fromHour);
  toHour.setHours(toHour.getHours() + 1);

  const lapCount = await firebase
    .collection('laps')
    .where('createdAt', '>=', fromHour)
    .where('createdAt', '<', toHour)
    .count()
    .get();

  return lapCount.data().count || 0;
}
