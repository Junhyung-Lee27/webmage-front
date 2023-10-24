import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SettingPage from "./pages/SettingPage";
import SearchPage from "./pages/SearchPage";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";

function App() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <ThemeProvider theme={currentTheme}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
