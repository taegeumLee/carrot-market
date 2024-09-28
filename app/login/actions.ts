"use server";

export const handleForm = async (prevState: any, data: FormData) => {
  console.log(data.get("email"), data.get("password"));
  return {
    errors: ["wrong email or password", "password is too short"],
  };
};
