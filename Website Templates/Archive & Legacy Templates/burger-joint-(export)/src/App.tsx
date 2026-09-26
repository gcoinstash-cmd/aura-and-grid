import Nav from './components/Nav';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Testimonials from './components/Testimonials';
import Story from './components/Story';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Menu />
        <Testimonials />
        <Story />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

