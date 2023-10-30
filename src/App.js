import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SettingPage from "./pages/SettingPage";
import SearchPage from "./pages/SearchPage";
import MainPage from "./pages/MainPage.js";
import MandaWritePage from "./pages/MandaWritePage.js";
import FeedPage from "./pages/FeedPage";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { Reset } from "styled-reset";

function App() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <ThemeProvider theme={currentTheme}>
      <Reset />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/manda" replace /> : <AuthPage />} />
        <Route path="/manda" element={isLoggedIn ? <MainPage /> : <Navigate to="/" replace />} />
        <Route path="/mandawrite" element={isLoggedIn ? <MandaWritePage /> : <Navigate to="/" replace />} />
        <Route path="/setting" element={isLoggedIn ? <SettingPage /> : <Navigate to="/" replace />} />
        <Route path="/search" element={isLoggedIn ? <SearchPage /> : <Navigate to="/" replace />} />
        <Route path="/feed" element={isLoggedIn ? <FeedPage /> : <Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;