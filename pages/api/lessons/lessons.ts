import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Lesson } from "types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Lesson>>
) {
  if (req.method === "GET") {
    const lessons: Array<Lesson> = await prisma.lesson.findMany();
    res.status(200).json(lessons)
  }
}
