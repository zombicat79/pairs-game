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
    
        const playCards = this.pickCards();
        const shuffledCards = this.shuffleCards(playCards);
        this.createCards(shuffledCards);
        if (this.theme === "football") {
            gameScreen.classList.add("football-bg");
            document.getElementById("champions-theme").play();
        }
        else if (this.theme === "dragonball") {
            gameScreen.classList.add("dragon-bg");
            document.getElementById("dragonball-theme").play();
        }
        else if (this.theme === "space") {
            gameScreen.classList.add("space-bg");
            document.getElementById("interstellar-theme").play();
        } else {
            gameScreen.classList.add("got-bg");
            document.getElementById("got-theme").play();
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

    createCards(readyCards) {
        const imgPath = `./public/images/${this.theme}/`;

        readyCards.forEach((item, index) => {
            const newCard = document.createElement('div');
            
            if (this.theme === 'football' || this.theme === 'got' || this.theme === 'space') {
                const cardImg = document.createElement('img');
                cardImg.setAttribute('src', imgPath + item.img);
                cardImg.classList.add('card-img');
                newCard.appendChild(cardImg);
                switch(this.theme) {
                    case 'space':
                        newCard.classList.add('space-card');
                        cardImg.classList.add('card-img-big');
                        break;
                    case 'got':
                        newCard.classList.add('got-card');
                        cardImg.classList.add('card-img-big');
                        break;
                    default:
                        newCard.classList.add('football-card');
                        cardImg.classList.add('card-img-small');
                }
            } else {
                newCard.style.backgroundImage = `linear-gradient(white, white), url(${imgPath + item.img})`;
                newCard.style.backgroundSize = '90% 95%';
                newCard.style.backgroundPosition = 'center';
                newCard.style.backgroundRepeat = 'no-repeat';
            }
            
            newCard.setAttribute('id', index);
            newCard.classList.add('card');
            newCard.classList.add(item.pairId);
            const unveilCard = this.unveilCard.bind(this);
            newCard.addEventListener('click', unveilCard);
            cardGrid.appendChild(newCard);
        })
    }

    unveilCard(event) {
        if (this.activePairing.length < 2) {
            this.flipCard(event.target);
            this.activePairing.push(event.target);
            this.evaluateTry();
        }
    }

    flipCard(card) {
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
                card.style.backgroundImage = 'url' + bgPropertySplit[1];
            }
            card.classList.remove("rotating");
        }, 1000);
    }

    evaluateTry() {
        if (this.turnStep === 2) {
            setTimeout(() => {
                console.log(this.activePairing)
                const classComparison = this.activePairing.map((el) => {
                    return el.classList.value;
                });
                console.log(classComparison)
                if (classComparison[0] === classComparison[1]) {
                    document.getElementById("message-board").innerHTML = 'Nailed it!'
                    console.log("Success!")
                } else {
                    document.getElementById("message-board").innerHTML = 'Wrong choice!'
                    console.log("Failure!")
                }
                this.activePairing = [];
                this.turnStep = 1;
            }, 1500);
        } else {
            this.turnStep = 2;
        }
    }
}