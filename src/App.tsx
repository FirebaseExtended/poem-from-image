import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import { useStorage, useStorageTask, useFirestore, useFirestoreCollectionData, useStorageDownloadURL } from "reactfire";
import {
  ref as createStorageRef,
  uploadBytesResumable,
  UploadTask,
  UploadTaskSnapshot,
  StorageReference
} from "firebase/storage";
import {
  collection,
  addDoc
} from "firebase/firestore";

function UploadProgress({ uploadTask, storageRef }: { uploadTask: UploadTask, storageRef: StorageReference }) {
  const { status, data: uploadProgress } = useStorageTask<UploadTaskSnapshot>(uploadTask, storageRef);
  
  if (status === 'loading') {
    return <Progress id="progress" value={1} className="max-w-sm" />;
  }

  console.log(status, uploadProgress);
  const { bytesTransferred, totalBytes } = uploadProgress;

  let percentComplete = Math.round(100 * (bytesTransferred / totalBytes));
  if (percentComplete < 2) {
    percentComplete = 5;
  }
  console.log(bytesTransferred, totalBytes, percentComplete);
  return <Progress id="progress" value={percentComplete} className="max-w-sm" />;
}

function PoemImage({imagePath}: {imagePath: string}) {
  const storage = useStorage();
  const { status, data: imageURL } = useStorageDownloadURL(createStorageRef(storage, imagePath));

  if (status === "loading") {
    return <span>...</span>
  }

  return <img src={imageURL}/>;
}

function ImageGrid() {
  const firestore = useFirestore();
  const poemsCollection = collection(firestore, 'poems');

  const {status, data} = useFirestoreCollectionData(poemsCollection, {idField: 'poemId'});
  console.log(data);
  if (status === "loading") {
    return <p>Loading images...</p>
  }

  return data.map(poem => {
    return <PoemImage key={poem.poemId} imagePath={poem.image} />
  })
}

function App() {
  const [uploadTask, setUploadTask] = useState<null | UploadTask>(null);
  const [storageRef, setStorageRef] = useState<null | StorageReference>(null)
  const storage = useStorage();
  const firestore = useFirestore();
  async function uploadImage(event: any) {
    const imageUploadElement = event.target as HTMLInputElement;
    const fileList = imageUploadElement.files;
    
    if (!fileList) {
      console.log("no file found to upload");
      return;
    }

    const fileToUpload = fileList[0];
    const fileName = fileToUpload.name;
    const newRef = createStorageRef(storage, `images/${fileName}`);
    const newUploadTask = uploadBytesResumable(newRef, fileToUpload);
    
    setStorageRef(newRef);
    setUploadTask(newUploadTask);

    await newUploadTask;

    await addDoc(collection(firestore, 'poems'), {
      image: newRef.fullPath
    });

    setUploadTask(null);
    setStorageRef(null);
  }

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">{(uploadTask && storageRef) ? "Uploading..." : "Upload picture"}</Label>
        <Input disabled={!!(uploadTask && storageRef)} onChange={uploadImage} id="picture" type="file" />
      </div>
      {(uploadTask && storageRef) ? <UploadProgress uploadTask={uploadTask} storageRef={storageRef}/> : null}
      <ImageGrid />
    </>
  );
}

export default App;
