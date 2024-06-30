class TallyApp {
    constructor(maxNumber, minNumber, stepAmount) {
        this.MAX_NUMBER = maxNumber;
        this.MIN_NUMBER = minNumber;
        this.STEP_AMOUNT = stepAmount;
        this.display = document.getElementById('display');
        this.addButton = document.getElementById('addition');
        this.subtractButton = document.getElementById('subtract');
        this.resetButton = document.getElementById('reset');

        this.addButton.addEventListener('click', this.addingHandler.bind(this));
        this.subtractButton.addEventListener('click', this.subtractHandler.bind(this));
        this.resetButton.addEventListener('click', this.resetDisplay.bind(this));
    }

        addingHandler() {
            const newValue = parseInt(this.display.textContent) + this.STEP_AMOUNT;
            if (newValue <= this.MAX_NUMBER) {
                this.display.textContent = newValue;
            }
        }
    
        subtractHandler() {
            const newValue = parseInt(this.display.textContent) - this.STEP_AMOUNT;
            if (newValue >= this.MIN_NUMBER) {
                this.display.textContent = newValue;
            }
        }

        resetDisplay() {
            this.display.textContent = '0'
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        const tallyApp = new TallyApp(10, 0, 1);
    })