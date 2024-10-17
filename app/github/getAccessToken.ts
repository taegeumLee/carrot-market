export default async function getAccessToken(code: string) {
  let accessTokenURL = "https://github.com/login/oauth/access_token";

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET_KEY!,
    code: code,
  }).toString();

  accessTokenURL = `${accessTokenURL}?${accessTokenParams}`;

  const { error, access_token } = await (
    await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  return { error, access_token };
}
