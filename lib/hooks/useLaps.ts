import { useEffect, useState } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "@/lib/firebase";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import Lap from "@/lib/interfaces/lap";
import useRunners from "./useRunners";
import useAuth from "./useAuth";

export default function useLaps() {
  const { runners } = useRunners();
  const { isLoggedIn, user } = useAuth();
  const [laps, setLaps] = useState<Lap[]>([]);

  useEffect(() => {
    if (!isLoggedIn || !user) return;
    syncLaps();
  }, [isLoggedIn, user]);

  async function syncLaps() {
    const q = collection(db, "/apps/24-stunden-lauf/laps");
    const querySnapshot = await getDocs(q);
    const laps = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...data } as Lap;
    });
    setLaps(laps);

    onSnapshot(q, (querySnapshot) => {
      const laps = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data } as Lap;
      });
      setLaps(laps);
    });
  }

  async function createLap(runnerNumber: number) {
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

  async function deleteLap(lapId: string) {
    await deleteDoc(doc(db, "apps/24-stunden-lauf/laps", lapId));
  }

  return { laps, createLap, deleteLap };
}
