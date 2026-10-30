"use client";

import { useEffect, useState } from "react";

import { subscribeMock } from "@/lib/mock/store";

// lib/data-ийн async функцыг ачаалж, mock өгөгдөл өөрчлөгдөхөд (захиалга, админ засвар) дахин уншина.
// `load`-ийг useCallback-аар тогтвортой болгож дамжуулна.
export function useData<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    const run = () =>
      load().then((value) => {
        if (alive) setData(value);
      });
    run();
    const unsubscribe = subscribeMock(run);
    return () => {
      alive = false;
      unsubscribe();
    };
  }, [load]);

  return { data, loading: data === undefined };
}
