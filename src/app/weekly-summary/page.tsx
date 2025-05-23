'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface Entry {
  date: string;
  mood: 'happy' | 'neutral' | 'sad';
}

export default function WeeklySummary() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    setUserId(decoded.id);
    fetch(`/api/journal?userId=${decoded.id}`)
      .then((res) => res.json())
      .then((data) => {
        const pastWeek = data
          .filter((entry: Entry) => {
            const entryDate = new Date(entry.date);
            const today = new Date();
            const diffDays = (today.getTime() - entryDate.getTime()) / (1000 * 3600 * 24);
            return diffDays <= 7;
          })
          .sort((a: Entry, b: Entry) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setEntries(pastWeek);
      });
  }, []);

  const moodMap = { happy: 2, neutral: 1, sad: 0 };
  const moodLabelMap = ['😢 Sad', '😐 Neutral', '😊 Happy'];

  const chartData = {
    labels: entries.map((e) => new Date(e.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood Level',
        data: entries.map((e) => moodMap[e.mood]),
        fill: false,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const moodCounts = entries.reduce(
    (acc, entry) => {
      acc[entry.mood]++;
      return acc;
    },
    { happy: 0, neutral: 0, sad: 0 }
  );

  const chartOptions = {
    scales: {
      y: {
        ticks: {
          callback: function (tickValue: string | number) {
            if (typeof tickValue === 'number') {
              return moodLabelMap[tickValue] || '';
            }
            return '';
          },
          stepSize: 1,
          min: 0,
          max: 2,
        },
      },
    },
  };

  return (
    <main className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">🧠 Weekly Mood Summary</h1>

      {entries.length === 0 ? (
        <p className="text-gray-500">No entries found in the past 7 days.</p>
      ) : (
        <>
          <Line data={chartData} options={chartOptions} />

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-100 p-4 rounded">
              <p className="text-lg font-semibold text-black">😊 Happy</p>
              <p className='text-black'>{moodCounts.happy} day(s)</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <p className="text-lg font-semibold text-black">😐 Neutral</p>
              <p className='text-black'>{moodCounts.neutral} day(s)</p>
            </div>
            <div className="bg-red-100 p-4 rounded">
              <p className="text-lg font-semibold text-black">😢 Sad</p>
              <p className='text-black'>{moodCounts.sad} day(s)</p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
