
import * as React from "react";

export const Loading: React.FC = () => {
  return (
    <div className="flex space-x-2 justify-center items-center">
      {["0s", "0.2s", "0.4s"].map((animationDelay, idx) => {
        return (
          <div
            key={idx}
            className="w-3 h-3 bg-slate-200 rounded-full animate-bounce"
            style={{ animationDelay: animationDelay }}
          ></div>
        );
      })}
    </div>
  );
};
