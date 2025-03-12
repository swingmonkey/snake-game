// 游戏配置
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

// 游戏状态
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop;

// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

// 游戏初始化
function initGame() {
  // 事件监听
  document.addEventListener('keydown', handleKeyPress);
  restartBtn.addEventListener('click', resetGame);
  
  generateFood();
  gameLoop = setInterval(update, INITIAL_SPEED);
}

// 游戏主循环
function update() {
  direction = nextDirection;
  const head = {...snake[0]};

  // 移动蛇头
  switch(direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }

  // 碰撞检测
  if (checkCollision(head)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // 吃食物检测
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }

  draw();
}

// 绘制画面
function draw() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制蛇
  ctx.fillStyle = '#4CAF50';
  snake.forEach(segment => {
    ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
  });

  // 绘制食物
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
}

// 生成食物
function generateFood() {
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  };
  // 避免食物生成在蛇身上
  while(snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }
}

// 碰撞检测
function checkCollision(position) {
  return position.x < 0 || position.x >= GRID_SIZE || 
         position.y < 0 || position.y >= GRID_SIZE ||
         snake.some((segment, index) => index !== 0 && 
           segment.x === position.x && segment.y === position.y);
}

// 按键处理
function handleKeyPress(event) {
  switch(event.key) {
    case 'ArrowUp':
      if (direction !== 'down') nextDirection = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') nextDirection = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') nextDirection = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') nextDirection = 'right';
      break;
  }
}

// 游戏结束
function gameOver() {
  clearInterval(gameLoop);
  restartBtn.style.display = 'block';
}

// 重新开始
function resetGame() {
  snake = [{x: 10, y: 10}];
  direction = 'right';
  nextDirection = 'right';
  score = 0;
  scoreElement.textContent = score;
  restartBtn.style.display = 'none';
  generateFood();
  gameLoop = setInterval(update, INITIAL_SPEED);
}

// 启动游戏
initGame();