# Import the Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn

# Import the Firebase Admin SDK to access Cloud Firestore and Cloud Storage.
from firebase_admin import initialize_app, firestore, storage
from google.cloud import firestore, storage

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
@firestore_fn.on_document_created(
    document="poems/"
)
def generate_poem_from_image(event, context):
  document = event.data

  # Download the image as bytes
  image_path = document["image"]
  bucket = storage.bucket("poem-from-image.appspot.com")
  image_bytes = bucket.blob(image_path).download_as_bytes()
  vertex_image = vertexai.vision_models.Image(image_bytes)

  # Generate captions from the image bytes
  caption_model = ImageCaptioningModel.from_pretrained("imagetext@001")
  captions = caption_model.get_captions(
    image=vertex_image,
    number_of_results=1,
    language="en")

  # Generate a poem from the image captions
  text_model = TextGenerationModel.from_pretrained("text_bison")
  poem = text_model.predict(
      prompt=f"Write a poem about the following image caption: {captions[0]}",
      temperature=0.9)

  # Update the 'caption' & 'poem' fields in the document with the generated content
  document.reference.update({"caption": caption.text},{"poem": poem.text})