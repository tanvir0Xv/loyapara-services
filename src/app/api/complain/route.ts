import { collectionName } from "./../../../lib/CollectionName/CollectionName";
import dbConnect from "@/lib/MongoDB/mongodb";
import { NextResponse } from "next/server";

type ComplainData = {
  accusedName: string;
  complaintType: string;
  message: string;
};

export async function GET() {
  try {
    const collection = await dbConnect(collectionName.COMPLAIN);
    const result = await collection.find({}).sort({ _id: -1 }).toArray();

    return NextResponse.json(
      {
        message: "success",
        data: result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message: "failed",
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: ComplainData = await request.json();
    if (!body.accusedName || !body.complaintType || !body.message) {
      return NextResponse.json(
        { error: "accusedName, complaintType and message are required" },
        { status: 400 },
      );
    }

    const dbCollection = await dbConnect(collectionName.COMPLAIN);
    const result = await dbCollection.insertOne(body);

    return NextResponse.json(
      {
        message: "Complaint received successfully!",
        data: result,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON or request" },
      { status: 400 },
    );
  }
}
