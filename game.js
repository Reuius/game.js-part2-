const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const healthElement = document.getElementById('health');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Игрок
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 25,
    color: '#FF4444',
    speed: 5,
    health: 3
};

// Игровые объекты
let score = 0;
const enemies = [];
const resources = [];

// Создаём начальные объекты
function spawnObjects() {
    // Ресурсы
    for (let i = 0; i < 10; i++) {
        resources.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 10,
            color: '#00FF00'
        });
    }

    // Враги
    setInterval(() => {
        enemies.push({
            x: Math.random() < 0.5 ? 0 : canvas.width,
            y: Math.random() * canvas.height,
            radius: 20,
            color: '#6666FF',
            speed: 2
        });
    }, 2000);
}

// Движение игрока за курсором
document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - player.x;
    const dy = e.clientY - player.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance > player.speed) {
        player.x += (dx / distance) * player.speed;
        player.y += (dy / distance) * player.speed;
    }
});

// Проверка столкновений
function checkCollisions() {
    // Сбор ресурсов
    resources.forEach((resource, index) => {
        const dx = player.x - resource.x;
        const dy = player.y - resource.y;
        if (Math.hypot(dx, dy) < player.radius + resource.radius) {
            resources.splice(index, 1);
            score += 10;
            scoreElement.textContent = score;
        }
    });

    // Столкновение с врагами
    enemies.forEach((enemy, index) => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        if (Math.hypot(dx, dy) < player.radius + enemy.radius) {
            enemies.splice(index, 1);
            player.health--;
            healthElement.textContent = '❤'.repeat(player.health);
            if (player.health <= 0) gameOver();
        }
    });
}

// Отрисовка
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Игрок
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();

    // Ресурсы
    resources.forEach(resource => {
        ctx.beginPath();
        ctx.arc(resource.x, resource.y, resource.radius, 0, Math.PI * 2);
        ctx.fillStyle = resource.color;
        ctx.fill();
    });

    // Враги
    enemies.forEach(enemy => {
        enemy.x += (player.x - enemy.x) * 0.01 * enemy.speed;
        enemy.y += (player.y - enemy.y) * 0.01 * enemy.speed;
        
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color;
        ctx.fill();
    });
}

// Игровой цикл
function gameLoop() {
    checkCollisions();
    draw();
    requestAnimationFrame(gameLoop);
}

// Конец игры
function gameOver() {
    alert(`Ты проиграл, Счёт: ${score}`);
    location.reload();
}

// Запуск
spawnObjects();
gameLoop();
// Ресурсы
resources.forEach(resource => {
    ctx.beginPath();
    ctx.arc(resource.x, resource.y, resource.radius, 0, Math.PI * 2);
    ctx.fillStyle = resource.color;
    ctx.fill();
}); // Убрана лишняя точка с запятой

// Враги
enemies.forEach(enemy => {
    enemy.x += (player.x - enemy.x) * 0.01 * enemy.speed;
    enemy.y += (player.y - enemy.y) * 0.01 * enemy.speed; // Исправлено написание "enemy"
    
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
});
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

// Для мыши
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Для касаний
// canvas.addEventListener('touchmove', (e) => {
//     e.preventDefault();
//     const touch = e.touches[0];
//     mouseX = touch.clientX;
//     mouseY = touch.clientY;
// });