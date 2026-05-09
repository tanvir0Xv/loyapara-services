import { collectionName } from "@/lib/CollectionName/CollectionName";
import dbConnect from "@/lib/MongoDB/mongodb";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: any) {
  try {
    // ১. URL থেকে Query Parameters (category এবং search) বের করা
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const searchTerm = searchParams.get("search"); // আপনি চাইলে 'query' ও ব্যবহার করতে পারেন

    // ২. ডেটাবেস কানেকশন
    const collection = await dbConnect(collectionName.ALL as string);

    // ৩. ডাইনামিক MongoDB কুয়েরি অবজেক্ট তৈরি
    const dbQuery: Record<string, any> = {};

    // যদি URL-এ category থাকে, তাহলে কুয়েরিতে তা যোগ করা হবে
    if (category) {
      dbQuery.category = category;
    }

    // যদি search term থাকে, তাহলে বিভিন্ন ফিল্ডের উপর রেগুলার এক্সপ্রেশন (Regex) দিয়ে সার্চ হবে
    if (searchTerm) {
      // $or মানে হলো নিচের যেকোনো একটি ফিল্ডের সাথে মিললেই ডেটা রিটার্ন করবে
      dbQuery.$or = [
        { name: { $regex: searchTerm, $options: "i" } }, // নামের মধ্যে খুঁজবে
        { phone: { $regex: searchTerm, $options: "i" } }, // ফোন নাম্বারে খুঁজবে
        { category: { $regex: searchTerm, $options: "i" } }, // ক্যাটাগরিতে খুঁজবে
        { nickName: { $regex: searchTerm, $options: "i" } }, // ডাকনামে খুঁজবে
        { speciality: { $regex: searchTerm, $options: "i" } }, // স্পেশালিটির মধ্যে খুঁজবে
        { location: { $regex: searchTerm, $options: "i" } } // ঠিকানায় খুঁজবে
      ];
    }

    // ৪. তৈরিকৃত কুয়েরি (dbQuery) এর উপর ভিত্তি করে ডেটা ফেচ করা
    const data = await collection.find(dbQuery).toArray();

    // ৫. ডেটা রিটার্ন করা
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { category } = data;

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // ক্যাটাগরি অনুযায়ী কালেকশন ম্যাপ
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

    const targetCollectionName = categoryToCollection[category];

    if (!targetCollectionName) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // ১. স্পেসিফিক কালেকশনে সেভ করা
    const specificCollection = await dbConnect(targetCollectionName as string);
    const result = await specificCollection.insertOne({
      ...data,
      createdAt: new Date(),
    });

    // ২. 'all' কালেকশনেও সেভ করা (সার্চের সুবিধার জন্য)
    const allCollection = await dbConnect(collectionName.ALL as string);
    await allCollection.insertOne({
      ...data,
      specificId: result.insertedId,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });

  } catch (error: any) {
    console.error("Post Error:", error);
    return NextResponse.json(
      { error: "Failed to save data" }, 
      { status: 500 }
    );
  }
}