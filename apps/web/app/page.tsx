import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/staff");
  }
}
