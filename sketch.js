const AUDIO_SETTINGS = {
  OFF: 'off',
  ON: 'on'
}

const VISUALIZATION = {
  CIRCLE: 'circle',
  PERLIN: 'perlin',
  EXPERIMENT: 'exp'
}

const BANDS = 64;

let audioIn;
let currentAudioSetting = AUDIO_SETTINGS.OFF;
// let currentVisualization = VISUALIZATION.CIRCLE;
// let currentVisualization = VISUALIZATION.PERLIN;
let currentVisualization = VISUALIZATION.EXPERIMENT;
let fft;
let inc = 0.01;
let start = 0;
let xoff1 = start;
let xoff2 = start + inc;
let yoff1 = start;
let yoff2 = start + inc;
let h;
let w;

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
    h = document.getElementById("mainBody").offsetHeight
    w = document.getElementById("mainBody").offsetWidth
    createCanvas(w, h - 30);
    colorMode(HSB);
    angleMode(DEGREES);
  }

  if (VISUALIZATION.PERLIN) {
    createCanvas(200, 200);
    pixelDensity(1);
  }

  if (VISUALIZATION.EXPERIMENT) {
    h = document.getElementById("mainBody").offsetHeight
    w = document.getElementById("mainBody").offsetWidth
    createCanvas(w, h - 30);
    colorMode(HSB);
    angleMode(DEGREES);
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
    if (currentVisualization === VISUALIZATION.EXPERIMENT) {
     drawExperiment();
    }
  }
}

function drawExperiment() {
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
    rect(noise(xoff1), noise(xoff2), x, y )
    start += inc
  }

  stroke(255);
  noFill();
}

function drawPerlin() {
  let yoff = 0;
  loadPixels();
  /*
    if the x loop is outer loop, we get a vertical streak
    if the y loop is outer loop, we get a horizontal streak
    
    changing the increment will make it a more or less smooth blur
  
    noiseDetail is the "octave" we are iterating over
     - mess around with the two params in noiseDetail to control the quality of the noise
  */
  noiseDetail(4, 0.2)
  let spectrum = fft.analyze()
  for (let i = 0; i < spectrum.length; i++) {
    for (let y = 0; y < height; y++) {
      let xoff = 0;
      for (let x = 0; x < width; x++) {
        let index = (x + y * width) * 4;
        let r = noise(xoff, yoff) * 255;
        pixels[index] = spectrum[i];
        pixels[index + 1] = r;
        pixels[index + 2] = r;
        pixels[index + 3] = 255;
        xoff += inc;
      }
      yoff += inc;
    }
  }
  updatePixels();
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