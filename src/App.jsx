import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import NavigationBar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import ShowsGrid from './components/ShowsGrid';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App bg-dark-custom min-vh-100 text-white">
      <NavigationBar />
      <main>
        <HeroCarousel />
        <ShowsGrid />
      </main>
      <Footer />
    </div>
  );
}

export default App;
