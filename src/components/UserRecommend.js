import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import componentTheme from "./theme";

function UserRecommend({user}) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  return (
    <ThemeProvider theme={theme}>
      <RecommendContainer backgroundcolor={theme.color.bg}>
        <Row>
          <StyledProfile
            src={
              user.user_image instanceof File
                ? URL.createObjectURL(user.user_image)
                : process.env.PUBLIC_URL + "/logo/Manda_logo1.svg"
            }
          />
          <Column>
            <StyledText size="16" weight="500" color={theme.color.font1}>
              {user.username}
            </StyledText>
            <StyledText size="12" weight="400" color={theme.color.font2}>
              {user.user_position}
            </StyledText>
          </Column>
          <StyledAddBox
            src={process.env.PUBLIC_URL + "/icon/add.svg"}
            filter={theme.filter.primary}
          ></StyledAddBox>
        </Row>
        <StyledText size="12" weight="300" color={theme.color.font2}>
          {user.user_hash}
        </StyledText>
      </RecommendContainer>
    </ThemeProvider>
  );
}

let RecommendContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  gap: 16px;
  width: 100%;
  padding: 24px;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  background-color: ${({ backgroundcolor }) => backgroundcolor};
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

let StyledProfile = styled.img`
  width: 56px;
  height: 56px;
  border: 1px solid ${({ theme }) => theme.color.border };
  border-radius: 50%;
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
  filter: ${({ theme }) => theme.filter.font2};
`;

export default UserRecommend;
