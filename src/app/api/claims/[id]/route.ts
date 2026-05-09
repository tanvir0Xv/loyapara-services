import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/MongoDB/mongodb";
import { collectionName } from "@/lib/CollectionName/CollectionName";

type UpdateClaimBody = {
  status: "pending" | "verified" | "rejected";
};

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: Params) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid claim id." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as UpdateClaimBody;
    const collection = await dbConnect(collectionName.CLAIMS);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: body.status } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Claim not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Claim status updated" });
  } catch {
    return NextResponse.json(
      { message: "Failed to update claim" },
      { status: 400 },
    );
  }
}
