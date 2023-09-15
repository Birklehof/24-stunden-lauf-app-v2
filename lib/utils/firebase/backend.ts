import { Runner, RunnerWithLapCount } from '@/lib/interfaces';
import { db } from '@/lib/firebase/admin';

// Used in pages/ranking.tsx
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

// Used in runner/index.tsx
export async function getRunner(email: string): Promise<Runner> {
  const runner = await db
    .collection('apps/24-stunden-lauf/runners')
    .where('email', '==', email)
    .limit(1)
    .get();

  if (runner.docs.length == 0) {
    throw new Error('Runner not found');
  }

  return {
    id: runner.docs[0].id,
    ...runner.docs[0].data(),
  } as Runner;
}

// Used in assistant/index.tsx
export async function getRunnersDict(): Promise<{ [id: string]: Runner }> {
  const runners = await db.collection('apps/24-stunden-lauf/runners').get();

  const runnersDict: { [id: string]: Runner } = {};

  runners.docs.forEach((runner) => {
    runnersDict[runner.id] = {
      id: runner.id,
      ...runner.data(),
    } as Runner;
  });

  return runnersDict;
}

// Used in runner/charts.tsx
export async function getLapsInHour(hour: number): Promise<number> {
  let fromHour = new Date(Date.now())
  let toHour = new Date(Date.now())

  fromHour.setHours(hour)
  fromHour.setMinutes(0)
  fromHour.setSeconds(0)
  fromHour.setMilliseconds(0)

  toHour.setHours(hour)
  toHour.setMinutes(59)
  toHour.setSeconds(59)
  toHour.setMilliseconds(999)

  console.log('getLapsInHour');
  console.log(hour);
  console.log(fromHour);
  console.log(toHour);

  const lapCount = await db
    .collection('apps/24-stunden-lauf/laps')
    .where('createdAt', '>=', fromHour)
    .where('createdAt', '<=', toHour)
    .count()
    .get();

  return lapCount.data().count || 0;
}
