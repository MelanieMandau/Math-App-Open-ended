class MathGame {
    constructor() {
        this.score = 0;
        this.gameTime = 300; // 5 minutes in seconds
        this.timeLeft = this.gameTime;
        this.isGameActive = false;
        this.progressRing = document.querySelector('.progress-ring-circle');
        this.circumference = 2 * Math.PI * 70; // 70 is the radius
        this.progressRing.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.gameContainer = document.querySelector('.game-container');
        this.startButton = document.querySelector('.start-button');
        this.progressRingElement = document.querySelector('.progress-ring');
        this.scoreDisplay = document.querySelector('.score-display');
        this.gameContainer.classList.add('started'); // Tilføjer klassen "started"
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.gameContainer.classList.add('not-started');
    }

    setupEventListeners() {
        const inputs = document.querySelectorAll('.answer-input');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => this.checkAnswer(e.target));
        });

        const helpButtons = document.querySelectorAll('.help-button');
        helpButtons.forEach(button => {
            button.addEventListener('click', (e) => this.showHelpPopup(e.target));
        });

        this.startButton.addEventListener('click', () => this.startGame());
    }

    showHelpPopup(button) {
        const playerNumber = button.closest('.player-section').querySelector('.player-number').textContent;
        alert(`Hjælp til ${playerNumber}: Prøv at tænke på ligningen som en opdeling af tal.`);
    }

    startGame() {
        this.isGameActive = true;
        this.score = 0;
        this.timeLeft = this.gameTime;
        this.startButton.style.display = 'none';
        this.progressRingElement.style.display = 'block';
        this.scoreDisplay.style.display = 'block';
        this.gameContainer.classList.remove('not-started');

        // Tilføj gittermønster som baggrund
        this.addGridBackground();

        this.updateScore();
        this.generateProblems();
        this.startTimer();
    }

    addGridBackground() {
        document.body.style.backgroundImage = `
            linear-gradient(to right, #d0d0d0 1px, transparent 1px),
            linear-gradient(to bottom, #d0d0d0 1px, transparent 1px)
        `;
        document.body.style.backgroundSize = '20px 20px';
        document.body.style.backgroundColor = 'white';
    }

    generateProblems() {
        const problems = document.querySelectorAll('.math-problem');
        problems.forEach(problem => {
            const numbers = this.generateProblem();
            problem.querySelector('.problem-text').textContent =
                `${numbers.num1} ${numbers.operator} ${numbers.num2} =`;
            problem.dataset.answer = numbers.answer;
            problem.querySelector('.answer-input').value = '';
            problem.querySelector('.feedback').textContent = '';
        });
    }

    generateProblem() {
        const operators = ['+', '-'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const answer = operator === '+' ? num1 + num2 : num1 - num2;
        return { num1, num2, operator, answer };
    }

    checkAnswer(input) {
        if (!this.isGameActive) return;

        const problem = input.closest('.math-problem');
        const correctAnswer = parseInt(problem.dataset.answer);
        const userAnswer = parseInt(input.value);
        const feedback = problem.querySelector('.feedback');

        if (!isNaN(userAnswer)) {
            if (userAnswer === correctAnswer) {
                feedback.textContent = 'Korrekt!';
                feedback.className = 'feedback correct';
                this.score++;
                this.updateScore();

                setTimeout(() => {
                    const numbers = this.generateProblem();
                    problem.querySelector('.problem-text').textContent =
                        `${numbers.num1} ${numbers.operator} ${numbers.num2} =`;
                    problem.dataset.answer = numbers.answer;
                    input.value = '';
                    feedback.textContent = '';
                }, 1500);
            } else {
                feedback.textContent = 'Forkert';
                feedback.className = 'feedback incorrect';
            }
        }
    }

    updateScore() {
        this.scoreDisplay.textContent = this.score;
    }

    startTimer() {
        const timer = setInterval(() => {
            this.timeLeft--;
            const progress = (this.timeLeft / this.gameTime) * this.circumference;
            this.progressRing.style.strokeDashoffset = this.circumference - progress;

            if (this.timeLeft <= 0) {
                clearInterval(timer);
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        this.isGameActive = false;
        alert(`Spillet er slut! I fik ${this.score} rigtige svar!`);
        this.startButton.style.display = 'block';
        this.progressRingElement.style.display = 'none';
        this.scoreDisplay.style.display = 'none';
        this.gameContainer.classList.add('not-started');
        document.body.style.backgroundImage = ''; // Fjern baggrundsmønster
        document.body.style.backgroundColor = '#f0f0f0'; // Standardfarve
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MathGame();
});
