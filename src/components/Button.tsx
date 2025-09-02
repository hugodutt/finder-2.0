import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={
        "relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] transition font-medium text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed " +
        (props.className ?? "")
      }
    >
      {children}
    </button>
  );
}
