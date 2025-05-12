"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">로딩 중...</h2>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
            내 정보
          </h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <div className="mt-1 text-lg text-gray-900">
              {session.user?.email}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              이름
            </label>
            <div className="mt-1 text-lg text-gray-900">
              {session.user?.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 