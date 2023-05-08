import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { User, Runner } from "@/lib/interfaces";

async function createRunner(
  name: string,
  runners: { [id: string]: Runner }
): Promise<number> {
  if (!name) {
    throw new Error("Invalid name");
  }
  const number = Object.keys(runners).length + 1;

  const runner = { name, number, type: "guest" } as Runner;
  await addDoc(collection(db, "apps/24-stunden-lauf/runners"), runner);

  return number;
}

async function deleteLap(lapId: string) {
  await deleteDoc(doc(db, "apps/24-stunden-lauf/laps", lapId));
}

async function createLap(
  runnerNumber: number,
  runners: { [id: string]: Runner },
  user: User | undefined
) {
  if (runnerNumber <= 0) {
    throw new Error("Ungültige Startnummer");
  }

  const runnerId = Object.values(runners).find(
    (runner) => runner.number == runnerNumber
  )?.id;

  if (!runnerId) {
    throw new Error("Kein Läufer mit dieser Startnummer");
  }

  // Make api request to /api/createLap
  const res = await fetch("/api/createLap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: user?.accessToken || "",
    },
    body: JSON.stringify({ runnerId }),
  });

  if (res.status == 200) {
    return;
  }

  const body = await res.text();

  if (res.status == 401 || res.status == 403) {
    throw new Error("Zugriff verweigert");
  }

  if (res.status == 400) {
    if (JSON.parse(body).error == "Too many laps") {
      throw new Error("Letzte Runde ist keine Zwei Minuten her");
    }
  }

  throw new Error("Unbekannter Fehler");
}

export { createRunner, deleteLap, createLap };
