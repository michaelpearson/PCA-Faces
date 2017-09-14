let ctx;
function run(components, means) {
  ctx = document.getElementById('canvas').getContext("2d");
  ctx.width = 64;
  ctx.height = 64;
  createComponentSliders(components.length);

  ctx.rect(0, 0, 64, 64);
  ctx.fillStyle = 'white';
  ctx.fill();

  window.components = components;
  window.means = means;
  update();
}

function getComponentValues() {
  let sliders = document.querySelectorAll('input[type=range]');
  let values = [];
  for(let a = 0; a < sliders.length; a++) {
    values.push(parseFloat(sliders[a].value));
  }
  return values;
}

let imageData = new Uint8ClampedArray(4 * 64 * 64);
let tempData = new Float32Array(64 * 64);

function update() {
  let values = getComponentValues();

  for(let a = 0; a < means.length; a++) {
    tempData[a] = means[a];
  }

  for(let a = 0; a < values.length; a++) {
    for(let b = 0; b < components[a].length; b++) {
      tempData[b] += components[a][b] * values[a];
    }
  }

  let min = tempData[0];
  let max = tempData[0];
  for(let a = 0;a < tempData.length; a++) {
    if(tempData[a] > max) {
      max = tempData[a];
    }
    if(tempData[a] < min) {
      min = tempData[a];
    }
  }

  let factor = 255 / (max - min);
  let offset = min;

  for(let a = 0;a < tempData.length; a++) {
    let value = (tempData[a] - offset) * factor;
    imageData[a * 4 + 0] = value;
    imageData[a * 4 + 1] = value;
    imageData[a * 4 + 2] = value;
    imageData[a * 4 + 3] = 255;
  }

  ctx.putImageData(new ImageData(imageData, 64, 64), 0, 0, 0, 0, 64, 64);
}

function random() {
  let sliders = document.querySelectorAll('input[type=range]');
  for(let a = 0; a < sliders.length; a++) {
    sliders[a].MaterialSlider.change((Math.random() - 0.5) * 20);
  }
  update();
}


function createComponentSliders(count) {
  let container = document.getElementsByClassName('components')[0];

  for(let a = 0; a < count; a++) {
    let slider = document.createElement('input');
    slider.type = "range";
    //slider.orient = "vertical";
    slider.className = "mdl-slider mdl-js-slider";
    //slider.style.webkitAppearance = "slider-vertical";
    slider.min = -10;
    slider.max = 10;
    slider.step = 0.01;
    container.appendChild(slider);
  }
  componentHandler.upgradeDom();

  document.querySelectorAll('input[type=range]').forEach(e => e.onchange = e.oninput = update);
}

Promise.all([
  fetch('/api/components.json').then(r => r.json()),
  fetch('/api/means.json').then(r => r.json())
]).then((parameters) => {
  if(document.getElementsByTagName('canvas').length) {
    run(parameters[0], parameters[1]);
  } else {
    window.onload = run.bind(null, parameters[0], parameters[1]);
  }
});

