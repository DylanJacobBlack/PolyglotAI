import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
  MutableRefObject,
} from "react";
import {
  useResizeDetector,
} from "react-resize-detector";

import classes from "./LessonDisplay.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
// import Definition from "./Definition";
// import LangContext from "../../store/lang-context";

const pagePaddingLeft = 60;
const pagePaddingRight = 60;
const pagePaddingTop = 48;
const pagePaddingBottom = 48;
const approxWordsPerPage = 200;
const lineHeight = 33;
interface LessonDisplayInterface {
  text: string;
  isLoading: boolean;
  status: string;
}

const LessonDisplay = ({ text, isLoading, status }: LessonDisplayInterface) => {
  console.log(text)
  // const langCtx = useContext(LangContext);

  const [lessonPages, setLessonPages] = useState<JSX.Element[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [modalSwitch, setModalSwitch] = useState(false);
  const [topClick, setTopClick] = useState(false);
  const [translation, setTranslation] = useState({
    phrase: "",
    translation: "",
  });
  const [defIsLoading, setDefIsLoading] = useState(false);

  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;

  // const wordHandler = useCallback(
  //   (event: MouseEvent) => {
  //     setModalSwitch(true);
  //     if (event.clientY < (window.innerHeight - 30) / 2) {
  //       setTopClick(true);
  //     } else {
  //       setTopClick(false);
  //     }
  //     setDefIsLoading(true);
  //     const phrase =  event.target.textContent
  //       .trim()
  //       .replace(/[,./?;':~&%$#@*^|]/g, "");
  //     (async function () {
  //       const response = await fetch(
  //         "https://definiens-api.herokuapp.com/word",
  //         {
  //           method: "POST",
  //           body: JSON.stringify({
  //             text: phrase,
  //             // language: langCtx.language,
  //           }),
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );
  //       const data = await response.json();
  //       setTranslation({ phrase: phrase, translation: data.translation });
  //       setDefIsLoading(false);
  //     })();
  //   },
  //   [langCtx.language]
  // );

  useEffect(() => {
    if (!lessonPages) return;
    const handleKeyDown = (event: any) => {
      if (event.code === "ArrowLeft" && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
      if (event.code === "ArrowRight" && currentPage < lessonPages.length - 1) {
        setCurrentPage(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, lessonPages]);

  console.log(currentPage)

  const onResize = useCallback(
    (width?: number, height?: number) => {
      if (isLoading === false && status === "" && width && height && text) {
        const pages = [];

        let maxWidth = 300;
        let columnHeight = 200;
        if (height - pagePaddingTop - pagePaddingBottom > 200)
          columnHeight = height - pagePaddingTop - pagePaddingBottom;
        if (width - pagePaddingLeft - pagePaddingRight > 300)
          maxWidth = width - pagePaddingLeft - pagePaddingRight;

        const maxLinesPerPage = Math.round(columnHeight / lineHeight) - 2;
        const x = pagePaddingLeft;
        const y = lineHeight;

        // # words that have been displayed
        //(used when ordering a new page of words)
        let wordCount = 0;

        const canvas: any = canvasRef.current;
        const context =
          canvas instanceof HTMLCanvasElement ? canvas.getContext("2d") : null;
        if (!context) return;

        context.font = "20px verdana";
        const textPara: Array<string | number> = [];
        // Pushing zeroes allows the textToLines function to detect page breaks
        text.split("\n").forEach((para) => {
          if (para) {
            textPara.push(para);
            textPara.push(0);
          } else textPara.push(0);
        });
        const textWords = textPara
          .map((para) => {
            if (typeof para !== "string") return 0;
            else return para.split(" ");
          })
          .flat();

        const getNextWords = (nextWordIndex: number) => {
          const words = textWords.slice(
            nextWordIndex,
            nextWordIndex + approxWordsPerPage
          );

          return words;
        };

        const textToLines = (
          words: Array<string | number>,
          maxWidth: number,
          maxLines: number,
          x: number,
          y: number
        ) => {
          const lines = [];

          while (words.length > 0 && lines.length <= maxLines) {
            let line = getLineOfText(words, maxWidth);
            words = words.splice(line.index + 1);
            lines.push(line);
            wordCount += line.index + 1;
          }

          return lines;
        };

        const getLineOfText = (
          words: Array<string | number>,
          maxWidth: number
        ) => {
          let line = "";
          let space = "";
          for (let i = 0; i < words.length; i++) {
            // Check if "word" value is 0. If it is, line break.
            if (words[i] === 0) {
              return { index: i, text: line + "\u00A0" };
            }
            let testWidth = context.measureText(line + " " + words[i]).width;
            // When tested width is greater than the maxwidth, return an index of one less
            if (testWidth > maxWidth) {
              return { index: i - 1, text: line };
            }
            line += space + words[i];
            space = " ";
          }
          return { index: words.length - 1, text: line };
        };

        const linesToLinks = (
          lines: Array<{ index: number; text: string }>
        ) => {
          const linesOfLinks: Array<Array<JSX.Element>> = [];
          let linkedLine: Array<JSX.Element> = [];
          lines.forEach((line) => {
            line.text.split(" ").forEach((linkedWord) => {
              linkedLine.push(
                <tspan
                  className={classes["linked-word"]}
                  // onClick={wordHandler}
                >{`${linkedWord} `}</tspan>
              );
            });
            linesOfLinks.push(linkedLine);
            linkedLine = [];
          });
          return linesOfLinks;
        };

        const drawSvg = (linesOfLinks: JSX.Element[][], x: any, i: number) => {
          const tspans: Array<JSX.Element> = [];
          linesOfLinks.forEach((line, index) => {
            const tspan = (
              <tspan
                key={`page${index}-line${line}`}
                x={x}
                dy={`${lineHeight}px`}
              >
                {line.map((linkedWord) => linkedWord)}
              </tspan>
            );
            tspans.push(tspan);
          });

          const sText = (
            <text fontFamily="verdana" fontSize="20px" fill="#000000">
              {tspans}
            </text>
          );

          return (
            <div
              className={classes.column}
              style={{ height: height, width: width }}
              key={`page${i}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={columnHeight}
                width={width}
              >
                {sText}
              </svg>
            </div>
          );
        };

        for (let i = 0; wordCount !== textWords.length; i++) {
          let lines = textToLines(
            getNextWords(wordCount),
            maxWidth,
            maxLinesPerPage,
            x,
            y
          );
          let linesOfLinks = linesToLinks(lines);
          pages.push(drawSvg(linesOfLinks, x, i));
        }

        let prevPageNum;
        const pageNum = pages.length;

        if (lessonPages) prevPageNum = lessonPages.length;
        setLessonPages(pages);
        if (prevPageNum && prevPageNum > 0) {
          const newPageNumber = Math.round(
            currentPage * (pageNum / prevPageNum)
          );
          if (newPageNumber > 0) setCurrentPage(newPageNumber);
        }
      }
    },
    [isLoading, status, text, currentPage, lessonPages]
  );

  const { ref } = useResizeDetector({ onResize });

  const pageBackHandler = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const pageForwardHandler = () => {
    if (currentPage < lessonPages.length - 1) setCurrentPage(currentPage + 1);
  };

  const onHideHandler = () => {
    setTranslation({ phrase: "", translation: "" });
    setModalSwitch(false);
  };

  return (
    <div className={classes.lesson}>
      <canvas ref={canvasRef} className={classes.canvas} />
      {/* {modalSwitch && (
        <Definition
          isLoading={defIsLoading}
          topClick={topClick}
          phrase={translation.phrase}
          translation={translation.translation}
          onHide={onHideHandler}
        />
      )} */}
      <button className={classes.button} onClick={() => pageBackHandler()}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <div className={classes.page} ref={ref}>
        {!isLoading &&
          status === "" &&
          lessonPages !== null &&
          lessonPages[currentPage]}
      </div>
      <button className={classes.button} onClick={() => pageForwardHandler()}>
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default React.memo(LessonDisplay);
