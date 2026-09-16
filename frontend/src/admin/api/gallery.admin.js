import { adminFetch } from "./adminClient";

export const GalleryAdminAPI = {
  /** file: File, meta: { category, caption, sortOrder, ... } */
  upload: (file, meta = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    Object.entries(meta).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    return adminFetch("/gallery", { method: "POST", body: formData });
  },

  update: (id, meta) =>
    adminFetch(`/gallery/${id}`, { method: "PATCH", body: meta }),
  remove: (id) => adminFetch(`/gallery/${id}`, { method: "DELETE" }),
};
