import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultResponse } from "src/types/shared";

import RouteHandler from "@Lib/RouteHandler";
import prisma from "@Lib/prisma";

async function PostCurrencyRoute(
  req: NextApiRequest,
  res: NextApiResponse<DefaultResponse>,
  next: Function
) {
  const { CRON_ACTION_KEY } = process.env;
  const authToken = req.headers.authorization?.split(" ")[1];

  if (CRON_ACTION_KEY != authToken) {
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized Request" });
  }

  const rates: Record<string, number> = await fetch(
    "https://open.er-api.com/v6/latest/USD"
  )
    .then((res) => res.json())
    .then((res) => res.rates);

  await prisma.$transaction([
    prisma.currencyRate.deleteMany(),
    prisma.currencyRate.createMany({
      data: Object.entries(rates).map(([key, value]) => ({
        symbol: key,
        rate: value,
      })),
    }),
  ]);
  res.json({ message: "Successfully Updated Currencies" });
}

export default RouteHandler().post(PostCurrencyRoute);
