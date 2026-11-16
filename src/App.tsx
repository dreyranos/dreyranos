import { MotionConfig } from 'motion/react';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import ScrollProgressBar from './components/ScrollProgressBar';
import {
  IntroCurtain,
  ScreenBridge,
  ScreenPagerRail,
  CustomCursor,
  CurvedDrawerNav,
} from './components/AquaEffects';
import HeroSection from './components/HeroSection';
import ManifestoSection from './components/ManifestoSection';
import ProjectsSection from './components/ProjectsSection';
import ServicesSection from './components/ServicesSection';
import ExperienceSection from './components/ExperienceSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactFooter from './components/ContactFooter';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#060609] text-[#F5F4FA] flex flex-col relative">
        <AnimatedBackground />
        <IntroCurtain />
        <CustomCursor />
        <ScrollProgressBar />
        <Navbar />
        <ScreenPagerRail />
        <CurvedDrawerNav />
        <main className="flex-1 relative z-10">
          <HeroSection />
          <ScreenBridge num="01" label="Sobre Andrey Ramos" targetId="sobre" />
          <ManifestoSection />
          <ScreenBridge num="02" label="Projetos & Arquitetura" targetId="projetos" />
          <ProjectsSection />
          <ScreenBridge num="03" label="Áreas de Atuação" targetId="atuacao" />
          <ServicesSection />
          <ScreenBridge num="04" label="Trajetória Profissional" targetId="trajetoria" />
          <ExperienceSection />
          <ScreenBridge num="05" label="Depoimentos & Impacto" targetId="depoimentos" />
          <TestimonialsSection />
          <ScreenBridge num="06" label="Contato Direto" targetId="contato" />
        </main>
        <ContactFooter />
      </div>
    </MotionConfig>
  );
}
