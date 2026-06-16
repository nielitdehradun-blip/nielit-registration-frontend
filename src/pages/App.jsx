import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Registration from "./Registration";
import Students from "./Students";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/students" element={<Students />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;