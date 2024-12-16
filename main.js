// Game board and configurations
let board;
let score = 0;
const rows = 4;
const columns = 4;

// High score stored in localStorage
let highScore = localStorage.getItem("highScore") || 0;

// Initialize game
window.onload = function () {
    document.getElementById("high-score").innerText = highScore;
    setGame();
};

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Create the board UI
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

    // Add initial tiles
    addRandomTile();
    addRandomTile();
    updateBoard();
}

function updateBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.getElementById(`${r}-${c}`);
            const num = board[r][c];
            updateTile(tile, num);
        }
    }
    document.getElementById("score").innerText = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore); // Update high score in localStorage
        document.getElementById("high-score").innerText = highScore;
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.className = "tile"; // Reset tile classes
    if (num > 0) {
        tile.innerText = num;
        if (num <= 2048) {
            tile.classList.add(`x${num}`);
        } else {
            tile.classList.add("x4096");
        }
    }
}

// Add a random tile to an empty position
function addRandomTile() {
    let emptyTiles = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                emptyTiles.push({ r, c });
            }
        }
    }

    if (emptyTiles.length > 0) {
        const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[r][c] = Math.random() < 0.8 ? 2 : 4; // 80% chance for 2, 20% for 4
    }
}

// Key controls
document.addEventListener("keyup", (e) => {
    let moved = false;

    switch (e.code) {
        case "ArrowLeft":
            moved = slideLeft();
            break;
        case "ArrowRight":
            moved = slideRight();
            break;
        case "ArrowUp":
            moved = slideUp();
            break;
        case "ArrowDown":
            moved = slideDown();
            break;
    }

    if (moved) {
        addRandomTile();
        updateBoard();

        // Check for game over
        if (isGameOver()) {
            alert("Game Over! Your score: " + score);
        }
    }
});

// Slide functions
function filterZero(row) {
    return row.filter(num => num !== 0); // Remove zeroes
}

function slide(row) {
    row = filterZero(row); // Remove zeroes

    // Combine adjacent tiles
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i]; // Add the merged value to the score
        }
    }

    row = filterZero(row); // Remove zeroes again

    // Fill remaining space with zeroes
    while (row.length < columns) {
        row.push(0);
    }

    return row;
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        const originalRow = [...board[r]];
        board[r] = slide(board[r]);
        if (JSON.stringify(originalRow) !== JSON.stringify(board[r])) {
            moved = true;
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        const originalRow = [...board[r]];
        board[r] = slide(board[r].reverse()).reverse();
        if (JSON.stringify(originalRow) !== JSON.stringify(board[r])) {
            moved = true;
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        const originalColumn = board.map(row => row[c]);
        let column = slide(originalColumn);
        for (let r = 0; r < rows; r++) {
            board[r][c] = column[r];
        }
        if (JSON.stringify(originalColumn) !== JSON.stringify(column)) {
            moved = true;
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        const originalColumn = board.map(row => row[c]);
        let column = slide(originalColumn.reverse()).reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = column[r];
        }
        if (JSON.stringify(originalColumn) !== JSON.stringify(column)) {
            moved = true;
        }
    }
    return moved;
}

// Check if the game is over
function isGameOver() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) return false; // Empty tile exists
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) return false; // Merge possible horizontally
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) return false; // Merge possible vertically
        }
    }
    return true;
}
// High score stored in localStorage

// Initialize game
window.onload = function () {
    document.getElementById("high-score").innerText = highScore;
    setGame();

    // Add event listener for Restart button
    document.getElementById("restart-btn").addEventListener("click", restartGame);
};

function restartGame() {
    // Reset score
    score = 0;

    // Clear the board
    document.getElementById("board").innerHTML = "";

    // Reinitialize the game
    setGame();
}
