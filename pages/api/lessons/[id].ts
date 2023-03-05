import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Lesson } from "types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ lesson: Lesson }>
) {
  console.log('test')
  if (req.method === "GET") {
    const lessonId = req.query.id as string;

    let lesson;
    if (lessonId) {
      lesson = (await prisma.lesson.findUnique({
        where: { id: lessonId },
      }));
      if (lesson) {
        res.status(200).json({ lesson });
      }
    }
  }
}
