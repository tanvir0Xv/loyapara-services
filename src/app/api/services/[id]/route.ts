import { collectionName } from "@/lib/CollectionName/CollectionName";
import dbConnect from "@/lib/MongoDB/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ভুল ID ফরম্যাট প্রদান করা হয়েছে" },
        { status: 400 },
      );
    }

    const collection = await dbConnect(collectionName.ALL as string);
    const data = await collection.findOne({ _id: new ObjectId(id) });

    if (!data) {
      return NextResponse.json(
        { error: "কোনো ডেটা পাওয়া যায়নি" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Fetch Single Data Error:", error);
    return NextResponse.json(
      { error: "ডেটা লোড করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const allCollection = await dbConnect(collectionName.ALL as string);
    const existingData = await allCollection.findOne({ _id: new ObjectId(id) });

    if (!existingData) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    // ১. 'all' কালেকশনে আপডেট করা
    await allCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    // ২. স্পেসিফিক কালেকশনে আপডেট করা
    const categoryToCollection: Record<string, collectionName> = {
      "রাজমিস্ত্রি": collectionName.RAJMISTRI,
      "ওয়েল্ডিং মিস্ত্রি": collectionName.WELDING,
      "পাইপ ফিটিং (প্লাম্বার)": collectionName.PLAMBAR,
      "গরুর ডাক্তার (পশু চিকিৎসক)": collectionName.COWDOCTOR,
      "মাস্টার / গৃহশিক্ষক": collectionName.TEACHER,
      "হোমিও ডাক্তার": collectionName.HOMEOPATHICDOCTOR,
      "ভ্যান ও অটো সার্ভিস": collectionName.VANANDAUTO,
      "ইলেকট্রিশিয়ান": collectionName.ELECTRICAN,
      "ইলেকট্রনিক্স মেকার": collectionName.ELECTRONICS,
      "মোটরসাইকেল মেকার": collectionName.MOTORCYCLEMECHANIC,
      "মেশিন ও হালের মেকার": collectionName.POWERTILLERMECHANIC,
      "ভ্যান ও সাইকেল মেকার": collectionName.VANCYCLEMECHANIC,
      "খেজুরের রস": collectionName.DATEJUICE,
      "কৃষি শ্রমিক": collectionName.FARMER,
      "কৃষক / কৃষি উদ্যোক্তা": collectionName.HOUSEHOLDER,
      "দর্জি / টেইলার্স": collectionName.TAILOR,
    };

    const targetCollectionName = categoryToCollection[existingData.category];
    if (targetCollectionName && existingData.specificId) {
      const specificCollection = await dbConnect(targetCollectionName as string);
      await specificCollection.updateOne(
        { _id: new ObjectId(existingData.specificId) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const allCollection = await dbConnect(collectionName.ALL as string);
    const existingData = await allCollection.findOne({ _id: new ObjectId(id) });

    if (!existingData) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    // ১. 'all' কালেকশন থেকে ডিলিট করা
    await allCollection.deleteOne({ _id: new ObjectId(id) });

    // ২. স্পেসিফিক কালেকশন থেকে ডিলিট করা
    const categoryToCollection: Record<string, collectionName> = {
      "রাজমিস্ত্রি": collectionName.RAJMISTRI,
      "ওয়েল্ডিং মিস্ত্রি": collectionName.WELDING,
      "পাইপ ফিটিং (প্লাম্বার)": collectionName.PLAMBAR,
      "গরুর ডাক্তার (পশু চিকিৎসক)": collectionName.COWDOCTOR,
      "মাস্টার / গৃহশিক্ষক": collectionName.TEACHER,
      "হোমিও ডাক্তার": collectionName.HOMEOPATHICDOCTOR,
      "ভ্যান ও অটো সার্ভিস": collectionName.VANANDAUTO,
      "ইলেকট্রিশিয়ান": collectionName.ELECTRICAN,
      "ইলেকট্রনিক্স মেকার": collectionName.ELECTRONICS,
      "মোটরসাইকেল মেকার": collectionName.MOTORCYCLEMECHANIC,
      "মেশিন ও হালের মেকার": collectionName.POWERTILLERMECHANIC,
      "ভ্যান ও সাইকেল মেকার": collectionName.VANCYCLEMECHANIC,
      "খেজুরের রস": collectionName.DATEJUICE,
      "কৃষি শ্রমিক": collectionName.FARMER,
      "কৃষক / কৃষি উদ্যোক্তা": collectionName.HOUSEHOLDER,
      "দর্জি / টেইলার্স": collectionName.TAILOR,
    };

    const targetCollectionName = categoryToCollection[existingData.category];
    if (targetCollectionName && existingData.specificId) {
      const specificCollection = await dbConnect(targetCollectionName as string);
      await specificCollection.deleteOne({ _id: new ObjectId(existingData.specificId) });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}