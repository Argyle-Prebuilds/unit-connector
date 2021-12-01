import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Not Found" });
  }

  const { id, token } = req.body;

  try {
    const result = await prisma.user.create({
      data: {
        id: id,
        token: token,
      },
    });

    console.log("created user: ", result);

    res.json(result);
  } catch (error) {
    res.status(400).json({ error });
  }
}

export default handler;
