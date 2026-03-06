const options = [];
const optionsList = document.getElementById('options-list');
const optionInput = document.getElementById('option-input');
const addBtn = document.getElementById('add-option');
const rouletteCanvas = document.getElementById('roulette-canvas');
const ctx = rouletteCanvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const resultDiv = document.getElementById('result');

const rouletteSection = document.getElementById('roulette-section');
const inputSection = document.getElementById('input-section');

let isSpinning = false;
let currentAngle = 0;
let spinAnimationId;

// Добавление варианта
addBtn.onclick = () => {
  const val = optionInput.value.trim();
  if (val && !options.includes(val)) {
    options.push(val);
    renderOptions();
    optionInput.value = '';
    if (options.length >= 2 && inputSection.style.display !== 'none') {
      inputSection.style.display = 'none';
      rouletteSection.style.display = 'block';
      drawWheel();
    }
  }
};

function renderOptions() {
  optionsList.innerHTML = '';
  options.forEach((opt, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${opt}</span><button data-index="${index}">&times;</button>`;
    optionsList.appendChild(li);
    li.querySelector('button').onclick = () => {
      options.splice(index,1);
      renderOptions();
      if (options.length < 2) {
        inputSection.style.display = 'block';
        rouletteSection.style.display = 'none';
      } else {
        drawWheel();
      }
    };
  });
}

// Рисуем колесо
function drawWheel() {
  const total = options.length;
  const startAngle = 0;
  const arcSize = (2 * Math.PI) / total;

  ctx.clearRect(0, 0, rouletteCanvas.width, rouletteCanvas.height);
  ctx.save();

  const cx = rouletteCanvas.width/2;
  const cy = rouletteCanvas.height/2;
  const radius = Math.min(cx, cy) - 20;

  options.forEach((opt, i) => {
    const angle = startAngle + i * arcSize;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + arcSize);
    ctx.lineTo(cx, cy);
    ctx.fillStyle = `hsl(${(i * 360) / total}, 70%, 60%)`;
    ctx.fill();

    // Текст
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle + arcSize/2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.fillText(opt, radius - 10, 5);
    ctx.restore();
  });

  ctx.restore();

  // Стрелка
  ctx.beginPath();
  ctx.moveTo(rouletteCanvas.width/2, 10);
  ctx.lineTo(rouletteCanvas.width/2 - 10, 30);
  ctx.lineTo(rouletteCanvas.width/2 + 10, 30);
  ctx.fillStyle = "#fff";
  ctx.fill();
}

// Вращение колеса
function spinWheel() {
  if (isSpinning || options.length < 2) return;
  isSpinning = true;
  resultDiv.textContent = '';

  const targetIndex = Math.floor(Math.random() * options.length);
  const total = options.length;
  const arcSize = (2 * Math.PI) / total;

  // Вычисляем угол, на который нужно остановиться
  const stopAngle = (Math.random() * 2 * Math.PI) + (2 * Math.PI * 4) + (total - targetIndex) * arcSize - arcSize/2;

  const duration = 4000; // миллисекунды
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    if (elapsed > duration) {
      currentAngle = stopAngle % (2 * Math.PI);
      isSpinning = false;
      showResult(targetIndex);
      resetBtn.style.display = 'inline-block';
      return;
    }
    const progress = elapsed / duration;
    const easing = 1 - Math.pow(1 - progress, 3); // ease out
    const currentRotation = easing * stopAngle;
    currentAngle = currentRotation % (2 * Math.PI);
    drawRotatedWheel(currentAngle);
    spinAnimationId = requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function drawRotatedWheel(angle) {
  ctx.clearRect(0, 0, rouletteCanvas.width, rouletteCanvas.height);
  ctx.save();
  ctx.translate(rouletteCanvas.width/2, rouletteCanvas.height/2);
  ctx.rotate(angle);
  ctx.translate(-rouletteCanvas.width/2, -rouletteCanvas.height/2);
  drawWheel();
  ctx.restore();

  // Стрелка
  ctx.beginPath();
  ctx.moveTo(rouletteCanvas.width/2, 10);
  ctx.lineTo(rouletteCanvas.width/2 - 10, 30);
  ctx.lineTo(rouletteCanvas.width/2 + 10, 30);
  ctx.fillStyle = "#fff";
  ctx.fill();
}

function showResult(index) {
  resultDiv.textContent = `Вы выбрали: ${options[index]}`;
}

document.getElementById('spin-btn').onclick = () => {
  spinWheel();
};

resetBtn.onclick = () => {
  cancelAnimationFrame(spinAnimationId);
  drawWheel();
  resultDiv.textContent = '';
  resetBtn.style.display = 'none';
};
