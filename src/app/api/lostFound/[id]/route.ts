import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/MongoDB/mongodb";
import { collectionName } from "@/lib/CollectionName/CollectionName";

type Params = {
  params: Promise<{ id: string }>;
};

type LostFoundUpdate = {
  type?: "lost" | "found";
  title?: string;
  location?: string;
  date?: string;
  description?: string;
  image?: string;
  status?: "active" | "claimed";
};

export async function PATCH(request: Request, context: Params) {
  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid item id." }, { status: 400 });
  }

  try {
    const body = (await request.json()) as LostFoundUpdate;
    const updatePayload: LostFoundUpdate = {};
    if (body.type !== undefined) updatePayload.type = body.type;
    if (body.title !== undefined) updatePayload.title = body.title;
    if (body.location !== undefined) updatePayload.location = body.location;
    if (body.date !== undefined) updatePayload.date = body.date;
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.image !== undefined) updatePayload.image = body.image;
    if (body.status !== undefined) updatePayload.status = body.status;

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ message: "No fields to update." }, { status: 400 });
    }

    const collection = await dbConnect(collectionName.LOST_FOUND);
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatePayload });

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "LostFound item not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "LostFound updated successfully." });
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Params) {
  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid item id." }, { status: 400 });
  }

  const collection = await dbConnect(collectionName.LOST_FOUND);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ message: "LostFound item not found." }, { status: 404 });
  }

  return NextResponse.json({ message: "LostFound deleted successfully." });
}
