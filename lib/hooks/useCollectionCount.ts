import { FirestoreError, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Options } from "react-firebase-hooks/firestore/dist/firestore/types";

export default function useCollectionCount(
  collectionName: string,
  options?: Options | undefined
) {
  const [collectionCount, setCollectionCount] = useState<number>(0);
  const [snapshot, loading, error] = useCollection(
    collection(db, collectionName),
    options
  );

  useEffect(() => {
    const newCollectionCount = snapshot?.docs.length;
    setCollectionCount(newCollectionCount || 0);
  }, [snapshot]);

  return [collectionCount, loading, error] as [
    number,
    boolean,
    FirestoreError | undefined
  ];
}
