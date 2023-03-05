// import { Image, Transformation } from "cloudinary-react";

import { Lesson } from "types";
import Link from "next/link";

const LessonCard = ({ id, title, level, text }: Lesson) => {
  const truncatedText = () => {
    if (text?.length > 500) {
      return `${text.substr(0, text.lastIndexOf(" ", 500))}...`;
    }
    return text;
  };

  const getLevel = (level: number) => {
    if (level === 1) {
      return "Newbie";
    }
    if (level === 2) {
      return "Beginner";
    }
    if (level === 3) {
      return "Intermediate";
    }
    if (level === 4) {
      return "Proficient";
    }
    if (level === 5) {
      return "Advanced";
    }
    if (level === 6) {
      return "Fluent";
    }
  };

  // const preparedUrl = url.match(
  //   /(?!\/)[^/]*(?=\.jpg|.jpeg|.png|.gif|.svg|.tiff)/g
  // )[0];

  return (
    <div className="flex flex-col bg-gray-200 p-3 rounded-lg">
      {/* <Link to={`/lessons/${id}`}>
      <div>
        <Image publicId={preparedUrl} alt="lesson image">
            <Transformation height="195" width="163" crop="fill" />
          </Image>
      </div>
      </Link> */}
      <Link href={`/lessons/${id}`}>
        <div className="">
          <h3 className="">{title}</h3>
          {/* <p className="">{text}</p> */}
        </div>
      </Link>
      <h3 className="">{getLevel(level)}</h3>
    </div>
  );
};

export default LessonCard;
