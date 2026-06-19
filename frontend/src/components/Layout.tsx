import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="bg-background min-h-screen">
      <TopNav />
      <Sidebar />
      <main className="pt-14 md:pl-sidebar-width min-h-screen">
        <div className="max-w-[1280px] mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
