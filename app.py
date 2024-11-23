import os

from PIL import Image
from flask import Flask, render_template, request, jsonify
import keras
import numpy as np

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the model
species_model = keras.models.load_model('models/model.h5')
expression_model = keras.models.load_model('models/expression.h5')

# Fungsi preprocessing gambar
def preprocess_image(image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)  # Tambahkan dimensi batch
    image = image / 255.0  # Normalisasi
    return image

@app.route('/')
def home():  # put application's code here
    return render_template('index.html', contents=["hero.html", "content.html", "about.html"])

@app.route('/classify')
def classify():
    return render_template('index.html', contents=["classify.html"])

# @app.route("/report")
# def report():
#     return render_template('report.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:

        uploaded_file = request.files['image']  # Access the file by key

        # Save the file to a temporary location
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        # Open and preprocess the image
        image = Image.open(file_path)
        processed_image = preprocess_image(image, target_size=(224, 224))  # Adjust size for your model

        # Make prediction
        species = species_model.predict(processed_image)[0][0].tolist()
        expression = expression_model.predict(processed_image)[0].tolist()

        expression = expression.index(max(expression))
        # Cleanup: remove the file after processing
        os.remove(file_path)

        # Return the prediction as JSON
        return jsonify({'prediction': {'species': species, 'expression': expression}})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
