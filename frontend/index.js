import { backend } from 'declarations/backend';

const canvasContainer = document.getElementById('canvas-container');
const startButton = document.getElementById('start-game');
const scoreList = document.getElementById('score-list');
const loadingIndicator = document.getElementById('loading-indicator');

let dosboxInstance = null;

// Wait for js-dos to load
window.addEventListener('load', () => {
    if (window.Dos) {
        startButton.disabled = false;
    } else {
        console.error("js-dos failed to load");
    }
});

startButton.addEventListener('click', startGame);

async function startGame() {
    try {
        loadingIndicator.style.display = 'block';
        startButton.disabled = true;

        if (dosboxInstance) {
            await dosboxInstance.exit();
        }

        const ci = await Dos(canvasContainer, {
            wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
            cycles: "auto",
            autolock: false,
        });

        dosboxInstance = ci;

        const bundle = await ci.bundle("https://cdn.dos.zone/custom/dos/quake.jsdos");
        await bundle.extract();
        await ci.mount(bundle.fs);
        await ci.run();

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
