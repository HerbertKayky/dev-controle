"use client";
import { useRouter } from "next/navigation";
import { FiRefreshCcw } from "react-icons/fi";

export function ButtonRefresh() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.refresh()}
      className="bg-gray-700 px-2 py-1 rounded"
    >
      <FiRefreshCcw size={24} color="#FFF" />
    </button>
  );
}
