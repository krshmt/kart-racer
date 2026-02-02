import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/Footer/footer";
import Home from "./pages/home";
import Description from "./pages/description";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/description" element={<Description />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
