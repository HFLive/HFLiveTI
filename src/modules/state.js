export const SESSION_KEY = "hflive-personality-test-session";
export const SESSION_VERSION = 2;

export function shuffle(items, random = Math.random) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

export function createQuizSession(questions, random = Math.random) {
  return {
    version: SESSION_VERSION,
    questionOrder: shuffle(
      questions.map((question) => question.id),
      random,
    ),
    optionOrder: Object.fromEntries(
      questions.map((question) => [
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
  if (!sameIdSet(session.questionOrder, questionIds)) return false;
  if (
    !Number.isInteger(session.currentIndex) ||
    session.currentIndex < 0 ||
    session.currentIndex >= questions.length
  ) {
    return false;
  }

  for (const question of questions) {
    const optionIds = question.options.map((option) => option.id);
    if (!sameIdSet(session.optionOrder?.[question.id], optionIds)) return false;
  }

  if (!session.answers || typeof session.answers !== "object") return false;
  for (const [questionId, optionId] of Object.entries(session.answers)) {
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
