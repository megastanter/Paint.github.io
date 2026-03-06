const gridSize = 10;
const colors = [
  'color-1', 'color-2', 'color-3', 'color-4', 'color-5',
  'color-6', 'color-7', 'color-8', 'color-9', 'color-10'
];

const container = document.getElementById('game-container');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const restartBtn = document.getElementById('restart');
const gameOverDiv = document.getElementById('game-over');
const restartOverBtn = document.getElementById('restart-over');

const soundPop = document.getElementById('pop-sound');

let grid = [];
let score = 0;
let level = 1;
let movesLeft = 50; // можно добавить лимит ходов
let gameActive = true;

function init() {
  score = 0;
  level = 1;
  movesLeft = 50;
  gameActive = true;
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = level;
  gameOverDiv.classList.add('hidden');
  generateGrid();
  render();
}

function generateGrid() {
  grid = [];
  for (let r = 0; r < gridSize; r++) {
    const row = [];
    for (let c = 0; c < gridSize; c++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      row.push({ color, matched: false });
    }
    grid.push(row);
  }
}

function render() {
  container.innerHTML = '';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement('div');
      cell.className = `block ${grid[r][c].color}`;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.onclick = () => handleClick(r, c);
      container.appendChild(cell);
    }
  }
}

function handleClick(r, c) {
  if (!gameActive) return;
  const targetColor = grid[r][c].color;
  const toRemove = [];
  const visited = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  function dfs(row, col) {
    if (
      row < 0 ||
      row >= gridSize ||
      col < 0 ||
      col >= gridSize ||
      visited[row][col] ||
      grid[row][col].color !== targetColor
    ) {
      return;
    }
    visited[row][col] = true;
    toRemove.push({ row, col });
    dfs(row + 1, col);
    dfs(row - 1, col);
    dfs(row, col + 1);
    dfs(row, col - 1);
  }

  dfs(r, c);

  if (toRemove.length < 2) return;

  // Анимация удаления
  toRemove.forEach(({ row, col }) => {
    const index = row * gridSize + col;
    const el = container.children[index];
    el.style.transition = 'opacity 0.2s, transform 0.2s';
    el.style.opacity = '0';
    el.style.transform = 'scale(0)';
  });

  setTimeout(() => {
    // Удаление блоков
    toRemove.forEach(({ row, col }) => {
      grid[row][col] = null;
    });
    updateScore(toRemove.length);
    playSound();

    // Падение блоков
    collapse();

    // Проверка завершения уровня
    if (checkGameOver()) {
      endGame();
    } else {
      render();
    }
  }, 200);
}

function collapse() {
  for (let c = 0; c < gridSize; c++) {
    let empty = 0;
    for (let r = gridSize - 1; r >= 0; r--) {
      if (grid[r][c] === null) {
        empty++;
      } else if (empty > 0) {
        grid[r + empty][c] = grid[r][c];
        grid[r][c] = null;
      }
    }
    for (let r = 0; r < empty; r++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      grid[r][c] = { color, matched: false };
    }
  }
}

function updateScore(points) {
  score += points * 10;
  document.getElementById('score').textContent = score;
}

function playSound() {
  if (soundPop) {
    soundPop.currentTime = 0;
    soundPop.play();
  }
}

function checkGameOver() {
  // Можно реализовать проверку наличия возможных ходов
  // Или просто лимит ходов
  movesLeft--;
  document.querySelector('.score').textContent = `Очки: ${score} | Осталось ходов: ${movesLeft}`;
  if (movesLeft <= 0) {
    return true;
  }
  // Или проверка наличия соединенных блоков
  // Для простоты — лимит ходов
  return false;
}

function endGame() {
  gameActive = false;
  document.getElementById('game-over').classList.remove('hidden');
}

document.getElementById('restart').onclick = init;
document.getElementById('restart-over').onclick = init;

init();
