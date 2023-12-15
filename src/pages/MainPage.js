import styled, { ThemeProvider } from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Manda from "../components/Manda";
import MandaTitle from "../components/MandaTitle";
import TodoList from "../components/TodoList"
import componentTheme from "../components/theme";
import axios from "axios";
import { BASE_URL } from "./../config";
import { setUser } from "../store/userSlice";
import UserProfile from "../components/UserProfile";
import { setSelectedUser } from "../store/selectedUserSlice";

function MainPage() {
  const dispatch = useDispatch();

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 유저 상태
  const user = useSelector((state) => state.user);
  let selectedUser = useSelector((state) => state.selectedUser);

  // 만다라트 작성 상태
  const [currPage, setCurrPage] = useState("");

  // user.Id 변경되었을 때 실행
  useEffect(() => {
    // 사용자 프로필 업데이트
    const fetchData = async (userId, authToken) => {
      try {
        const response = await axios.get(`${BASE_URL}/user/profile/${userId}`, {
          headers: {
            accept: "application/json",
            Authorization: `Token ${authToken}`,
          },
        });
        dispatch(
          setUser({
            userId: response.data.userId,
            username: response.data.username,
            userImg: response.data.userImg,
            userPosition: response.data.userPosition,
            userInfo: response.data.userInfo,
            userHash: response.data.userHash,
            userEmail: response.data.userEmail,
            userProvider: response.data.userProvider,
            followerCount: response.data.followerCount,
            successCount: response.data.successCount,
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchData(user.userId, user.authToken);

    // currPage 상태 변환
    setCurrPage("MAIN");
  }, [user.userId]);

  useEffect(() => {
    // 만약 selectedUser가 비어 있고 user에 정보가 있다면, user로 selectedUser 설정
    if (
      !selectedUser ||
      (Object.keys(selectedUser).length === 0 && user.username !== "")
    ) {
      dispatch(setSelectedUser(user));
    }
  }, [user.username]);

  // 투두리스트 샘플 데이터
  // const todoInfo = [
  //   {
  //     id: 1,
  //     title: "알고리즘 3문제 풀이",
  //     detail: "백준 7579번, 2293번, 2629번 풀기",
  //     todo_date: new Date(2023, 9, 31, 12, 34, 56),
  //   },
  //   {
  //     id: 2,
  //     title: "포트폴리오 최신화",
  //     detail: "프로젝트 성과 정리",
  //     todo_date: new Date(2023, 9, 31, 12, 34, 56),
  //   },
  //   {
  //     id: 3,
  //     title: "면접 준비",
  //     detail: "면접 스터디 구하기",
  //     todo_date: new Date(2023, 10, 1, 12, 34, 56),
  //   },
  //   {
  //     id: 4,
  //     title: "30분 달리기",
  //     detail: "9시 러닝크루 모임 참석",
  //     todo_date: new Date(2023, 10, 1, 12, 34, 56),
  //   },
  //   {
  //     id: 5,
  //     title: "자바스크립트 공부",
  //     detail: "비동기 처리에 대한 깊은 이해와 실습",
  //     todo_date: new Date(2023, 10, 3, 14, 34, 56),
  //   },
  //   {
  //     id: 6,
  //     title: "디자인 패턴 학습",
  //     detail: "싱글톤 패턴과 팩토리 패턴에 대해 조사",
  //     todo_date: new Date(2023, 10, 4, 16, 34, 56),
  //   },
  // ];

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Body>
          <Stadardized>
            <TopGroup>
              <ProfileLog>
                <UserProfile />
                {/* <MandaLog>만다로그</MandaLog> */}
              </ProfileLog>
              <MyManda>
                <MandaTitle />
                <Manda currPage={currPage} setCurrPage={setCurrPage} />
              </MyManda>
            </TopGroup>
            {/* <Line /> */}
            {/* <TodoGroup>
              <TodoList date="Today" todos={todoInfo}>
                오늘
              </TodoList>
              <TodoList date="Tomorrow" todos={todoInfo}>
                내일
              </TodoList>
              <TodoList date="This Week" todos={todoInfo}>
                이번 주
              </TodoList>
            </TodoGroup> */}
          </Stadardized>
        </Body>
      </PageLayout>
    </ThemeProvider>
  );
}

const PageLayout = styled.div`
  ${({ theme }) => theme.component.font.importPretendard};
  font-family: Pretendard-Regular;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.bg2};
  height: 100vh;
`;

let Body = styled.div`
  display: flex;
  align-content: space-between;
  justify-content: center;
  width: 100%;
  margin-top: 56px;
`;

let Stadardized = styled.div`
  display: flex;
  flex-direction: column;
  width: 1080px;
  gap: 32px;
  margin-top: 16px;
  margin-bottom: 80px;
`;

const TopGroup = styled.div`
  display: flex;
  justify-content: space-between;
`

const MyManda = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileLog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 48px;
`

const Profile = styled.div`
  display: inline-flex;
  width: 222px;
  height: 230px;
  background: grey;
  color: white;
  flex-direction: column;
  align-items: center;
`
const MandaLog = styled.div`
  display: inline-flex;
  width: 222px;
  height: 376px;
  flex-direction: column;
  align-items: center;
  background: grey;
  color: white;
  margin-top: 24px;
`

const Line = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  margin: 30px 0px;
  width: 1080px;
`

const TodoGroup = styled.div`
  display: inline-flex;
  justify-content: space-between;
`

// const TodoList = styled.div`
//   display: inline-flex;
//   width: 338px;
//   height: 230px;
//   background: grey;
//   color: white;
// `


export default MainPage;
