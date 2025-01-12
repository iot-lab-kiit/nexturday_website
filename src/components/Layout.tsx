import React from "react";
import Navbar from "./Navbar";
import Carousel from "./Carousel";
import Footer from "./Footer";
import { Outlet } from "react-router";


const Layout: React.FC = () => {
  const images = [
    "https://images.pexels.com/photos/29532721/pexels-photo-29532721/free-photo-of-modern-interior-of-oculus-world-trade-center.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/30159434/pexels-photo-30159434/free-photo-of-intricate-floral-patterns-at-sheikh-zayed-mosque.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    "https://images.pexels.com/photos/30138707/pexels-photo-30138707/free-photo-of-close-up-of-vibrant-green-palm-leaf-pattern.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  ];

  return (
    <div style={{ backgroundColor: "#0F0C13" }}>
      <Navbar />
      <main>
        <Outlet />
        <Carousel images={images} />
        
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
