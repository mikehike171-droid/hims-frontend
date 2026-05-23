"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { settingsApi } from "@/lib/settingsApi";
import authService from "@/lib/authService";

type Slide = {
  visual: string;
  title: string;
  sub: string;
  btn: string;
  btnLink?: string;
};

// ─── Per-slide animation state ───────────────────────────────────────────────
type AnimState = "hidden" | "entering" | "visible" | "exiting";

const ENTER_DURATION = 550; // ms — how long the enter transition takes
const EXIT_DURATION  = 350; // ms — how long the exit transition takes
const AUTO_INTERVAL  = 7000; // ms — auto-advance cadence

// CSS transition strings reused for both text and image so they're always in sync
const enterTransition = `opacity ${ENTER_DURATION}ms cubic-bezier(0.22,1,0.36,1), transform ${ENTER_DURATION}ms cubic-bezier(0.22,1,0.36,1)`;
const exitTransition  = `opacity ${EXIT_DURATION}ms ease-in, transform ${EXIT_DURATION}ms ease-in`;

function getTextStyle(state: AnimState): React.CSSProperties {
  switch (state) {
    case "hidden":
      return { opacity: 0, transform: "translateX(-40px)", transition: "none", pointerEvents: "none" };
    case "entering":
      return { opacity: 1, transform: "translateX(0)", transition: enterTransition };
    case "visible":
      return { opacity: 1, transform: "translateX(0)", transition: "none" };
    case "exiting":
      return { opacity: 0, transform: "translateX(-30px)", transition: exitTransition, pointerEvents: "none" };
  }
}

function getImageStyle(state: AnimState): React.CSSProperties {
  switch (state) {
    case "hidden":
      return { opacity: 0, transform: "translateX(40px) scale(0.96)", transition: "none", pointerEvents: "none" };
    case "entering":
      return { opacity: 1, transform: "translateX(0) scale(1)", transition: enterTransition };
    case "visible":
      return { opacity: 1, transform: "translateX(0) scale(1)", transition: "none" };
    case "exiting":
      return { opacity: 0, transform: "translateX(30px) scale(0.96)", transition: exitTransition, pointerEvents: "none" };
  }
}

type RevealLevel = 1 | 2 | 3 | 4;

function getTitleStyle(level: RevealLevel): React.CSSProperties {
  return {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 400ms ease-out, transform 400ms ease-out",
  };
}

function getSubtitleStyle(level: RevealLevel): React.CSSProperties {
  return {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 400ms ease-out, transform 400ms ease-out",
  };
}

function getButtonStyle(level: RevealLevel): React.CSSProperties {
  return {
    opacity: 1,
    transform: "translateY(0)",
    transition: "opacity 400ms ease-out, transform 400ms ease-out",
  };
}

