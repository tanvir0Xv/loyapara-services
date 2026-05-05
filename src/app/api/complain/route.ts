import { collectionName } from "./../../../lib/CollectionName/CollectionName";
import dbConnect from "@/lib/MongoDB/mongodb";
import { Collection } from "mongodb";
import { NextResponse } from "next/server";

type ComplainData = {
  accusedName: string;
  complaintType: string;
  message: string;
};

export async function GET() {
  const collection = await dbConnect(collectionName.COMPLAIN);
  const result = await collection.find({}).toArray();
  try {
    return NextResponse.json(
      {
        message: "success",
        data: result,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "failed",
        error: error.message,
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

    const dbCollection = await dbConnect(collectionName.COMPLAIN);
    const result = await dbCollection.insertOne(body);

    return NextResponse.json(
      {
        message: "Complaint received successfully!",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON or request" },
      { status: 400 },
    );
  }
}
