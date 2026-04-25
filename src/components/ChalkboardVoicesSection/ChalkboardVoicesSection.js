import React from "react";
import "./ChalkboardVoicesSection.css";

const teacherClouds = [
  {
    src: "/images/thought-clouds/teacher-wish.png",
    alt: "Thought: I wish I had more time for each student",
    className: "chalk-cloud chalk-cloud--t1",
  },
  {
    src: "/images/thought-clouds/teacher-grading.png",
    alt: "Thought: Checking takes so long and I still can not tell who is falling behind",
    className: "chalk-cloud chalk-cloud--t2",
  },
  {
    src: "/images/thought-clouds/teacher-testing.png",
    alt: "Thought: Are these questions really testing their understanding",
    className: "chalk-cloud chalk-cloud--t3",
  },
];

const studentClouds = [
  {
    src: "/images/thought-clouds/student-weak.png",
    alt: "Thought: Should I ask again, what if I look weak",
    className: "chalk-cloud chalk-cloud--s2",
  },
  {
    src: "/images/thought-clouds/student-everyone.png",
    alt: "Thought: Everyone else seems to get it, why not me",
    className: "chalk-cloud chalk-cloud--s1",
  },
  {
    src: "/images/thought-clouds/student-explain.png",
    alt: "Thought: Maybe if someone could explain it my way",
    className: "chalk-cloud chalk-cloud--s3",
  },
];

const ChalkboardVoicesSection = () => {
  return (
    <section
      className="chalkboard-voices"
      aria-label="Voices from the classroom"
    >
      <div className="chalkboard-voices-inner">
        <div className="chalk-col chalk-col--teacher">
          <div className="chalk-teacher-scene">
            {teacherClouds.map((c) => (
              <img
                key={c.className}
                className={c.className}
                src={c.src}
                alt={c.alt}
                loading="lazy"
                decoding="async"
              />
            ))}
            <div className="chalk-figure chalk-figure--zoom">
              <img
                src="/images/chalkboard-teacher.png"
                alt="Teacher at her desk, reflecting on time and assessment"
              />
            </div>
          </div>
        </div>

        <div className="chalk-col chalk-col--bell">
          <div className="chalk-bell-wrap">
            <div className="chalk-bell-anim" aria-hidden="true">
              <img
                className="chalk-bell-img"
                src="/images/chalkboard-bell.png"
                alt=""
              />
            </div>
          </div>
        </div>

        <div className="chalk-col chalk-col--student">
          <div className="chalk-student-scene">
            {studentClouds.map((c) => (
              <img
                key={c.className}
                className={c.className}
                src={c.src}
                alt={c.alt}
                loading="lazy"
                decoding="async"
              />
            ))}
            <div className="chalk-figure chalk-figure--zoom chalk-figure--student-crop">
              <img
                src="/images/chalkboard-student.png"
                alt="Student at his desk, thinking about asking for help"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChalkboardVoicesSection;
