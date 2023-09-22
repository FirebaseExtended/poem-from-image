import { onDocumentCreated } from "firebase-functions/v2/firestore";
import logger from "firebase-functions/logger";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import {getFirestore} from 'firebase-admin/firestore'

const app = initializeApp();
const db = getFirestore(app);

function promiseWait(waitMilis) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, waitMilis);
  });
}

const poemText = `This present moment is perfect simply due to the fact you're experiencing it.

You can't have light without dark. You can't know happiness unless you've known sorrow.

Exercising the imagination, experimenting with talents, being creative; these things, to me, are truly the windows to your soul.

Isn't that fantastic?
`;

const mockCreatePoem = onDocumentCreated("poems/{poemId}", async (event) => {
  if (!event) {
    logger.log("event was null. exiting.");
    return;
  }

  const poem = event.data.data();
  const poemRef = event.data.ref;

  logger.log("here is the poem", poem);

  const poemDoc = await db.doc(`poems/${event.params.poemId}`).get()
  logger.log('poem doc from initialized firestore', poemDoc.data());

  // mock getting the caption
  await poemRef.set(
    {
      status: "CAPTIONING_STARTED",
    },
    { merge: true }
  );
  await promiseWait(3000);
  await poemRef.set(
    {
      status: "CAPTIONING_COMPLETE",
      caption: "A happy little tree in front of some mountains",
    },
    { merge: true }
  );

  // mock generating the poem
  await poemRef.set(
    {
      status: "GENERATING_POEM",
    },
    { merge: true }
  );
  await promiseWait(3000);
  await poemRef.set(
    {
      status: "FINISHED",
      poem: poemText,
    },
    { merge: true }
  );

  logger.log("poem has been generated");
});

export default { mockCreatePoem };
