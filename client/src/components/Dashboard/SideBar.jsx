import React from "react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, setActiveTab, activeTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const tabs = [
    { name: "Home", icon: "🏠", id: "home" },
    { name: "Upload Files", icon: "📤", id: "upload" },
    { name: "Profile", icon: "👤", id: "profile" },
    
    { name: "Logout", icon: "🚪", id: "logout" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-[#111827]/95 text-white shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:static md:translate-x-0 md:shadow-none`}
    >
      <div className="flex h-full flex-col px-4 py-5">
        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-2xl shadow-lg">
  ☁️
</div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-400">
              CloudDrop
            </h1>
            <p className="text-sm text-slate-300">Secure File Sharing Platform</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                <span className="text-lg transition-transform group-hover:scale-110">
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-200">Storage Used</p>
            <span className="text-xs text-slate-400">24.8%</span>
          </div>

          <div className="h-2 w-full rounded-full bg-white/10">
            <div className="h-2 w-[25%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
          </div>

          <p className="mt-2 text-xs text-slate-400">2.48 GB / 10 GB</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;