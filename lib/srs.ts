// Interval in days indexed by difficulty level (0 = easiest, 4 = hardest)
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

/**
 * Returns the next review date based on the last review date and difficulty.
 * Difficulty 0 = very easy (longer interval), 4 = very hard (shorter interval).
 */
export function calculateNextReviewDate(lastReviewed: Date, difficulty: number): Date {
  const clampedDifficulty = Math.max(0, Math.min(difficulty, REVIEW_INTERVALS.length - 1));
  const intervalDays = REVIEW_INTERVALS[clampedDifficulty];
  const nextReview = new Date(lastReviewed);
  nextReview.setDate(nextReview.getDate() + intervalDays);
  return nextReview;
}

/**
 * Returns true if `date` falls on calendar yesterday relative to `now`.
 */
export function isYesterday(date: Date, now: Date = new Date()): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

/**
 * Returns true if `date` is today relative to `now`.
 */
export function isToday(date: Date, now: Date = new Date()): boolean {
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export const XP_PER_REVIEW = 10;
