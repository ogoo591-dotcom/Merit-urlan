"use client";

import { useEffect } from "react";

// Мэдэгдлийн хуудсыг нээснээс хойш хэсэг хугацааны дараа уншсан гэж тэмдэглэнэ (шинэ нь эхлээд тодорч харагдана).
export function MarkReadOnView({ action }: { action: () => Promise<void> }) {
  useEffect(() => {
    const timer = window.setTimeout(() => void action(), 1500);
    return () => window.clearTimeout(timer);
  }, [action]);
  return null;
}
