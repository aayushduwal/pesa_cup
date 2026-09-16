import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import photo1 from "../assets/Gallery/1.jpg";
import photo4 from "../assets/Gallery/4.jpg";
import photoTeam from "../assets/Gallery/team.jpg";
import "../css/Gallery.css";
import { fetchGalleryImages } from "../data/apis/api.gallerys";
import API_BASE_URL from "../data/apis/config";

const UPLOADS_ORIGIN = API_BASE_URL.replace(/\/api\/v1$/, "");

const staticCategories = [
  {
    id: "match",
    label: "Match Photos",
    defaultCover: photo1,
    description: "Action shots from the tournament",
    fallbackCount: 6,
  },
  {
    id: "team",
    label: "Team Photos",
    defaultCover: photoTeam,
    description: "Participated team photos only",
    fallbackCount: 1,
  },
  {
    id: "celebration",
    label: "Celebrations",
    defaultCover: photo4,
    description: "Trophy Celebrations",
    fallbackCount: 1,
  },
];

const resolveImageUrl = (rawUrl) => {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http") || rawUrl.startsWith("data:")) {
    return rawUrl;
  }
  return `${UPLOADS_ORIGIN}${rawUrl}`;
};

export default function Gallery({ isHomePage = false }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        setLoading(true);
        const response = await fetchGalleryImages();
        setGalleryItems(response.data || response || []);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        setError("Unable to load gallery images at this time.");
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const category = staticCategories.find((c) => c.id === categoryId);

  if (categoryId && !category) {
    return (
      <div className="gallery-page-error container">
        <p>Category not found</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  const getCategoryCount = (catId, fallbackCount) => {
    if (!Array.isArray(galleryItems)) return fallbackCount;
    const count = galleryItems.filter((item) => item.category === catId).length;
    return count > 0 ? count : fallbackCount;
  };

  const getCategoryCover = (catId, defaultCover) => {
    if (catId === "team") {
      return defaultCover; // Always keeps ../assets/Gallery/team.jpg for Team Photos card
    }
    if (!Array.isArray(galleryItems)) return defaultCover;
    const categoryPhotos = galleryItems.filter(
      (item) => item.category === catId,
    );
    if (categoryPhotos.length > 0) {
      const latestPhoto = categoryPhotos[categoryPhotos.length - 1];
      const rawPath =
        latestPhoto.mediaUrl || latestPhoto.imageUrl || latestPhoto.src;
      return rawPath ? resolveImageUrl(rawPath) : defaultCover;
    }
    return defaultCover;
  };

  return (
    <div
      className={`gallery-landing${isHomePage ? " gallery-landing--embedded" : ""}`}
    >
      <div className="container">
        <div className="gallery-hero">
          <h1 className="gallery-hero-title">Gallery</h1>
          <p className="gallery-hero-sub">Tournament moments and highlights</p>
          <div className="gallery-hero-line" />
        </div>

        {loading && <div className="gallery-loading">Loading photos...</div>}
        {error && <div className="gallery-error-msg">{error}</div>}

        {!loading && !error && (
          <div className="gallery-categories">
            {staticCategories.map((cat, i) => {
              const count = getCategoryCount(cat.id, cat.fallbackCount);
              const coverImg = getCategoryCover(cat.id, cat.defaultCover);

              return (
                <div
                  key={cat.id}
                  className="gcat-card"
                  onClick={() => navigate(`/gallery/${cat.id}`)}
                >
                  <div className="gcat-img-wrap">
                    <img src={coverImg} alt={cat.label} className="gcat-img" />
                    <div className="gcat-img-overlay" />
                  </div>
                  <div className="gcat-body">
                    <span className="gcat-number">0{i + 1}</span>
                    <h3 className="gcat-label">{cat.label}</h3>
                    <p className="gcat-desc">{cat.description}</p>
                    <div className="gcat-footer">
                      <span className="gcat-count">{count} photos</span>
                      <span className="gcat-arrow">VIEW →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
