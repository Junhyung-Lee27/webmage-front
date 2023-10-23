import "./App.css";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SettingPage from "./pages/SettingPage";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";

function App() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <ThemeProvider theme={currentTheme}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/settings" element={<SettingPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
