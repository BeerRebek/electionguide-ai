"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          // Extract numeric part
          const numericMatch = target.match(/[\d.]+/);
          if (!numericMatch) {
            setDisplay(target);
            return;
          }
          const finalNum = parseFloat(numericMatch[0]);
          const prefix = target.slice(0, target.indexOf(numericMatch[0]));
          const postfix = target.slice(
            target.indexOf(numericMatch[0]) + numericMatch[0].length
          );

          let start = 0;
          const duration = 1500;
          const startTime = performance.now();

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            start = eased * finalNum;

            if (finalNum >= 1) {
              setDisplay(
                `${prefix}${Math.round(start)}${postfix}${suffix}`
              );
            } else {
              setDisplay(
                `${prefix}${start.toFixed(1)}${postfix}${suffix}`
              );
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplay(`${target}${suffix}`);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, suffix]);

  return <div ref={ref}>{display}</div>;
}

export function StatsBar() {
  const t = useTranslations("stats");

  const stats = [
    { value: t("officials_val"), suffix: "+", label: t("officials") },
    { value: t("voters_val"), suffix: "", label: t("voters") },
    { value: t("languages_val"), suffix: "+", label: t("languages") },
  ];

  return (
    <section
      className="bg-primary-container text-on-primary py-12 mt-8"
      aria-label="Key statistics"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-around items-center gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center gap-8">
            {index > 0 && (
              <div
                className="hidden md:block w-px h-16 bg-primary-fixed-dim/30"
                aria-hidden="true"
              />
            )}
            <div>
              <div className="text-[40px] leading-[1.2] font-bold mb-2">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-sm font-medium text-primary-fixed-dim uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

