from firebase_functions import firestore_fn
from firebase_admin import initialize_app, firestore, storage
import vertexai
from vertexai.language_models import TextGenerationModel
from vertexai.vision_models import ImageCaptioningModel, Image

# Initialize Firebase app and Vertex AI
initialize_app()
vertexai.init(project="poem-from-image", location="us-central1")

# Listen to the poems Firestore collection for document creation
@firestore_fn.on_document_created(document="poems/{poemId}")
def generate_poem_from_image(
    event: firestore_fn.Event[firestore_fn.DocumentSnapshot]):  

    # Save references to the document, image, and bucket
    doc_ref = event.data.reference
    image_path = event.data.get("image")
    bucket = storage.bucket("poem-from-image.appspot.com")

    # Download the image as bytes and create a vertex image
    image_bytes = bucket.blob(image_path).download_as_bytes()
    vertex_image = Image(image_bytes)

    # Generate captions from the image bytes and update status
    caption_model = ImageCaptioningModel.from_pretrained("imagetext@001")
    captions = caption_model.get_captions(
    image=vertex_image,
    number_of_results=1,
    language="en")
    doc_ref.update({"caption": captions[0]})

    # Generate a poem from the image captions and update status
    text_model = TextGenerationModel.from_pretrained("text-bison")
    poem = text_model.predict(
      prompt=f"Write a poem about the following image caption: {captions[0]}",
      temperature=1.0,
      max_output_tokens=256)
    doc_ref.update({"poem": poem.text})