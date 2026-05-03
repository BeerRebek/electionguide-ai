"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function CivicFact() {
  const t = useTranslations("dashboard.widgets.civicFact");
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm border-t-4 border-t-secondary-container">
      <div className="flex items-center gap-2 mb-2 text-secondary-container">
        <span className="material-symbols-outlined text-xl">lightbulb</span>
        <h3 className="text-sm font-medium uppercase tracking-wider font-bold">
          {t("title")}
        </h3>
      </div>
      <p className="text-base text-on-surface">
        {t("fact")}
      </p>
    </div>
  );
}

export function DailyQuiz() {
  const t = useTranslations("dashboard.widgets.dailyQuiz");
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-on-surface font-bold">
          {t("title")}
        </h3>
        <span className="bg-primary-container text-on-primary text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider">
          {t("badge")}
        </span>
      </div>
      <p className="text-base text-on-surface mb-4">
        {t("question")}
      </p>
      <Link
        href="/quiz"
        className="block w-full h-12 bg-white border border-primary text-primary text-sm font-medium rounded-lg hover:bg-surface-container transition-colors text-center leading-[3rem]"
      >
        {t("action")}
      </Link>
    </div>
  );
}

export function RecentNews() {
  const t = useTranslations("dashboard.widgets.recentNews");

  const NEWS_ITEMS = [
    {
      title: t("news1.title"),
      time: t("news1.time"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPx_W8lx0g2xUIKk7PC-L3BqYACQRyR6YvBK3j_09JmZjpyEsQdgL780lZBKDp0uoMVblcjqnXBlbc0aqtsVdpJDGevQe5hxxfd4_V837PY_Q21vBJTzWTz3OXNBV2s9x_q3VW-P_Soemo_gGPZ2Owk3k49D-I0vLzZ1hD5dQLIlHtWbhCK4Q4ra3RMbMHcwWptTn1CTDT0afjYECo_KZMBeE3AqCC0dOksjckEhctLATbc-JOtQ1yf7fDJ8wjOlp-LNTSrnfr0W6V",
    },
    {
      title: t("news2.title"),
      time: t("news2.time"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZX6Z5AG_3S0fzXdZCB0l2BFBusltSm2uDpMfE4mNi89ujaa2mT_gNJkUKcSjX3whJT8igaw2cEntcfk15sWpe1TLKq65k7RmCL3t2IC9yByjlc7Y-AH1nYH_JeZIh0eSYkw1mvDPxvicXX-Ym1Tkcb5LTGF1a5Xd-LhbX6HhJPZ4W8CqELmkdKea7ATMHsY_I6w3i_JwL0MPbZNurkinQnieTlZonnM_fVokUjbRXnmnVHilMLnLS1VlnTcIOEuUsIXC_pzAqz_kr",
    },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex-grow">
      <h3 className="text-sm font-medium text-on-surface font-bold mb-4 border-b border-surface-dim pb-2">
        {t("title")}
      </h3>
      <ul className="space-y-3">
        {NEWS_ITEMS.map((item) => (
          <li
            key={item.title}
            className="flex gap-3 items-start group cursor-pointer"
          >
            <div className="w-16 h-12 bg-surface-container rounded overflow-hidden flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="News thumbnail"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                src={item.image}
              />
            </div>
            <div>
              <h4 className="text-[13px] font-medium leading-tight text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </h4>
              <span className="text-[10px] text-on-surface-variant">
                {item.time}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
