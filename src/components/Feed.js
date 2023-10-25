import { useState } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";

function Feed({ userInfo, contentInfo }) {
    const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
    const userName = "testName1";
    console.log(currentTheme);

    const formatDateAgo = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        if (years > 0) {
            return `${years}년 전`;
        } else if (months > 0) {
            return `${months}개월 전`;
        } else if (days > 6) {
            const weeks = Math.floor(days / 7);
            return `${weeks}주일 전`;
        } else if (days > 0) {
            return `${days}일 전`;
        } else if (hours > 0) {
            return `${hours}시간 전`;
        } else if (minutes > 0) {
            return `${minutes}분 전`;
        } else {
            return `${seconds}초 전`;
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <FeedBox bgColor={currentTheme.bg3}>
                <FeedHeader>
                    <UserInfo>
                        <ProfileImgWrapper>
                            <ProfileImg src={userInfo.profile_img} />
                        </ProfileImgWrapper>
                        <TextBox>
                            <StyledText
                                size="0.875rem"
                                weight="600"
                                color={currentTheme.font1}
                            >
                                {userInfo.userName}
                            </StyledText>
                            <StyledText
                                size="0.75rem"
                                weight="500"
                                color={currentTheme.font2}
                                margin="0 0 0.25rem 0"
                            >
                                {userInfo.userPosition}
                            </StyledText>
                            <StyledText
                                size="0.75rem"
                                weight="500"
                                color={currentTheme.font2}
                            >
                                {formatDateAgo(contentInfo.upload_date)}
                            </StyledText>
                        </TextBox>
                    </UserInfo>
                    {userInfo.userName == userName ? (
                        <MenuIcon src={process.env.PUBLIC_URL + "/menu-horizontal.svg"} />
                    ) : (
                        userInfo.isFallowing ? (
                            <FallowingButton bgColor={currentTheme.bg2} color={currentTheme.primary} colorhover={currentTheme.secondary}>
                                팔로잉
                            </FallowingButton>
                        ) : (
                            <FallowButton color={currentTheme.font2} colorhover={currentTheme.primary}>
                                +팔로우
                            </FallowButton>
                        )
                    )
                    }
                </FeedHeader>
                <FeedTitle>
                    <FlexBox>
                        <StyledText
                            size="1rem"
                            weight="700"
                            color={currentTheme.font1}
                        >
                            {formatDateAgo(contentInfo.upload_date)}
                        </StyledText>

                    </FlexBox>

                </FeedTitle>
            </FeedBox>
        </ThemeProvider>
    )
}

let FlexBox = styled.div`
    ${({ theme }) => theme.flexBox.rowLeftCenter};
`;
let StyledText = styled.span`
    font-size: ${({ size }) => size};
    font-weight: ${({ weight }) => weight};
    color: ${({ color }) => color};
    text-align: ${({ align }) => align};
    margin: ${({ margin }) => margin};
`
let FeedBox = styled.div`
    ${({ theme }) => theme.flexBox.rowCenter};
    ${({ theme }) => theme.font.importPretendard};
    font-family: Pretendard-Regular;
    background-color: ${({ bgColor }) => bgColor};
    flex-direction: column;
    // box-shadow: 0px 0.5rem 1.5rem 0px rgba(0, 0, 0, 0.15);
    width: 60%;
    padding: 1.75rem 2.5rem;
`;
let FeedHeader = styled.div`
    ${({ theme }) => theme.flexBox.rowSpaceBetween};
    width: 100%;
`;
let UserInfo = styled.div`
    ${({ theme }) => theme.flexBox.rowCenter};
    gap: 0.75rem;
`
let TextBox = styled.div`
    ${({ theme }) => theme.flexBox.columnLeftCenter};
    width: calc(100% - 4rem);
    gap: 0.25rem;
`;
let ProfileImgWrapper = styled.div`
    width: 4rem;
    height: 4rem;
`;
let ProfileImg = styled.img`
    ${({ theme }) => theme.common.circleImg};
`;
let MenuIcon = styled.img`
    ${({ theme }) => theme.iconSize.medium};
`;
let FallowButton = styled.button`
    border: 1px solid ${({ color }) => color};
    color: ${({ color }) => color};
    border-radius: 1rem;
    width: 6rem;
    height: 2rem;
    font-size: 1rem;
    padding: 0.25rem 1rem;
    flex-shrink: 0;
    &:hover {
        border: 1px solid ${({ colorhover }) => colorhover};
        background-color: ${({ colorhover }) => colorhover};
        color: #fff;
        transition: 0.5s;
      }
`;
let FallowingButton = styled.button`
    border: 1px solid ${({ color }) => color};
    background-color: ${({ color }) => color};
    color: #fff;
    border-radius: 1rem;
    width: 6rem;
    height: 2rem;
    font-size: 1rem;
    padding: 0.25rem 1rem;
    flex-shrink: 0;
    &:hover {
        border: 1px solid ${({ colorhover }) => colorhover};
        background-color: ${({ colorhover }) => colorhover};
        transition: 0.5s;
      }
`;
let FeedTitle = styled.div`
    ${({ theme }) => theme.flexBox.columnLeftCenter};
`;
let AchieveCount = styled.span`

`;

export default Feed;