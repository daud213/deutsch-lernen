import Link from 'next/link';

type DailyProgressProps = {
  xp: number;
  streak: number;
  reviewsDueCount: number;
};

export default function DailyProgress({ xp, streak, reviewsDueCount }: DailyProgressProps) {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Today&apos;s Progress</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-500">{streak}</p>
          <p className="text-xs text-gray-500 mt-1">🔥 Day Streak</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-500">{xp}</p>
          <p className="text-xs text-gray-500 mt-1">⭐ Total XP</p>
        </div>
      </div>

      {reviewsDueCount > 0 ? (
        <Link
          href="/learn"
          className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Start Review &middot; {reviewsDueCount} card{reviewsDueCount !== 1 ? 's' : ''} due
        </Link>
      ) : (
        <div className="w-full text-center bg-green-50 text-green-600 font-semibold py-3 rounded-xl">
          All caught up for today! ✅
        </div>
      )}
    </div>
  );
}
