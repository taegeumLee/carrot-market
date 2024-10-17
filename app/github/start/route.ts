import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const BASE_URL = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
  };
  const formattedParams = new URLSearchParams(params).toString();
  const finalURL = `${BASE_URL}?${formattedParams}`;
  return redirect(finalURL);
}
