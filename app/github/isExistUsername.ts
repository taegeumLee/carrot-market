import PrismaDB from "@/lib/db";

export default async function isExistUsername(
  username: string
): Promise<boolean> {
  const user = await PrismaDB.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
}
