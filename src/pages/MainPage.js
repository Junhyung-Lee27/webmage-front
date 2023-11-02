import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Manda from "../components/Manda";
import MandaTitle from "../components/MandaTitle";
import TodoList from "../components/TodoList"
import theme from "../components/theme";

function MainPage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const user = useSelector((state) => state.user)
  console.log(user);

  const todoInfo = [
    {
      id: 1,
      title: "알고리즘 3문제 풀이",
      detail: "백준 7579번, 2293번, 2629번 풀기",
      todo_date: new Date(2023, 9, 31, 12, 34, 56),
    },
    {
      id: 2,
      title: "포트폴리오 최신화",
      detail: "프로젝트 성과 정리",
      todo_date: new Date(2023, 9, 31, 12, 34, 56),
    },
    {
      id: 3,
      title: "면접 준비",
      detail: "면접 스터디 구하기",
      todo_date: new Date(2023, 10, 1, 12, 34, 56),
    },
    {
      id: 4,
      title: "30분 달리기",
      detail: "9시 러닝크루 모임 참석",
      todo_date: new Date(2023, 10, 1, 12, 34, 56),
    },
    {
      id: 5,
      title: "자바스크립트 공부",
      detail: "비동기 처리에 대한 깊은 이해와 실습",
      todo_date: new Date(2023, 10, 3, 14, 34, 56),
    },
    {
      id: 6,
      title: "디자인 패턴 학습",
      detail: "싱글톤 패턴과 팩토리 패턴에 대해 조사",
      todo_date: new Date(2023, 10, 4, 16, 34, 56),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <PageLayout backgroundcolor={currentTheme.bg2}>
        <Header></Header>

        <TopGroup>
          <MyManda>
            <MandaTitle />
            <Manda />
          </MyManda>

          <ProfileLog>
            <Profile>프로필</Profile>
            <MandaLog>만다로그</MandaLog>
          </ProfileLog>
        </TopGroup>

        <Line />

        <TodoGroup>
          <TodoList date="Today" todos={todoInfo}>
            오늘
          </TodoList>
          <TodoList date="Tomorrow" todos={todoInfo}>
            내일
          </TodoList>
          <TodoList date="This Week" todos={todoInfo}>
            이번 주
          </TodoList>
        </TodoGroup>
      </PageLayout>
    </ThemeProvider>
  );
}

const PageLayout = styled.div`
  ${({ theme }) => theme.font.importPretendard};
  font-family: Pretendard-Regular;
  display: flex;
  flex-direction: column;
  background-color: ${({ backgroundcolor }) => backgroundcolor};
`;

const TopGroup = styled.div`
  display: flex;
`

const MyManda = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProfileLog = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: 24px;
  margin-top: 66px;
`


const Profile = styled.div`
  display: inline-flex;
  width: 250px;
  height: 230px;
  background: grey;
  color: white;
  flex-direction: column;
  align-items: center;
`
const MandaLog = styled.div`
  display: inline-flex;
  width: 250px;
  height: 376px;
  flex-direction: column;
  align-items: center;
  background: grey;
  color: white;
  margin-top: 24px;
`

const Line = styled.div`
  border-bottom: 1px solid #BFBFBF;
  margin: 30px 0px 30px 198px;
  width: 1048px;
`

const TodoGroup = styled.div`
  display: inline-flex;
  margin-left: 198px;
  gap: 17px;
`

// const TodoList = styled.div`
//   display: inline-flex;
//   width: 338px;
//   height: 230px;
//   background: grey;
//   color: white;
// `


export default MainPage;
