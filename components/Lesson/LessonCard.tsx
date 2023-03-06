// import { Image, Transformation } from "cloudinary-react";
import { CldImage } from "next-cloudinary";

import { Lesson } from "types";
import Link from "next/link";
import { Card } from "flowbite-react";

const LessonCard = ({ id, title, level, text, imageId }: Lesson) => {
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
    <div className="w-64">
      <Card className="backdrop-hue-rotate-180">
        <CldImage className="w-fill h-36 object-cover object-top" width="600" height="600" src={imageId} alt="My Image" />
        <div className="flex flex-col content-between gap-2 h-28">
          <Link href={`/lessons/${id}`}>
            <h3 className="text-l font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h3>
          </Link>
          <div className="flex-grow"></div>
          <div className="font-normal text-gray-700 dark:text-gray-400">
            <h3 className="text-sm">{getLevel(level)}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LessonCard;
