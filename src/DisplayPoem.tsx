import { doc } from "@firebase/firestore";
import { useLoaderData } from "react-router-dom";
import { useFirestore, useFirestoreDocData, useStorage, useStorageDownloadURL } from "reactfire";
import {
    ref as createStorageRef} from 'firebase/storage';
function PoemImage({imagePath}: {imagePath: string}) {
    const storage = useStorage();
    const { status, data: imageURL } = useStorageDownloadURL(createStorageRef(storage, imagePath));
  
    if (status === "loading") {
      return <span>...</span>
    }
  
    return <img className="w-1/3 h-1/3 p-2" src={imageURL}/>;
  }

function DisplayPoem() {
    const {poemId} = useLoaderData() as {poemId: string}

    const firestore = useFirestore();
    const poemDoc = doc(firestore, 'poems', poemId);

    const {status, data} = useFirestoreDocData(poemDoc);
    
    if (status === 'loading') {
        return <span>Loading...</span>
    }
    return <><PoemImage imagePath={data.image}></PoemImage><pre>{JSON.stringify(data, null, 2)}</pre></>
}

export default DisplayPoem;