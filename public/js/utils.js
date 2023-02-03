// GENERAL USE HELPER FUNCTIONS


// CONTROL BOARD HELPER FUNCTIONS
function manageSound(musicState, musicClip) {
    if (musicState) {
        document.getElementById(`${musicClip}-theme`).pause();
        document.getElementById(`${musicClip}-theme`).currentTime = 0;
    } else {
        document.getElementById(`${musicClip}-theme`).play();
    }
}

const endingMsg = document.getElementById("ending-msg");
// DRAGON BALL HELPER FUNCTIONS

function launchKame() {
    setTimeout(() => {
        gameScreen.classList.add('kame-gather');
        endingMsg.style.fontSize = "6vw";
        endingMsg.innerHTML = 'KAME...'
        endingMsg.style.zIndex = "10";
        endingMsg.style.fontFamily = "Archivo-Regular";
        endingMsg.style.color = "black";
        setTimeout(() => {endingMsg.innerHTML = 'HAME...'}, 2500);
        setTimeout(() => {
            endingMsg.innerHTML = 'HA!!!';
            gameScreen.classList.remove('kame-gather');
            gameScreen.style.zIndex = "100";
            gameScreen.classList.add('kame-attack');
        }, 8000);
        setTimeout(() => {endingMsg.innerHTML = 'HAA!!!'}, 9000);
        setTimeout(() => {endingMsg.innerHTML = 'HAAA!!!'}, 9500);
        setTimeout(() => {endingMsg.innerHTML = 'HAAAA!!!'}, 10000);
        setTimeout(() => {endingMsg.innerHTML = 'HAAAAA!!!'}, 10500);
        setTimeout(() => {endingMsg.innerHTML = 'HAAAAAA!!!'}, 11000);
        setTimeout(() => {endingMsg.innerHTML = 'HAAAAAAA!!!'}, 11500);
        setTimeout(() => {endingMsg.innerHTML = 'HAAAAAAAA!!!'}, 12000);
        setTimeout(() => {endingMsg.innerHTML = 'HAAAAAAAAA!!!'}, 12500);
        setTimeout(() => {endingMsg.innerHTML = 'HAAAAAAAAAA!!!'}, 13000);
        setTimeout(() => {endingMsg.innerHTML = 'HAAAAAAAAAAA!!!'}, 13500);
        setTimeout(() => {endingMsg.innerHTML = 'HAAAAAAAAAAAA!!!'}, 14000);
        setTimeout(() => {
            gameScreen.classList.remove('kame-attack');
            gameScreen.style.background = "linear-gradient(skyblue, white, skyblue)";
            gameScreen.style.opacity = "0.35";
        }, 14500);
    }, 5000);
}


// SPACE EXPLORATION HELPER FUNCTIONS
function liftoffGoAhead() {
    endingMsg.innerHTML = 'Liftoff!'
    endingMsg.style.zIndex = "10";
    endingMsg.style.fontFamily = "Space-Bold";
    endingMsg.style.color = 'yellow';
    setTimeout(() => {
        endingMsg.classList.add('txt-appearing');
        setTimeout(() => {
            endingMsg.style.fontSize = "10vw";
            endingMsg.classList.remove('txt-appearing');
        }, 3000);
    }, 15000)
}