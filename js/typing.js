/* ═══════════════════════════════════════════════════════════
   TYPING.JS — Typing animation for hero title
   ═══════════════════════════════════════════════════════════ */

(function () {
  const element = document.getElementById('typing-text');
  if (!element) return;

  const strings = [
    'Machine Learning Engineer',
    'AI Researcher & Trainer',
    'Neural Network Architect',
    'Full-Stack Developer',
    'Problem Solver | 500+ DSA'
  ];

  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPE_SPEED = 80;
  const DELETE_SPEED = 50;
  const PAUSE_AFTER_TYPE = 2000;
  const PAUSE_AFTER_DELETE = 500;

  function type() {
    const current = strings[stringIndex];

    if (!isDeleting && !isPaused) {
      // Typing
      element.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(() => {
          isPaused = false;
          isDeleting = true;
          type();
        }, PAUSE_AFTER_TYPE);
        return;
      }

      setTimeout(type, TYPE_SPEED + Math.random() * 40);
    } else if (isDeleting && !isPaused) {
      // Deleting
      element.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        setTimeout(type, PAUSE_AFTER_DELETE);
        return;
      }

      setTimeout(type, DELETE_SPEED);
    }
  }

  // Start typing after intro animation (wait for the 5s intro to finish + 0.5s padding)
  setTimeout(type, 5500);
})();
