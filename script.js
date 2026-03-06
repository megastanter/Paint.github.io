const body = document.body;
const colors = [
  '#222', '#444', '#666', '#888', '#aaa', '#ccc', '#eee', '#fff'
];

let currentColorIndex = 0;

function changeBackgroundColor() {
  currentColorIndex = (currentColorIndex + 1) % colors.length;
  body.style.backgroundColor = colors[currentColorIndex];
}

// Меняем цвет каждые 10 секунд
setInterval(changeBackgroundColor, 10000);

// Обработка кнопки входа
document.getElementById('enterGame').onclick = () => {
  // Открываем браузерную версию Minecraft
  window.open('https://classic.minecraft.net/', '_blank');
};
      
