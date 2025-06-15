import { headers } from "next/headers";
import { redirect } from "next/navigation";
import UserProvider from "@/components/UserProvider";

export default async function MainLayout({ children }) {
  const headersList = await headers();
  const cookie = headersList.get("cookie") || "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/getUser`,
    {
      headers: { Cookie: cookie },
      cache: "no-store",
    }
  );

  if (!res.ok) return redirect("/auth/login");

  const user = await res.json();

  return <UserProvider user={user}>{children}</UserProvider>;
}
