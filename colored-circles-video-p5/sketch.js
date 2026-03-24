let video;
let prevFramePixels = [];
const circleSize = 24 
let modeSelector; // Radio button for mode selection

const pastelColors = ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff'];
const asciiChars = [' ', '.', '-', '+', '*', '#', '@']; // Darker to lighter

function setup() {
  createCanvas(800, 800);
  frameRate(30);
  textSize(circleSize);
  textAlign(CENTER, CENTER);

  // Initialize webcam capture
  video = createCapture(VIDEO);
  video.size(800, 800);
  video.hide();

  // Create radio button for mode selection
  modeSelector = createRadio();
  modeSelector.option('circles', 'Circles');
  modeSelector.option('ascii', 'ASCII');
  modeSelector.selected('circles'); // Default mode

  // Style and position the radio buttons
  modeSelector.position(width / 2 - 70, height - 40); // Centered at bottom
  modeSelector.style('width', '140px');
  modeSelector.style('display', 'flex');
  modeSelector.style('justify-content', 'center');
}

function draw() {
  if (!video || !video.loadedmetadata) return;

  video.loadPixels();
  if (video.pixels.length === 0) return;

  background(255, 255, 255, 60);

  let selectedMode = modeSelector.value(); // Get selected mode

  for (let x = 0; x < width; x += circleSize) {
    for (let y = 0; y < height; y += circleSize) {
      const normY = (y / height) * (pastelColors.length - 1);
      const colorIndex = Math.floor(normY);
      const t = normY - colorIndex;

      const colorA = color(pastelColors[colorIndex]);
      const colorB = color(pastelColors[Math.min(colorIndex + 1, pastelColors.length - 1)]);
      const lerpedColor = lerpColor(colorA, colorB, t);

      const pixelIndex = (y * video.width + x) * 4;
      if (pixelIndex < 0 || pixelIndex >= video.pixels.length) continue;

      const brightness = (video.pixels[pixelIndex] + video.pixels[pixelIndex + 1] + video.pixels[pixelIndex + 2]) / 3;
      const prevBrightness = prevFramePixels[pixelIndex] || brightness;

      if (Math.abs(brightness - prevBrightness) > 15) {
        if (selectedMode === 'ascii') {
          let asciiIndex = floor(map(brightness, 0, 255, 0, asciiChars.length - 1));
          fill(0);
          text(asciiChars[asciiIndex], x, y);
        } else {
          const finalSize = constrain(circleSize + map(Math.abs(brightness - prevBrightness), 0, 255, -5, 10), 5, circleSize);
          fill(lerpedColor);
          noStroke();
          ellipse(x, y, finalSize);
        }
      }

      prevFramePixels[pixelIndex] = brightness;
    }
  }
}
