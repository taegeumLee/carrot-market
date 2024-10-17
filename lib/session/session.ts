import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "user",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export default getSession;
