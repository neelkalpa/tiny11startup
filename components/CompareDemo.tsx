import React from "react";
import { Compare } from "@/components/ui/compare";

export function CompareDemo() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex items-center justify-center">
      <div className="w-full aspect-video border-2 border-white rounded-lg dark:bg-neutral-900 bg-neutral-100 overflow-hidden shadow-lg">
        <Compare
          firstImage="/Before.jpg"
          secondImage="/After.jpg"
          firstImageClassName="object-cover w-full h-full"
          secondImageClassname="object-cover w-full h-full"
          className="w-full h-full"
          slideMode="hover"
          autoplay={true}
        />
      </div>
    </div>
  );
}
