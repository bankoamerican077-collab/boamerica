// components/LoadingSpinner.tsx
"use client";

export default function LoadingSpinner({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        style={{ width: size, height: size }}
        className="relative animate-spin"
      >
        {/* Blue ring */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent"></div>

        {/* Red ring (slightly smaller for layered effect) */}
        <div className="absolute inset-1 rounded-full border-4 border-red-500 border-b-transparent"></div>
      </div>
    </div>
  );
}
