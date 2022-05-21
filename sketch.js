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
let xoff1 = 0;
let xoff2 = 10000;

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
    createCanvas(5000, 1500);
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
  let spectrum = fft.analyze()
  stroke(255);
  noFill();
  // beginShape();
  translate(width / 1.5, height / 1.4);
  for (let i = 0; i < spectrum.length; i++) {
    stroke(spectrum[i],255,255);
    let angle = map(i, 0, spectrum.length, 0, 360);
    let r = map(spectrum[i], 0, BANDS, 40, (width / 6.5));
    // let x = (r * cos(angle)) * (width / 6.5);
    // let y = (r * sin(angle)) * (height / 6.5);
    let x = (width / 6.5) - (r * cos(angle))
    let y = (height / 6.5) - (r * sin(angle))

    // line(-(x * .5), -(y * -20), spectrum[i] - width * noise(xoff1), spectrum[i] - height * noise(xoff2))
    // line(-(x * .5), -(y * -70), spectrum[i] - width * noise(xoff1), spectrum[i] - height * noise(xoff2))

    // line(x * .5, y * -20, spectrum[i] - width * noise(xoff1), spectrum[i] - height * noise(xoff2))
    // line(x * .5, y * -70, spectrum[i] - width * noise(xoff1), spectrum[i] - height * noise(xoff2))


    line(x, y, width * noise(xoff1), height - spectrum[i] * noise(xoff2))
    line(-x + 300, -y + 300, width * noise(xoff1), height - spectrum[i] * noise(xoff2))

    line(x, y, spectrum[i] - width * noise(xoff1), spectrum[i] - height * noise(xoff2))
    line(x, y, spectrum[i] - width * noise(xoff1), spectrum[i] - height * noise(xoff2))

    // line(0,0, noise(x) * (width-100) + spectrum[i] + 100, noise(y) * (height/2) + (spectrum[i] - 100))
    // line(-300,-300, noise(xoff2) * (width-200) + spectrum[x], noise(xoff1) * (height) +  (spectrum[x] - 200))
    // line(0,0, noise(xoff2) * (width-300) + spectrum[x], noise(xoff1) * (height/3) + (spectrum[x] - 300))

    // line(0,0, noise(xoff2) * (width+100) + spectrum[x], noise(xoff1) * (height/2) + (spectrum[x] + 100))
    // line(0,0, noise(xoff2) * (width+200) + spectrum[x], noise(xoff1) * (height) +  (spectrum[x] + 200))
    // line(0,0, noise(xoff2) * (width+300) + spectrum[x], noise(xoff1) * (height/3) + (spectrum[x] + 300))
  }

  // beginShape()
  // for (let i = 0; i < spectrum.length; i++) {
  //   vertex(xoff1,xoff2);
  // }
  // endShape();

  // noLoop();

  // let x = map(noise(xoff1), 0, 1, 0, width);
  // let y = map(noise(xoff2), 0, 1, 0, height);

  // // You can think about this number as the speed at which its "walking through" that Perlin noise graph
  // // The bigger the number, the more it jumps ahead, the faster the new position is

  xoff1 += 0.0001;
  xoff2 += 0.0002;
  // ellipse(x, y, 24, 24);
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