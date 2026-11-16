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
import { PrefsProvider, useContent } from './prefs';

function Shell() {
  const { screens } = useContent();
  const label = (id: string) => screens.find((screen) => screen.id === id)?.label ?? id;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col relative">
        <AnimatedBackground />
        <IntroCurtain />
        <CustomCursor />
        <ScrollProgressBar />
        <Navbar />
        <ScreenPagerRail />
        <CurvedDrawerNav />
        <main className="flex-1 relative z-10">
          <HeroSection />
          <ScreenBridge num="01" label={label('sobre')} targetId="sobre" />
          <ManifestoSection />
          <ScreenBridge num="02" label={label('projetos')} targetId="projetos" />
          <ProjectsSection />
          <ScreenBridge num="03" label={label('atuacao')} targetId="atuacao" />
          <ServicesSection />
          <ScreenBridge num="04" label={label('trajetoria')} targetId="trajetoria" />
          <ExperienceSection />
          <ScreenBridge num="05" label={label('depoimentos')} targetId="depoimentos" />
          <TestimonialsSection />
          <ScreenBridge num="06" label={label('contato')} targetId="contato" />
        </main>
        <ContactFooter />
      </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <PrefsProvider>
      <Shell />
    </PrefsProvider>
  );
}
