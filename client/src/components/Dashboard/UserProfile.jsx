import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, updateUser } from "../../redux/slice/auth/authThunk";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    setNewUsername(user?.username || "");
  }, [user]);

  const handleUpdate = () => {
    if (!newUsername.trim()) return;
    dispatch(updateUser({ userId: user._id, username: newUsername.trim() }));
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteUser(user._id));
    setDeleteModalOpen(false);
  };

  const stats = [
    { label: "Uploads", value: user?.totalUploads ?? 0 },
    { label: "Downloads", value: user?.totalDownloads ?? 0 },
    { label: "Documents", value: user?.documentCount ?? 0 },
    { label: "Images", value: user?.imageCount ?? 0 },
  ];

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-4xl font-bold text-white shadow-xl shadow-cyan-500/20">
              {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {user?.fullname || "User Profile"}
              </h2>
              <p className="mt-1 text-slate-400">@{user?.username || "username"}</p>
              <p className="mt-1 text-sm text-slate-300">{user?.email || ""}</p>
              <p className="mt-1 text-xs text-slate-500">
                User ID: {user?._id || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-[#111827]/80 p-4 text-center"
              >
                <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={() => setEditModalOpen(true)}
          className="rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
        >
          Edit Profile
        </button>

        <button
          onClick={() => setDeleteModalOpen(true)}
          className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-3 font-semibold text-rose-300 transition hover:bg-rose-500/20"
        >
          Delete Account
        </button>
      </div>

      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Update Username</h3>
            <p className="mt-1 text-sm text-slate-400">
              Change how your username appears on CloudDrop.
            </p>

            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="mt-5 w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
              placeholder="Enter username"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-slate-400">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-2xl bg-rose-500/15 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;