import { NextResponse } from "next/server";
import dbConnect from "@/lib/MongoDB/mongodb";
import { collectionName } from "@/lib/CollectionName/CollectionName";

type ClaimRequestBody = {
  postId: string;
  claimerName: string;
  claimerPhone: string;
  claimerAddress: string;
  claimDetails: string;
  proofText: string;
};

export async function GET() {
  const collection = await dbConnect(collectionName.CLAIMS);
  const claims = await collection.find({}).sort({ _id: -1 }).toArray();
  return NextResponse.json({ message: "success", data: claims });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ClaimRequestBody;
    if (!body.postId || !body.claimerName || !body.claimerPhone) {
      return NextResponse.json(
        { message: "Required fields missing!" },
        { status: 400 },
      );
    }

    const claim = {
      postId: body.postId,
      claimerName: body.claimerName,
      claimerPhone: body.claimerPhone,
      claimerAddress: body.claimerAddress || "",
      claimDetails: body.claimDetails || "",
      proofText: body.proofText || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const collection = await dbConnect(collectionName.CLAIMS);
    await collection.insertOne(claim);
    return NextResponse.json(
      { message: "Claim submitted successfully!" },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 },
    );
  }
}
