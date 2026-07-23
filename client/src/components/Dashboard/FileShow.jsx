import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFiles } from "../../redux/slice/file/fileThunk";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaEnvelope,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";

const FileShow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.file);

  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;
  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(getUserFiles(userId));
    }
  }, [userId, dispatch]);

  const sortFileName = (filename = "") =>
    filename.length > 22 ? `${filename.slice(0, 22)}...` : filename;

  const getIcon = (type = "") => {
  if (type.startsWith("image/")) return "🖼️";
  if (type.startsWith("video/")) return "🎬";
  if (type.startsWith("audio/")) return "🎵";
  if (type === "application/pdf") return "📄";
  return "📁";
};
  function handleShare(shortUrl) {
    const frontendBaseUrl = window.location.origin;
    const fullUrl = `${frontendBaseUrl}${shortUrl}`;

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        "Download file: " + fullUrl
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        fullUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        fullUrl
      )}&text=Check this out!`,
      email: `mailto:?subject=Shared File&body=${encodeURIComponent(
        "Here’s your file: " + fullUrl
      )}`,
      copy: fullUrl,
      qr: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        fullUrl
      )}&size=150x150`,
    };
  }

  const downloadQRCode = async (shortUrl) => {
    const qrUrl = handleShare(shortUrl).qr;

    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("QR code download failed:", error);
      alert("Failed to download QR code. Please try again.");
    }
  };

  const filteredFiles = useMemo(() => {
    return (files || []).filter((file) => {
      const nameMatch = (file?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const typeMatch = filterType ? file.type === filterType : true;

      const statusMatch = filterStatus
        ? filterStatus === "expired"
          ? differenceInDays(new Date(file.expiresAt), new Date()) <= 0
          : differenceInDays(new Date(file.expiresAt), new Date()) > 0
        : true;

      return nameMatch && typeMatch && statusMatch;
    });
  }, [files, searchTerm, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / itemsPerPage));
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterStatus]);

  const fileTypes = [...new Set((files || []).map((f) => f.type).filter(Boolean))];

  const getFileTypeLabel = (type = "") => {
    if (type.startsWith("image/")) return "Image";
    if (type.startsWith("video/")) return "Video";
    if (type.startsWith("audio/")) return "Audio";
    if (type === "application/pdf") return "PDF";
    return "File";
  };

  const getBadgeClasses = (type = "") => {
    if (type.startsWith("image/")) return "bg-cyan-500/15 text-cyan-300 border-cyan-500/20";
    if (type.startsWith("video/")) return "bg-violet-500/15 text-violet-300 border-violet-500/20";
    if (type.startsWith("audio/")) return "bg-amber-500/15 text-amber-300 border-amber-500/20";
    if (type === "application/pdf")
      return "bg-rose-500/15 text-rose-300 border-rose-500/20";
    return "bg-slate-500/15 text-slate-300 border-slate-500/20";
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your Uploaded Files
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              Browse, preview, and share your uploads in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            Showing {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-4">
          <div className="lg:col-span-2">
<div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-slate-300">              <span>🔎</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by file name"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <select
            className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-slate-300 outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            {fileTypes.map((type) => (
              <option key={type} value={type}>
                {getFileTypeLabel(type)} ({type})
              </option>
            ))}
          </select>

          <select
            className="rounded-2xl border border-white/10 bg-[#0b1220] px-4 py-3 text-sm text-slate-300 outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {(searchTerm || filterType || filterStatus) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("");
                setFilterStatus("");
              }}
              className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/15"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {!files || files.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300 shadow-2xl backdrop-blur-xl">
          No files uploaded yet.
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300 shadow-2xl backdrop-blur-xl">
          No files match your filters.
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {paginatedFiles.map((file) => {
              const formattedSize =
                file.size > 1024 * 1024
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : file.size > 1024
                  ? `${(file.size / 1024).toFixed(2)} KB`
                  : `${file.size} Bytes`;

              const isExpired =
                differenceInDays(new Date(file.expiresAt), new Date()) <= 0;

              return (
                <article
  key={file._id}
  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111827]/85 p-5 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:shadow-2xl"
>
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getBadgeClasses(file.type)}`}>
                        {getFileTypeLabel(file.type)}
                      </div>
                      <h3 className="mt-3 truncate text-lg font-semibold text-white">
  {getIcon(file.type)} {sortFileName(file.name)}
</h3>
                      <p className="mt-1 text-sm text-slate-400">{formattedSize}</p>
                    </div>

                    <div className={`rounded-2xl px-3 py-2 text-xs font-semibold border ${
                      file.status === "active"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        : "border-rose-500/20 bg-rose-500/10 text-rose-300"
                    }`}>
                      {file.status}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="text-xs text-slate-500">Downloaded</p>
                      <p className="mt-1 font-medium">{file.downloadedContent || 0}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-3">
                      <p className="text-xs text-slate-500">Expiry</p>
                      <p className={`mt-1 font-medium ${isExpired ? "text-rose-300" : "text-slate-200"}`}>
                        {isExpired
                          ? "Expired"
                          : `In ${differenceInDays(new Date(file.expiresAt), new Date())} days`}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    Uploaded{" "}
                    {formatDistanceToNowStrict(new Date(file.createdAt), {
                      addSuffix: true,
                    })}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/10 transition hover:opacity-90"
                    >
                      Preview
                    </button>

                    <button
                      onClick={() => setShareFile(file)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                    >
                      Share
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow-xl backdrop-blur-xl">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-slate-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="truncate text-lg font-semibold text-white">
                {previewFile.name}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            {previewFile.type.startsWith("image/") && (
              <img
                src={previewFile.path}
                alt={previewFile.name}
                className="w-full rounded-2xl"
              />
            )}

            {previewFile.type.startsWith("video/") && (
              <video controls className="w-full rounded-2xl">
                <source src={previewFile.path} type={previewFile.type} />
                Your browser does not support the video tag.
              </video>
            )}

            {previewFile.type.startsWith("audio/") && (
              <audio controls className="w-full rounded-2xl">
                <source src={previewFile.path} type={previewFile.type} />
                Your browser does not support the audio element.
              </audio>
            )}

            {previewFile.type === "application/pdf" && (
              <iframe
                src={previewFile.path}
                title="PDF Preview"
                className="h-[500px] w-full rounded-2xl bg-white"
              />
            )}
          </div>
        </div>
      )}

      {shareFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="truncate text-lg font-semibold text-white">
                Share "{shareFile?.name}"
              </h3>
              <button
                onClick={() => setShareFile(null)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a
                href={handleShare(shareFile.shortUrl).whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <FaWhatsapp className="text-2xl text-green-400" />
                <span className="font-medium text-white">WhatsApp</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).twitter}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <FaTelegramPlane className="text-2xl text-sky-400" />
                <span className="font-medium text-white">Twitter / X</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).email}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <FaEnvelope className="text-2xl text-rose-400" />
                <span className="font-medium text-white">Email</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <FaInstagram className="text-2xl text-pink-400" />
                <span className="font-medium text-white">Facebook</span>
              </a>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-300">QR Code</p>
              <img
                src={handleShare(shareFile.shortUrl).qr}
                alt="QR Code"
                className="mt-3 h-32 w-32 rounded-2xl border border-white/10 bg-white p-2"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => downloadQRCode(shareFile.shortUrl)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
                >
                  <FaDownload />
                  Download QR Code
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(handleShare(shareFile.shortUrl).copy);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FileShow;
