const buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;

// Play sound file from the local sounds/ folder
function playSound(name) {
    const audio = new Audio("sounds/" + name + ".mp3");
    audio.play().catch(error => {
        console.log("Audio playback error:", error);
    });
}

// Start game on keypress or click on title
document.addEventListener("keydown", () => {
    if (!started) {
        startGame();
    }
});

document.getElementById("level-title").addEventListener("click", () => {
    if (!started) {
        startGame();
    }
});

function startGame() {
    started = true;
    level = 0;
    gamePattern = [];
    nextSequence();
}

// Handle button clicks
const buttons = document.querySelectorAll(".btn");
buttons.forEach(btn => {
    btn.addEventListener("click", function() {
        if (!started) return;

        const userChosenColour = this.getAttribute("id");
        userClickedPattern.push(userChosenColour);

        playSound(userChosenColour);
        animatePress(userChosenColour);

        checkAnswer(userClickedPattern.length - 1);
    });
});

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(() => {
                nextSequence();
            }, 1000);
        }
    } else {
        playSound("wrong");
        document.body.classList.add("game-over");
        document.getElementById("level-title").innerText = "Click Here or Press Any Key to Restart";

        setTimeout(() => {
            document.body.classList.remove("game-over");
        }, 200);

        startOver();
    }
}

function nextSequence() {
    userClickedPattern = [];
    level++;
    document.getElementById("level-title").innerText = "Level " + level;

    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    // Flash animation & sound for sequence
    const selectedBtn = document.getElementById(randomChosenColour);
    if (selectedBtn) {
        selectedBtn.style.opacity = "0.2";
        setTimeout(() => {
            selectedBtn.style.opacity = "1";
        }, 100);
    }

    playSound(randomChosenColour);
}

function animatePress(currentColor) {
    const activeBtn = document.getElementById(currentColor);
    if (activeBtn) {
        activeBtn.classList.add("pressed");
        setTimeout(() => {
            activeBtn.classList.remove("pressed");
        }, 100);
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}