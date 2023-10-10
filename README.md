# Demo: Generate a poem from an image upload

Generate an image from a poem with Cloud Functions for Firebase, Cloud Vertex API, PaLM, and Imagen. 

## Getting started

1. Create a new Firebase project and enable the Blaze plan
    1. Enable the following in the Firebase console:
        1. Cloud Firestore
        1. Sign in with Google 
    1. Run `firebase init` in this repository
1. [Enable the Vertex AI API](https://console.cloud.google.com/flows/enableapi?apiid=aiplatform.googleapis.com)
1. Run `npm install`
1. Run `firebase deploy`