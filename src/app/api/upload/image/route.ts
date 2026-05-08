import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "IMGBB_API_KEY is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Image file is required." }, { status: 400 });
  }

  const imgbbData = new FormData();
  imgbbData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: imgbbData,
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Image upload failed." }, { status: 502 });
  }

  const payload = (await response.json()) as {
    success?: boolean;
    data?: { url?: string };
  };

  if (!payload.success || !payload.data?.url) {
    return NextResponse.json({ message: "Image upload failed." }, { status: 502 });
  }

  return NextResponse.json({ imageUrl: payload.data.url });
}