function getRevealImageStyle(level: RevealLevel): React.CSSProperties {
  return {
    opacity: 1,
    filter: "brightness(1)",
    transition: "opacity 600ms ease-out, filter 600ms ease-out",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
const HeroScroller = () => {
  const { t } = useLanguage();
  const [slides, setSlides]   = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  // Which slide is currently "on stage"
  const [current, setCurrent]   = useState(0);
  const [animState, setAnimState] = useState<AnimState>("visible"); // first slide starts visible
  
  // Scroll-based reveal level: tracks which elements are visible for current slide
  const [revealLevel, setRevealLevel] = useState<RevealLevel>(1); // Start at 1 so title is visible

  // Refs to avoid stale closures in scroll / timer handlers
  const currentRef  = useRef(0);
  const revealLevelRef = useRef<RevealLevel>(1);
  const animatingRef = useRef(false); // true while a transition is in progress
  const slidesRef   = useRef<Slide[]>([]);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Scroll accumulator — we use wheel delta to decide when to advance
  const scrollAccRef  = useRef(0);
  const SCROLL_THRESH = 80; // px of accumulated delta before advancing

  // ── Fetch slides ────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await settingsApi.getHeroSections();
        if (data?.length) {
          const mapped: Slide[] = data.map((item: any) => ({
            visual: item.image_url?.startsWith("http")
              ? item.image_url
              : `${authService.getSettingsApiUrl().replace("/api", "")}${item.image_url}`,
            title:   item.title,
            sub:     item.subtitle,
            btn:     item.button_text,
            btnLink: item.button_link,
          }));
          setSlides(mapped);
          slidesRef.current = mapped;
        }
      } catch (e) {
        console.error("Failed to fetch hero slides:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Core transition: exit current → enter next ──────────────────────────────
  const goTo = useCallback((nextIdx: number) => {
    if (animatingRef.current || slidesRef.current.length === 0) return;
    if (nextIdx === currentRef.current) return;

    animatingRef.current = true;

    // 1. Exit current pair (text + image leave together)
    setAnimState("exiting");

    setTimeout(() => {
      // 2. Snap to next slide while invisible
      setCurrent(nextIdx);
      currentRef.current = nextIdx;
      setAnimState("hidden");
      
      // 3. Reset reveal level to 1 (title visible) for the new slide
      setRevealLevel(1);
      revealLevelRef.current = 1;

      // 4. One frame later: trigger enter animation for the new pair
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimState("entering");

          // 5. After enter completes, mark as stable
          setTimeout(() => {
            setAnimState("visible");
            animatingRef.current = false;
          }, ENTER_DURATION);
        });
      });
    }, EXIT_DURATION);
  }, []);

  const next = useCallback(() => {
    const len = slidesRef.current.length;
    if (!len) return;
    goTo((currentRef.current + 1) % len);
  }, [goTo]);

  const prev = useCallback(() => {
    const len = slidesRef.current.length;
    if (!len) return;
    goTo((currentRef.current - 1 + len) % len);
  }, [goTo]);

  // ── Reveal level progression for scroll-based sequential animation ──────────
  const advanceRevealLevel = useCallback(() => {
    if (animatingRef.current) return;
    
    const currentLevel = revealLevelRef.current;
    
    // If not at max reveal level, advance the reveal
    if (currentLevel < 4) {
      revealLevelRef.current = (currentLevel + 1) as RevealLevel;
      setRevealLevel(revealLevelRef.current);
      return true; // Reveal was advanced, don't slide
    }
    
    // At max reveal level, allow slide advance
    return false;
  }, []);

  // ── Auto-advance ─────────────────────────────────────────────────────────────
  const resetAutoTimer = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(next, AUTO_INTERVAL);
  }, [next]);

  useEffect(() => {
    if (slides.length === 0) return;
    resetAutoTimer();
    return () => { if (autoTimerRef.current) clearInterval(autoTimerRef.current); };
  }, [slides.length, resetAutoTimer]);

  // ── Scroll-wheel handler ─────────────────────────────────────────────────────
  useEffect(() => {
    if (slides.length === 0) return;

    const onWheel = (e: WheelEvent) => {
      // Only intercept when the hero section is in the viewport
      const hero = document.getElementById("hero-scroller");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      // Hero must occupy at least half the viewport height to intercept scroll
      if (rect.top > window.innerHeight * 0.5 || rect.bottom < window.innerHeight * 0.5) return;

      scrollAccRef.current += e.deltaY;

      if (Math.abs(scrollAccRef.current) >= SCROLL_THRESH) {
        const direction = scrollAccRef.current > 0 ? 1 : -1;
        scrollAccRef.current = 0;

        if (direction > 0) {
          // Scrolling down
          resetAutoTimer();
          
          // First try to advance reveal level, then slide if at max
          const revealAdvanced = advanceRevealLevel();
          if (!revealAdvanced) {
            // Reveal is at max, advance to next slide (or allow natural scroll if on last slide)
            if (currentRef.current === slidesRef.current.length - 1) return;
            e.preventDefault();
            next();
          } else {
            e.preventDefault();
          }
        } else {
          // Scrolling up
          resetAutoTimer();
          
          // For up scroll, we could reverse reveal levels, but for now advance to previous slide
          if (currentRef.current === 0) return;
          e.preventDefault();
          prev();
        }
      } else {
        // Accumulating — prevent page scroll only while hero is active or revealing
        if (currentRef.current > 0 || scrollAccRef.current > 0 || revealLevelRef.current < 4) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [slides.length, next, prev, resetAutoTimer, advanceRevealLevel]);

  // ── Touch support ────────────────────────────────────────────────────────────
  const touchStartY = useRef(0);
  useEffect(() => {
    if (slides.length === 0) return;
    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd   = (e: TouchEvent) => {
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 40) return;
      resetAutoTimer();
      delta > 0 ? next() : prev();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend",   onTouchEnd);
    };
  }, [slides.length, next, prev, resetAutoTimer]);

  // ── Keyboard support ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (slides.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { resetAutoTimer(); next(); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   { resetAutoTimer(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length, next, prev, resetAutoTimer]);

  // ── Render ───────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div id="hero-scroller" className="relative flex items-center justify-center bg-white" style={{ minHeight: 460 }}>
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const s = slides[current];

  const handleBtnClick = () => {
    if (s.btnLink) window.location.href = s.btnLink;
    else window.dispatchEvent(new CustomEvent("open-appointment-popup"));
  };

  const textStyle  = getTextStyle(animState);
  const imageStyle = getImageStyle(animState);

  return (
    <section
      id="hero-scroller"
      className="relative bg-white overflow-hidden select-none"
      style={{ minHeight: 460 }}
    >
      {/* ── Layout ── */}
      <div className="relative container mx-auto px-4 flex flex-col md:flex-row items-center min-h-[460px]">

        {/* Left arrow */}
        <button
          onClick={() => { resetAutoTimer(); prev(); }}
          aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => { resetAutoTimer(); next(); }}
          aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>

        {/* ── Text (left) — animates in sync with image ── */}
        <div
          className="flex-1 z-20 px-10 md:px-16 py-4 md:py-0 flex flex-col justify-center"
          style={textStyle}
        >
          <h2 
            className="text-3xl md:text-[2.6rem] font-extrabold leading-[1.15] font-heading text-primary"
            style={getTitleStyle(revealLevel)}
          >
            {t(s.title).toUpperCase()}
          </h2>
          <p 
            className="text-gray-500 text-base md:text-[1.05rem] mt-5 max-w-[420px] leading-relaxed"
            style={getSubtitleStyle(revealLevel)}
          >
            {t(s.sub)}
          </p>
          <button
            onClick={handleBtnClick}
            className="inline-block mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold text-base shadow-md hover:opacity-90 transition-all duration-300 w-fit cursor-pointer"
            style={getButtonStyle(revealLevel)}
          >
            {t(s.btn)}
          </button>
        </div>

        {/* ── Image (right) — animates in sync with text ── */}
        <div
          className="flex-1 relative flex items-end justify-center z-20 overflow-hidden min-h-[460px]"
          style={{...imageStyle, ...getRevealImageStyle(revealLevel)}}
        >
          <img
            src={s.visual}
            alt={s.title}
            className="relative z-20 w-full max-h-[440px] rounded-[2rem] object-cover drop-shadow-2xl"
          />
          {/* Decorative glows */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#22d3ee] opacity-30 blur-3xl rounded-full z-0 pointer-events-none" />
          <div className="absolute -bottom-5  -right-5  w-48 h-48 bg-[#06b6d4] opacity-40 blur-2xl  rounded-full z-0 animate-pulse pointer-events-none" />
        </div>
      </div>

      {/* ── Dots ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { resetAutoTimer(); goTo(i); }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-6" : "bg-gray-300 w-2"}`}
          />
        ))}
      </div>

      {/* ── Slide counter ── */}
      <div className="absolute bottom-4 right-6 text-[10px] font-bold text-gray-400 z-30 tabular-nums">
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
};

export default HeroScroller;
