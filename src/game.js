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
    
        const playCards = this.pickCards();
        console.log(playCards)
        const shuffledCards = this.shuffleCards(playCards);
        this.createCards(shuffledCards);
        if (this.theme === "football") {
            document.getElementById("champions-theme").play();
        } else {
            document.getElementById("got-theme").play();
        }
    }

    pickCards() {
        const cardDeck = this.theme === 'football' ? clubs : houses;
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

        readyCards.forEach((item) => {
            const newCard = document.createElement('div');
            const cardImg = document.createElement('img');
            cardImg.setAttribute('src', imgPath + item.img);
            cardImg.setAttribute('width', 75);
            newCard.appendChild(cardImg);
            newCard.classList.add('card');
            cardGrid.appendChild(newCard);
        })
    }
}