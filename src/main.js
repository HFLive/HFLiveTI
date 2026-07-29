import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/screens.css";

import { questions } from "./data/questions.js";
import { results } from "./data/results.js";
import { renderHome } from "./modules/home-template.js";
import {
  renderLoading,
  renderQuestion,
  renderResult,
} from "./modules/render.js";
import { calculateResult } from "./modules/scoring.js";
import {
  clearSession,
  createQuizSession,
  loadSession,
  saveSession,
} from "./modules/state.js";
import { createShareCard } from "./modules/share-card.js";

const app = document.querySelector("#app");
let session = null;
let answerLocked = false;
let activeResult = null;

const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
const requestedTheme = new URLSearchParams(window.location.search).get(
  "theme",
);
const themeOverride = ["light", "dark"].includes(requestedTheme)
  ? requestedTheme
  : null;

const syncTheme = () => {
  document.documentElement.dataset.theme =
    themeOverride ?? (colorScheme.matches ? "dark" : "light");
};

syncTheme();
colorScheme.addEventListener?.("change", () => {
  if (!themeOverride) syncTheme();
});

const memoryStorage = (() => {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
})();

const getStorage = () => {
  try {
    const probe = "__hflive_probe__";
    window.sessionStorage.setItem(probe, probe);
    window.sessionStorage.removeItem(probe);
    return window.sessionStorage;
  } catch {
    return memoryStorage;
  }
};

const storage = getStorage();
const questionById = (id) =>
  questions.find((question) => question.id === id);

const renderQuiz = () => {
  const questionId = session.questionOrder[session.currentIndex];
  const question = questionById(questionId);
  app.innerHTML = renderQuestion({
    question,
    optionOrder: session.optionOrder[questionId],
    currentIndex: session.currentIndex,
    total: session.questionOrder.length,
    selectedOptionId: session.answers[questionId],
  });
  app.querySelector(".question-card")?.focus({ preventScroll: true });
};

const showResult = () => {
  activeResult = calculateResult(questions, session.answers);
  app.innerHTML = renderResult({
    primaryKey: activeResult.primary,
    secondaryKey: activeResult.secondary,
    scores: activeResult.scores,
    leadScore: activeResult.leadScore,
    leadPrimaryCount: activeResult.leadPrimaryCount,
    leadMaxScore: activeResult.leadMaxScore,
  });
  window.scrollTo({ top: 0, behavior: "instant" });
};

const startQuiz = () => {
  session = createQuizSession(questions);
  saveSession(storage, session);
  activeResult = null;
  renderQuiz();
};

const goHome = () => {
  app.innerHTML = renderHome();
  window.scrollTo({ top: 0, behavior: "instant" });
};

const showSelectedOption = (optionId) => {
  for (const optionButton of app.querySelectorAll('[data-action="answer"]')) {
    const selected = optionButton.dataset.optionId === optionId;
    optionButton.classList.toggle("is-selected", selected);
    optionButton.setAttribute("aria-checked", String(selected));
    const mark = optionButton.querySelector(".option-mark");
    if (mark) mark.textContent = selected ? "●" : "○";
  }
};

const answerCurrentQuestion = (optionId) => {
  if (answerLocked) return;
  const questionId = session.questionOrder[session.currentIndex];
  const question = questionById(questionId);
  if (!question.options.some((option) => option.id === optionId)) return;

  answerLocked = true;
  session.answers[questionId] = optionId;
  saveSession(storage, session);
  showSelectedOption(optionId);

  window.setTimeout(() => {
    const isLastQuestion =
      session.currentIndex === session.questionOrder.length - 1;
    if (isLastQuestion) {
      app.innerHTML = renderLoading();
      window.setTimeout(() => {
        showResult();
        answerLocked = false;
      }, 720);
      return;
    }

    session.currentIndex += 1;
    saveSession(storage, session);
    renderQuiz();
    answerLocked = false;
  }, 190);
};

const goBack = () => {
  if (!session || answerLocked || session.currentIndex === 0) return;
  session.currentIndex -= 1;
  saveSession(storage, session);
  renderQuiz();
};

const restartQuiz = () => {
  clearSession(storage);
  startQuiz();
};

const shareResult = async () => {
  if (!activeResult) return;
  const primary = results[activeResult.primary];
  const secondary = results[activeResult.secondary];
  const secondaryLabel =
    activeResult.primary === "lead" ? "专业侧重" : "第二倾向";
  const status = app.querySelector("[data-share-status]");
  const shareButtons = app.querySelectorAll('[data-action="share"]');
  const dialog = app.querySelector("[data-share-dialog]");
  const image = app.querySelector("[data-share-image]");
  const shareUrl = new URL(window.location.href);
  shareUrl.search = "";
  shareUrl.hash = "";

  if (!status || shareButtons.length === 0 || !dialog || !image) return;

  shareButtons.forEach((button) => {
    button.disabled = true;
  });
  status.textContent = "正在生成分享图片…";

  try {
    image.src = await createShareCard({
      primary,
      secondary,
      secondaryLabel,
      shareUrl: shareUrl.toString(),
    });
    await image.decode?.();
    status.textContent = "";
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  } catch (error) {
    status.textContent =
      error instanceof Error ? error.message : "分享图片生成失败，请重试";
  } finally {
    shareButtons.forEach((button) => {
      button.disabled = false;
    });
  }
};

const closeShareDialog = () => {
  const dialog = app.querySelector("[data-share-dialog]");
  if (!dialog) return;
  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
  }
};

app.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;

  const action = trigger.dataset.action;
  if (action === "start") startQuiz();
  if (action === "answer") answerCurrentQuestion(trigger.dataset.optionId);
  if (action === "back") goBack();
  if (action === "restart") restartQuiz();
  if (action === "share") shareResult();
  if (action === "close-share") closeShareDialog();
  if (action === "home") {
    event.preventDefault();
    goHome();
  }
});

const hasStaticHome =
  app.firstElementChild?.matches('[data-screen="home"]') ?? false;

session = loadSession(storage, questions);
if (
  session &&
  Object.keys(session.answers).length === session.questionOrder.length
) {
  showResult();
} else if (session) {
  renderQuiz();
} else if (!hasStaticHome) {
  goHome();
}
