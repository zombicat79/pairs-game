// Table of game characteristics according to level selection
const difficultyChart = {
    1: {cards: 10, time: null, attempts: null}, 
    2: {cards: 20, time: null, attempts: null},
    3: {cards: 30, time: null, attempts: null},
    4: {cards: 10, time: 1, attempts: null},
    5: {cards: 20, time: 0.5, attempts: null},
    6: {cards: 30, time: 0.25, attempts: null},
    7: {cards: 10, time: 1, attempts: 4},
    8: {cards: 20, time: 0.5, attempts: 3},
    9: {cards: 30, time: 0.25, attempts: 2}
}

// Establishment of default game characteristics (parameters)
let gameParameters = [difficultyChart[1].cards, difficultyChart[1].time, difficultyChart[1].attempts];

// Acquisition of DOM elements
const setupScreen = document.getElementById("pre-game");
const gameScreen = document.getElementById("game");

const themeSelect = document.getElementById("theme");
const timeSelect = document.getElementById("time");
const attemptSelect = document.getElementById("attempts");
const setupSelects = [timeSelect, attemptSelect];
const difficultySelect = document.getElementById("difficulty");
const difficulty1 = document.getElementById("beginners");
const difficulty2 = document.getElementById("endurance");
const difficulty3 = document.getElementById("professional");
const difficultyGroups = [difficulty1, difficulty2, difficulty3];
const startBtn = document.getElementById("start-btn");

const cardGrid = document.getElementById("card-grid");

// Management of difficulty selection menus
let difficultyIndex = 0;

setupSelects.forEach((el) => {
    el.addEventListener('change', function() {
        if (el.value === "true" && difficultyIndex < 2) {
            difficultyIndex++;
        }
        if (el.value === "false" && difficultyIndex > 0) {
            difficultyIndex--;
        }
        difficultyGroups.forEach((el) => {
            el.classList.remove("show");
            el.classList.add("hide");
        })
        showDifficulty();
        assignDefaultParams(difficultyIndex);
    })
})

function showDifficulty() {
    for (let i=0; i <= difficultyIndex; i++) {
        difficultyGroups[difficultyIndex].classList.remove("hide");
        difficultyGroups[difficultyIndex].classList.add("show");
        difficultyGroups[difficultyIndex].querySelector("option").selected = true;
    }
}

function assignDefaultParams(index) {
    switch(true) {
        case index === 0:
            gameParameters = [difficultyChart[1].cards, difficultyChart[1].time, difficultyChart[1].attempts];
            break;
        case index === 1:
            gameParameters = [difficultyChart[4].cards, difficultyChart[4].time, difficultyChart[4].attempts];
            break;
        default:
            gameParameters = [difficultyChart[7].cards, difficultyChart[7].time, difficultyChart[7].attempts];
    }
}

// Instantiation of difficulty selection
difficultySelect.addEventListener('change', function() {
    gameParameters = [];
    const value = Number(difficultySelect.value);
    const {cards, time, attempts} = (difficultyChart[value])
    gameParameters = [...gameParameters, cards, time, attempts];
})

// Game start
startBtn.addEventListener("click", function() {
    const game = new Game(themeSelect.value, gameParameters[0], gameParameters[1], gameParameters[2]);
    game.startGame();
})