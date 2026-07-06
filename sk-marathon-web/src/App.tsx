import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import RegisterPage from "./pages/RegisterPage";
import StatusCheckPage from "./pages/StatusCheckPage";
import HomePage from "./pages/HomePage";
import RunWithUs from "./pages/RunWithUs";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/status" element={<StatusCheckPage />} />
          <Route path="/run-with-us" element={<RunWithUs />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;