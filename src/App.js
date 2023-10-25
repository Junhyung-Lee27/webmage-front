import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SettingPage from "./pages/SettingPage";
import SearchPage from "./pages/SearchPage";
import FeedPage from "./pages/FeedPage";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { Reset } from 'styled-reset'

function App() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <ThemeProvider theme={currentTheme}>
      <Reset />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/feed" element={<FeedPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
