import React from "react";
import "./HomePreShowcaseBand.css";

/**
 * New homepage band placed above Teacher Brain Showcase only.
 * Copy is placeholder — replace in this file or lift to props later.
 */
const HomePreShowcaseBand = () => {
  return (
    <section
      className="home-pre-showcase-band"
      aria-labelledby="home-pre-showcase-band-title"
    >
      <div className="home-pre-showcase-band__inner">
        <p className="home-pre-showcase-band__kicker">Vidyam AI</p>
        <h2 id="home-pre-showcase-band__title" className="home-pre-showcase-band__title">
          Where teaching meets intelligence
        </h2>
        <p className="home-pre-showcase-band__lede">
          A short line of supporting copy can go here. Edit this block in{" "}
          <code>HomePreShowcaseBand.js</code> when you are ready.
        </p>
      </div>
    </section>
  );
};

export default HomePreShowcaseBand;
