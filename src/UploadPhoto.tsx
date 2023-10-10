/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { User } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import {
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
  ref as createStorageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore, useStorage, useStorageTask, useUser } from "reactfire";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Progress } from "./components/ui/progress";

function UploadProgress({
  uploadTask,
  storageRef,
}: {
  uploadTask: UploadTask;
  storageRef: StorageReference;
}) {
  const { status, data: uploadProgress } = useStorageTask<UploadTaskSnapshot>(
    uploadTask,
    storageRef
  );

  if (status === "loading") {
    return <Progress id="progress" value={1} className="max-w-sm" />;
  }

  console.log(status, uploadProgress);
  const { bytesTransferred, totalBytes } = uploadProgress;

  let percentComplete = Math.round(100 * (bytesTransferred / totalBytes));
  if (percentComplete < 2) {
    percentComplete = 5;
  }
  console.log(bytesTransferred, totalBytes, percentComplete);
  return (
    <Progress id="progress" value={percentComplete} className="max-w-sm" />
  );
}

export default function UploadPhoto() {
  const [uploadTask, setUploadTask] = useState<null | UploadTask>(null);
  const [storageRef, setStorageRef] = useState<null | StorageReference>(null);
  const storage = useStorage();
  const firestore = useFirestore();
  const { data: user } = useUser();
  const navigate = useNavigate();

  async function uploadImage(event: any) {
    const imageUploadElement = event.target as HTMLInputElement;
    const fileList = imageUploadElement.files;

    if (!fileList) {
      console.log("no file found to upload");
      return;
    }

    // Get the user's UID.
    const fileToUpload = fileList[0];
    const fileName = fileToUpload.name;
    const newRef = createStorageRef(storage, `images/${fileName}`);
    const newUploadTask = uploadBytesResumable(newRef, fileToUpload);

    setStorageRef(newRef);
    setUploadTask(newUploadTask);

    await newUploadTask;

    const newDoc = await addDoc(collection(firestore, "poems"), {
      image: newRef.fullPath,
      caption: "",
      poem: "",
      user: (user as User).uid,
    });

    navigate(`/poems/${newDoc.id}`);
  }

  return (
    <>
      <Card className="drop-shadow-sm">
        <CardHeader>
          <CardTitle>Start a new poem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className=" grid w-full max-w-sm items-center grow gap-1.5">
            <Label htmlFor="picture">
              {uploadTask && storageRef ? "Uploading..." : "Upload picture"}
            </Label>
            <Input
            className="transition ease-in-out hover:drop-shadow-md"
              disabled={!!(uploadTask && storageRef)}
              onChange={uploadImage}
              id="picture"
              type="file"
            />
          </div>
        </CardContent>
        <CardFooter>
          {uploadTask && storageRef ? (
            <UploadProgress uploadTask={uploadTask} storageRef={storageRef} />
          ) : null}
        </CardFooter>
      </Card>
    </>
  );
}
