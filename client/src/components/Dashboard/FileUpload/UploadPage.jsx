import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../../redux/slice/file/fileThunk";
import { toast } from "react-toastify";

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.file);
  const { user } = useSelector((state) => state.auth);

  const [files, setFiles] = useState([]);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (fileList) => {
    const incomingFiles = Array.from(fileList || []);
    const newFiles = incomingFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024
    );

    if (newFiles.length === 0) {
      toast.error("Only files up to 10MB are allowed.");
      return;
    }

    setFiles((prev) => [...prev, ...newFiles]);
    toast.success("File(s) added!");
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info("File removed");
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  const formatSize = (size) => {
    if (size > 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    if (size > 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${size} Bytes`;
  };

  const getFileIcon = (type = "") => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.startsWith("video/")) return "🎬";
    if (type.startsWith("audio/")) return "🎵";
    if (type === "application/pdf") return "📄";
    return "📁";
  };

  const getFileLabel = (type = "") => {
    if (type.startsWith("image/")) return "Image";
    if (type.startsWith("video/")) return "Video";
    if (type.startsWith("audio/")) return "Audio";
    if (type === "application/pdf") return "PDF";
    return "File";
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("userId", user?._id || user?.id || "");
    formData.append("hasExpiry", enableExpiry);

    if (enableExpiry && expiryDate) {
      const hours = Math.ceil(
        (new Date(expiryDate) - new Date()) / (1000 * 60 * 60)
      );
      formData.append("expiresAt", hours);
    }

    formData.append("isPassword", enablePassword);
    if (enablePassword && password) {
      formData.append("password", password);
    }

    try {
      await dispatch(uploadFile(formData)).unwrap();
      toast.success("Files uploaded successfully!");
      setFiles([]);
      setPassword("");
      setExpiryDate("");
      setEnablePassword(false);
      setEnableExpiry(false);
      window.location.reload();
    } catch (err) {
      toast.error(err?.error || "Upload failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-3xl shadow-lg shadow-cyan-500/20">
            ☁️
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Upload Center
          </h1>
          <p className="mt-3 text-slate-400">
            Upload and securely share files with password and expiry options.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onClick={handleBrowseClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`mt-8 cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 sm:p-12 ${
            isDragging
              ? "border-cyan-400 bg-cyan-500/10"
              : "border-cyan-500/25 bg-[#111827]/80 hover:border-cyan-400 hover:bg-[#151f2f]"
          }`}
        >
          <div className="text-5xl sm:text-6xl">📤</div>

          <h3 className="mt-4 text-2xl font-semibold text-white">
            Drag & Drop Files
          </h3>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            JPG, PNG, PDF, MP4, MOV, AVI, MKV — Max 10MB each
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBrowseClick();
            }}
            className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
          >
            Browse Files
          </button>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept=".jpg,.jpeg,.webp,.png,.mp4,.avi,.mov,.mkv,.mk3d,.mks,.mka,.pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Options */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Password Protection
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Add a password before sharing
              </p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={enablePassword}
                onChange={(e) => setEnablePassword(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-slate-600 transition peer-checked:bg-cyan-500">
                <div
                  className={`mt-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    enablePassword ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </label>
          </div>

          {enablePassword && (
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Expiry Date
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Automatically expire the share link
              </p>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={enableExpiry}
                onChange={(e) => setEnableExpiry(e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-slate-600 transition peer-checked:bg-cyan-500">
                <div
                  className={`mt-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                    enableExpiry ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </label>
          </div>

          {enableExpiry && (
            <input
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          )}
        </div>
      </div>

      {/* Summary */}
      {files.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="text-xl font-semibold text-white">Upload Summary</h3>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#111827] p-4">
              <p className="text-sm text-slate-400">Files Selected</p>
              <p className="mt-2 text-3xl font-bold text-cyan-400">
                {files.length}
              </p>
            </div>

            <div className="rounded-2xl bg-[#111827] p-4">
              <p className="text-sm text-slate-400">Total Size</p>
              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {formatSize(totalSize)}
              </p>
            </div>
          </div>

          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all"
              style={{
                width: `${Math.min((totalSize / (5 * 1024 * 1024)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Selected Files */}
      {files.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-400 shadow-xl backdrop-blur-xl">
          No files selected yet
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="rounded-3xl border border-white/10 bg-[#111827]/85 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                  {getFileIcon(file.type)}
                </div>

                <button
                  onClick={() => removeFile(index)}
                  className="rounded-xl bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-300 transition hover:bg-rose-500/20"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                  {getFileLabel(file.type)}
                </span>
              </div>

              <h3 className="mt-3 truncate text-lg font-semibold text-white">
                {file.name}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {formatSize(file.size)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleUpload}
          disabled={loading || files.length === 0}
          className="rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-cyan-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Uploading..." : "Upload Files"}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;