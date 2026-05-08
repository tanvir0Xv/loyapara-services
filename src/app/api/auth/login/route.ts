import { NextResponse } from "next/server";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/session";

type LoginBody = {
  phoneNumber?: string;
  password?: string;
};

export async function POST(request: Request) {
  const secret = process.env.AUTH_SECRET;
  const adminPhone = process.env.ADMIN_PHONE;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!secret || !adminPhone || !adminPassword) {
    return NextResponse.json(
      { message: "Auth environment is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as LoginBody;
    const phone = body.phoneNumber?.trim();
    const password = body.password?.trim();

    if (!phone || !password) {
      return NextResponse.json({ message: "Phone and password are required." }, { status: 400 });
    }

    if (phone !== adminPhone || password !== adminPassword) {
      return NextResponse.json({ message: "Invalid phone or password." }, { status: 401 });
    }

    const token = await createSessionToken(phone, secret);
    const response = NextResponse.json({ message: "Login successful." });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }
}
