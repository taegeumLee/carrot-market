import axios from "axios";

export default async function getAccessToken(code: string) {
  console.log("Requesting access token with code:", code);

  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log("GitHub API 응답:", response.data);

    if (response.data.error) {
      console.error("GitHub OAuth 오류:", response.data);
      return {
        error:
          response.data.error_description || "알 수 없는 오류가 발생했습니다.",
      };
    }

    return { access_token: response.data.access_token };
  } catch (error) {
    console.error("Error requesting GitHub access token:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error response:", error.response.data);
    }
    return { error: "서버 오류가 발생했습니다." };
  }
}
