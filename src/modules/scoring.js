export const GROUP_KEYS = ["camera", "technical", "audio", "lighting"];

const emptyGroupRecord = () =>
  Object.fromEntries(GROUP_KEYS.map((group) => [group, 0]));

const questionNumber = (questionId) => {
  const match = String(questionId).match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export function calculateResult(questions, answers) {
  const scores = emptyGroupRecord();
  const primaryCounts = emptyGroupRecord();
  let leadScore = 0;
  let leadPrimaryCount = 0;
  let leadMaxScore = 0;
  let leadMaxPrimaryCount = 0;
  const latestPrimaryQuestion = Object.fromEntries(
    GROUP_KEYS.map((group) => [group, -1]),
  );

  for (const question of questions) {
    const optionId = answers[question.id];
    const option = question.options.find((candidate) => candidate.id === optionId);
    if (!option) continue;

    const questionLeadMax = Math.max(
      ...question.options.map((candidate) => candidate.lead ?? 0),
    );
    leadMaxScore += questionLeadMax;
    if (questionLeadMax === 2) leadMaxPrimaryCount += 1;
    leadScore += option.lead ?? 0;
    if (option.lead === 2) leadPrimaryCount += 1;

    option.weights.forEach((weight, index) => {
      const group = GROUP_KEYS[index];
      scores[group] += weight;
      if (weight === 2) {
        primaryCounts[group] += 1;
        latestPrimaryQuestion[group] = Math.max(
          latestPrimaryQuestion[group],
          questionNumber(question.id),
        );
      }
    });
  }

  const rankedGroups = [...GROUP_KEYS].sort((left, right) => {
    return (
      scores[right] - scores[left] ||
      primaryCounts[right] - primaryCounts[left] ||
      latestPrimaryQuestion[right] - latestPrimaryQuestion[left] ||
      GROUP_KEYS.indexOf(left) - GROUP_KEYS.indexOf(right)
    );
  });

  const isHiddenLead =
    leadMaxScore > 0 &&
    leadScore >= Math.ceil(leadMaxScore * 0.75) &&
    leadPrimaryCount >= Math.ceil(leadMaxPrimaryCount * 0.625);

  return {
    primary: isHiddenLead ? "lead" : rankedGroups[0],
    secondary: isHiddenLead ? rankedGroups[0] : rankedGroups[1],
    scores,
    primaryCounts,
    leadScore,
    leadPrimaryCount,
    leadMaxScore,
    leadMaxPrimaryCount,
  };
}
