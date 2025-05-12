import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            <div className="text-sm text-gray-500">
              {session.user.name}님 환영합니다
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">직원 관리</h2>
              <p className="text-blue-700">직원 정보 및 권한 관리</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-2">메뉴 관리</h2>
              <p className="text-green-700">메뉴 및 가격 관리</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-900 mb-2">통계</h2>
              <p className="text-purple-700">매출 및 주문 통계</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 