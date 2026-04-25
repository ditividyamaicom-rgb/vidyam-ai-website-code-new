import React, { useState, useRef, useEffect } from "react";
import "./homeBody.css";
import MissionAccordion from "../Accordion/Accordion";
import ChalkboardVoicesSection from "../ChalkboardVoicesSection/ChalkboardVoicesSection";
import TeacherBrainShowcase from "../TeacherBrainShowcase/TeacherBrainShowcase";
import PlatformsMarquee from "../PlatformsMarquee/PlatformsMarquee";
import HiringSection from "../HiringSection/HiringSection";
import FooterComp from "../Footer/Footer";
const HomeBody = () => {
  const [playingVideos, setPlayingVideos] = useState({});
  const videoRefs = useRef({});
  const [animateWords, setAnimateWords] = useState(false);
  const saarthiSectionRef = useRef(null);
  const [animateTeam, setAnimateTeam] = useState(false);
  const teamSectionRef = useRef(null);
  const [activeAccordionTab, setActiveAccordionTab] = useState(() => {
    return "platforms";
  });
  const [isMobile, setIsMobile] = useState(false);
  const empowermentRingLightRef = useRef(null);
  const empowermentObserveRef = useRef(null);
  const empowermentRevealedRef = useRef(false);
  const [empowermentImgInView, setEmpowermentImgInView] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      empowermentRevealedRef.current = true;
      setEmpowermentImgInView(true);
      return;
    }
    if (empowermentRevealedRef.current) {
      return;
    }
    if (activeAccordionTab !== "platforms") {
      return;
    }

    let obs = null;
    let cancelled = false;

    const arm = (el) => {
      if (cancelled || !el || empowermentRevealedRef.current) {
        return;
      }
      obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              empowermentRevealedRef.current = true;
              setEmpowermentImgInView(true);
              if (obs) {
                obs.disconnect();
                obs = null;
              }
              return;
            }
          }
        },
        { threshold: 0, rootMargin: "0px 0px -24px 0px" }
      );
      obs.observe(el);
    };

    const el = empowermentObserveRef.current;
    if (el) {
      arm(el);
    } else {
      const t = requestAnimationFrame(() => {
        const el2 = empowermentObserveRef.current;
        if (el2) {
          arm(el2);
        }
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(t);
        if (obs) {
          obs.disconnect();
        }
      };
    }

    return () => {
      cancelled = true;
      if (obs) {
        obs.disconnect();
      }
    };
  }, [activeAccordionTab]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const durationMs = 5500;
    const start = performance.now();
    const lit = 0.28;
    const dim = 0.72;
    let pathLen = 0;
    let raf = 0;
    const step = (now) => {
      const el = empowermentRingLightRef.current;
      if (!el) {
        raf = requestAnimationFrame(step);
        return;
      }
      if (!pathLen) {
        if (typeof el.getTotalLength === "function" && el.getTotalLength() > 0) {
          pathLen = el.getTotalLength();
        } else {
          pathLen = 100;
        }
        el.setAttribute("stroke-dasharray", `${lit * pathLen} ${dim * pathLen}`);
      }
      const t = ((now - start) % durationMs) / durationMs;
      el.setAttribute("stroke-dashoffset", String(-t * pathLen));
      const slow = 0.55 + 0.45 * Math.sin(now * 0.0065);
      const run = 0.6 + 0.4 * Math.sin(now * 0.01 + t * 28);
      const radiance = Math.min(1.35, slow * (0.75 + 0.25 * run));
      const g1 = 2 + 7 * radiance;
      const g2 = 6 + 18 * radiance;
      const g3 = 12 + 28 * radiance;
      const a = 0.88 + 0.12 * Math.sin(now * 0.008);
      el.style.filter = [
        `drop-shadow(0 0 ${g1}px rgba(255, 250, 235, ${0.92 * a}))`,
        `drop-shadow(0 0 ${g2}px rgba(255, 225, 160, ${0.75 * a}))`,
        `drop-shadow(0 0 ${g3}px rgba(255, 200, 120, ${0.45 * a}))`,
      ].join(" ");
      el.setAttribute(
        "stroke",
        `rgba(255, 252, 240, ${(0.88 + 0.12 * run).toFixed(3)})`
      );
      raf = requestAnimationFrame(step);
    };
    const boot = window.setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, 0);
    return () => {
      window.clearTimeout(boot);
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const internVideos = [
    {
      id: 1,
      thumbnail: "/images/image1.png",
      videoUrl: "/videos/video1.mp4",
      title: "Meet Drayson",
      subtitle: "Intern Experience",
      team: "V"
    },
    {
      id: 2,
      thumbnail: "/images/image2.png",
      videoUrl: "/videos/video2.mp4",
      title: "Darshan P.",
      subtitle: "Summer Sojourn 2017"
    }
  ];

  const togglePlay = async (videoId) => {
    console.log(`togglePlay called for video ${videoId}`);
    const video = videoRefs.current[videoId];
    if (!video) {
      console.error(`Video ref not found for video ${videoId}`);
      console.log('Available refs:', Object.keys(videoRefs.current));
      return;
    }

    console.log(`Video element found:`, video);
    console.log(`Video src:`, video.src);
    console.log(`Video readyState:`, video.readyState);
    console.log(`Video paused:`, video.paused);
    console.log(`Currently playing:`, playingVideos[videoId]);

    try {
      if (playingVideos[videoId] || !video.paused) {
        console.log(`Pausing video ${videoId}`);
        video.pause();
        setPlayingVideos(prev => ({ ...prev, [videoId]: false }));
      } else {
        console.log(`Attempting to play video ${videoId}`);
        // Ensure video is loaded
        if (video.readyState < 2) {
          console.log(`Video not ready, loading...`);
          video.load();
          // Wait for video to be ready
          await new Promise((resolve) => {
            video.addEventListener('canplay', resolve, { once: true });
            setTimeout(resolve, 2000); // Timeout after 2 seconds
          });
        }
        
        // Try unmuting if needed (some browsers require user interaction)
        if (video.muted) {
          video.muted = false;
        }
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          try {
            await playPromise;
            console.log(`Video ${videoId} play promise resolved`);
            setPlayingVideos(prev => ({ ...prev, [videoId]: true }));
          } catch (playError) {
            console.error(`Play promise rejected:`, playError);
            // If autoplay is blocked, try with muted
            if (playError.name === 'NotAllowedError') {
              console.log(`Autoplay blocked, trying muted...`);
              video.muted = true;
              try {
                await video.play();
                setPlayingVideos(prev => ({ ...prev, [videoId]: true }));
              } catch (mutedError) {
                console.error(`Even muted play failed:`, mutedError);
              }
            }
          }
        } else {
          console.log(`Video ${videoId} play() returned undefined`);
          setPlayingVideos(prev => ({ ...prev, [videoId]: true }));
        }
      }
    } catch (error) {
      console.error(`Error playing video ${videoId}:`, error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Video element:', video);
      console.error('Video src:', video.src);
      console.error('Video readyState:', video.readyState);
      console.error('Video networkState:', video.networkState);
      if (video.error) {
        console.error('Video error code:', video.error.code);
        console.error('Video error message:', video.error.message);
      }
    }
  };

  const handleVideoEnd = (videoId) => {
    setPlayingVideos(prev => ({ ...prev, [videoId]: false }));
  };

  const handleVideoPause = (videoId) => {
    setPlayingVideos(prev => ({ ...prev, [videoId]: false }));
  };

  const handleVideoPlay = (videoId) => {
    setPlayingVideos(prev => ({ ...prev, [videoId]: true }));
  };

  useEffect(() => {
    // Use Intersection Observer to trigger animation when section comes into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateWords(true);
            // Once animated, we can disconnect the observer
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before fully in view
      }
    );

    if (saarthiSectionRef.current) {
      observer.observe(saarthiSectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Use Intersection Observer to trigger team section animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateTeam(true);
            // Once animated, we can disconnect the observer
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before fully in view
      }
    );

    if (teamSectionRef.current) {
      observer.observe(teamSectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="homeBody">
        <div className="homeBody-container">
          <ChalkboardVoicesSection />
          <TeacherBrainShowcase />
          <div id="about" className="mission">
            <div className="mission-content">
              <h1>
                Our Mission
                <span className="material-symbols-outlined">task_alt</span>
              </h1>
              <p>
                Our mission at Vidyam AI is to redefine education by creating
                cutting-edge technologies like GenAI, XR, and the Saarthi app,
                personalized for every student in India and beyond. We're
                committed to bridging the gap between traditional education and
                immersive learning experiences.
              </p>
            </div>
            <div className="mission-accordion">
              <MissionAccordion onTabChange={setActiveAccordionTab} />
            </div>
          </div>

          {/* Vidyam LLM Key Characteristics Section */}
          <div className={`vidyam-llm-section ${activeAccordionTab !== "models" ? (isMobile ? "mobile-hidden" : "desktop-hidden") : ""}`}>
            <h2 className="vidyam-llm-title">Vidyam LLM : Key Characteristics</h2>
            <div className="vidyam-llm-content">
              <div className="vidyam-llm-grid">
                <div className="vidyam-llm-box">
                  <h3>Curriculum-Specific Models :</h3>
                  <p>Vidyam LLM is fine-tuned for the NCERT syllabus, ensuring relevance and accuracy.</p>
                </div>
                <div className="vidyam-llm-box">
                  <h3>Subject-Focused :</h3>
                  <p>Initially focused on Science for classes 6-12, with future plans to expand to other subjects.</p>
                </div>
                <div className="vidyam-llm-box">
                  <h3>Multilingual Support :</h3>
                  <p>While currently available in English, we aim to support multiple Indian languages soon.</p>
                </div>
                <div className="vidyam-llm-box">
                  <h3>Grade-Appropriate Responses :</h3>
                  <p>The models provide explanations and examples tailored to the students' age and grade level.</p>
                </div>
              </div>
              <div className="vidyam-llm-robot">
                <img
                  src="/images/robotr.png"
                  alt="Vidyam LLM Robot"
                  className="vidyam-llm-robot-img"
                />
              </div>
            </div>
          </div>

          <section
            className={`empowerment-infographic-section ${activeAccordionTab !== "platforms" ? (isMobile ? "mobile-hidden" : "desktop-hidden") : ""}`}
            aria-labelledby="empowerment-infographic-heading"
          >
            <div className="empowerment-infographic-inner">
              <h2
                id="empowerment-infographic-heading"
                className="empowerment-infographic-title"
              >
                A connected learning ecosystem that empowers
                <br />
                <span className="empowerment-infographic-title-accent">
                  Every School and Every Student.
                </span>
              </h2>
              <div
                ref={empowermentObserveRef}
                className="empowerment-infographic-glow-wrap"
              >
                <svg
                  className="empowerment-ring-svg"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <rect
                    className="empowerment-ring-track"
                    x="0.35"
                    y="0.35"
                    width="99.3"
                    height="99.3"
                    rx="1.4"
                    ry="1.4"
                    pathLength="100"
                    fill="none"
                  />
                  <rect
                    ref={empowermentRingLightRef}
                    className="empowerment-ring-light"
                    x="0.35"
                    y="0.35"
                    width="99.3"
                    height="99.3"
                    rx="1.4"
                    ry="1.4"
                    pathLength="100"
                    fill="none"
                  />
                </svg>
                <img
                  src="/images/school-copilot-empowerment.png"
                  alt="Infographic: School Copilot and Student Copilot empowerment connecting students, teachers, and parents around school empowerment"
                  className={
                    "empowerment-infographic-img" +
                    (empowermentImgInView
                      ? " empowerment-infographic-img--in-view"
                      : "")
                  }
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </section>

          {/* Saarthi feature section — only when Mission accordion = Platforms (replaces previous School Copilot block) */}
          <section
            ref={saarthiSectionRef}
            className={`saarthi-section saarthi-section--hidden-temp ${activeAccordionTab !== "platforms" ? (isMobile ? "mobile-hidden" : "desktop-hidden") : ""}`}
          >
            <div className="saarthi-visual">
              <div className="saarthi-chats">
                <img
                  src="/images/demo-1.jpeg"
                  alt="Saarthi demo chat 1"
                  className="saarthi-chat-card saarthi-chat-card-1"
                />
                <img
                  src="/images/demo-2.jpeg"
                  alt="Saarthi demo chat 2"
                  className="saarthi-chat-card saarthi-chat-card-2"
                />
                <img
                  src="/images/demo-3.jpeg"
                  alt="Saarthi demo chat 3"
                  className="saarthi-chat-card saarthi-chat-card-3"
                />
                <img
                  src="/images/demo-4.jpeg"
                  alt="Saarthi demo chat 4"
                  className="saarthi-chat-card saarthi-chat-card-4"
                />
              </div>
              <img
                src="/images/student-girl.png"
                alt="Student using Saarthi"
                className="saarthi-girl"
              />
            </div>

            <div className="saarthi-text">
              <h2>Meet Saarthi — Your AI Study Co‑Pilot</h2>
              <p className="saarthi-lead">
                Need quick homework help? Stuck on a tricky question? Want instant
                quizzes to test yourself? Saarthi is your AI buddy that&apos;s always
                there for you — fast, friendly, and available on{" "}
                <strong>WhatsApp 24/7.</strong>
              </p>
              <p className="saarthi-sub">
                <strong className={animateWords ? "animate-words" : ""}>
                  <span className="word-animate word-1">Just</span>{" "}
                  <span className="word-animate word-2">Click.</span>{" "}
                  <span className="word-animate word-3">Ask.</span>{" "}
                  <span className="word-animate word-4">Learn.</span>
                </strong>{" "}
                Instant support, personalised explanations, and learning that feels effortless.
              </p>
            </div>
          </section>

          <div className="platforms-marquee-gate">
            <PlatformsMarquee />
          </div>

          <div id="team" ref={teamSectionRef} className="team-section">
            <div className="team-banner">
              <div className="team-badge">
                <div className="team-badge-circle">
                  <span className="team-badge-title">
                    Our<br />Team
                  </span>
                  <span className="material-symbols-outlined team-badge-icon">
                    group
                  </span>
                </div>
              </div>
              <div className={`team-text ${animateTeam ? 'animate-slide-in' : ''}`}>
                <p>
                  Our team at Vidyam AI comprises seasoned professionals with
                  extensive experience in AI research and product development.
                  With backgrounds spanning over 15 years in technology, our
                  co-founders bring a wealth of expertise to the table. From AI
                  cloud services to data science and product management, our
                  diverse skill sets converge to drive innovation and redefine
                  the educational landscape.
                </p>
              </div>
            </div>
          </div>

          {/* Founder Quote Section */}
          <section className="founder-quote-section">
            <div className="founder-quote-content">
              <div className="founder-quote-text">
                <blockquote className="founder-quote">
                  “AI gives us the power to teach one child at a time, even at the scale of a nation.”
                </blockquote>
                <div className="founder-name-title">
                  <div className="founder-name-inline">
                    <img
                      src="/images/founder.png"
                      alt="Akash Srivastav, Founder of Vidyam AI"
                      className="founder-avatar-mobile"
                    />
                    <h2 className="founder-name">Akash Srivastav</h2>
                  </div>
                  <span className="founder-title">Founder of Vidyam AI</span>
                </div>
                <div className="founder-social-icons">
                  <a href="https://twitter.com/akashsrivastav" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/in/akashsrivastav" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="founder-portrait">
                <img
                  src="/images/founder.png"
                  alt="Akash Srivastav, Founder of Vidyam AI"
                  className="founder-image"
                />
              </div>
            </div>
          </section>

          {/* We are Hiring Section */}
          <HiringSection />

          {/* Intern Testimonials Section */}
          <section className="intern-testimonials-section">
            <div className="intern-testimonials-container">
              <h2 className="intern-testimonials-title">
                Intern Testimonials
                <span className="material-symbols-outlined">mic</span>
                </h2>
              
              <div className="intern-videos-grid">
                {internVideos.map((video, index) => {
                  const isPlaying = playingVideos[video.id];
                  return (
                    <div
                      key={video.id}
                      className={`intern-video-card ${isPlaying ? 'active-video' : ''}`}
                    >
                      <div className="video-thumbnail">
                        {video.videoUrl ? (
                          <video
                            ref={(el) => {
                              if (el) {
                                videoRefs.current[video.id] = el;
                                console.log(`Video ref set for video ${video.id}`, el);
                              }
                            }}
                            src={video.videoUrl}
                            poster={video.thumbnail}
                            className="carousel-video"
                            preload="auto"
                            playsInline
                            controls
                            muted={false}
                            onEnded={() => handleVideoEnd(video.id)}
                            onPause={() => handleVideoPause(video.id)}
                            onPlay={() => {
                              console.log(`Video ${video.id} started playing`);
                              handleVideoPlay(video.id);
                            }}
                            onClick={(e) => {
                              // Only toggle if clicking on the video itself, not on controls
                              if (e.target.tagName === 'VIDEO') {
                                e.stopPropagation();
                                console.log(`Video ${video.id} clicked (center area)`);
                                togglePlay(video.id);
                              }
                            }}
                            onError={(e) => {
                              console.error(`Error loading video ${video.id}:`, e);
                              console.error('Video URL:', video.videoUrl);
                              console.error('Video element:', e.target);
                              if (e.target.error) {
                                console.error('Error code:', e.target.error.code);
                                console.error('Error message:', e.target.error.message);
                              }
                            }}
                            onLoadedData={() => {
                              console.log(`Video ${video.id} loaded successfully`);
                            }}
                            onCanPlay={() => {
                              console.log(`Video ${video.id} can play`);
                            }}
                            onLoadedMetadata={() => {
                              console.log(`Video ${video.id} metadata loaded`);
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img src={video.thumbnail} alt={video.title} />
                        )}
                        {!isPlaying ? (
                          <button 
                            className="video-play-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(`Play button clicked for video ${video.id}`);
                              togglePlay(video.id);
                            }}
                            aria-label="Play video"
                          >
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </button>
                        ) : (
                          <>
                            <button 
                              className="video-play-button video-pause-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log(`Pause button clicked for video ${video.id}`);
                                togglePlay(video.id);
                              }}
                              aria-label="Pause video"
                            >
                              <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                              </svg>
                            </button>
                            <div 
                              className="video-click-overlay"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log(`Video overlay clicked for video ${video.id}`);
                                togglePlay(video.id);
                              }}
                              aria-label="Click to pause"
                            />
                          </>
                        )}
                        {/* Subtitle / title overlay removed as requested */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Footer */}
          <FooterComp />
        </div>
      </div>
    </>
  );
};

export default HomeBody;
