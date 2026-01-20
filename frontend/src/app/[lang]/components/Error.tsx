"use client";

import { useDictionary } from "@/contexts/DictionaryContext";

export default function Error() {
  const { t } = useDictionary();

  return (
    <div className="container mx-auto p-8">
      <h2>{t("messages.error.somethingWentWrong")}</h2>
    </div>
  );
}
