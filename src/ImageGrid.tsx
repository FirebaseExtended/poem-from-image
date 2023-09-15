import { User } from "firebase/auth";
import { collection, query, where } from "firebase/firestore";
import { ref as createStorageRef } from "firebase/storage";
import { Link } from "react-router-dom";
import {
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
  useStorage,
  useStorageDownloadURL,
} from "reactfire";
import { Skeleton } from "./components/ui/skeleton";

function PlaceholderImage() {
  return <Skeleton className="w-32 h-32 rounded-sm" />;
}

function PoemImage({ imagePath }: { imagePath: string }) {
  const storage = useStorage();
  const { status, data: imageURL } = useStorageDownloadURL(
    createStorageRef(storage, imagePath)
  );

  if (status === "loading") {
    return <PlaceholderImage />;
  }

  return (
    <img
      className="rounded-sm transition ease-in-out hover:drop-shadow-lg hover:scale-105 "
      src={imageURL}
    />
  );
}
export default function ImageGrid() {
  const firestore = useFirestore();
  const poemsCollection = collection(firestore, "poems");
  const auth = useAuth();
  const poemsQuery = query(
    poemsCollection,
    where("user", "==", (auth.currentUser as User).uid)
  );

  const { status, data } = useFirestoreCollectionData(poemsQuery, {
    idField: "poemId",
  });

  return (
    <>
      <div className="p-1 flex justify-center">
        <h1>Other poems you've made</h1>
      </div>
      <div className="p-2 grid grid-cols-2 gap-2 justify-items-center align-middle">
        {status === "loading"
          ? [1, 2, 3, 4, 5].map((x) => <PlaceholderImage key={x} />)
          : data.map((poem) => {
              return (
                <Link key={poem.poemId} to={`poems/${poem.poemId}`}>
                  <PoemImage imagePath={poem.image} />
                </Link>
              );
            })}
      </div>
    </>
  );
}
