import React, { useEffect, useRef, useState } from "react";
import "./TeacherBrainShowcase.css";

const base = process.env.PUBLIC_URL || "";

// WhatsApp exports in public/images (copilot-*.png).
const TBS_IMG = {
  studentIllus: `${base}/images/copilot-student.png`,
  brainIllus: `${base}/images/copilot-brain.png`,
  schoolIllus: `${base}/images/copilot-school.png`,
};

const studentFeatures = [
  {
    icon: "bolt",
    title: "Instant Doubt Solving",
    body: "Real-time answers to questions, clearing confusion.",
  },
  {
    icon: "watch_later",
    title: "24/7 Support",
    body: "Assistance is always available, anytime.",
  },
  {
    icon: "person",
    title: "Personalized Guidance",
    body: "Learning plans and feedback tailored to the student.",
  },
  {
    icon: "edit_note",
    title: "Assignments & Quizzes",
    body: "Practice material generated to track progress.",
  },
];

const schoolFeatures = [
  {
    icon: "post_add",
    title: "Instant Question Paper Generation",
    body: "Assessments created in moments.",
  },
  {
    icon: "fact_check",
    title: "Answer Sheet Checking",
    body: "Automatic grading for fast feedback.",
  },
  {
    icon: "monitoring",
    title: "Class-Wide Student Analysis",
    body: "Insights on group performance and trends.",
  },
  {
    icon: "account_tree",
    title: "Student Learning Trajectory Tracking",
    body: "Detailed mapping of each student's journey.",
  },
];

const FeatureItem = ({ icon, title, body }) => (
  <li className="tbs-feat">
    <span
      className="tbs-feat-icon material-symbols-outlined"
      aria-hidden
    >
      {icon}
    </span>
    <div className="tbs-feat-text">
      <div className="tbs-feat-title">{title}</div>
      <p className="tbs-feat-body">{body}</p>
    </div>
  </li>
);

const TeacherBrainShowcase = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) {
        setInView(true);
        return undefined;
      }
    }

    const isLikelyInView = () => {
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      return r.top < h * 0.92 && r.bottom > h * 0.06;
    };

    let finished = false;
    const ob = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (!finished) {
            finished = true;
            setInView(true);
            ob.unobserve(el);
          }
        }
      },
      { root: null, threshold: 0.06, rootMargin: "0px 0px 10% 0px" }
    );
    ob.observe(el);

    if (isLikelyInView()) {
      requestAnimationFrame(() => {
        if (isLikelyInView() && !finished) {
          finished = true;
          setInView(true);
          ob.unobserve(el);
        }
      });
    }
    return () => ob.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={
        "teacher-brain-showcase" +
        (inView ? " teacher-brain-showcase--active" : "")
      }
      aria-labelledby="tbs-a11y-title"
    >
      <h2 id="tbs-a11y-title" className="tbs-sr-only">
        Student Copilot, Teacher Brain, and School Copilot
      </h2>
      <div className="tbs-neural-backdrop" aria-hidden="true" />
      <div className="tbs-grid">
        <div className="tbs-col tbs-col--left">
          <p className="tbs-kicker tbs-kicker--gold">
            Get instant homework help, clear doubts and test knowledge.
          </p>
          <article className="tbs-card">
            <div className="tbs-card-header">
              <h3 className="tbs-card-title">Student Copilot AI</h3>
              <div className="tbs-card-illus">
                <img
                  src={TBS_IMG.studentIllus}
                  alt=""
                  className="tbs-illus"
                  width={200}
                  height={180}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
            <ul className="tbs-feat-list">
              {studentFeatures.map((f) => (
                <FeatureItem
                  key={f.title}
                  icon={f.icon}
                  title={f.title}
                  body={f.body}
                />
              ))}
            </ul>
            <a
              className="tbs-cta"
              href="https://www.vidyam.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try Student Copilot <span className="tbs-cta-arrow">→</span>
            </a>
          </article>
        </div>

        <div className="tbs-col tbs-col--center">
          <div
            className="tbs-connector tbs-connector--to-left"
            aria-hidden="true"
          />
          <div
            className="tbs-connector tbs-connector--to-right"
            aria-hidden="true"
          />
          <div className="tbs-center-block">
            <div className="tbs-brain-stack">
              <div className="tbs-brain-aura" aria-hidden="true" />
              <div className="tbs-brain-glow" aria-hidden="true" />
              <img
                src={TBS_IMG.brainIllus}
                alt="Teacher Brain"
                className="tbs-brain"
                width={800}
                height={640}
                loading="eager"
                decoding="async"
              />
            </div>
            <p className="tbs-powered-by">Powered By</p>
            <p className="tbs-powered-brand">Teacher Brain™</p>
          </div>
        </div>

        <div className="tbs-col tbs-col--right">
          <p className="tbs-kicker tbs-kicker--gold">
            Generate smart question papers and evaluate answers instantly.
          </p>
          <article className="tbs-card">
            <div className="tbs-card-header">
              <h3 className="tbs-card-title">School Copilot AI</h3>
              <div className="tbs-card-illus">
                <img
                  src={TBS_IMG.schoolIllus}
                  alt=""
                  className="tbs-illus"
                  width={200}
                  height={180}
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
            <ul className="tbs-feat-list">
              {schoolFeatures.map((f) => (
                <FeatureItem
                  key={f.title}
                  icon={f.icon}
                  title={f.title}
                  body={f.body}
                />
              ))}
            </ul>
            <a
              className="tbs-cta"
              href="https://www.schoolcopilot.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Try School Copilot <span className="tbs-cta-arrow">→</span>
            </a>
          </article>
        </div>
      </div>
      <span className="tbs-sparkle" aria-hidden="true">
        ✦
      </span>
    </section>
  );
};

export default TeacherBrainShowcase;
