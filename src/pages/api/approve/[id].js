import { PrismaClient } from "@prisma/client";
import { createDepositAccount } from "api/createDepositAccount";
import { encryptPayDistributionConfig } from "api/encryptPayDistributionConfig";

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "Not Found" });
  }

  try {
    const depositAccount = await createDepositAccount();
    const { routingNumber, accountNumber } = depositAccount.attributes;

    const config = {
      bank_account: {
        bank_name: "Finance Now",
        routing_number: routingNumber,
        account_number: accountNumber,
        account_type: "checking",
      },
      amount_allocation: {
        value: "32.57",
        min_value: "32.57",
        max_value: "32.57",
      },
      allow_editing: false,
    };

    const encryptedPd = await encryptPayDistributionConfig(config);

    const result = await prisma.account.update({
      where: {
        id: req.query.id,
      },
      data: {
        pd: encryptedPd,
        deposit: {
          create: {
            id: depositAccount.id,
            routingNumber: routingNumber,
            accountNumber: accountNumber,
          },
        },
      },
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error });
  }
}

export default handler;
