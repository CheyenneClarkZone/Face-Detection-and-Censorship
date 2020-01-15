const video = document.querySelector(".webcam");

const canvas = document.querySelector(".video");
const ctx = canvas.getContext("2d");

const faceCanvas = document.querySelector(".face");
const faceCtx = canvas.getContext("2d");

const faceDetector = new FaceDetector();

// Write a function that will populate the users video
async function populateVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1920, height: 1080 }
  });
  video.srcObject = stream;
  await video.play();
  //size the canvases to be the same size as video
  console.log(video.videoWidth, video,videoHeight);
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}

async function detect() {
  const faces = await faceDetector.detect(video); //new function to detect faces in the shot. New variable called faces, call await on it so it doesn't run until a promise is settled, then call to detect the face on faceDetector. Pass to that a video.
  console.log(faces);
  //ask the browser when the next animation frame is, and tell it to run detect for us.
  requestAnimationFrame(detect); //pass requestAnimationFrame a detect. Recursion - detect is being called from within detect, and that allows us to just be running it infinitely.
}

populateVideo().then(detect);  //need to run .then after the video has been populated, because if you run detect when there's no video it won't find faces. It is a promise base.