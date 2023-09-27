# Import the Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn

# Import the Firebase Admin SDK to access Cloud Firestore and Cloud Storage.
from firebase_admin import initialize_app, firestore, storage

# Import the Vertex AI client library to access caption and text generation models.
import vertexai
from vertexai.language_models import TextGenerationModel
from vertexai.vision_models import ImageCaptioningModel

# Initialize app
app = initialize_app()

# Initialize Vertex AI
PROJECT_ID = "poem-from-image" 
REGION = "us-central1"
vertexai.init(project=PROJECT_ID, location=REGION)

# Listen to the poems Firestore collection for document creation
@firestore_fn.on_document_created(document="poems/{poemId}")
def generate_poem_from_image(event: firestore_fn.Event[firestore_fn.DocumentSnapshot]):
  doc = event.data
  doc_ref = doc.reference

  # Download the image as bytes and create a vertex image
  image_path = doc.get("image")
  bucket = storage.bucket("poem-from-image.appspot.com")
  image_bytes = bucket.blob(image_path).download_as_bytes()
  vertex_image = vertexai.vision_models.Image(image_bytes)

  # Generate captions from the image bytes and update status
  caption_model = ImageCaptioningModel.from_pretrained("imagetext@001")
  doc_ref.update({"status": "CAPTIONING_STARTED"})
  captions = caption_model.get_captions(
    image=vertex_image,
    number_of_results=1,
    language="en")
  doc_ref.update(
    {"status": "CAPTIONING_COMPLETE",
    "caption": captions[0]})

  # Generate a poem from the image captions and update status
  text_model = TextGenerationModel.from_pretrained("text-bison")
  doc_ref.update({"status": "GENERATING_POEM"})
  poem = text_model.predict(
      prompt=f"Write a poem about the following image caption: {captions[0]}",
      temperature=0.9,
      max_output_tokens=256)
  doc_ref.update(
    {"status": "FINISHED",
    "poem": poem.text})