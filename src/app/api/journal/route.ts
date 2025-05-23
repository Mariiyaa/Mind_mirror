import Entry from "@/src/models/Entry";
import { connectDB } from "@/src/lib/mongodb";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const entry = await Entry.create(body);
  return Response.json(entry);
}

export async function GET(req: NextRequest) {
  await connectDB();
  const userId = req.nextUrl.searchParams.get("userId");
  const entries = await Entry.find({ userId }).sort({ date: -1 });
  return Response.json(entries);
}
