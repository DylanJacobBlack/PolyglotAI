import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import AuthContext from "store/auth-context";
import LangContext from "store/lang-context";

import LessonCard from "components/Lesson/LessonCard";
import loadingSpinner from "../assets/spinner.jpg";
import Image from "next/image";

interface Lesson {
  id: string;
  title: string;
  level: number;
  text: string;
}

const Lessons = () => {
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  const langCtx = useContext(LangContext);

  useEffect(() => {
    langCtx.enable();
  }, [langCtx]);

  useEffect(() => {
    if (langCtx.language !== null) {
      (async function () {
        try {
          setIsLoading(true);
          setError('');
          const response = await fetch("http://localhost:3000/api/v1/lessons");

          if (!response.ok) {
            throw new Error("Something went wrong.");
          }
          const lessonData = await response.json();
          // const filteredLessons = data.lessons.filter(
          //   (lesson: Lesson) => lesson.language.name === langCtx.language
          // );
          setLessons(lessonData);
        } catch (error: any) {
          setError(error.message);
        }
        setIsLoading(false);
      })();
    } else router.push("/");
  }, [langCtx.language, router]);

  let status = "";

  if (error.length) {
    status = error;
  }

  return (
    <div className="min-h-screen min-w-full bg-white flex justify-center items-center">
      {isLoading && (
        <div className="">
          Loading...
          {/* <Image
            className="spinner"
            src={loadingSpinner}
            alt="Loading spinner"
          /> */}
        </div>
      )}
      {status !== "" && (
        <div className="">
          <div className="">
            <h1>{status}</h1>
          </div>
        </div>
      )}
      <div className="flex flex-wrap row gap-4 h-3/4 w-3/4">
        {!isLoading &&
          // langCtx.language !== null &&
          lessons.length > 0 &&
          lessons.map((lesson: Lesson) => (
            <LessonCard
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              text={lesson.text}
              level={lesson.level}
              // url={lesson.url}
            />
          ))}
      </div>
    </div>
  );
};

export default Lessons;
