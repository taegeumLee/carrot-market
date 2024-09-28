"use server";

export const handleForm = async (data: FormData) => {
  console.log(data.get("email"), data.get("password"));
  return {
    error: "wrong email or password",
  };
};
