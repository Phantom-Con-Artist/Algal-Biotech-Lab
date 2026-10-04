import { Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
