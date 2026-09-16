import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/Gallery.css";
import { fetchGalleryImages } from "../data/apis/api.gallerys";

import photo1 from "../assets/Gallery/1.jpg";
import photo2 from "../assets/Gallery/2.jpg";
import photo3 from "../assets/Gallery/3.jpg";
import photo4 from "../assets/Gallery/4.jpg";
import photo5 from "../assets/Gallery/5.jpg";
import photo6 from "../assets/Gallery/6.jpg";
import photoBack from "../assets/Gallery/back.jpg";
import photoTeam from "../assets/Gallery/team.jpg";

const categoryMetadata = {
  match: {
    label: "Match Photos",
    description: "Action shots from the tournament",
    fallbackPhotos: [
      {
        id: "static-1",
        src: photo1,
        caption: "Match Highlights",
        description: "",
      },
      {
        id: "static-2",
        src: photo2,
        caption: "Match Highlights",
        description: "",
      },
      {
        id: "static-3",
        src: photo3,
        caption: "Match Highlights",
        description: "",
      },
      {
        id: "static-4",
        src: photo4,
        caption: "Match Highlights",
        description: "",
      },
      {
        id: "static-5",
        src: photo5,
        caption: "Match Highlights",
        description: "",
      },
      {
        id: "static-6",
        src: photo6,
        caption: "Match Highlights",
        description: "",
      },
    ],
  },
  team: {
    label: "Team Photos",
    description: "Participated team photos only",
    fallbackPhotos: [
      {
        id: "static-7",
        src: photoTeam,
        caption: "Meet our participated Teams",
        description: "",
      },
    ],
  },
  celebration: {
    label: "Celebrations",
    description: "Trophy Celebrations",
    fallbackPhotos: [
      {
        id: "static-8",
        src: photoBack,
        caption: "Trophy Celebration",
        description: "",
      },
    ],
  },
};

const resolveImageUrl = (rawUrl) => {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http") || rawUrl.startsWith("data:")) return rawUrl;
  return `http://localhost:3000${rawUrl}`;
};

export default function GalleryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const categoryInfo = categoryMetadata[categoryId];

  useEffect(() => {
    const loadCategoryPhotos = async () => {
      if (!categoryInfo) return;
      try {
        setLoading(true);
        const response = await fetchGalleryImages();
        const apiItems = response.data || response || [];

        const fetchedPhotos = apiItems
          .filter((item) => item.category === categoryId)
          .map((item) => ({
            id: item.id || item._id,
            src: resolveImageUrl(item.mediaUrl || item.imageUrl || item.src),
            caption: item.title || item.caption || "Gallery Photo",
            description: item.description || "",
          }))
          .reverse();

        // Accurate count: API priority, fallback only if empty
        if (fetchedPhotos.length > 0) {
          setPhotos(fetchedPhotos);
        } else {
          setPhotos(categoryInfo.fallbackPhotos);
        }
      } catch (err) {
        console.error("Failed to fetch gallery photos:", err);
        setPhotos(categoryInfo ? categoryInfo.fallbackPhotos : []);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryPhotos();
  }, [categoryId, categoryInfo]);

  if (!categoryInfo) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="gallery-page-error">
            <p>Category not found</p>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const lightboxIndex = photos.findIndex((p) => p.id === lightbox?.id);
  const goPrev = (e) => {
    e.stopPropagation();
    setLightbox(photos[(lightboxIndex - 1 + photos.length) % photos.length]);
  };
  const goNext = (e) => {
    e.stopPropagation();
    setLightbox(photos[(lightboxIndex + 1) % photos.length]);
  };

  return (
    <div className="page-content gallery-page">
      <div className="container">
        <div className="gallery-page-header">
          <button className="gallery-back-btn" onClick={() => navigate(-1)}>
            ← Back to Gallery
          </button>
          <div>
            <h2 className="gallery-page-title">{categoryInfo.label}</h2>
            <p className="gallery-page-desc">
              {categoryInfo.description} ({photos.length} photos)
            </p>
          </div>
        </div>

        {loading ? (
          <div
            className="gallery-loading"
            style={{ textAlign: "center", padding: "2rem" }}
          >
            <p>Loading photos...</p>
          </div>
        ) : (
          <div className="gallery-page-grid">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="gallery-item"
                onClick={() => setLightbox(photo)}
                onMouseEnter={() => setHoveredId(photo.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="gallery-img"
                />
                <div
                  className="gallery-caption"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
                    padding: "16px 12px 10px",
                    color: "#fff",
                    opacity: hoveredId === photo.id ? 1 : 0,
                    transform:
                      hoveredId === photo.id
                        ? "translateY(0)"
                        : "translateY(6px)",
                    transition: "opacity 0.25s ease, transform 0.25s ease",
                  }}
                >
                  <strong style={{ fontSize: "14px", display: "block" }}>
                    {photo.caption}
                  </strong>
                  {photo.description && (
                    <p
                      style={{
                        fontSize: "12px",
                        opacity: 0.9,
                        margin: "2px 0 0",
                        lineHeight: "1.3",
                      }}
                    >
                      {photo.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close Lightbox"
            >
              ✕
            </button>
            <button
              className="lightbox-nav prev"
              onClick={goPrev}
              aria-label="Previous Image"
            >
              ←
            </button>
            <img
              src={lightbox.src}
              alt={lightbox.caption}
              className="lightbox-img"
            />
            <button
              className="lightbox-nav next"
              onClick={goNext}
              aria-label="Next Image"
            >
              →
            </button>
            <div className="lightbox-caption" style={{ textAlign: "center" }}>
              <span
                className="lightbox-counter"
                style={{
                  display: "inline-block",
                  opacity: 0.8,
                  fontSize: "13px",
                }}
              >
                {lightboxIndex + 1} / {photos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
