export const SESSION_KEY = "hflive-personality-test-session";
export const SESSION_VERSION = 3;
export const QUIZ_QUESTION_COUNT = 10;

export function shuffle(items, random = Math.random) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

export function createQuizSession(questions, random = Math.random) {
  const questionOrder = shuffle(
    questions.map((question) => question.id),
    random,
  ).slice(0, Math.min(QUIZ_QUESTION_COUNT, questions.length));
  const selectedQuestions = questionOrder.map((questionId) =>
    questions.find((question) => question.id === questionId),
  );

  return {
    version: SESSION_VERSION,
    questionOrder,
    optionOrder: Object.fromEntries(
      selectedQuestions.map((question) => [
        question.id,
        shuffle(
          question.options.map((option) => option.id),
          random,
        ),
      ]),
    ),
    answers: {},
    currentIndex: 0,
  };
}

const sameIdSet = (actual, expected) =>
  Array.isArray(actual) &&
  actual.length === expected.length &&
  actual.every((id) => expected.includes(id)) &&
  new Set(actual).size === expected.length;

function isValidSession(session, questions) {
  if (!session || session.version !== SESSION_VERSION) return false;

  const questionIds = questions.map((question) => question.id);
  const expectedQuestionCount = Math.min(
    QUIZ_QUESTION_COUNT,
    questions.length,
  );
  if (
    !Array.isArray(session.questionOrder) ||
    session.questionOrder.length !== expectedQuestionCount ||
    new Set(session.questionOrder).size !== expectedQuestionCount ||
    !session.questionOrder.every((id) => questionIds.includes(id))
  ) {
    return false;
  }
  if (
    !Number.isInteger(session.currentIndex) ||
    session.currentIndex < 0 ||
    session.currentIndex >= session.questionOrder.length
  ) {
    return false;
  }

  for (const questionId of session.questionOrder) {
    const question = questions.find((candidate) => candidate.id === questionId);
    const optionIds = question.options.map((option) => option.id);
    if (!sameIdSet(session.optionOrder?.[question.id], optionIds)) return false;
  }

  if (!session.answers || typeof session.answers !== "object") return false;
  for (const [questionId, optionId] of Object.entries(session.answers)) {
    if (!session.questionOrder.includes(questionId)) return false;
    const question = questions.find((candidate) => candidate.id === questionId);
    if (!question?.options.some((option) => option.id === optionId)) return false;
  }

  return true;
}

export function saveSession(storage, session) {
  try {
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function loadSession(storage, questions) {
  try {
    const value = storage.getItem(SESSION_KEY);
    if (!value) return null;
    const session = JSON.parse(value);
    if (isValidSession(session, questions)) return session;
    clearSession(storage);
    return null;
  } catch {
    clearSession(storage);
    return null;
  }
}

export function clearSession(storage) {
  try {
    storage.removeItem(SESSION_KEY);
    return true;
  } catch {
    return false;
  }
}
