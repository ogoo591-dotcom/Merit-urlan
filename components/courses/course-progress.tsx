"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback } from "react";

import { getCompletedLessons } from "@/lib/data/progress";
import { useData } from "@/lib/data/use-data";

export function useCourseProgress(courseId: string, lessonIds: string[]) {
  const { user } = useUser();
  const userId = user?.id;
  const { data: completed = [] } = useData(useCallback(() => getCompletedLessons(userId, courseId), [userId, courseId]));
  const done = lessonIds.filter((id) => completed.includes(id));
  return {
    userId,
    completed,
    percent: lessonIds.length ? Math.round((done.length / lessonIds.length) * 100) : 0,
    doneCount: done.length,
  };
}

export function CourseProgressBar({ courseId, lessonIds }: { courseId: string; lessonIds: string[] }) {
  const { percent, doneCount } = useCourseProgress(courseId, lessonIds);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-[#7a6b63]">
        <span>
          {doneCount}/{lessonIds.length} хичээл
        </span>
        <span className="font-semibold text-[#2f2420]">{percent}%</span>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-[#f1e6e0]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Сургалтын явц"
      >
        <div className="h-full rounded-full bg-[#a24456] transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
