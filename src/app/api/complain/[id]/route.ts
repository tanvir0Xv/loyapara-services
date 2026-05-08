import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/MongoDB/mongodb";
import { collectionName } from "@/lib/CollectionName/CollectionName";

type ComplainUpdateBody = {
  accusedName?: string;
  complaintType?: string;
  message?: string;
};

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Params) {
  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid complain id." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as ComplainUpdateBody;
    const updatePayload: ComplainUpdateBody = {};
    if (body.accusedName !== undefined) updatePayload.accusedName = body.accusedName;
    if (body.complaintType !== undefined) updatePayload.complaintType = body.complaintType;
    if (body.message !== undefined) updatePayload.message = body.message;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ message: "No fields to update." }, { status: 400 });
    }

    const collection = await dbConnect(collectionName.COMPLAIN);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatePayload },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Complain not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Complain updated successfully." });
  } catch {
    return NextResponse.json({ message: "Failed to update complain." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Params) {
  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid complain id." }, { status: 400 });
  }

  const collection = await dbConnect(collectionName.COMPLAIN);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "Complain not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "Complain deleted successfully." });
}
