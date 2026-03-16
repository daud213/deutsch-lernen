export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/db';
import DailyProgress from '@/components/DailyProgress';
import Link from 'next/link';

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user XP and max streak across all words
  const { data: profile } = await supabase
    .from('users')
    .select('xp')
    .eq('id', user.id)
    .single();

  const { data: progressRows } = await supabase
    .from('user_progress')
    .select('streak')
    .eq('user_id', user.id)
    .order('streak', { ascending: false })
    .limit(1);

  // Count cards due for review right now
  const { count: reviewsDue } = await supabase
    .from('user_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review', new Date().toISOString());

  const xp = (profile as any)?.xp ?? 0;
 const streak = (progressRows as any)?.[0]?.streak ?? 0;
  const reviewsDueCount = reviewsDue ?? 0;

  // Fetch vocabulary list for browsing
  const { data: vocabulary } = await supabase
    .from('vocabulary')
    .select('id, german, english')
    .order('id');

  return (
    <div>
      <DailyProgress xp={xp} streak={streak} reviewsDueCount={reviewsDueCount} />

      <h2 className="text-base font-semibold text-gray-600 mb-3">All Words</h2>
      <ul className="flex flex-col gap-2">
{(vocabulary as any[])?.map((word: any) => (
          <li key={word.id}>
            <Link
              href={`/learn/${word.id}`}
              className="flex justify-between items-center bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="font-medium text-gray-800">{word.german}</span>
              <span className="text-sm text-gray-400">{word.english}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
