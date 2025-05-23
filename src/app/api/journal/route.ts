import Entry from "@/src/models/Entry";
import { connectDB } from "@/src/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  const body = await req.json();
  await connectDB();
  const entry = await Entry.create(body);
  return NextResponse.json(entry);
}

export async function GET(req: NextRequest) {
  await connectDB();
  
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId || !Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
  }

  const entries = await Entry.find({ userId: new Types.ObjectId(userId) }).sort({ date: -1 });
  return NextResponse.json(entries);
}
