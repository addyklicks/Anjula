const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const proposalSection = document.getElementById('proposal-section');
const successSection = document.getElementById('success-section');

const messages = [
    "No",
    "Are you sure?",
    "Think again",
    "Haha, nice try",
    "No escape",
    "You can not escape love",
    "You are trying my patience",
    "Nice try",
    "Still no? Really?",
    "Nope not happening",
    "Don't be like that!",
    "I'll be sad...",
    "Pretty please?",
    "You're breaking my heart 💔",
    "Last chance!",
    "Okay, I'll ask again...",
    "Please?",
    "Come on!",
    "You know you want to!",
    "Just click Yes!"
];

let messageIndex = 1; // Start from 1 because 0 is "No" (initial)

noBtn.addEventListener('click', () => {
    // Change text
    noBtn.innerText = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;

    // Move button
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    // Calculate available space within the viewport (not just container, to make it more fun)
    // But keep it somewhat reachable so they can click it to see more messages
    
    // Let's keep it within the viewport but safe distance from edges
    const maxX = window.innerWidth - btnRect.width - 20;
    const maxY = window.innerHeight - btnRect.height - 20;

    const randomX = Math.max(10, Math.floor(Math.random() * maxX));
    const randomY = Math.max(10, Math.floor(Math.random() * maxY));

    noBtn.style.position = 'fixed'; // Use fixed to position relative to viewport
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Add a little rotation for fun
    const randomRot = Math.floor(Math.random() * 40) - 20;
    noBtn.style.transform = `rotate(${randomRot}deg)`;
});

// Also make it run away on hover after a few clicks to make it harder? 
// User said "if she clicks No", so I'll stick to click mostly. 
// But adding a hover effect after some time is fun.
// Let's stick to click as per strict instructions "if she clicks No".

yesBtn.addEventListener('click', () => {
    // Fire confetti
    triggerConfetti();

    // Hide proposal, show success
    proposalSection.classList.add('hidden');
    successSection.classList.remove('hidden');
    
    // More confetti loop
    let duration = 5 * 1000;
    let animationEnd = Date.now() + duration;
    let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInOut(min, max) {
      return Math.random() * (max - min) + min;
    }

    let interval = setInterval(function() {
      let timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      let particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInOut(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
});

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}
