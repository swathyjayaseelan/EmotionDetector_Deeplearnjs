// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {KNNImageClassifier} from 'deeplearn-knn-image-classifier';
import {NDArrayMathGPU, Array3D, ENV}from 'deeplearn';

// Number of classes to classify
const NUM_CLASSES = 2;
// Webcam Image size. Must be 227.
const IMAGE_SIZE = 227;
// K value for KNN
const TOPK = 10;


class Main {
  constructor(){
    // Initiate variables
    this.infoTexts = 'Model Running..';
    //this.training = -1; // -1 when no class is being trained
    this.videoPlaying = false;
    this.infoTexts = [];
    // Initiate deeplearn.js math and knn classifier objects
    this.knn = new KNNImageClassifier(NUM_CLASSES, TOPK, ENV.math);

    // Create video element that will contain the webcam image
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '');
    this.video.setAttribute('playsinline', '');

    // Add video element to DOM
    document.body.appendChild(this.video);
const div = document.createElement('div');
    // Create training buttons and info texts
    /*for(let i=0;i<NUM_CLASSES; i++){
      const div = document.createElement('div');
      document.body.appendChild(div);
      div.style.marginBottom = '10px';

      // Create training button
      const button = document.createElement('button')
      button.innerText = "Train "+i;
      div.appendChild(button);

      // Listen for mouse events when clicking the button
      button.addEventListener('mousedown', () => this.training = i);
      button.addEventListener('mouseup', () => this.training = -1);

      // Create info text
      const infoText = document.createElement('span')
      infoText.innerText = " No examples added";
      div.appendChild(infoText);
      this.infoTexts.push(infoText);
    }
    */
    var imgcount = 80;
    const infoText = document.createElement('div');
    infoText.innerText = 'Training Model';
    //console.log(infoText);
    document.body.appendChild(infoText);
    this.infoTexts.push(infoText);

    //Similing faces
    for(var i=1; i<=imgcount ; i++){
    const elem = document.createElement('img');
    elem.setAttribute( "src", "Smiling/"+i+".jpg");
    elem.setAttribute("height", "227");
    elem.setAttribute("width", "227");
    elem.setAttribute("id", "myimg"+i);
    document.body.appendChild(elem);
    elem.style.display = 'none';
  }
  //Sad faces
  for(var k=1; k<=imgcount ; k++){
  const elem = document.createElement('img');
  elem.setAttribute( "src", "Sad/"+k+".jpg");
  elem.setAttribute("height", "227");
  elem.setAttribute("width", "227");
  elem.setAttribute("id", "mysadimg"+k);
  document.body.appendChild(elem);
  elem.style.display = 'none';
}
    // Setup webcam
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
      this.video.srcObject = stream;
      this.video.width = IMAGE_SIZE;
      this.video.height = IMAGE_SIZE;

      this.video.addEventListener('playing', ()=> this.videoPlaying = true);
      this.video.addEventListener('paused', ()=> this.videoPlaying = false);
    })

    // Load knn model
    this.knn.load()
    .then(() => this.start());
  }

  start(){
    var imgcount = 80;
    this.hand = 1;
    this.face = 0;
    //console.log(image);
    for(var j=1; j<=imgcount; j++){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = document.getElementById('myimg'+j);
    canvas.width = 227;
    canvas.height = 227;

    context.drawImage(img, 0, 0 );

    var myData = context.getImageData(0, 0, 227, 227);
    const imagetest = Array3D.fromPixels(myData);
    this.knn.addImage(imagetest,this.hand );
    //console.log(imagetest);
    }

    for(var l=1; l<=imgcount; l++){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = document.getElementById('mysadimg'+l);
    canvas.width = 227;
    canvas.height = 227;

    context.drawImage(img, 0, 0 );

    var myData = context.getImageData(0, 0, 227, 227);
    const imagetest = Array3D.fromPixels(myData);
    this.knn.addImage(imagetest,this.face );
    //console.log(imagetest);
    }
  if (this.timer) {
      this.stop();
    }
    this.video.play();
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }

  stop(){
    this.video.pause();
    cancelAnimationFrame(this.timer);
  }

  animate(){
    if(this.videoPlaying){

      //Training Model

      // Get image data from video element
      const image = Array3D.fromPixels(this.video);


      /*

      // Train class if one of the buttons is held down
      if(this.training != -1){
        // Add current image to classifier
        this.knn.addImage(image, this.training)
        console.log(this.training);
      }

      // If any examples have been added, run predict*/
      const exampleCount = this.knn.getClassExampleCount();
      if(Math.max(...exampleCount) > 0){
        this.knn.predictClass(image)
        .then((res)=>{
          /*for(let i=0;i<NUM_CLASSES; i++){
            // Make the predicted class bold
            if(res.classIndex == i){
              this.infoTexts[i].style.fontWeight = 'bold';
            } else {
              this.infoTexts[i].style.fontWeight = 'normal';
            }

            // Update info text
            if(exampleCount[i] > 0){
              this.infoTexts[i].innerText = ` ${exampleCount[i]} examples - ${res.confidences[i]*100}%`
            }
          }*/
          console.log(res.classIndex);

          for(var i=0; i<NUM_CLASSES ; i++){
            //this.infoTexts[i].innerText = ` ${res.classIndex} - ${res.confidences[i]*100}%`
          }

          /*if(res.classIndex == 1){
            this.infoText.innerText = 'Smiling';
          }
          else {
            this.infoText.innerText = 'Frowning';
          }
*/

        })
        // Dispose image when done
        .then(()=> image.dispose())
      } else {
        image.dispose();
      }
    }
    this.timer = requestAnimationFrame(this.animate.bind(this));
  }
}

window.addEventListener('load', () => new Main());
