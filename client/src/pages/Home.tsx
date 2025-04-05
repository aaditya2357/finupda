import React, { useEffect } from 'react';
import TopBar from '../components/TopBar';
import MarketTicker from '../components/MarketTicker';
import HeroSection from '../components/HeroSection';
import Dashboard from '../components/Dashboard';
import AIAdvisor from '../components/AIAdvisor';
import LearnSection from '../components/LearnSection';
import CommunitySection from '../components/CommunitySection';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const Home = () => {
  // Add scroll effect for top bar
  useEffect(() => {
    const handleScroll = () => {
      const topBar = document.getElementById('topBar');
      if (topBar) {
        if (window.scrollY > 50) {
          topBar.classList.add('scrolled');
        } else {
          topBar.classList.remove('scrolled');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <MarketTicker />
      <HeroSection />
      <Dashboard />
      <AIAdvisor />
      <LearnSection />
      <CommunitySection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
