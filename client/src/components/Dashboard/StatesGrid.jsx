import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slice/auth/authThunk";

const StatsGrid = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (user && user.id && !hasFetched.current) {
      dispatch(getUser(user.id));
      hasFetched.current = true;
    }
  }, [user, dispatch]);

  const cards = useMemo(
    () => [
      {
        title: "Total Uploads",
        value: user?.totalUploads ?? 0,
        icon: "📤",
        accent: "from-emerald-400 to-teal-500",
      },
      {
        title: "Total Downloads",
        value: user?.totalDownloads ?? 0,
        icon: "📥",
        accent: "from-blue-400 to-cyan-500",
      },
      {
        title: "Videos Uploaded",
        value: user?.videoCount ?? 0,
        icon: "🎬",
        accent: "from-violet-400 to-fuchsia-500",
      },
      {
        title: "Images Uploaded",
        value: user?.imageCount ?? 0,
        icon: "🖼️",
        accent: "from-amber-400 to-orange-500",
      },
      {
        title: "Documents Uploaded",
        value: user?.documentCount ?? 0,
        icon: "📄",
        accent: "from-rose-400 to-pink-500",
      },
      {
        title: "Last Login",
        value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A",
        icon: "⏰",
        accent: "from-slate-400 to-slate-500",
      },
    ],
    [user]
  );

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back, {user?.fullname || "User"} 👋
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Here is a quick snapshot of your file activity.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            {user?.email || "user@example.com"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/80 p-5 shadow-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.accent}`} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-400">{card.title}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-xl shadow-lg`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsGrid;