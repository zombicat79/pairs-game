class Game {
    constructor(theme, cards, timeHandicap, guessHandicap) {
        this.theme = theme;
        this.cards = cards;
        this.timeHandicap = timeHandicap * cards || null;
        this.guessHandicap = guessHandicap * cards || null;
        this.activePairing = [];
        this.collectedPairs = [];
        this.turnStep = 1;
        this.goal = cards / 2;
        this.finished = false;
    }

    startGame() {
        console.log("starting game!!");
        console.log(`theme: ${this.theme}, cards: ${this.cards}, time: ${this.timeHandicap}, attempts: ${this.guessHandicap}`)
        setupScreen.classList.remove('show');
        setupScreen.classList.add('hide');
        gameScreen.classList.toggle('hide');
        gameScreen.classList.toggle('show');

        this.setDecoration();
    
        const playCards = this.pickCards();
        const shuffledCards = this.shuffleCards(playCards);
        this.createCards(shuffledCards);
        if (this.theme === "football") {
            gameScreen.classList.add("football-bg");
            document.getElementById("champions-theme").play();
        }
        else if (this.theme === "dragonball") {
            gameScreen.classList.add("dragon-bg");
            document.getElementById("dragonball-theme").volume = 0.8;
            document.getElementById("dragonball-theme").play();
        }
        else if (this.theme === "space") {
            gameScreen.classList.add("space-bg");
            document.getElementById("interstellar-theme").volume = 0.8;
            document.getElementById("interstellar-theme").play();
        } else {
            gameScreen.classList.add("got-bg");
            document.getElementById("got-theme").volume = 0.8;
            document.getElementById("got-theme").play();
        }
    }

    setDecoration() {
        const msgImages = Array.from(document.getElementsByClassName("message-img"));
        
        switch(this.theme) {
            case 'football':
                msgImages.forEach((img) => img.setAttribute('src', './public/images/football/ball.png'));
                break;
            case 'got':
                msgImages.forEach((img) => img.setAttribute('src', './public/images/GoT/ice-and-fire.png'));
                break;
            case 'dragonball':
                msgImages.forEach((img) => img.setAttribute('src', './public/images/dragonball/golden-ball.png'));
                break;
            default:
                msgImages.forEach((img) => img.setAttribute('src', './public/images/space/planet-mars.png'));
        }
    }

    pickCards() {
        const cardDeck = this.theme === 'football' ? clubs : this.theme === 'dragonball' ? heroes : this.theme === 'space' ? missions : houses;
        let picks = 0;
        let selection = [];

        while (picks < this.cards / 2) {
            const randomIndex = Math.floor(Math.random() * cardDeck.length);
            if (!selection.includes(cardDeck[randomIndex])) {
                selection.push(cardDeck[randomIndex]);
                picks++;
            }
        }
        const doubledSelection = selection.concat(selection);
        return doubledSelection;
    }

    shuffleCards(cardsToShuffle) {
        let shuffleDeck1 = [...cardsToShuffle];
        let shuffleDeck2 = [];
        const shuffleRounds = Math.floor(Math.random() * 200);
        let completedRounds = 0;
        
        while (completedRounds <= shuffleRounds) {
            let shuffleMethod = Math.floor(Math.random() * 5);
            switch(true) {
                case shuffleMethod === 0:
                    shuffleDeck1 = [...shuffleDeck1].reverse();
                    break;
                case shuffleMethod === 1:
                    if (shuffleDeck1.length > 1) {
                        const shuffleLeftoverA = [...shuffleDeck1].pop();
                        shuffleDeck1.pop();
                        shuffleDeck2.push(shuffleLeftoverA);
                    }
                    break;
                case shuffleMethod === 2:
                    if (shuffleDeck2.length > 0 && shuffleDeck1 < this.cards) {
                        shuffleDeck1.push(shuffleDeck2[0]);
                        shuffleDeck2.shift();
                    }
                    break;
                case shuffleMethod === 3:
                    if (shuffleDeck1.length > 1) {
                        const shuffleLeftoverB = [...shuffleDeck1].shift();
                        shuffleDeck1.shift();
                        shuffleDeck2.push(shuffleLeftoverB);
                    }
                    break;
                default:
                    if (shuffleDeck2.length > 0 && shuffleDeck1 < this.cards) {
                        shuffleDeck1.unshift(shuffleDeck2[0]);
                        shuffleDeck2.shift();
                    }
            }
            completedRounds++;
        }
        return shuffleDeck2.concat(shuffleDeck1);
    }

    createCards(processedCards) {
        const imgPath = `./public/images/${this.theme}/`;

        processedCards.forEach((item, index) => {
            const newCard = document.createElement('div');
            
            if (this.theme === 'football' || this.theme === 'got' || this.theme === 'space') {
                const cardImg = document.createElement('img');
                cardImg.setAttribute('src', imgPath + item.img);
                cardImg.classList.add('card-img', 'fixed');
                newCard.appendChild(cardImg);
                switch(this.theme) {
                    case 'space':
                        newCard.classList.add('space-card');
                        cardImg.classList.add('card-img-big');
                        break;
                    case 'got':
                        newCard.classList.add('got-card');
                        cardImg.classList.add('card-img-big');
                        newCard.addEventListener('mouseover', () => {
                            //this.runSFX('card-hover');
                        })
                        break;
                    default:
                        newCard.classList.add('football-card');
                        cardImg.classList.add('card-img-small');
                }
            } else {
                newCard.classList.add('dragonball-card');
                newCard.style.backgroundImage = `url('./public/images/dragonball/xeron-goku.png'), linear-gradient(skyblue, white), url(${imgPath + item.img})`;
                newCard.style.backgroundSize = 'contain';
                newCard.style.backgroundPosition = 'center';
                newCard.style.backgroundRepeat = 'no-repeat';
            }
            
            newCard.setAttribute('id', index);
            newCard.classList.add('card');
            newCard.classList.add(item.pairId);
            newCard.dataset.pair_id = item.pairId;
            newCard.addEventListener('mouseover', () => {
                this.runSFX('card-hover');
            })
            const unveilCard = this.unveilCard.bind(this);
            newCard.addEventListener('click', function(event) {
                unveilCard(event, processedCards, item);
            });
            cardGrid.appendChild(newCard);
        })
    }

    unveilCard(event, initialCardState, contentInfo) {
        if (this.activePairing.length < 2) {
            if (!this.activePairing.includes(event.target) && !this.activePairing.includes(event.target.parentElement)) {
                this.flipCard(event.target);
                this.activePairing.push(event.target);
                event.target.style.pointerEvents = "none";
                this.evaluateTry(initialCardState, contentInfo);
            }
        }
    }

    flipCard(card) {
        if (!card.classList.contains('flipped') && !card.classList.contains('fixed')) {
            card.classList.add("rotating");
            setTimeout(() => {
                if (this.theme === 'football' || this.theme === 'got' || this.theme === 'space') {
                    switch(this.theme) {
                        case 'space':
                            card.style.backgroundImage = "linear-gradient(darkgrey, black)";
                            break;
                        case 'got':
                            card.style.backgroundImage = "linear-gradient(darkgrey, black)";
                            break;
                        default:
                            card.style.backgroundImage = "linear-gradient(yellow, lightgrey)";
                    }
                    Array.from(card.children)[0].style.display = "block";
                } else {
                    const bgPropertySplit = card.style.backgroundImage.split("url");
                    card.style.backgroundImage = 'url' + bgPropertySplit[2];
                    card.style.backgroundSize = '100% 100%';
                }
                card.classList.remove("rotating");
            }, 1000);
            card.classList.add("flipped");
        }
    }

    evaluateTry(initialCardState, contentInfo) {
        document.getElementById("message-text").innerHTML = ''
        if (this.turnStep === 2) {
            setTimeout(() => {
                console.log(this.activePairing)
                const classComparison = this.activePairing.map((el) => {
                    return el.classList.value;
                });
                console.log(classComparison)
                if (classComparison[0] === classComparison[1]) {
                    this.postMessage('success', contentInfo);
                    this.runSFX('success');
                    this.collectedPairs.push(this.activePairing);
                    if (this.collectedPairs.length === this.goal) {
                        this.finishGame('success');
                        return;
                    }
                    this.activePairing = [];
                } else {
                    this.postMessage('failure', contentInfo);
                    this.runSFX('failure');
                    const backflipCards = this.backflipCards.bind(this);
                    setTimeout(() => {
                        backflipCards(initialCardState)
                    }, 2000);
                }
                this.turnStep = 1;
            }, 1500);
        } else {
            this.turnStep = 2;
        }
    }

    backflipCards(initialCardState) {
        this.activePairing.forEach((card) => {
            card.classList.add("rotating");
            card.classList.remove("flipped");
            if (this.theme === 'football' || this.theme === 'got' || this.theme === 'space') {
                card.style.removeProperty('background-image');
                Array.from(card.children)[0].style.display = "none";
            }
            if (this.theme === 'dragonball') {
                const imgPath = `./public/images/${this.theme}/`;
                initialCardState.forEach((el) => {
                    if (card.className.includes(el.pairId)) {
                        card.style.backgroundImage = `url('./public/images/dragonball/xeron-goku.png'), linear-gradient(skyblue, white), url(${imgPath + el.img})`;
                    }
                })
                card.style.backgroundSize = 'contain';
            }
            setTimeout(() => {
                card.classList.remove("rotating");
                card.style.pointerEvents = "initial";
            }, 1000)
        })
        this.activePairing = [];
    }

    postMessage(msgType, contentInfo) {
        const messageBoard = document.getElementById("message-board");
        let messageText = document.getElementById("message-text");

        switch(this.theme) {
            case 'football':
                messageText.innerHTML = msgType === 'success' ? `That's a magnificent goal! You put ${contentInfo.name} ahead in the scoreboard!` : `What an incredibly missed chance! You'd better keep training!`;
                break;
            case 'got':
                messageText.style.fontFamily = 'Macondo, cursive';
                messageText.style.color = 'white';
                messageText.innerHTML = msgType === 'success' ? `Allegiance sworn! You took <span style="color: goldenrod">${contentInfo.name}</span> under your banner!` : `Unwise decision! <span style="color: darkred">${contentInfo.name}</span> betrayed you and aligned with your foes.`;
                break;
            case 'dragonball':
                messageText.style.fontFamily = 'Archivo-Regular, Arial, sans-serif';
                messageText.style.color = 'black';
                messageText.innerHTML = msgType === 'success' ? `Nailed it! You enrolled <strong>${contentInfo.name.toUpperCase()}</strong> in your fighter squad!` : `Wrong move! You took a power punch from <strong>${contentInfo.name.toUpperCase()}</strong>`;
                break;
            default:
                messageText.style.fontFamily = 'Space-Regular, Arial, sans-serif';
                messageText.style.color = 'yellow';
                messageText.innerHTML = msgType === 'success' ? `All systems in place! <span style="font-family: 'Space-Italic-Bold'; color: goldenrod">${contentInfo.name} mission</span> is ready to launch!` : 'System error: unable to calculate orbit. Aborting launch!';
        }
        window.scroll({top: 0, left: 0, behavior: 'smooth'});
        gameScreen.style.pointerEvents = "none";
        messageBoard.classList.add('coming-in');
        setTimeout(() => {
            messageBoard.classList.remove('coming-in');
            gameScreen.style.pointerEvents = "initial";
        }, 8000)
    }

    runSFX(sfxType) {
        let soundPath;
        let sfxPlayer;
        let availableEffects;
        let randomEffect;
        switch(this.theme) {
            case 'space':
                soundPath = "./public/sounds/space/";
                sfxPlayer = document.getElementById("space-sfx");
                if (sfxType === 'success') {
                    availableEffects = [/*'liftoff.wav', 'rocket-launch.mp3', */ 'sequence.mp3'];
                }
                else if (sfxType === 'card-hover') {
                    availableEffects = ['computer-blip.mp3'];
                }
                else if (sfxType === 'successful-end') {
                    setTimeout(() => {
                        sfxPlayer.setAttribute('src', soundPath + 'liftoff.wav');
                        document.getElementById("space-sfx").play();
                    }, 5000)
                    return;
                } else {
                    gameScreen.classList.add('space-alarmed');
                    setTimeout(() => {gameScreen.classList.remove('space-alarmed')}, 5000);
                    availableEffects = [/* 'houston-problem.mp3', 'high-pitched-alarm.wav', */ 'nuclear-alert.mp3'];
                }
                randomEffect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
                sfxPlayer.setAttribute('src', soundPath + randomEffect);
                document.getElementById("space-sfx").play();
                break;
            case 'got':
                soundPath = "./public/sounds/got/";
                sfxPlayer = document.getElementById("got-sfx");
                if (sfxType === 'success') {
                    availableEffects = [/* 'dragon-roar.mp3', 'wolf-howl.mp3', */ 'battle-horn.mp3'];
                }
                else if (sfxType === 'card-hover') {
                    availableEffects = ['unsheath-sword.wav'];
                } else {
                    availableEffects = [/* 'winter-is-coming.mp3',*/ 'dracarys.mp3' /*, 'im-not-lord-commander.mp3', 'burn-your-bodies.mp3', 'hard-for-you.mp3', 'terrible-mistake.mp3', 'where-are-my-dragons.mp3'*/];
                }

                randomEffect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
                sfxPlayer.setAttribute('src', soundPath + randomEffect);
                document.getElementById("got-sfx").play();
                break;
            case 'dragonball':
                soundPath = "./public/sounds/dragonball/";
                sfxPlayer = document.getElementById("dragonball-sfx");
                if (sfxType === 'success') {
                    availableEffects = ['adventure-tone.mp3'];
                }
                else if (sfxType === 'card-hover') {
                    availableEffects = ['canvi-de-lloc.mp3'];
                }
                else if (sfxType === 'successful-end') {
                    setTimeout(() => {
                        sfxPlayer.setAttribute('src', soundPath + 'kamehameha.mp3');
                        document.getElementById("dragonball-sfx").play();
                    }, 5000)
                    return;
                } else {
                    availableEffects = ['punch-sfx.mp3'];
                }

                randomEffect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
                sfxPlayer.setAttribute('src', soundPath + randomEffect);
                document.getElementById("dragonball-sfx").play();
                break;
            default:
                soundPath = "./public/sounds/football/";
                sfxPlayer = document.getElementById("football-sfx");
                if (sfxType === 'success') {
                    availableEffects = ['goal.mp3'];
                }
                else if (sfxType === 'card-hover') {
                    availableEffects = ['football-kick.wav'];
                }
                else if (sfxType === 'successful-end') {
                    /* setTimeout(() => {
                        sfxPlayer.setAttribute('src', soundPath + 'kamehameha.mp3');
                        document.getElementById("dragonball-sfx").play();
                    }, 5000)
                    return; */
                } else {
                    availableEffects = ['booing-crowd.wav'];
                }

                randomEffect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
                sfxPlayer.setAttribute('src', soundPath + randomEffect);
                document.getElementById("football-sfx").play();

        }
    }

    finishGame(endType) {
        cardGrid.style.pointerEvents = "none";
        const endingMsg = document.getElementById("ending-msg");
        
        if (endType = 'success') {
            this.runSFX('successful-end');
            switch(this.theme) {
                case 'dragonball':
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
                    break;
                case 'space':
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
                    break;
            }
        }
    }
}