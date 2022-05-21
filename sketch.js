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

let audioIn;
let currentAudioSetting = AUDIO_SETTINGS.OFF;
let fft;
// let amp;

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
  createCanvas(256, 256);
  // colorMode(HSB);
  angleMode(DEGREES);

  audioIn = new p5.AudioIn();
  audioIn.getSources(gotSources);

  button = createButton('Play')
  button.mousePressed(startAudio);

  fft = new p5.FFT(0.9, 256);
  fft.setInput(audioIn);
  // amp = new p5.Amplitude();
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
    console.log(spectrum)
    // console.log(spectrum.length)
    for(let i = 0; i < spectrum.length; i++) {
      let amp = spectrum[i];
      // range of spectrum array is between 0 & 255
      let y = map(amp, 0, 255, height, 0);
      line(i, height, i, y)
    }
    stroke(255);
    noFill();
  }
}