import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./SideBar";
import StatsGrid from "./StatesGrid";
import UserProfile from "./UserProfile";
import UploadPage from "./FileUpload/UploadPage";
import FileShow from "./FileShow";
import Logout from "./Logout";


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-white shadow-2xl">
          Loading CloudDrop...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_30%),linear-gradient(to_bottom,_#0f172a,_#111827)] text-white">
        <div className="flex min-h-screen">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />

          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-7xl">
                {activeTab === "home" && (
                  <div className="space-y-6">
                   

                    <StatsGrid />
                    <FileShow />
                  </div>
                )}

                {activeTab === "upload" && (
                  <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                    <UploadPage />
                  </section>
                )}

                {activeTab === "profile" && (
                  <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
                    <UserProfile />
                  </section>
                )}


                {activeTab === "logout" && <Logout />}
              </div>
            </main>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default Dashboard;