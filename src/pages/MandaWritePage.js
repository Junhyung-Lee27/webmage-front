import styled from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import MandaWrite from "../components/MandaWrite";
import MandaSimple from "../components/MandaSimple";
import { BASE_URL } from "./../config";

function MandaWritePage() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  // 각 사용자의 정보와 axios URL 설정
  const users = [
    { id: 1, name: "User 1", axiosURL: `${BASE_URL}/manda/mandamain/1` },
    { id: 2, name: "User 2", axiosURL: `${BASE_URL}/manda/mandamain/2` },
    { id: 3, name: "User 3", axiosURL: `${BASE_URL}/manda/mandamain/3` },
    { id: 4, name: "User 4", axiosURL: `${BASE_URL}/manda/mandamain/4` },
  ];

  return (
    <PageLayout backgroundcolor={currentTheme.bg2}>
      <Header></Header>
      <MandaWrite />
      <Title>다른 사용자의 만다라트</Title>
      <OtherManda>
        {users.map((user) => (
          <MandaSimple key={user.id} axiosURL={user.axiosURL} />
        ))}
      </OtherManda>
    </PageLayout>
  );
}

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  background-color: ${({ backgroundcolor }) => backgroundcolor};
`;

const Title = styled.div`
  margin-left: 198px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.font1};
  margin-bottom: 14px;
  margin-top: 40px;
  display: block;
`;

const OtherManda = styled.div`
  display: flex;
  margin-left: 198px;
  gap: 40px;
  margin-top: -30px;
`;

export default MandaWritePage;
