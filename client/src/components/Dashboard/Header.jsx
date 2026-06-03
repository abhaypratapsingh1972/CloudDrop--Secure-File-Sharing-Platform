import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";

const colorMap = {
  pink: "bg-pink-500",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
};

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [mode, setModeState] = useState("light");
  const [theme, setThemeState] = useState("pink");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "pink";
    const savedMode = localStorage.getItem("mode") || "light";
    setThemeState(savedTheme);
    setModeState(savedMode);
    document.body.setAttribute("data-theme", savedTheme);
    document.body.setAttribute("data-mode", savedMode);
  }, []);

  const applyTheme = (newTheme) => {
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setThemeState(newTheme);
    setThemeDropdownOpen(false);
  };

  const applyMode = (newMode) => {
    document.body.setAttribute("data-mode", newMode);
    localStorage.setItem("mode", newMode);
    setModeState(newMode);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f172a]/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="rounded-xl p-2 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="PasteBox Logo" className="h-10 w-10 rounded-xl" />
            <div>
              <h1 className="text-2xl font-bold text-emerald-400">CloudDrop</h1>
              <p className="text-sm text-slate-400">Secure File Sharing Platform</p>
            </div>
          </Link>
        </div>

        <div className="mx-4 hidden flex-1 max-w-xl lg:block">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300">
            <span className="text-lg">🔎</span>
            <input
              type="text"
              placeholder="Search files..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={mode === "dark"}
              onChange={() => applyMode(mode === "light" ? "dark" : "light")}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-slate-600 transition peer-checked:bg-emerald-500">
              <div
                className={`mt-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  mode === "dark" ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
          </label>

          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg shadow-lg transition hover:bg-white/10"
              aria-label="Theme settings"
            >
              🎨
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-3 rounded-2xl border border-white/10 bg-[#111827] p-3 shadow-2xl">
                <div className="flex gap-2">
                  {Object.keys(colorMap).map((color) => (
                    <button
                      key={color}
                      onClick={() => applyTheme(color)}
                      className={`h-6 w-6 rounded-full ring-2 ring-transparent transition hover:scale-110 hover:ring-white/40 ${colorMap[color]}`}
                      aria-label={`${color} theme`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 font-bold text-white">
              {user?.fullname?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden leading-tight sm:block">
              <h3 className="text-sm font-semibold text-white">{user?.fullname || "User"}</h3>
              <p className="text-xs text-slate-400">{user?.email || "user@example.com"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;