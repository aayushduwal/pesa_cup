import { Link } from "react-router-dom";
import banner from "../assets/banner.png";
import "../css/Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-media">
        <img src={banner} alt="Futsal Tournament Banner" className="hero-img" />
      </div>
      <div className="hero-text">
        <h1 className="hero-title">
          <span className="highlight">PRABHAT ENGLISH</span>
          <span className="highlight">SECONDARY SCHOOL</span>
          <span className="highlight-accent">PESA CUP 2083</span>
        </h1>
        <p className="hero-subtitle">
          Organized by PESA (Prabhat Ex-Students Association)
        </p>
        <p className="hero-description">
          Welcome to Prabhat English Secondary School Futsal Tournament.
          <br />
          Catch live scores and tournament updates!
          <br />
          <br />
          Organized by 2076 Batch.
        </p>

        <div className="hero-buttons">
          <Link to="/fixtures" className="btn btn-primary">
            VIEW FIXTURES
          </Link>
          <Link to="/standings" className="btn btn-secondary">
            VIEW STANDINGS
          </Link>
          <Link to="/register" className="btn btn-secondary">
            REGISTER TEAM
          </Link>
        </div>
      </div>
    </section>
  );
}
