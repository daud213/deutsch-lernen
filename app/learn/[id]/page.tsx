import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/db';
import FlashCard from '@/components/FlashCard';
import Link from 'next/link';

type PageProps = {
  params: { id: string };
};

export default async function LearnPage({ params }: PageProps) {
  const supabase = await createClient();

  // Auth guard
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Parse and validate id
  const vocabId = parseInt(params.id, 10);
  if (isNaN(vocabId)) notFound();

  // Fetch the word
  const { data: word, error } = await supabase
    .from('vocabulary')
    .select('id, german, english, example')
    .eq('id', vocabId)
    .single();

  if (error || !word) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link href="/" className="text-sm text-blue-500 hover:underline">
        ← Back to home
      </Link>
      <FlashCard word={word} />
    </div>
  );
}
