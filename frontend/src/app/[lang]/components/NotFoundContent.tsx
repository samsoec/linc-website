"use client";

import { useDictionary } from "@/contexts/DictionaryContext";

export default function NotFoundContent() {
  const { t } = useDictionary();

  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center px-6 py-24">
      <div className="text-center">
        {/* 404 Large Number */}
        <h1 className="mb-4 text-9xl font-extrabold text-gray-200 dark:text-gray-700">404</h1>

        {/* Heading */}
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
          {t("notFound.heading")}
        </h2>

        {/* Message */}
        <p className="mb-8 text-lg font-light text-gray-600 dark:text-gray-400">
          {t("notFound.message")}
        </p>
      </div>
    </div>
  );
}
