import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "Not Found" });
  }

  const { id } = req.query;

  try {
    const account = await prisma.account.findUnique({
      where: {
        id: id,
      },
    });

    res.json(account);
  } catch (error) {
    res.status(400).json({ error });
  }
}

export default handler;
