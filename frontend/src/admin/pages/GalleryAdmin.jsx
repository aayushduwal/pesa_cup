import { useEffect, useState } from "react";
import "../../css/Gallery.css";
import {
  deleteGalleryImage,
  fetchGalleryImages,
  uploadGalleryImage,
} from "../../data/apis/api.gallerys";
import AdminModal from "../components/AdminModal";
import "../css/Admin.css";

const resolveImageUrl = (rawUrl) => {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http") || rawUrl.startsWith("data:")) {
    return rawUrl;
  }
  return `http://localhost:3000${rawUrl}`;
};

export default function GalleryAdmin() {
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("match");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const setFeedbackMessage = (type, text) => {
    setMessage({ type, text });
    if (type === "success") {
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    }
  };

  const loadPhotos = async () => {
    try {
      setLoadingPhotos(true);
      const response = await fetchGalleryImages();
      const items = response.data || response || [];
      setPhotos([...items].reverse()); // Newest first
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("title", title);
    if (description) {
      formData.append("description", description);
    }
    formData.append("category", category);
    formData.append("file", file);

    try {
      setSubmitting(true);
      await uploadGalleryImage(formData);

      setTitle("");
      setDescription("");
      setFile(null);
      e.target.reset();

      setFeedbackMessage("success", "Image uploaded successfully!");
      loadPhotos();
    } catch (err) {
      console.error(err);
      setFeedbackMessage(
        "error",
        err?.response?.data?.message ||
          "Failed to upload image. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId || deleting) return;

    const idToDelete = deleteId;
    setDeleting(true);

    try {
      await deleteGalleryImage(idToDelete);
      setDeleteId(null);
      setFeedbackMessage("success", "Image deleted successfully!");
      loadPhotos();
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteId(null);
      setFeedbackMessage(
        "error",
        err?.response?.data?.message ||
          "Failed to delete image. Item may already be removed.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-gallery-page">
      <h2>Gallery Management</h2>

      <form onSubmit={handleUpload} className="upload-form">
        <h3>Add New Photo</h3>

        {message.text && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "6px",
              marginBottom: "15px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor:
                message.type === "success" ? "#1e4620" : "#4a151b",
              color: message.type === "success" ? "#a3e635" : "#fca5a5",
              border: `1px solid ${
                message.type === "success" ? "#2e6830" : "#7f1d1d"
              }`,
            }}
          >
            {message.text}
          </div>
        )}

        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div>
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="match">Match Photos</option>
            <option value="team">Team Photos</option>
            <option value="celebration">Celebrations</option>
          </select>
        </div>

        <div>
          <label>File:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Uploading..." : "Upload Image"}
        </button>
      </form>

      <div className="admin-photo-list">
        <h3>Current Images ({photos.length})</h3>
        {loadingPhotos ? (
          <div style={{ padding: "20px", color: "#94a3b8" }}>
            Loading images...
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title & Description</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((item) => {
                  const itemId = item.id || item._id;
                  const rawPath = item.mediaUrl || item.imageUrl || item.src;
                  return (
                    <tr key={itemId}>
                      <td>
                        <img
                          src={resolveImageUrl(rawPath)}
                          alt={item.title}
                          className="receipt-cell-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23334155'/%3E%3Ctext x='50%25' y='50%25' fill='%2394a3b8' font-size='10' dominant-baseline='middle' text-anchor='middle'%3EN/A%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </td>
                      <td className="admin-table-strong">
                        <div>{item.title}</div>
                        {item.description && (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              fontWeight: "normal",
                              marginTop: "2px",
                            }}
                          >
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td>{item.category}</td>
                      <td>
                        <button
                          className="admin-icon-btn admin-icon-btn--reject"
                          onClick={() => setDeleteId(itemId)}
                          title="Delete photo"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <AdminModal title="Confirm Deletion" onClose={() => setDeleteId(null)}>
          <p className="admin-modal-text">
            Are you sure you want to delete this photo permanently?
          </p>
          <div className="admin-modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={deleting}
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn admin-btn-danger"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
