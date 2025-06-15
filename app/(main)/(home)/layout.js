import { Navbar, Sidebar } from "@/components";

export default function homeLayout({ children }) {
  return (
    <div className="mb-5">
      <Navbar />
      <div className="w-full flex">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
