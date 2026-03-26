const letterMessage = `Dios te bendiga ✨

Solo quería escribirte algo sencillo, pero sincero. A veces no hacen falta palabras complicadas para decir lo que uno siente, y hoy simplemente quería recordarte lo especial que eres.

Tu forma de ser, de hablar y hasta de ver las cosas tiene algo que no se encuentra fácilmente. Me gusta la tranquilidad que transmites y lo bien que se siente poder compartir momentos contigo, incluso los más simples.

No sé exactamente a dónde nos lleve esto, pero sí sé que valoro mucho lo que hay ahora. Y si en algún momento dudas de lo que significas, vuelve a leer esto: eres alguien importante.

Gracias por estar, por existir y por ser tú 🌷

Con cariño,
katy`;

const openLetterBtn = document.getElementById("openLetterBtn");
const heroScreen = document.getElementById("heroScreen");
const letterStage = document.getElementById("letterStage");
const letterContent = document.getElementById("letterContent");
const heartsLayer = document.getElementById("heartsLayer");
const audioToggle = document.getElementById("audioToggle");
const audioLabel = document.getElementById("audioLabel");
const audioHint = document.getElementById("audioHint");
const backgroundMusic = document.getElementById("backgroundMusic");

let typingTimer;
let floatingHeartsTimer;
let isLetterOpen = false;
let isAudioAvailable = true;

function setAudioState(isPlaying) {
  audioToggle.setAttribute("aria-pressed", String(isPlaying));
  audioLabel.textContent = isPlaying ? "Pausar música" : "Reproducir música";
}

function registerAudioUnavailable() {
  isAudioAvailable = false;
  audioToggle.disabled = true;
  audioToggle.classList.add("is-disabled");
  audioHint.textContent =
    "Agrega tu archivo en assets/carta.mp3 para acompañar la carta.";
  setAudioState(false);
}

async function tryPlayMusic() {
  if (!isAudioAvailable) {
    return;
  }

  try {
    await backgroundMusic.play();
    setAudioState(true);
    audioHint.textContent = "La melodía está acompañando la carta.";
  } catch (error) {
    registerAudioUnavailable();
  }
}

function typeLetter() {
  let index = 0;
  letterContent.textContent = "";
  letterContent.classList.add("is-typing");

  // Escribimos el mensaje poco a poco para que la carta se sienta íntima y viva.
  function appendCharacter() {
    const currentCharacter = letterMessage[index];
    letterContent.textContent += currentCharacter;
    index += 1;

    if (index >= letterMessage.length) {
      letterContent.classList.remove("is-typing");
      return;
    }

    const isLineBreak = currentCharacter === "\n";
    const isPauseMark = /[.!?:]/.test(currentCharacter);
    const delay = isLineBreak
      ? 140
      : isPauseMark
        ? 90
        : currentCharacter === ","
          ? 60
          : 28;

    typingTimer = window.setTimeout(appendCharacter, delay);
  }

  appendCharacter();
}

function createHeart({ burst = false } = {}) {
  const heart = document.createElement("span");
  const symbols = ["❤", "❥", "♥"];
  const left = `${Math.random() * 100}%`;
  const duration = `${burst ? 4.4 + Math.random() * 1.2 : 6.8 + Math.random() * 2.4}s`;
  const delay = `${Math.random() * 0.6}s`;
  const size = `${burst ? 0.95 + Math.random() * 0.75 : 0.65 + Math.random() * 0.8}rem`;
  const drift = `${(Math.random() * 80 - 40).toFixed(0)}px`;

  heart.className = "floating-heart";
  heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  heart.style.left = left;
  heart.style.setProperty("--float-duration", duration);
  heart.style.setProperty("--float-delay", delay);
  heart.style.setProperty("--heart-size", size);
  heart.style.setProperty("--heart-drift", drift);

  heartsLayer.appendChild(heart);

  window.setTimeout(() => {
    heart.remove();
  }, 9000);
}

function launchHearts() {
  // Un pequeño "estallido" inicial hace que la apertura se sienta más especial.
  for (let index = 0; index < 12; index += 1) {
    window.setTimeout(() => createHeart({ burst: true }), index * 120);
  }

  floatingHeartsTimer = window.setInterval(() => {
    createHeart();
  }, 900);
}

function openLetterExperience() {
  if (isLetterOpen) {
    return;
  }

  // Esta clase dispara la transición completa: sobre, fade y carta principal.
  isLetterOpen = true;
  document.body.classList.add("letter-open");
  heroScreen.setAttribute("aria-hidden", "true");
  letterStage.setAttribute("aria-hidden", "false");

  tryPlayMusic();
  launchHearts();

  window.setTimeout(() => {
    typeLetter();
  }, 950);
}

openLetterBtn.addEventListener("click", openLetterExperience);

audioToggle.addEventListener("click", async () => {
  if (!isAudioAvailable) {
    return;
  }

  if (backgroundMusic.paused) {
    await tryPlayMusic();
    return;
  }

  backgroundMusic.pause();
  setAudioState(false);
  audioHint.textContent = "La música quedó en pausa por un momento.";
});

backgroundMusic.addEventListener("error", registerAudioUnavailable);

window.addEventListener("beforeunload", () => {
  window.clearTimeout(typingTimer);
  window.clearInterval(floatingHeartsTimer);
});
