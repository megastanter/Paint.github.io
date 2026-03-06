const options = [];
const optionsList = document.getElementById('options-list');
const optionInput = document.getElementById('option-input');
const addBtn = document.getElementById('add-option');
const rouletteCanvas = document.getElementById('roulette-canvas');
const ctx = rouletteCanvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resetBtn = document.getElementById('reset-btn');
const resultSpan = document.getElementById('current-selection');
const notification = document.getElementById('notification');

let isSpinning = false;
let currentAngle = 0;
let animationId = null;

function updateUI() {
  spinBtn.disabled = options.length < 2 || isSpinning;
}

addBtn.onclick = () => {
  const val = optionInput.value.trim();
  if (val && !options.includes(val)) {
    options.push(val);
    renderOptions();
    optionInput.value = '';
    if (options.length >= 2 && document.getElementById('roulette-section').style.display === 'none') {
      document.getElementById('roulette-section').style.display = 'block';
      drawWheel();
    }
    updateUI();
  }
};

function renderOptions() {
  optionsList.innerHTML = '';
  options.forEach((opt, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${opt}</span><button data-index="${index}">&times;</button>`;
    optionsList.appendChild(li);
    li.querySelector('button').onclick = () => {
      options.splice(index, 1);
      renderOptions();
      updateUI();
      if (options.length < 2) {
        document.getElementById('roulette-section').style.display = 'none';
      } else {
        drawWheel();
      }
    };
  });
  updateUI();
}

// Основная функция рисования колеса
function drawWheel(rotation = 0) {
  ctx.clearRect(0, 0, rouletteCanvas.width, rouletteCanvas.height);
  ctx.save();

  const cx = rouletteCanvas.width / 2;
  const cy = rouletteCanvas.height / 2;
  const radius = Math.min(cx, cy) - 40;

  const total = options.length;
  const arcSize = (2 * Math.PI) / total;

  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.translate(-cx, -cy);

  options.forEach((opt, i) => {
    const startAngle = i * arcSize;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, startAngle + arcSize);
    ctx.lineTo(cx, cy);
    ctx.fillStyle = `hsl(${(i * 360) / total}, 70%, 60%)`;
    ctx.fill();

    // Текст
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startAngle + arcSize / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.fillText(opt, radius - 10, 6);
    ctx.restore();
  });

  ctx.restore();

  // Стрелка
  ctx.beginPath();
  ctx.moveTo(cx, 20);
  ctx.lineTo(cx - 15, 50);
  ctx.lineTo(cx + 15, 50);
  ctx.fillStyle = '#fff';
  ctx.fill();
}

// Вращение колеса
function spinWheel() {
  if (isSpinning || options.length < 2) return;

  isSpinning = true;
  updateUI();
  notification.textContent = '';

  const total = options.length;
  const arcSize = (2 * Math.PI) / total;
  const targetIndex = Math.floor(Math.random() * total);
  const targetAngle = (Math.PI * 4) + (total - targetIndex) * arcSize - arcSize / 2;

  const duration = 5000; // миллисекунды
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    if (elapsed >= duration) {
      currentAngle = targetAngle % (2 * Math.PI);
      isSpinning = false;
      updateUI();
      showResult(targetIndex);
      resetBtn.style.display = 'inline-block';
      return cancelAnimationFrame(animationId);
    }

    const progress = elapsed / duration;
    const easing = 1 - Math.pow(1 - progress, 3); // ease out
    const angle = easing * targetAngle + (1 - easing) * currentAngle;
    currentAngle = angle % (2 * Math.PI);
    drawWheel(currentAngle);
    animationId = requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// Отображение результата
function showResult(index) {
  resultSpan.textContent = options[index];
  notification.textContent = `Вы выбрали: ${options[index]}`;
}

// Обработчики кнопок
document.getElementById('spin-btn').onclick = () => {
  spinWheel();
};

document.getElementById('reset-btn').onclick = () => {
  cancelAnimationFrame(animationId);
  drawWheel();
  notification.textContent = '';
  resetBtn.style.display = 'none';
};

// Обновляем состояние кнопки
updateUI();
