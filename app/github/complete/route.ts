import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import getAccessToken from "../getAccessToken";
import getGithubEmail from "../getGithubEmail";
import getGithubProfile from "../getGithubProfile";
import UpdateSession from "@/lib/session/updateSession";
import isExistUsername from "../isExistUsername";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  console.log("Received GitHub code:", code);

  if (!code) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }

  const { error, access_token } = await getAccessToken(code);
  console.log("getAccessToken result:", { error, access_token });

  if (error) {
    console.error("GitHub 인증 오류:", error);
    return NextResponse.json(
      { error: "GitHub 인증 오류", details: error },
      { status: 400 }
    );
  }

  const { id, name, profile_photo } = await getGithubProfile(access_token);

  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await UpdateSession(user.id);
    return NextResponse.redirect(new URL("/products", request.url));
  }

  const email = await getGithubEmail(access_token);
  const isExist = await isExistUsername(name);

  const newUser = await db.user.create({
    data: {
      github_id: id + "",
      username: isExist ? `${name}-gh` : name,
      avatar: profile_photo,
      email: email,
    },
    select: {
      id: true,
    },
  });

  await UpdateSession(newUser.id);
  return NextResponse.redirect(new URL("/products", request.url));
}
