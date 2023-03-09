import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(400).json({
    error: "Not implemented",
  });
}
