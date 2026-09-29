const buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;
let acceptingInput = false;
let nextSequenceTimeout;
let inputUnlockTimeout;
let sequenceTimeouts = [];

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
    clearTimeout(nextSequenceTimeout);
    clearTimeout(inputUnlockTimeout);
    clearSequenceTimeouts();
    started = true;
    level = 0;
    gamePattern = [];
    nextSequence();
}

// Handle button clicks
const buttons = document.querySelectorAll(".btn");
buttons.forEach(btn => {
    btn.addEventListener("click", function() {
        if (!started || !acceptingInput) return;

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
            acceptingInput = false;
            nextSequenceTimeout = setTimeout(() => {
                if (started) nextSequence();
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
    clearSequenceTimeouts();
    acceptingInput = false;
    userClickedPattern = [];
    level++;
    document.getElementById("level-title").innerText = "Level " + level;

    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    const sequenceStepDuration = 600;
    gamePattern.forEach((colour, index) => {
        const flashTimeout = setTimeout(() => {
            const selectedBtn = document.getElementById(colour);
            if (selectedBtn) {
                selectedBtn.style.opacity = "0.2";
                sequenceTimeouts.push(setTimeout(() => {
                    selectedBtn.style.opacity = "1";
                }, 250));
            }
            playSound(colour);
        }, index * sequenceStepDuration);
        sequenceTimeouts.push(flashTimeout);
    });

    inputUnlockTimeout = setTimeout(() => {
        if (started) acceptingInput = true;
    }, gamePattern.length * sequenceStepDuration);
}

function clearSequenceTimeouts() {
    sequenceTimeouts.forEach(timeout => clearTimeout(timeout));
    sequenceTimeouts = [];
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
    clearTimeout(nextSequenceTimeout);
    clearTimeout(inputUnlockTimeout);
    clearSequenceTimeouts();
    level = 0;
    gamePattern = [];
    started = false;
    acceptingInput = false;
}
