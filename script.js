let playerScore = 0;
let computerScore = 0;
let currentStreak = 0;
let playerHistory = [];

// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    // Save theme preference
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Load saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    }
});

// Add click event listeners to choices
document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => play(button.dataset.choice));
});

// Reset button event listener
document.getElementById('resetBtn').addEventListener('click', resetGame);

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    // Pattern prediction based on player's history
    if (playerHistory.length >= 3) {
        const lastThreeMoves = playerHistory.slice(-3);
        if (lastThreeMoves.every(move => move === lastThreeMoves[0])) {
            const predictedMove = lastThreeMoves[0];
            document.getElementById('prediction').textContent = 
                "I predict you'll choose " + predictedMove + " again! 😉";
            const counterMoves = {
                'rock': 'paper',
                'paper': 'scissors',
                'scissors': 'rock'
            };
            return counterMoves[predictedMove];
        }
    }
    document.getElementById('prediction').textContent = '';
    return choices[Math.floor(Math.random() * 3)];
}

// Add these functions at the beginning of your script.js file
// Update the updateHands function
function updateHands(playerChoice, computerChoice) {
    const playerHand = document.querySelector('.player-hand');
    const computerHand = document.querySelector('.computer-hand');

    // Start with rock hands
    playerHand.className = 'player-hand hand-rock';
    computerHand.className = 'computer-hand hand-rock';

    // Add shake animation
    playerHand.classList.add('shake');
    computerHand.classList.add('shake');

    // After shake animation, show the chosen hands
    setTimeout(() => {
        playerHand.classList.remove('shake');
        computerHand.classList.remove('shake');
        playerHand.className = `player-hand hand-${playerChoice}`;
        computerHand.className = `computer-hand hand-${computerChoice}`;
    }, 800);
}

// Modify your play function to include the hand animation
function play(playerChoice) {
    document.querySelectorAll('.choice').forEach(btn => btn.classList.remove('winner'));

    playerHistory.push(playerChoice);
    const computerChoice = getComputerChoice();
    
    // Update hands with animation
    updateHands(playerChoice, computerChoice);

    // Delay the result to match the animation
    setTimeout(() => {
        const result = getWinner(playerChoice, computerChoice);
        
        // Add winner animation
        const winningChoice = result === 'win' ? playerChoice : 
                             result === 'lose' ? computerChoice : null;
        if (winningChoice) {
            document.querySelector(`[data-choice="${winningChoice}"]`).classList.add('winner');
        }

        updateScore(result);
        updateDisplay(playerChoice, computerChoice, result);

        // Add haptic feedback if supported
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    }, 800);
}

// Modify your resetGame function to reset the hands
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    currentStreak = 0;
    playerHistory = [];
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
    document.getElementById('status').textContent = 'Choose your move!';
    document.getElementById('streak').textContent = 'Current Streak: 0';
    document.getElementById('prediction').textContent = '';
    document.querySelectorAll('.choice').forEach(btn => btn.classList.remove('winner'));

    // Add reset animation
    if (window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
    }

    // Reset hands
    const playerHand = document.querySelector('.player-hand');
    const computerHand = document.querySelector('.computer-hand');
    playerHand.className = 'player-hand';
    computerHand.className = 'computer-hand';
}

function getWinner(player, computer) {
    if (player === computer) return 'tie';
    if ((player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')) {
        return 'win';
    }
    return 'lose';
}

function updateScore(result) {
    if (result === 'win') {
        playerScore++;
        currentStreak++;
    } else if (result === 'lose') {
        computerScore++;
        currentStreak = 0;
    }
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
    document.getElementById('streak').textContent = `Current Streak: ${currentStreak}`;
}

function updateDisplay(playerChoice, computerChoice, result) {
    const emojiMap = {
        'rock': '🪨',
        'paper': '📄',
        'scissors': '✂️'
    };

    let message = `You chose ${emojiMap[playerChoice]} vs Computer's ${emojiMap[computerChoice]}. `;
    if (result === 'win') {
        message += '🎉 You win!';
    } else if (result === 'lose') {
        message += '😔 Computer wins!';
    } else {
        message += '🤝 It\'s a tie!';
    }
    document.getElementById('status').textContent = message;
}