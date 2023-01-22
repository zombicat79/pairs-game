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
    }

    formatTime(timeUnit) {
        if (timeUnit < 10) {
            return '0' + timeUnit.toString();
        } else {
            return timeUnit.toString();
        }
    }
}