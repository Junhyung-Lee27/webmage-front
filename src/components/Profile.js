import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import theme from "./theme";
import { useEffect, useState } from "react";
import FallowButton from "./FallowButton";

function Profile({ user_info }) {
    const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
    const [tagString, setTagString] = useState("");
    const myNickname = "test"

    useEffect(() => {
        setTagString("");
        for (let tag of user_info.tags) {
            setTagString((current) => current + " #" + tag);
        }
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <ProfileBox>
                <ProfileImgWrapper>
                    <ProfileImg src={user_info.profile_img} />
                </ProfileImgWrapper>
                <InfoBox>
                    <StyledText
                        size="1rem"
                        weight="500"
                        color={currentTheme.font1}
                    >
                        {user_info.userName}
                    </StyledText>
                    <RowCenter>
                        <FallowerBox>
                            <StyledText
                                size="0.625rem"
                                weight="500"
                                color={currentTheme.font2}
                            >
                                팔로워
                            </StyledText>
                            <StyledText
                                size="0.875rem"
                                weight="500"
                                color={currentTheme.font1}
                            >
                                {user_info.fallower}
                            </StyledText>
                        </FallowerBox>
                        <FallowerBox>
                            <StyledText
                                size="0.625rem"
                                weight="500"
                                color={currentTheme.font2}
                            >
                                실천
                            </StyledText>
                            <StyledText
                                size="0.875rem"
                                weight="500"
                                color={currentTheme.font1}
                            >
                                {user_info.practice}
                            </StyledText>
                        </FallowerBox>
                    </RowCenter>
                    <ColumnLeft>
                        <StyledText
                            size="0.75rem"
                            weight="700"
                            color={currentTheme.font1}
                        >
                            {user_info.userPosition}
                        </StyledText>
                        <StyledText
                            size="0.75rem"
                            weight="500"
                            color={currentTheme.font1}
                        >
                            {user_info.userIntro}
                        </StyledText>
                        <StyledText
                            size="0.75rem"
                            weight="500"
                            color={currentTheme.font1}
                        >
                            {tagString}
                        </StyledText>
                    </ColumnLeft>
                    {myNickname === user_info.userName ? null : (
                        <RowCenter>
                            <FallowButton isFallowing={user_info.isFallowing} />
                            <MessageButton bgcolor={currentTheme.bg3} color={currentTheme.font2} colorhover={currentTheme.primary}>
                                메시지
                            </MessageButton>
                        </RowCenter>
                    )}
                </InfoBox>
            </ProfileBox>
        </ThemeProvider>
    )
}

let ProfileBox = styled.div`
    ${({ theme }) => theme.flexBox.columnCenter};
    width:250px;
    ${({ theme }) => theme.font.importPretendard};
    font-family: Pretendard-Regular;
`;
let RowCenter = styled.div`
    ${({ theme }) => theme.flexBox.rowCenter};
    gap: 1rem;
`;
let ColumnLeft = styled.div`
    ${({ theme }) => theme.flexBox.columnLeftCenter};
    gap: 1rem;
    width: 100%;
`;
let FallowerBox = styled.div`
    ${({ theme }) => theme.flexBox.columnCenter};
    margin: 0.5rem 1.5rem;
`;
let StyledText = styled.span`
    font-size: ${({ size }) => size};
    font-weight: ${({ weight }) => weight};
    color: ${({ color }) => color};
    text-align: ${({ align }) => align};
    margin: ${({ margin }) => margin};
`;
let ProfileImgWrapper = styled.div`
    width: 4rem;
    height: 4rem;
    flex-shrink: 0;
    z-index:2000;
`;
let ProfileImg = styled.img`
${({ theme }) => theme.common.circleImg};
`;
let InfoBox = styled.div`
    position: relative;
    top: -2rem;
    width:100%;
    padding: 3.25rem 1.25rem 1.75rem 1.25rem;
    background-color: ${(props) => props.theme.bg3};
    border-radius:0.5rem;
    ${({ theme }) => theme.flexBox.columnCenter};
    gap: 2rem;
`;
let MessageButton = styled.button`
    border: 2px solid ${({ color }) => color};
    color: ${({ color }) => color};
    background-color: ${({ bgcolor }) => bgcolor};
    border-radius: 1rem;
    width: 6rem;
    height: 2rem;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.25rem 1rem;
    flex-shrink: 0;
    &:hover {
        border: 1px solid ${({ colorhover }) => colorhover};
        background-color: ${({ colorhover }) => colorhover};
        color: #fff;
        transition: 0.5s;
      }
`;
export default Profile;