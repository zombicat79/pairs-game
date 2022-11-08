class Card {
    constructor(id, pairId, img) {
        this.uniqueId = id;
        this.pairId = pairId;
        this.img = img;
        this.turnStep = game.turnStep.bind(this);
    }

    createCard() {
        const cardBody = document.createElement('div');
        const cardImg = document.createElement('img');
        cardImg.setAttribute('src', this.img);
        cardImg.setAttribute('width', 75);
        cardBody.appendChild(cardImg);
        cardBody.setAttribute('id', this.uniqueId);
        cardBody.classList.add('card');
        cardBody.classList.add(this.pairId);
        const unveilCard = game.unveilCard.bind(this);
        cardBody.addEventListener('click', unveilCard);
        
        return cardBody;
    }

    /* unveilCard(event) {
        const turnStep = game.turnStep;
        console.log(turnStep)
        if (game.turnStep === 1) {
            console.log(event.target)
        }
    } */
}