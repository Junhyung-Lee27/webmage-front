import styled from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Manda from "../components/Manda";
import MandaTitle from "../components/MandaTitle";

function MainPage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
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
        <TodoList>Today</TodoList>
        <TodoList>Tomorrow</TodoList>
        <TodoList>This Week</TodoList>
      </TodoGroup>

    </PageLayout>
  );
}

const PageLayout = styled.div`
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

const TodoList = styled.div`
  display: inline-flex;
  width: 338px;
  height: 230px;
  background: grey;
  color: white;
`


export default MainPage;
