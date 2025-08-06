import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Trustees from "./pages/Trustees";
import WhatIsZakat from "./pages/WhatIsZakat";
import FAQ from "./pages/FAQ";
import Community from "./pages/Community";
import Apply from "./pages/Apply";
import CalculateZakat from "./pages/CalculateZakat";
import Contact from "./pages/Contact";
import LatestNews from "./pages/LatestNews";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/trustees" element={<Trustees />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/community" element={<Community />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/calculatezakat" element={<CalculateZakat />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/latestnews" element={<LatestNews />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
