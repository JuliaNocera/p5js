const AUDIO_SETTINGS = {
  OFF: 'off',
  ON: 'on'
}

const VISUALIZATION = {
  CIRCLE: 'circle',
  PERLIN: 'perlin'
}

const BANDS = 64;

let audioIn;
let currentAudioSetting = AUDIO_SETTINGS.OFF;
// let currentVisualization = VISUALIZATION.CIRCLE;
let currentVisualization = VISUALIZATION.PERLIN;
let fft;

// PERLIN NOISE VARIABLES
let xoff = 0;

function startAudio() {
  if(currentAudioSetting === AUDIO_SETTINGS.OFF) {
    audioIn.start()
    currentAudioSetting = AUDIO_SETTINGS.ON
  } else {
    return
  }
}

function setup(){

  if (VISUALIZATION.CIRCLE) {
    createCanvas(800, 800);
    colorMode(HSB);
    angleMode(DEGREES);
  }

  if (VISUALIZATION.PERLIN) {
    createCanvas(400, 400);
  }

  audioIn = new p5.AudioIn();
  audioIn.getSources(gotSources);

  button = createButton('Play')
  button.mousePressed(startAudio);

  fft = new p5.FFT(0.9, BANDS);

  // tell fft that the audio input is our mic / audio in 
  fft.setInput(audioIn);
}

function gotSources(deviceList) {
  if (deviceList.length > 0) {
    //set the source to the first item in the deviceList array
    audioIn.setSource(0);
    let currentSource = deviceList[audioIn.currentSource];
    console.log({currentSource})
  }
}

function keyPressed() {
  if ((key == 'P') || (key == 'p')) {
  startAudio();
  }
}

function draw() {
  background(0);
  if (currentAudioSetting === AUDIO_SETTINGS.ON) {
    if (currentVisualization === VISUALIZATION.CIRCLE) {
      drawCircleSpectrum();
    }
    if (currentVisualization === VISUALIZATION.PERLIN) {
      drawPerlin();
    }
  }
}

function drawPerlin() {
  let x = map(noise(xoff), 0, 1, 0, width);
  let y = map(noise(xoff), 0, 1, 0, height);

  // You can think about this number as the speed at which its "walking through" that Perlin noise graph
  // The bigger the number, the more it jumps ahead, the faster the new position is
  xoff += 0.01;

  ellipse(x, y, 24, 24);
}

function drawCircleSpectrum() {
  let spectrum = fft.analyze()
  noStroke();
  // translate to the center
  translate(width / 2, height / 2);

  for (let i = 0; i < spectrum.length; i++) {
    let angle = map(i, 0, spectrum.length, 0, 360);
    let amp = spectrum[i];

    // set the radius to map that amplitude from 0 --> 256 to 40 --> 200
    let r = map(amp, 0, BANDS, 40, (width / 6.5));
    let x = r * cos(angle);
    let y = r * sin(angle);

    stroke(amp, 255, 255);
    line(0, 0, x, y);
  }

  stroke(255);
  noFill();
}