import AboutSection from "@/component/Aboutsection";
import BreakTheMold from "@/component/Breakthemold";

import CreativeStrategySection from "@/component/Creativestrategysection";
import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import HeroSection from "@/component/Herosection";

import SelectedWorks from "@/component/Selectedworks";
import ServicesSection from "@/component/ServicesSection";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
      {/* <BugCursor /> */}
      {/* <SectionBug/> */}
     
        <FloatingNavbar />
        <HeroSection />
        <AboutSection />
        
        <ServicesSection />
        <CreativeStrategySection />
        <SelectedWorks />
        <BreakTheMold />
        <Footer />
       
   
    </div>
  );
}
