import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SettingPage from "./pages/SettingPage";
import SearchPage from "./pages/SearchPage";
import MainPage from "./pages/MainPage.js";
import MandaWritePage from "./pages/MandaWritePage.js";
import FeedPage from "./pages/FeedPage";
import ChatPage from "./pages/ChatPage";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { Reset } from "styled-reset";
import KakaoCallback from "./components/KakaoLogin.js";

function App() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <ThemeProvider theme={currentTheme}>
      <Reset />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/manda" replace /> : <AuthPage />} />
        <Route path="/manda" element={isLoggedIn ? <MainPage /> : <Navigate to="/" replace />} />
        <Route path={`/manda/:username`} element={isLoggedIn ? <MainPage /> : <Navigate to="/" replace />} />
        <Route
          path="/manda/write"
          element={isLoggedIn ? <MandaWritePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/setting"
          element={isLoggedIn ? <SettingPage /> : <Navigate to="/" replace />}
        />
        <Route path={`/search/:keyword`} element={isLoggedIn ? <SearchPage /> : <Navigate to="/" replace />} />
        <Route path="/feed" element={isLoggedIn ? <FeedPage /> : <Navigate to="/" replace />} />
        {/* <Route path="/chat" element={isLoggedIn ? <ChatPage /> : <Navigate to="/" replace />} /> */}
        <Route path="/user/kakao-callback" element={<KakaoCallback />}></Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
