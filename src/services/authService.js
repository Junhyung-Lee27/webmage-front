import axios from "axios";

// 회원가입
export const signup = async (username, email, password, passwordCheck) => {
  // 비밀번호 불일치할 경우
  if (password !== passwordCheck) {
    return { error: "비밀번호가 일치하지 않습니다." };
  }

  // 비밀번호 일치할 경우
  try {
    const response = await axios.post("http://15.164.217.203:8000/user/signup/", {
      username,
      email,
      password,
    });

    // 응답 처리
    if (response.status === 201) {
      return { success: true };
    } else {
      return { error: "회원가입에 실패했습니다. 아이디, 이메일, 비밀번호 형식을 확인해주세요." };
    }
  } catch (error) {
    //예외 처리
    console.error("Signup API error:", error);
    return { error: "회원가입 중 오류가 발생했습니다. 나중에 다시 시도해주세요." };
  }
};

// 로그인
export const login = async (username, password) => {
  try {
    const response = await axios.post("http://15.164.217.203:8000/user/login/", {
      username,
      password,
    });

    // 응답 처리
    if (response.status === 200 && response.statusText === "OK") {
      return { success: true };
    } else {
      return { error: "로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요." };
    }
  } catch (error) {
    console.error("Login API error:", error);
    return { error: "로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요." };
  }
};

// 로그아웃
export const logout = async () => {
  try {
    const response = await axios.post("http://15.164.217.203:8000/user/logout/");

    if (response.status === 200 && response.statusText === "OK") {
      return { success: true };
    } else {
      return { error: "로그아웃에 실패했습니다. 나중에 다시 시도해주세요." };
    }
  } catch (error) {
    console.error("Logout API error:", error);
    return { error: "로그아웃 중 오류가 발생했습니다. 나중에 다시 시도해주세요." };
  }
};
