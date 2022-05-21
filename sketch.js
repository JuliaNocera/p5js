// let mic;

// function setup() {
//   createCanvas(710, 200);

//   // Create an Audio input
//   mic = new p5.AudioIn();

//   // start the Audio Input.
//   // By default, it does not .connect() (to the computer speakers)
//   mic.start();
// }

// function draw() {
//   background(200);

//   // Get the overall volume (between 0 and 1.0)
//   let vol = mic.getLevel();
//   fill(127);
//   stroke(0);

//   // Draw an ellipse with height based on volume
//   let h = map(vol, 0, 1, height, 0);
//   ellipse(width / 2, h - 25, 50, 50);
// }


const AUDIO_SETTINGS = {
  OFF: 'off',
  ON: 'on'
}

const BANDS = 64;

let audioIn;
let currentAudioSetting = AUDIO_SETTINGS.OFF;
let fft;
let w;

let volhistory = [];

function startAudio() {
  if(currentAudioSetting === AUDIO_SETTINGS.OFF) {
    audioIn.start()
    currentAudioSetting = AUDIO_SETTINGS.ON
  } else {
    return
  }
}

function setup(){
  createCanvas(768, 768);
  colorMode(HSB);
  angleMode(DEGREES);

  audioIn = new p5.AudioIn();
  audioIn.getSources(gotSources);

  button = createButton('Play')
  button.mousePressed(startAudio);

  fft = new p5.FFT(0.9, BANDS);

  w = width / BANDS

  // tell fft that the audio input is our mic / audio in 
  fft.setInput(audioIn);
}

function gotSources(deviceList) {
  // console.log(deviceList)
  if (deviceList.length > 0) {
    //set the source to the first item in the deviceList array
    audioIn.setSource(0);
    let currentSource = deviceList[audioIn.currentSource];
    console.log({currentSource})
  }
}

function draw() {
  background(0);
  if (currentAudioSetting === AUDIO_SETTINGS.ON) {
    let spectrum = fft.analyze()
    noStroke();
    for(let i = 0; i < spectrum.length; i++) {
      let amp = spectrum[i];
      // range of spectrum array is between 0 & 255
      let y = map(amp, 0, 255, height, 0);

      // fill bars based on i
      fill(amp, 255, 255)
      // subtract 2 from width to give a little space between the lines in visualizer
      rect(i * w, y, w - 2, height - y)
    }
    // stroke(255);
    noFill();
  }
}