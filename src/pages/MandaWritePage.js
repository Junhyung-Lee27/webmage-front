import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import MandaWrite from "../components/MandaWrite";
import MandaSimple from "../components/MandaSimple";
import componentTheme from "../components/theme";
import { BASE_URL } from "./../config";

function MandaWritePage() {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // // 각 사용자의 정보와 axios URL 설정
  // const users = [
  //   { id: 1, name: "User 1", axiosURL: `${BASE_URL}/manda/mandamain/1` },
  //   { id: 2, name: "User 2", axiosURL: `${BASE_URL}/manda/mandamain/2` },
  //   { id: 3, name: "User 3", axiosURL: `${BASE_URL}/manda/mandamain/3` },
  //   { id: 4, name: "User 4", axiosURL: `${BASE_URL}/manda/mandamain/4` },
  // ];

  return (
    <ThemeProvider theme={theme}>
      <PageLayout backgroundcolor={theme.color.bg2}>
        <Header></Header>
        <Body>
          <Stadardized>
            <MandaWrite />
            {/* <Title>다른 사용자의 만다라트</Title> */}
            {/* <OtherManda>
              {users.map((user) => (
                <MandaSimple key={user.id} axiosURL={user.axiosURL} />
              ))}
            </OtherManda> */}
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
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  height: 100vh;
`;

let Body = styled.div`
  display: flex;
  align-content: space-between;
  justify-content: center;
  width: 100%;
  margin-top: 28px;
  margin-bottom: 80px;
`;

let Stadardized = styled.div`
  display: flex;
  flex-direction: column;
  width: 1200px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.font1};
  margin-bottom: 14px;
  margin-top: 40px;
  display: block;
`;

const OtherManda = styled.div`
  display: flex;
  gap: 40px;
  margin-top: -30px;
`;

export default MandaWritePage;
