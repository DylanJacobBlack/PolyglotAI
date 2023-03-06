import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { PrismaClient } from "@prisma/client";
import AuthContext from "store/auth-context";
import LangContext from "store/lang-context";

import LessonCard from "components/Lesson/LessonCard";
// import loadingSpinner from "../assets/spinner.jpg";
import Image from "next/image";
import { Lesson } from "types";

interface LessonsProps {
  lessons: Array<Lesson>;
}

const Lessons = ({ lessons }: LessonsProps) => {
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const langCtx = useContext(LangContext);

  useEffect(() => {
    langCtx.enable();
  }, [langCtx]);

  // useEffect(() => {
  //   if (langCtx.language !== null) {
  //     (async function () {
  //       try {
  //         setIsLoading(true);
  //         setError("");
  //         const response = await fetch("http://localhost:3000/api/v1/lessons");

  //         if (!response.ok) {
  //           throw new Error("Something went wrong.");
  //         }
  //         const lessonData = await response.json();
  //         // const filteredLessons = data.lessons.filter(
  //         //   (lesson: Lesson) => lesson.language.name === langCtx.language
  //         // );
  //         setLessons(lessonData);
  //       } catch (error: any) {
  //         setError(error.message);
  //       }
  //       setIsLoading(false);
  //     })();
  //   } else router.push("/");
  // }, [langCtx.language, router]);

  return (
    <div className="min-w-full p-10 bg-white flex justify-center items-center">
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
        {lessons.length > 0 &&
          lessons.map((lesson: Lesson) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              text={lesson.text}
              level={lesson.level}
              imageId={lesson.imageId}
            />
          ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const prisma = new PrismaClient();
  const lessons = await prisma.lesson.findMany();
  return {
    props: {
      lessons,
    },
  };
}

export default Lessons;
