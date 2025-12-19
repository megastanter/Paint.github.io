const contentDiv = document.getElementById('content');
const numberGenBtn = document.getElementById('numberGenBtn');
const rouletteBtn = document.getElementById('rouletteBtn');

numberGenBtn.addEventListener('click', showNumberGenerator);
rouletteBtn.addEventListener('click', showRoulette);

function clearContent() {
  contentDiv.innerHTML = '';
}

// Показываем генератор чисел
function showNumberGenerator() {
  clearContent();
  const html = `
    <h2>Генератор случайных чисел</h2>
    <div>
      <label>От: <input type="number" id="minNumber" value="0" min="0" max="1000000" style="width: 100px; padding: 5px; border-radius: 10px; border: 1px solid #ccc;" /></label>
    </div>
    <div style="margin-top:10px;">
      <label>До: <input type="number" id="maxNumber" value="1000000" min="0" max="1000000" style="width: 100px; padding: 5px; border-radius: 10px; border: 1px solid #ccc;" /></label>
    </div>
    <button id="generateBtn" style="margin-top:20px; padding:10px 20px; border:none; border-radius:15px; background:linear-gradient(135deg, #ffd1ba, #ffe0b2); cursor:pointer; font-size:1em; box-shadow:0 4px 8px rgba(0,0,0,0.2); transition:background 0.3s;">Генерировать</button>
    <div id="result" style="margin-top:20px; font-size:2em; font-weight:bold;"></div>
  `;
  contentDiv.innerHTML = html;

  document.getElementById('generateBtn').addEventListener('click', generateNumber);
}

// Генерация числа
function generateNumber() {
  const min = parseInt(document.getElementById('minNumber').value);
  const max = parseInt(document.getElementById('maxNumber').value);
  if (isNaN(min) || isNaN(max) || min > max) {
    alert('Пожалуйста, введите корректные числа: минимум не должен превышать максимум.');
    return;
  }
  const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
  document.getElementById('result').innerText = randNum;
}

// Показываем рулетку
function showRoulette() {
  clearContent();
  const html = `
    <h2>Рулетка да/нет</h2>
    <button id="spinBtn" style="margin-top:20px; padding:10px 20px; border:none; border-radius:15px; background:linear-gradient(135deg, #ffd1ba, #ffe0b2); cursor:pointer; font-size:1em; box-shadow:0 4px 8px rgba(0,0,0,0.2); transition:background 0.3s;">Крутить рулетку</button>
    <div id="result" style="margin-top:20px; font-size:2em; font-weight:bold;"></div>
  `;
  contentDiv.innerHTML = html;

  document.getElementById('spinBtn').addEventListener('click', spinRoulette);
}

function spinRoulette() {
  const resultDiv = document.getElementById('result');
  resultDiv.innerText = '';
  const options = ['Да!', 'Нет!'];
  let index = 0;
  const interval = setInterval(() => {
    resultDiv.innerText = options[index];
    index = (index + 1) % options.length;
  }, 100);

  setTimeout(() => {
    clearInterval(interval);
    const finalChoice = Math.random() < 0.5 ? 'Да!' : 'Нет!';
    resultDiv.innerText = finalChoice;
  }, 1500);
}

// Изначально показываем меню
// Можно оставить так, чтобы при загрузке было меню
