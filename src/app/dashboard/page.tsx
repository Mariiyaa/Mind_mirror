"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Entry {
  _id?: string;
  date: string;
  wentWell: string;
  couldBeBetter: string;
  feeling: string;
  mood: string;
}

export default function Dashboard() {
  const [entry, setEntry] = useState<Entry>({
    date: new Date().toISOString().slice(0, 10),
    wentWell: "",
    couldBeBetter: "",
    feeling: "",
    mood: "neutral",
  });

  const [entries, setEntries] = useState<Entry[]>([]);
  const [userId, setUserId] = useState<string>("");

  const router = useRouter();

  async function fetchEntries(uid: string) {
    fetch(`/api/journal?userId=${uid}`)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setEntries(data);
      } else {
        console.error("API error:", data);
        setEntries([]);
      }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decoded: any = JSON.parse(atob(token!.split(".")[1]));
    const res = await fetch("/api/journal", {
      method: "POST",
      body: JSON.stringify({ ...entry, userId: decoded.id }),
    });

    if (res.ok) {
      fetchEntries(userId);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const decoded: any = JSON.parse(atob(token.split(".")[1]));
  const uid = decoded.id;
  setUserId(uid);

    fetchEntries(uid);
  }, []);

  return (
    <main className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Daily Journal</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <textarea
          placeholder="What went well today?"
          value={entry.wentWell}
          onChange={(e) => setEntry({ ...entry, wentWell: e.target.value })}
          className="border p-2 rounded-md"
        />
        <textarea
          placeholder="What could have gone better?"
          value={entry.couldBeBetter}
          onChange={(e) => setEntry({ ...entry, couldBeBetter: e.target.value })}
          className="border p-2 rounded-md"
        />
        <textarea
          placeholder="How are you feeling?"
          value={entry.feeling}
          onChange={(e) => setEntry({ ...entry, feeling: e.target.value })}
          className="border p-2 rounded-md"
        />
        <select
          value={entry.mood}
          onChange={(e) => setEntry({ ...entry, mood: e.target.value })}
          className="border p-2 rounded-md"
        >
          <option className="text-black" value="happy">😊 Happy</option>
          <option className="text-black" value="neutral">😐 Neutral</option>
          <option className="text-black" value="sad">😢 Sad</option>
        </select>
        <button type="submit" className="bg-[#F59E0B] text-white px-4 py-2 rounded">
          Save Entry
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Previous Entries</h2>
      <ul className="space-y-4">
        {entries.map((e) => (
          <li key={e._id} className="border p-4 rounded-md">
            <p><strong>Date:</strong> {new Date(e.date).toDateString()}</p>
            <p><strong>Mood:</strong> {e.mood}</p>
            <p><strong>Feeling:</strong> {e.feeling}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
