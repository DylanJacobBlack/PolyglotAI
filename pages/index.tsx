import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>PolyglotAI</title>
      </Head>
      <div className="flex w-screen justify-center items-center p-10">
        <div className={classes.header}>
          <div className={classes["text-box"]}>
            <h2 className={classes.slogan1}>Learn languages</h2>
            <h2 className={classes.slogan2}>the easy way</h2>
          </div>
        </div>
      </div>
    </>
  );
}

import classes from "./Welcome.module.css";
