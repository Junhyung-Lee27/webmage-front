import axios from "axios";
import { BASE_URL } from "./../config";

// 토큰 가져오기
export const getCsrfToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/get_token/`);

    if (response.status === 200) {
      return { success: true, csrfToken: response.data.csrf_token };
    } else {
      return { error: "나중에 다시 시도해주세요." };
    }
  } catch (error) {
    console.error("getCsrfToken API error:", error);
    return { error: "나중에 다시 시도해주세요." };
  }
};

// 회원가입
export const signup = async (username, email, password, passwordCheck) => {
  // 비밀번호 불일치할 경우
  if (password !== passwordCheck) {
    return { error: "비밀번호가 일치하지 않습니다." };
  }

  // 비밀번호 일치할 경우
  try {
    const response = await axios.post(`${BASE_URL}/user/signup/`, {
      username,
      email,
      password,
    });

    // 응답 처리
    if (response.status === 201) {
      return { success: true, token: response.data.token };
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
    const response = await axios.post(`${BASE_URL}/user/login/`, {
      username,
      password,
    });

    // 응답 처리
    if (response.status === 200) {
        return { success: true, token: response.data.token, userId: response.data.user_id };
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
    const response = await axios.post(`${BASE_URL}/user/logout/`);

    if (response.status === 200) {
      return { success: true };
    } else {
      return { error: "로그아웃에 실패했습니다. 나중에 다시 시도해주세요." };
    }
  } catch (error) {
    console.error("Logout API error:", error);
    return { error: "로그아웃 중 오류가 발생했습니다. 나중에 다시 시도해주세요." };
  }
};

// 프로필 수정
export const editAccount = async (username, email, password, passwordCheck, authToken) => {
  // 비밀번호 불일치할 경우
  if (password !== passwordCheck) {
    return { error: "비밀번호가 일치하지 않습니다." };
  } else {
    const requestData = {
      username,
      email,
      password,
    };

    const axiosConfig = {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${authToken}`,
      },
    };

    try {
      const response = await axios.patch(
        `${BASE_URL}/user/edit/`,
        requestData,
        axiosConfig
      );

      if (response.status === 200) {
        return { success: true };
      } else {
        return { error: "프로필 수정에 실패했습니다. 나중에 다시 시도해주세요" };
      }
    } catch (error) {
      console.error("userEdit Api Error:", error);
      return { error: " 프로필 수정 중 오류가 발생했습니다. 나중에 다시 시도해주세요." };
    }
  }
};

// 회원탈퇴
export const deleteUser = async (authToken, password) => {
  try {
    const response = await axios.delete(`${BASE_URL}/user/delete-user/`, {
      headers: {
        accept: "application/json",
        Authorization: `Token ${authToken}`,
      },
      data: { password: password },
    });

    if (response.status === 200) {
      return { success: true };
    } else {
      return { error: "회원탈퇴에 실패했습니다. 나중에 다시 시도해주세요." };
    }
  } catch (error) {
    console.error("Delete-user API error:", error);
    if (error.response && error.response.data.error) {
      return { error: error.response.data.error }; // 서버에서 제공하는 에러 메시지 사용
    }
    return { error: "회원탈퇴 중 오류가 발생했습니다. 나중에 다시 시도해주세요." };
  }
};
