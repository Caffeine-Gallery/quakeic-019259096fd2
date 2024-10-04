import { backend } from 'declarations/backend';

const canvasContainer = document.getElementById('canvas-container');
const startButton = document.getElementById('start-game');
const scoreList = document.getElementById('score-list');
const loadingIndicator = document.getElementById('loading-indicator');

let dosPlayer = null;

// Wait for js-dos to load
window.addEventListener('load', () => {
    if (window.DosPlayer) {
        startButton.disabled = false;
    } else {
        console.error("js-dos failed to load");
        alert("Failed to load necessary components. Please refresh the page and try again.");
    }
});

startButton.addEventListener('click', startGame);

async function startGame() {
    try {
        loadingIndicator.style.display = 'block';
        startButton.disabled = true;

        if (dosPlayer) {
            dosPlayer.exit();
        }

        dosPlayer = new DosPlayer(canvasContainer, {
            wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
            cycles: "auto",
            autolock: false,
        });

        await dosPlayer.load("https://cdn.dos.zone/custom/dos/quake.jsdos");
        await dosPlayer.run();

        loadingIndicator.style.display = 'none';
        startButton.disabled = false;

        // Add event listener for game over (you may need to implement this based on the game's behavior)
        // For demonstration, we'll use a timeout to simulate game over after 5 minutes
        setTimeout(() => {
            const playerName = prompt("Game Over! Enter your name:");
            const score = Math.floor(Math.random() * 1000); // Replace with actual score
            if (playerName) {
                addScore(playerName, score);
            }
        }, 300000);
    } catch (error) {
        console.error("Error starting game:", error);
        alert("Failed to start the game. Please try again.");
        loadingIndicator.style.display = 'none';
        startButton.disabled = false;
    }
}

async function addScore(name, score) {
    try {
        await backend.addScore(name, score);
        await updateHighScores();
    } catch (error) {
        console.error("Error adding score:", error);
        alert("Failed to add score. Please try again.");
    }
}

async function updateHighScores() {
    try {
        const scores = await backend.getHighScores();
        scoreList.innerHTML = '';
        scores.forEach(([name, score]) => {
            const li = document.createElement('li');
            li.textContent = `${name}: ${score}`;
            scoreList.appendChild(li);
        });
    } catch (error) {
        console.error("Error updating high scores:", error);
        alert("Failed to update high scores. Please refresh the page.");
    }
}

updateHighScores();
