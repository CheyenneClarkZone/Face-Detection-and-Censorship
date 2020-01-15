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
}

console.log(populateVideo);

populateVideo();
