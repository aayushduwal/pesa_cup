import Fixtures from "../components/Fixtures";
import Gallery from "../components/Gallery";
import Hero from "../components/Hero";
import Sponsors from "../components/Sponsors";
import StandingsSection from "../components/Standings";
import Statistics from "../components/Statistics";
import TopScorersList from "../components/TopScorersList";
import TournamentsSection from "../components/TournamentsSection";

export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <TournamentsSection isHomePage={true} />
      <Fixtures />
      <StandingsSection />
      <TopScorersList />
      <Statistics />
      <Gallery isHomePage />
      <Sponsors />
    </main>
  );
}
