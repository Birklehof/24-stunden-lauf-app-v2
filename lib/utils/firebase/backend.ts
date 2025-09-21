import { Runner } from '@/lib/interfaces';
import { firebase } from '@/lib/firebase/admin';


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
    name: runner.docs[0].data().name,
    type: runner.docs[0].data().type,
    number: runner.docs[0].data().number,
    goal: runner.docs[0].data().goal,
  } as Runner;
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

// Used in pages/ranking.tsx
export async function getRunnersArray(): Promise<Runner[]> {
  const runners = await firebase.collection('runners').get();

  const runnersArray: Runner[] = [];

  runners.docs.forEach((runner) => {
    runnersArray.push({
      id: runner.id,
      name: runner.data().name,
      number: runner.data().number,
      type: runner.data().type,
      email: runner.data().email,
      class: runner.data().class,
      house: runner.data().house,
      laps: runner.data().laps || 0,
    } as Runner);
  });

  return runnersArray;
}
