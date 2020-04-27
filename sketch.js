// Copyright (c) 2018 ml5
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Style Transfer Image Example using p5.js
=== */

let style;
let video;
let resultImg;
let modelSet;

let poseNet;
let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;
let img;
let AI = false;

function preload() {
  img = loadImage('images/3-1.png');
}

function setup() {
  isSafa = isSafari();
  if (isSafa && window.location.href == "http://localhost:8000/") {
    alert('Sorry we do not yet support your device, please open this page with Chrome on a desktop. We will support other devices in the near future!');
    window.location.href="About.html";
    return;
  } 
 
  createCanvas(0.6*windowWidth, windowHeight).parent('canvasContainer');

  video = createCapture(VIDEO);
  video.hide();

  // The results image from the style transfer
  resultImg = createImg('');
  resultImg.hide();

  // Create a new Style Transfer method with a defined style.
  // We give the video as the second argument

  
  style = ml5.styleTransfer('models/pic4', video, modelLoaded);
}

function isSafari() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') != -1) {
    if (ua.indexOf('chrome') > -1) {
      return false;
    } else {
      return true;
    }
  }
}

function updateStyleImg(ele)
{ 
  if(AI)
  { 
    AI = false;
    clear();
    video = createCapture(VIDEO);
    video.hide();
    resultImg = createImg('');
    resultImg.hide();
    
  }

  if (ele.src) {
    // currentModel = ele.id;
    windowResized();
    style = ml5.styleTransfer('models/' + ele.id, video, modelLoaded);
  }
  
}

function changeBG(color){
  document. body. style. background = color;
  }


function windowResized() {
    resizeCanvas(0.6*windowWidth, windowHeight);
}

function draw(){
  //var a = windowWidth - 4/3*windowHeight
  if(!AI)
  {
    image(resultImg, 0, 0, 0.6*windowWidth, windowHeight);
  }
  else
  { 
    style = null;
    image(video, 1280, 720);
    // resultImg.hide();
    let d = dist(noseX, noseY, eyelX, eyelY);
    image(img, noseX+d/2, noseY-d, d/2);
    //fill(255, 0, 0);
    //ellipse(noseX, noseY, d);
  }
  
}

// A function to call when the model has been loaded.
function modelLoaded() {
  select('#status').html('Model Loaded');
  style.transfer(gotResult);
}

// When we get the results, update the result image src
function gotResult(err, img) {
  resultImg.attribute('src', img.src);
  style.transfer(gotResult);
}

function keyPressed()
{
  if(keyCode == 'S' || 's')
  {
    saveCanvas();
  }

}

function start()
{
  resizeCanvas(1280,720);
  poseNet = ml5.poseNet(video, modelReady2);
  poseNet.on('pose', gotPoses);
  AI = true;
  clear(); 
}

function gotPoses(poses) {
  // console.log(poses);
  if (poses.length > 0) {
    let nX = poses[0].pose.keypoints[0].position.x;
    let nY = poses[0].pose.keypoints[0].position.y;
    let eX = poses[0].pose.keypoints[1].position.x;
    let eY = poses[0].pose.keypoints[1].position.y;
    noseX = lerp(noseX, nX, 0.5);
    noseY = lerp(noseY, nY, 0.5);
    eyelX = lerp(eyelX, eX, 0.5);
    eyelY = lerp(eyelY, eY, 0.5);
  }
}

function modelReady2() {
  console.log('model ready');
}

