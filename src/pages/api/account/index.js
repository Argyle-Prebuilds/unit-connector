import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Not Found" });
  }

  const { id, userId, linkItemId } = req.body;

  try {
    const result = await prisma.account.create({
      data: {
        id: id,
        userId: userId,
        linkItemId: linkItemId,
      },
    });

    console.log("created account: ", result);

    res.json(result);
  } catch (error) {
    res.status(400).json({ error });
  }
}

export default handler;
