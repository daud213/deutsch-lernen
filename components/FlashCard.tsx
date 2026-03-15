'use client';

import { useState, useTransition } from 'react';
import { updateUserProgress } from '@/lib/actions';

type Word = {
  id: number;
  german: string;
  english: string;
  example: string | null;
};

type FlashCardProps = {
  word: Word;
};

const DIFFICULTY_BUTTONS = [
  { label: 'Again', value: 4, color: 'bg-red-500 hover:bg-red-600' },
  { label: 'Hard', value: 3, color: 'bg-orange-400 hover:bg-orange-500' },
  { label: 'Good', value: 1, color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Easy', value: 0, color: 'bg-green-500 hover:bg-green-600' },
] as const;

export default function FlashCard({ word }: FlashCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<{ streak: number; xp: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleReveal() {
    setRevealed(true);
  }

  function handleDifficulty(difficulty: number) {
    setError(null);
    startTransition(async () => {
      const result = await updateUserProgress(word.id, difficulty);
      if (result.success) {
        setFeedback({ streak: result.streak, xp: result.xp });
      } else {
        setError(result.error);
      }
    });
  }

  // After a successful review, show a brief summary
  if (feedback) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-2xl shadow-md text-center">
        <span className="text-4xl">🎉</span>
        <p className="text-lg font-semibold text-gray-800">Nice work!</p>
        <div className="flex gap-6 text-sm text-gray-600">
          <span>🔥 Streak: <strong>{feedback.streak}</strong></span>
          <span>⭐ XP: <strong>{feedback.xp}</strong></span>
        </div>
        <button
          onClick={() => {
            setRevealed(false);
            setFeedback(null);
          }}
          className="mt-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
        >
          Next Card
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-md">
      {/* German word */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">German</p>
        <h2 className="text-3xl font-bold text-gray-900">{word.german}</h2>
      </div>

      {/* Reveal / answer area */}
      {!revealed ? (
        <button
          onClick={handleReveal}
          className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 font-medium transition-colors"
        >
          Tap to reveal
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          {/* English translation */}
          <div className="text-center bg-gray-50 rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">English</p>
            <p className="text-xl font-semibold text-gray-800">{word.english}</p>
          </div>

          {/* Example sentence */}
          {word.example && (
            <p className="text-sm text-gray-500 italic text-center px-2">
              &ldquo;{word.example}&rdquo;
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          {/* Difficulty buttons */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {DIFFICULTY_BUTTONS.map(({ label, value, color }) => (
              <button
                key={label}
                onClick={() => handleDifficulty(value)}
                disabled={isPending}
                className={`py-2 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50 ${color}`}
              >
                {isPending ? '…' : label}
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-gray-400">How well did you know this?</p>
        </div>
      )}
    </div>
  );
}
