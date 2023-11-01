import styled from "styled-components";
import { useSelector } from "react-redux";

function UserRecommend() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  return (
    <RecommendContainer backgroundcolor={currentTheme.bg}>
      <Row>
        <StyledProfile />
        <Column>
          <StyledText size="14" weight="500" color={currentTheme.font1}>
            이준형
          </StyledText>
          <StyledText size="12" weight="400" color={currentTheme.font1}>
            프론트엔드 개발자
          </StyledText>
        </Column>
        <StyledAddBox
          src={process.env.PUBLIC_URL + "/icon/add.svg"}
          fillcolor={currentTheme.primary}
        ></StyledAddBox>
      </Row>
      <StyledText size="12" weight="300" color={currentTheme.font2}>
        #Oreumi, #Front-end, #tag1, #tag2
      </StyledText>
    </RecommendContainer>
  );
}

let RecommendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 250px;
  height: 120px;
  padding: 24px 14px 24px 16px;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  /* 아래는 제거 필요 */
  margin-left: 24px;
`;

let Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

let Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

let StyledProfile = styled.div`
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 24px;
  /* background-image: url(); */
  background-color: #5e5e5e;
`;

let StyledText = styled.span`
  font-size: ${({ size }) => size + "px"};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  cursor: ${({ cursor = "default" }) => cursor};
`;

let StyledAddBox = styled.img`
  width: 32px;
  height: 32px;
  margin-left: auto;
  fill: ${({ fillcolor }) => fillcolor};
`;

export default UserRecommend;
