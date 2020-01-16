const video = document.querySelector(".webcam"); //document.querySelector returns the first element within the document that matches rhe specified selector.
const canvas = document.querySelector(".video");
const ctx = canvas.getContext("2d");
const faceCanvas = document.querySelector(".face");
const faceCtx = faceCanvas.getContext("2d");
const faceDetector = new window.FaceDetector();
const SIZE = 10; // allow us to reference size later on. It's in caps to show, any variables that are constant throughout the application
const SCALE = 1.5; //Make pixalation cover full face by using scaling 

// Write a function that will populate the users video
async function populateVideo() {
  //await and async pause running until promise is done
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 1280, height: 720 } //video width and height should be same as canvas for better quality
  });
  video.srcObject = stream; //stream the video
  await video.play(); //await and async pause running until promise is done
  //size the canvases to be the same size as video
  console.log(video.videoWidth, video.videoHeight); //show the video width and height
  canvas.width = video.videoWidth; //canvas and video width are the same / equal to each other
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}

async function detect() {
  //detect the face when access is granted by user to use webcam
  const faces = await faceDetector.detect(video); //new function to detect faces in the shot. New variable called faces, call await on it so it doesn't run until a promise is settled, then call to detect the face on faceDetector. Pass to that a video.
  //console.log(faces.length); //show in console how many faces are being detected
  //ask the browser when the next animation frame is, and tell it to run detect for us.
  faces.forEach(drawFace); // passed it the drawFace callback function, and for each face found it will log the face
  faces.forEach(censor); // For each face found, it'll censor it
  requestAnimationFrame(detect); //pass requestAnimationFrame a detect. Recursion - detect is being called from within detect, and that allows us to just be running it infinitely.
}

function drawFace(face) {
  //create drawFace function which takes in user's face
  const { width, height, top, left } = face.boundingBox; // destructure everything in curly brackets out of the face.boundingBox
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the amount of yellow boxes following the face / clears out canvas for us
  ctx.strokeStyle = "#ffc600"; // setting defaults
  ctx.lineWidth = 2; // How thick the line will be drawn (by default)
  ctx.strokeRect(left, top, width, height); //the API for drawing a rectangle
}

function censor({ boundingBox: face }) {
  // destructure the boundingBox property directly.
  faceCtx.imageSmoothingEnabled = false; //turned off so you can get the real pixelated values instead of smooth effect.
  faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height); // we want to clear canvas before doing any of below / clear the whole canvas every time we move over
  // draw the small face
  faceCtx.drawImage(
    // 5 source args
    video, // where does the source come from?
    face.x, // where do we start the source pull from?
    face.y,
    face.width,
    face.height,
    // 4 draw args (draw into base canvas)
    face.x, // where do we start drawing the x and y?
    face.y,
    SIZE,
    SIZE
  );

  //take that face back out and draw it back at normal size
  faceCtx.drawImage(
    faceCanvas, //source (grab source from itself)
    face.x,
    face.y,
    SIZE, // no longer height and width of face, but h & w of the small image (which is why we put that in it's own variable)
    SIZE,
    // drawing args
    face.x,
    face.y,
    face.width,
    face.height
  );
}

populateVideo().then(detect); //need to run .then after the video has been populated, because if you run detect when there's no video it won't find faces. It is a promise base.
