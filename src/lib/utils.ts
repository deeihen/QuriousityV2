/**
 * Generates a random 6-digit access code for a quiz.
 * @returns A string representing a 6-digit code.
 */
export const generateQuizCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Calculates the score for a question based on correctness and time remaining.
 * @param isCorrect Whether the answer is correct.
 * @param timeLeft Time remaining in seconds.
 * @returns The calculated score.
 */
export const calculateScore = (isCorrect: boolean, timeLeft: number): number => {
  if (!isCorrect) return 0;
  return 100 + (timeLeft * 2);
};
