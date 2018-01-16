# Emotion Detector

A deeplearning model is trained to infer emotions captured on a live webcam within the browser using [deeplearn.js](https://deeplearnjs.org).

Behind the scenes the image from the webcam is being processed by a small neural network called [Squeezenet](https://github.com/DeepScale/SqueezeNet). This network is trained to recognize all sorts of classes from the imagenet dataset, and is optimized to be really small, making is useable in the browser.

## To run the application

1. Clone the repo or download the zip file to local machine

2. Navigate to the folder and run 'npm install' to install all the dependencies

3. Then start the local budo webserver by running 'npm start'

4. Access (http://localhost:9966) on chrome

## Credits

Inspired from Google Creative Lab [teachable-machine-boilerplate] 'https://github.com/googlecreativelab/teachable-machine-boilerplate'
