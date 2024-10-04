import { backend } from 'declarations/backend';

const canvasContainer = document.getElementById('canvas-container');
const startButton = document.getElementById('start-game');
const scoreList = document.getElementById('score-list');

let dosBoxInstance = null;

startButton.addEventListener('click', startGame);

async function startGame() {
    if (dosBoxInstance) {
        dosBoxInstance.exit();
    }

    const ci = await Dos(canvasContainer, {
        wdosboxUrl: "https://js-dos.com/6.22/current/wdosbox.js",
        cycles: "auto",
        autolock: false,
    });

    dosBoxInstance = ci;

    await ci.run("https://cdn.dos.zone/custom/dos/quake.jsdos");

    // Add event listener for game over (you may need to implement this based on the game's behavior)
    // For demonstration, we'll use a timeout to simulate game over after 5 minutes
    setTimeout(() => {
        const playerName = prompt("Game Over! Enter your name:");
        const score = Math.floor(Math.random() * 1000); // Replace with actual score
        if (playerName) {
            addScore(playerName, score);
        }
    }, 300000);
}

async function addScore(name, score) {
    await backend.addScore(name, score);
    await updateHighScores();
}

async function updateHighScores() {
    const scores = await backend.getHighScores();
    scoreList.innerHTML = '';
    scores.forEach(([name, score]) => {
        const li = document.createElement('li');
        li.textContent = `${name}: ${score}`;
        scoreList.appendChild(li);
    });
}

updateHighScores();
