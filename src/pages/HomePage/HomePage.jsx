import Navbar from "../../Components/User/Navbar/Navbar";
import BannerSlider from "../../Components/User/BannerSlider/BannerSlider";
import AboutFoundation from "../../Components/User/AboutFoundation/AboutFoundation";
import FocusAreas from "../../Components/User/FocusAreas/FocusAreas";
import PartnerHospitals from "../../Components/User/PartnerHospitals/PartnerHospitals";
import UpcomingEvents from "../../Components/User/UpcomingEvents/UpcomingEvents";
import Testimonials from "../../Components/User/Testimonials/Testimonials";
import DonateVolunteerCTA from "../../Components/User/DonateVolunteerCTA/DonateVolunteerCTA";
import Footer from "../../Components/User/Footer/Footer";

export default function HomePage() {
  return (
    <>
      {/* HEADER */}
      <Navbar />

      {/* SECTION 1: HERO / BANNER */}
      <section id="home-banner" className="pt-17">
        <BannerSlider />
      </section>

      {/* SECTION 2: ABOUT FOUNDATION */}
      <section id="about" className="scroll-mt-20">
        <AboutFoundation />
      </section>

      {/* SECTION 3: FOCUS AREAS */}
      <section id="focus-areas" className="scroll-mt-20">
        <FocusAreas />
      </section>

      {/* SECTION 4: PARTNER HOSPITALS */}
      <section id="partners" className="scroll-mt-20">
        <PartnerHospitals />
      </section>

      {/* SECTION 5: UPCOMING EVENTS */}
      <section id="events" className="scroll-mt-20">
        <UpcomingEvents />
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section id="testimonials" className="scroll-mt-20">
        <Testimonials />
      </section>

      {/* SECTION 7: DONATE + VOLUNTEER CALL-TO-ACTION */}
      <section id="cta" className="scroll-mt-20">
        <DonateVolunteerCTA />
      </section>

      {/* FOOTER */}
      {<Footer />}
    </>
  );
}
