import { redirect } from 'next/navigation';
import { createClient } from '@/lib/db';

/**
 * /learn — redirects to the next card due for review,
 * or to a random vocabulary word if none are due.
 */
export default async function LearnIndexPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Find the next due card
  const { data: due } = await supabase
    .from('user_progress')
    .select('vocabulary_id')
    .eq('user_id', user.id)
    .lte('next_review', new Date().toISOString())
    .order('next_review', { ascending: true })
    .limit(1)
    .single();

  if (due) {
    // Replace line 30 with this:
redirect(`/learn/${(due as any).vocabulary_id}`);
  }

  // No cards due — pick a word the user hasn't seen yet, or fall back to word 1
  const { data: seen } = await supabase
    .from('user_progress')
    .select('vocabulary_id')
    .eq('user_id', user.id);

  // Replace line 40 with this:
const seenIds = (seen as any[])?.map((r) => r.vocabulary_id) ?? [];

  const query = supabase.from('vocabulary').select('id').limit(1);
  if (seenIds.length > 0) {
    query.not('id', 'in', `(${seenIds.join(',')})`);
  }
  const { data: unseen } = await query.single();

  redirect(`/learn/${unseen?.id ?? 1}`);
}
