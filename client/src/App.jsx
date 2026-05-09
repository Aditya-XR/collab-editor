import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import EditorPage from "./pages/EditorPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<EditorPage />} path="/documents/:id" />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
