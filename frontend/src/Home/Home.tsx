import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Particles from "@/components/ui/particles";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Navbar from "@/AddedWidget/Navbar";
import './Home.css'
import BentoDemo from "./BentoDemo";
import { Globe } from "@/components/ui/globe";
import Footer from "@/AddedWidget/Footer";
// import MarqueeDemo from "./Marqueedemo";

function Home() {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <>
      <Navbar />
      <div className="home-1">
        <div className="home-2">
          <h1>The Ultimate Platform for Smart Urban Management</h1>
          <p>Need more than urban management tools? MetroMinds provides embeddable interfaces and intuitive dashboards for efficient urban management.</p>
          <RainbowButton style={{ marginTop: '2%', fontFamily: 'Poppins', fontWeight: '400', letterSpacing: '0.7px', fontSize: '13px' }}>Start building for free</RainbowButton>
        </div>
        <Particles
          className="absolute inset-0"
          quantity={1000}
          ease={80}
          color={color}
          refresh
        />
      </div>

      <div className="home-3">
        <div className="home-5">
          <h1>Everything You Need for Urban Management</h1>
          <p>Ever feel like urban management needs evolve constantly? MetroMinds adapts to the latest trends and best practices to ensure efficient city operations.</p>
        </div>
        <div className="home-4">
          <BentoDemo />
        </div>
      </div>


      <div className="home-6">
        <div className="home-7">
          <div className="home-8">
            <Globe />
          </div>
        </div>
        <div className="home-7">
          <div className="home-9">
            <h1>Transforming India with Sustainable Urban Management</h1>
            <p>Ready to explore? Visit the MetroMinds dashboard for intuitive tools and interfaces that streamline urban management.</p>
            <RainbowButton style={{ marginTop: '2%', fontFamily: 'Poppins', fontWeight: '400', letterSpacing: '0.7px', fontSize: '13px' }}>Go to dashboard</RainbowButton>
          </div>
        </div>
      </div>

      <div className="home-10">

      </div>

      <Footer/>
    </>
  );
}

export default Home;

