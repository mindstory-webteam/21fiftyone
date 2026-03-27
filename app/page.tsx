
import AboutSection from "@/component/Aboutsection";
import  BenefitSection  from "@/component/BenefitSection";
import BreakTheMold from "@/component/Breakthemold";
import CraftingCulture from "@/component/Craftingculture";

import CreativeStrategySection from "@/component/Creativestrategysection";
import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import HeroSection from "@/component/Herosection";
import ProjectLumina from "@/component/Projectlumina";
import ProjectsScroll from "@/component/Projectsscroll";

import SelectedWorks from "@/component/Selectedworks";
import ServicesSection from "@/component/ServicesSection";
import  StickyVideoSection  from "@/component/StickyVideoSection";

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
    
      {/* <SectionBug/> */}
     
        <FloatingNavbar />
        <HeroSection />
         <CraftingCulture />
       
        
        <BenefitSection />
        {/* <StickyVideoSection /> */}
      
     

       
          <AboutSection />

          <ProjectsScroll />
      
        {/* <ServicesSection /> */}
        {/* <CreativeStrategySection /> */}
        {/* <ProjectLumina /> */}
        {/* <SelectedWorks /> */}
        <BreakTheMold />
        <Footer />
       
   
    </div>
  );
}
