import { BASE_URL } from "../config";

import axios from "axios";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login, signup } from "../services/authService";
import { setAuthToken, setIsLoggedIn, setUser } from "../store/userSlice";

function KakaoCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authCode, setAuthCode] = useState("");
  
  useEffect(() => {
    onKakaoCallback();
  }, []);

  useEffect(() => {
    signupWithKakao(authCode);
  }, [authCode])

  async function onKakaoCallback() {
    // 클라이언트 authorization code 획득
    const currentURL = window.location.search;
    const urlParams = new URLSearchParams(currentURL);
    const authCode = urlParams.get("code");
    setAuthCode(authCode);
  }

  async function signupWithKakao(authCode) {
    // 사용자 정보 access_token 요청
    if (authCode) {
      const oauthParams = {
        code: authCode,
        grant_type: "authorization_code",
        client_id: `${process.env.REACT_APP_KAKAO_APP_KEY}`,
        redirect_uri: `${process.env.REACT_APP_KAKAO_REDIRECT_URI}`,
        client_secret: `${process.env.REACT_APP_KAKAO_CLIENT_SECRET}`,
      };
      const oauthParamsString = new URLSearchParams(oauthParams).toString();
      const response = await axios.post(
        `https://kauth.kakao.com/oauth/token?${oauthParamsString}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      const accessToken = response.data.access_token;

      // 사용자 정보 요청
      if (accessToken) {
        const userInfoResponse = await axios.post(
          `https://kapi.kakao.com/v2/user/me`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "Content-type: application/x-www-form-urlencoded;charset=utf-8",
            },
          }
        );

        // 서버에 가입 요청
        const data = userInfoResponse.data;
        var username = data.properties.nickname + data.id;
        const email = data.kakao_account.email;
        const password = data.id;
        const passwordCheck = data.id;
        const provider = "KAKAO"+data.id;

        const signupResponse = await signup(username, email, password, passwordCheck, provider);

        // 회원가입 성공했을 경우
        if (signupResponse.success) {
          if (signupResponse.username) {
            var username = signupResponse.username;
          }
          
          // 로그인 시도
          const loginResponse = await login(username, password);

          if (loginResponse.success) {
            dispatch(setUser({ userId: loginResponse.userId }));
            dispatch(setAuthToken(loginResponse.token));
            dispatch(setIsLoggedIn(true));
            navigate("/manda");
          } else if (loginResponse.error) {
            alert("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
          }
        }
        // 회원가입 실패했을 경우
        else if (signupResponse.error) {
          alert(signupResponse.error);
        }
      }
    }
  }



  return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoCallback;
