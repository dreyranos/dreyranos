import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import { NeuralCanvas } from './components/NeuralCanvas';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { SeoHelmet } from './components/SeoHelmet';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ExpertiseSection } from './components/ExpertiseSection';
import { ArchitectureSection } from './components/ArchitectureSection';
import { StackSection } from './components/StackSection';
import { ExperienceSection } from './components/ExperienceSection';
import { GitHubSection } from './components/GitHubSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { SectionDivider } from './components/SectionDivider';
import { NotFound } from './components/NotFound';
import { Footer } from './components/Footer';
import { FloatingLanguageToggle } from './components/FloatingLanguageToggle';
import { ScrollToTop } from './components/ScrollToTop';
import { type Lang, type Theme } from './data/portfolioData';

const VALID_PATHS = new Set(['/', '/index.html']);

function normalizePathname(rawPath: string): string {
  if (!rawPath || rawPath === '/') return '/';
  const trimmed = rawPath.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('ar_lang');
      return saved === 'en' ? 'en' : 'pt';
    } catch {
      return 'pt';
    }
  });

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('ar_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  const normalizedPath = normalizePathname(pathname);
  const isNotFound = !VALID_PATHS.has(normalizedPath);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigateHome = useCallback((sectionHash?: string) => {
    const targetUrl = sectionHash && sectionHash !== '#topo' ? `/${sectionHash}` : '/';
    window.history.pushState({}, '', targetUrl);
    setPathname('/');

    window.setTimeout(() => {
      if (sectionHash && sectionHash !== '#topo') {
        const target = document.querySelector(sectionHash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ar_lang', lang);
    } catch {
      // Ignore storage failures
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('ar_theme', theme);
    } catch {
      // Ignore storage failures
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <HelmetProvider>
      <SeoHelmet lang={lang} isNotFound={isNotFound} />
      <MotionConfig reducedMotion="user">
        <div className="min-h-screen flex flex-col">
          {!isNotFound && <ScrollProgressBar />}
          <NeuralCanvas theme={theme} />
          <Header
            lang={lang}
            isNotFound={isNotFound}
            onNavigateHome={handleNavigateHome}
          />
          <main className="flex-1 flex flex-col">
            {isNotFound ? (
              <NotFound
                lang={lang}
                attemptedPath={pathname}
                onNavigateHome={handleNavigateHome}
              />
            ) : (
              <>
                <HeroSection
                  lang={lang}
                  theme={theme}
                  onToggleLang={setLang}
                  onToggleTheme={setTheme}
                />
                <SectionDivider />
                <ExpertiseSection lang={lang} />
                <SectionDivider />
                <ArchitectureSection lang={lang} />
                <SectionDivider />
                <StackSection lang={lang} theme={theme} />
                <SectionDivider />
                <ExperienceSection lang={lang} />
                <SectionDivider className="print:hidden" />
                <GitHubSection lang={lang} theme={theme} />
                <SectionDivider />
                <ProjectsSection lang={lang} />
                <SectionDivider />
                <ContactSection lang={lang} />
              </>
            )}
          </main>
          <Footer lang={lang} />
          {!isNotFound && <ScrollToTop lang={lang} />}
          <FloatingLanguageToggle lang={lang} onChangeLang={setLang} />
        </div>
      </MotionConfig>
    </HelmetProvider>
  );
}
