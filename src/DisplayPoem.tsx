import { doc } from "@firebase/firestore";
import { useLoaderData } from "react-router-dom";
import {
  useFirestore,
  useFirestoreDocData,
  useStorage,
  useStorageDownloadURL,
} from "reactfire";
import { ref as createStorageRef } from "firebase/storage";
import { Skeleton } from "./components/ui/skeleton";

function PoemImage({ imagePath }: { imagePath: string }) {
  const storage = useStorage();
  const { status, data: imageURL } = useStorageDownloadURL(
    createStorageRef(storage, imagePath)
  );

  if (status === "loading") {
    return (
      <Skeleton className="h-1/4 w-1/4 rounded-sm border-solid border-2 border-slate-500" />
    );
  }

  return (
      <img className="h-60 rounded-sm" src={imageURL} />
  );
}

function DisplayPoem() {
  const { poemId } = useLoaderData() as { poemId: string };

  const firestore = useFirestore();
  const poemDoc = doc(firestore, "poems", poemId);

  const { status: loadingStatus, data } = useFirestoreDocData(poemDoc);

  if (loadingStatus === "loading") {
    return <span>Loading...</span>;
  } else if (!data) {
    return "no data";
  }

  let poemComponent;

  if (data.status === "FINISHED") {
    poemComponent = (<>{data.poem.split("\n").map((stanza: string, i: number) => !stanza ? <br key={i}/> : <p className="text-lg font-medium" key={i}>{stanza}</p>)}</>)
  } else {
    poemComponent = <div>{[1,2,3].map(i => <Skeleton key={i} className="m-4 h-4 w-96"/>)}</div>
  }

  if (data.status === "CAPTION_COMPLETE") console.log(data.status);

  if (data.status === "IMAGE_DOWNLOADED") console.log(data.status);

  return (
    <div className="overflow-auto">
      <div className="flex items-center">
        <PoemImage imagePath={data.image} />
      </div>
      <div className="p-4">
        {poemComponent}
      </div>
    </div>
  );
}

export default DisplayPoem;