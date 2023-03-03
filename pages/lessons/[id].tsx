import { useState, useEffect, useContext } from "react";
// import { useParams } from "react-router-dom";

// import LangContext from "../store/lang-context";

import classes from "./Lesson.module.css";
import SideBar from "components/Lesson/SideBar";
import LessonDisplay from "components/Lesson/LessonDisplay";
// import loadingSpinner from "../assets/spinner.jpg"

const Lesson = () => {
  // const langCtx = useContext(LangContext);
  // const params = useParams();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   langCtx.disable();
  // }, [langCtx]);

  // useEffect(() => {
  //   async function fetchLessonData() {
  //     try {
  //       setIsLoading(true);
  //       setError(null);
  //       const response = await fetch(
  //         `http://localhost:3000/api/v1/lessons/${params.lessonId}`
  //       );

  //       if (!response.ok) {
  //         throw new Error("Something went wrong.");
  //       }
  //       const data = await response.json();
  //       setLesson(data);
  //     } catch (error) {
  //       // setError(error.message);
  //     }
  //     setIsLoading(false);
  //   }
  //   fetchLessonData();
  // }, [params.lessonId]);

  let status = "";

  if (lesson !== null) {
    status = "";
  }

  if (error) {
    status = error;
  }

  return (
    <div className={classes.lesson}>
      {/* {isLoading && (
        <div className="spinner-container">
          <img className="spinner" src={loadingSpinner} alt="Loading spinner" />
        </div>
      )} */}
      {status !== "" && <h1>{status}</h1>}
      {!isLoading && status === "" && (
        <SideBar
          // title={lesson.title}
          // url={lesson.url}
          isLoading={isLoading}
          status={status}
        />
      )}
      {!isLoading && status === "" && (
        <LessonDisplay
          // text={lesson.text}
          isLoading={isLoading}
          status={status}
        />
      )}
    </div>
  );
};

export default Lesson;
