
import About1 from "@/component/About1";
import AboutSection from "@/component/Aboutsection";


import  BenefitSection  from "@/component/BenefitSection";
import BreakTheMold from "@/component/Breakthemold";


import Features from "@/component/Features";
import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import HeroSection from "@/component/Herosection";

import ProjectsScroll from "@/component/Projectsscroll";



import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
    
      {/* <SectionBug/> */}
     
        <FloatingNavbar />
        <HeroSection />
         {/* <CraftingCulture /> */}
         <About1/> 

          <AboutSection />
           
          <Features/>
       
        
        <BenefitSection />
        {/* <StickyVideoSection /> */}
      
     

       
         

          <ProjectsScroll />
      
    
        <BreakTheMold />
        <Footer />
       
   
    </div>
  );
}
