const display = document.getElementById("display");
let displayDimensions = display.getBoundingClientRect();
const statusDisplay = document.getElementById("status")
const scoreDisplay = document.querySelectorAll(".score")
const levelSelector = document.getElementById("level")
const modal = document.getElementById("modal")
let globalX = 25
let globalY = 25

let snakeCellWidth = displayDimensions.width / globalX;
let snakeCellHeight = displayDimensions.height / globalY;

let direction = 1
let level = 9
let gameStatus = true
let score = 0
let snakeLoop

// The "snake" will be an array of objects with relative x and y coordinates
// The "renderSnake()" function will then use these coordinates to calculate 
// where they will be on the screen relative to the .body element
let snake = [
    {
        x: 1,
        y: 0
    },
    {
        x: 0,
        y: 0
    }
]

// The apple will take the same xy values as the snake
let apple = {
    x: 10,
    y: 10
}

let lastX, lastY
function renderSnake() {

    // Get the xy values of the last cell
    // We will append this to the snake if "pointIncrease" is true
    lastX = snake[snake.length-1].x
    lastY = snake[snake.length-1].y

    // The next cell takes on the xy values of the previous
    for (let i=snake.length-1; i>=0; i--) {
        if (snake[i-1]) {
            snake[i].x = snake[i-1].x
            snake[i].y = snake[i-1].y
        } else {
            // console.log(snake[i].x, snake[i].y, lastX, lastY)
        }
    }

    // Snake's head is moved according to the direction
    switch(direction) {
        case 0:
            snake[0].y = snake[0].y == 0 ? globalY-1 : snake[0].y - 1
            break
        case 1:
            snake[0].x = snake[0].x == globalX-1 ? 0 : snake[0].x + 1
            break
        case 2:
            snake[0].y = snake[0].y == globalY-1 ? 0 : snake[0].y + 1
            break
        case 3:
            snake[0].x = snake[0].x == 0 ? globalX-1 : snake[0].x - 1
            break
    }

    // Check for apple, obstacle or body hit
    if (snake[0].x == apple.x && snake[0].y == apple.y) {
        snake.push({x:lastX, y:lastY})
        apple.x = Math.floor(Math.random() * globalX)
        apple.y = Math.floor(Math.random() * globalY)
        score++
        scoreDisplay.forEach(item => {
            item.innerHTML = score
        })
    }
    for(let i=1; i<snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            snakeLoop = clearInterval(snakeLoop)
            modal.style.display = "block"
        }
    }

    // First clear the display
    display.innerHTML = ""

    // And then render everything
    for (let i=0; i<snake.length; i++) {
        const cell = document.createElement('div')
        cell.style.height = `${snakeCellHeight}px`
        cell.style.width = `${snakeCellWidth}px`
        cell.style.position = "fixed"
        cell.style.backgroundColor = i == 0 ? "red" : "black"
        // cell.style.borderRadius = "1rem"
        cell.style.top = `${displayDimensions.top + (snake[i].y * snakeCellHeight)}px`
        cell.style.left = `${displayDimensions.left + (snake[i].x * snakeCellWidth)}px`
        display.appendChild(cell)
    }

    // This part is for rendering the apple
    const appleCell = document.createElement('div')
    appleCell.style.height = `${snakeCellHeight}px`
    appleCell.style.width = `${snakeCellWidth}px`
    appleCell.style.position = "fixed"
    appleCell.style.backgroundColor = "red"
    appleCell.style.borderRadius = "1rem"
    appleCell.style.top = `${displayDimensions.top + (apple.y * snakeCellHeight)}px`
    appleCell.style.left = `${displayDimensions.left + (apple.x * snakeCellWidth)}px`
    display.appendChild(appleCell)

}

// Next is the input loop
document.addEventListener('keydown', (event) => {
    console.log(event.key)
    switch(event.key) {
        case "ArrowUp":
            direction = direction == 2 ? 2 : 0;
            break
        case "ArrowRight":
            direction = direction == 3 ? 3 : 1;
            break
        case "ArrowDown":
            direction = direction == 0 ? 0 : 2;
            break
        case "ArrowLeft":
            direction = direction == 1 ? 1 : 3;
            break
        case " ":
            snakeLoop = snakeLoop ? clearInterval(snakeLoop) : setInterval(renderSnake, 1000-(level*100))
            gameStatus = !gameStatus
            statusDisplay.innerHTML = gameStatus ? "Playing" : "Paused"
            break
    }
})
function ArrowUp() {
    direction = direction == 2 ? 2 : 0;
}
function ArrowRight() {
    direction = direction == 3 ? 3 : 1;
}
function ArrowDown() {
    direction = direction == 0 ? 0 : 2;
}
function ArrowLeft() {
    direction = direction == 1 ? 1 : 3;
}

// Detecting "resize" events
window.addEventListener('resize', (event) => {
    displayDimensions = display.getBoundingClientRect()
    snakeCellWidth = displayDimensions.width / globalX;
    snakeCellHeight = displayDimensions.height / globalY;
})

// When user changes the level
levelSelector.addEventListener('change', (event) => {
    clearInterval(snakeLoop)
    level = event.target.value
    event.target.blur()
    display.focus()
    display.click()
    snakeLoop = setInterval(renderSnake, 1000-(level*100))
    gameStatus = true
    statusDisplay.innerHTML = gameStatus ? "Playing" : "Paused"
})

// Level restart
function restartGame() {
    direction = 1
    level = 9
    gameStatus = true
    score = 0
    snakeLoop

    snake = [
        {
            x: 1,
            y: 0
        },
        {
            x: 0,
            y: 0
        }
    ]

    apple = {
        x: 10,
        y: 10
    }
    modal.style.display = "none"
    snakeLoop = setInterval(renderSnake, 1000-(level*100))
}

snakeLoop = setInterval(renderSnake, 1000-(level*100))