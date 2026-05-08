import { NextResponse } from "next/server";
import dbConnect from "@/lib/MongoDB/mongodb";
import { collectionName } from "@/lib/CollectionName/CollectionName";

type LostFoundBody = {
  type: "lost" | "found";
  title: string;
  location: string;
  date: string;
  description?: string;
  image?: string;
};

export async function GET() {
  const collection = await dbConnect(collectionName.LOST_FOUND);
  const data = await collection.find({}).sort({ _id: -1 }).toArray();
  return NextResponse.json({ message: "success", data });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LostFoundBody;
    if (!body.title || !body.location || !body.date || !body.type) {
      return NextResponse.json({ message: "Required fields are missing." }, { status: 400 });
    }

    const payload = {
      type: body.type,
      title: body.title,
      location: body.location,
      date: body.date,
      description: body.description || "",
      image: body.image || "",
      status: "active",
      createdAt: new Date().toISOString(),
    };

    const collection = await dbConnect(collectionName.LOST_FOUND);
    const result = await collection.insertOne(payload);
    return NextResponse.json({ message: "Created successfully.", data: result }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
