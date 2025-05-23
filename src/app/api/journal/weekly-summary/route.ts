import Entry from "@/src/models/Entry";
import { connectDB } from "@/src/lib/mongodb";
import dayjs from "dayjs";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  const sevenDaysAgo = dayjs().subtract(6, "day").startOf("day").toDate();

  const entries = await Entry.find({
    userId,
    date: { $gte: sevenDaysAgo },
  });

  const moodCounts: Record<string, number> = {};
  entries.forEach((entry) => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });

  const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return Response.json({
    total: entries.length,
    moodCounts,
    mostFrequentMood,
  });
}
