import React, { useState, useEffect, useMemo, useRef } from "react";
import fallbackMarqueeUrls from "./platformMarqueeImages";
import { filenamesToUrls } from "./marqueeResource";
import "./PlatformsMarquee.css";

const MANIFEST_PATH = `${process.env.PUBLIC_URL || ""}/images/marquee/manifest.json`;

/**
 * Smiles & Stories: continuous R→L scroll — two copies in one flex row, then
 * rAF + translate3d(-offsetPx) in a loop. Pixel math avoids % keyframe issues
 * and is reliable on Windows. Motion always runs (not tied to system reduced-motion).
 */
const PlatformsMarquee = () => {
  const [urls, setUrls] = useState([]);
  const [durationDesktop, setDurationDesktop] = useState(50);
  const [durationMobile, setDurationMobile] = useState(36);
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef(null);

  const rawDuration = isMobile ? durationMobile : durationDesktop;
  const durationSec = Number.isFinite(rawDuration) && rawDuration > 0 ? rawDuration : 60;
  const loopDuration = Math.max(8, durationSec);

  const effectiveUrls = useMemo(() => {
    const raw = urls.length > 0 ? urls : fallbackMarqueeUrls;
    return Array.isArray(raw) ? [...raw] : [];
  }, [urls]);

  const trackUrls = useMemo(
    () => [...effectiveUrls, ...effectiveUrls],
    [effectiveUrls]
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    let last = performance.now();
    let offset = 0;

    const halfWidth = () => {
      const w = el.scrollWidth;
      return w > 0 ? w / 2 : 0;
    };

    const step = (now) => {
      const half = halfWidth();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;

      if (half > 0) {
        const speed = half / loopDuration;
        offset += speed * dt;
        if (offset >= half) {
          offset -= half;
        }
        el.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    const ro = new ResizeObserver(() => {
      const half = halfWidth();
      if (half > 0 && offset >= half) {
        offset = offset % half;
      }
    });
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.style.removeProperty("transform");
    };
  }, [loopDuration, effectiveUrls.length]);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch(MANIFEST_PATH, {
          signal: ac.signal,
          cache: "no-cache",
        });
        if (!res.ok) {
          throw new Error("manifest");
        }
        const data = await res.json();
        const raw = Array.isArray(data) ? data : data.images;
        if (!Array.isArray(raw)) {
          throw new Error("images");
        }
        const next = filenamesToUrls(raw.filter((x) => typeof x === "string"));
        if (next.length > 0) {
          setUrls(next);
        }
        if (typeof data.durationSec === "number" && data.durationSec > 0) {
          setDurationDesktop(data.durationSec);
        }
        if (typeof data.durationSecMobile === "number" && data.durationSecMobile > 0) {
          setDurationMobile(data.durationSecMobile);
        }
      } catch {
        if (!ac.signal.aborted) {
          setUrls([]);
        }
      }
    })();
    return () => ac.abort();
  }, []);

  if (!effectiveUrls.length) {
    return null;
  }

  return (
    <div
      className="platforms-marquee-outer"
      role="region"
      aria-labelledby="platforms-marquee-heading"
    >
      <h2 className="platforms-marquee-heading" id="platforms-marquee-heading">
        Smiles &amp; Stories
      </h2>
      <div className="platforms-marquee-film">
        <div className="platforms-marquee-viewport">
          <div
            ref={trackRef}
            className="platforms-marquee-track"
          >
            {trackUrls.map((src, idx) => {
              const n = effectiveUrls.length;
              const inFirst = idx < n;
              return (
                <img
                  key={`m-${idx}`}
                  className="platforms-marquee-img"
                  src={src}
                  alt={
                    inFirst
                      ? `Vidyam AI at schools and events — ${(idx % n) + 1}`
                      : ""
                  }
                  aria-hidden={!inFirst}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformsMarquee;
