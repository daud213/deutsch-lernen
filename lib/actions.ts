'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/db';
import { calculateNextReviewDate, isYesterday, isToday, XP_PER_REVIEW } from '@/lib/srs';

export type ActionResult =
  | { success: true; streak: number; xp: number }
  | { success: false; error: string };

/**
 * Updates (or creates) a user_progress row for the given word,
 * handles streak logic, and awards XP.
 *
 * difficulty: 0 (hardest/Again) → 4 (easiest/Easy)
 */
export async function updateUserProgress(
  vocabularyId: number,
  difficulty: number
): Promise<ActionResult> {
  const supabase = createClient();

  // 1. Verify the user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: 'Not authenticated' };
  }

  const now = new Date();

  // 2. Fetch the existing progress row (if any)
  const { data: existing } = await supabase
    .from('user_progress')
    .select('id, streak, last_reviewed, total_reviews')
    .eq('user_id', user.id)
    .eq('vocabulary_id', vocabularyId)
    .maybeSingle();

  // 3. Calculate new streak
  let newStreak = 1;
  if (existing) {
    const lastReviewed = new Date(existing.last_reviewed);
    if (isToday(lastReviewed, now)) {
      // Already reviewed today — keep current streak, don't double-award XP
      newStreak = existing.streak;
    } else if (isYesterday(lastReviewed, now)) {
      // Reviewed yesterday — extend streak
      newStreak = existing.streak + 1;
    } else {
      // Gap of >1 day — reset streak
      newStreak = 1;
    }
  }

  const nextReview = calculateNextReviewDate(now, difficulty);

  // 4. Upsert the progress row
  const { error: upsertError } = await supabase.from('user_progress').upsert(
    {
      user_id: user.id,
      vocabulary_id: vocabularyId,
      streak: newStreak,
      last_reviewed: now.toISOString(),
      next_review: nextReview.toISOString(),
      total_reviews: existing ? existing.total_reviews + 1 : 1,
      difficulty,
    },
    { onConflict: 'user_id,vocabulary_id' }
  );

  if (upsertError) {
    console.error('upsert error:', upsertError);
    return { success: false, error: 'Failed to save progress' };
  }

  // 5. Award XP — only once per unique review session (not on same-day re-reviews)
  const alreadyReviewedToday =
    existing && isToday(new Date(existing.last_reviewed), now);

  if (!alreadyReviewedToday) {
    const { error: xpError } = await supabase.rpc('increment_user_xp', {
      p_user_id: user.id,
      p_amount: XP_PER_REVIEW,
    });
    if (xpError) {
      console.error('xp increment error:', xpError);
      // Non-fatal — streak was already saved
    }
  }

  // 6. Fetch updated XP to return to the client
  const { data: profile } = await supabase
    .from('users')
    .select('xp')
    .eq('id', user.id)
    .single();

  revalidatePath('/');
  revalidatePath(`/learn/${vocabularyId}`);

  return {
    success: true,
    streak: newStreak,
    xp: profile?.xp ?? 0,
  };
}
