const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  // 먼저 사용자 생성
  const user = await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      // 필요한 다른 필드들 추가
    },
  });

  // 생성된 사용자의 ID를 사용하여 제품 생성
  for (let i = 0; i < 100; i++) {
    await prisma.product.create({
      data: {
        price: +faker.commerce.price({ min: 10000, max: 1000000 }),
        description: faker.commerce.productDescription(),
        title: faker.commerce.productName(),
        photos: faker.image.url(),
        userId: user.id,
      },
    });
  }

  await prisma.$disconnect();
})().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
