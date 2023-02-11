class Countdown {
    constructor(selectedTime) {
        this.maxTime = selectedTime
        this.minutes = Math.floor(selectedTime);
        this.seconds = selectedTime === Math.floor(selectedTime) ? 0 : 30;
        this.formattedMinutes = this.formatTime(this.minutes);
        this.formattedSeconds = this.formatTime(this.seconds);
    }

    decreaseSeconds() {
        if (this.seconds === 0) {
            this.seconds = 59;
        } else {
            this.seconds -= 1;
        }
        this.decreaseMinutes();
        this.formattedSeconds = this.formatTime(this.seconds);
    }

    decreaseMinutes() {
        if (this.minutes === this.maxTime) {
            this.minutes -= 1;
        }
        if (this.seconds === 1 && this.minutes !== 0) {
            setTimeout(() => {
                this.minutes -= 1;
                this.formattedMinutes = this.formatTime(this.minutes);
            }, 2000)
        }
        this.formattedMinutes = this.formatTime(this.minutes);
        this.checkUrgency();
        this.printTime();
    }

    printTime() {
        bigMinutesMarker.innerHTML = this.formattedMinutes[0];
        smallMinutesMarker.innerHTML = this.formattedMinutes[1];
        bigSecondsMarker.innerHTML = this.formattedSeconds[0];
        smallSecondsMarker.innerHTML = this.formattedSeconds[1];
    }

    formatTime(timeUnit) {
        if (timeUnit < 10) {
            return '0' + timeUnit.toString();
        } else {
            return timeUnit.toString();
        }
    }

    checkUrgency() {
        if (this.formattedMinutes === '00' || (this.formattedMinutes === '01' && this.formattedSeconds === '00')) {
            cronometerCounter.style.color = "red";
        } else {
            cronometerCounter.style.color = "black";
        }
    }
}