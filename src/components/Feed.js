import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import FallowButton from "./FallowButton";

function Feed({ userInfo, contentInfo }) {
    const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
    const currentFilter = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
    const userName = "오르미";
    const [emojiInfo, setEmojiInfo] = useState({});//피드 최다 이모지 및 총 이모지 갯수 표시를 위한 변수
    const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);

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

    const getEmojiInfo = (emoji_count) => {
        let maxKey = null;
        let nextMaxKey = null;
        let maxVal = -Infinity;
        let nextMaxVal = -Infinity;
        let total_count = 0;

        for (let key in emoji_count) {
            total_count += emoji_count[key];
            if (emoji_count[key] > maxVal) {
                nextMaxKey = maxKey;
                nextMaxVal = maxVal;
                maxKey = key;
                maxVal = emoji_count[key];
            } else if (emoji_count[key] > nextMaxVal) {
                nextMaxKey = key;
                nextMaxVal = emoji_count[key];
            }
        }

        return { total_count, maxKey, nextMaxKey };
    }

    const openEmojiModal = () => {

    }

    useEffect(() => {
        setEmojiInfo(getEmojiInfo(contentInfo.emoji_count));
    }, [contentInfo]);

    return (
        <ThemeProvider theme={theme}>
            <FeedBox bgcolor={currentTheme.bg3}>
                {/*유저정보 및 팔로우버튼/메뉴버튼 */}
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
                        <MediumIcon src={process.env.PUBLIC_URL + "/icon/menu-horizontal.svg"} filter={currentFilter.font1} />
                    ) : (
                        <FallowButton isFallowing={userInfo.isFallowing} />
                    )
                    }
                </FeedHeader>
                {/*주요목표, 세부목표, 하위목표*/}
                <FeedTitle>
                    <FlexBox>
                        <StyledText
                            size="1rem"
                            weight="700"
                            color={currentTheme.font1}
                        >
                            {contentInfo.content}
                        </StyledText>
                        <AchieveCount color={currentTheme.font1}>
                            <StyledText
                                size="0.625rem"
                                color={currentTheme.font1}
                            >
                                {contentInfo.content_count}회 실천
                            </StyledText>
                        </AchieveCount>
                    </FlexBox>
                    <FlexBox>
                        <TitleBox>
                            <StyledText
                                size="0.75rem"
                                weight="500"
                                color={currentTheme.font2}
                                margin="0 0 0.25rem 0"
                            >
                                핵심 목표
                            </StyledText>
                            <StyledText
                                size="0.875rem"
                                weight="500"
                                color={currentTheme.font1}
                            >
                                {contentInfo.main_title}
                            </StyledText>
                        </TitleBox>
                        <TitleBox>
                            <StyledText
                                size="0.75rem"
                                weight="500"
                                color={currentTheme.font2}
                                margin="0 0 0.25rem 0"
                            >
                                세부 목표
                            </StyledText>
                            <StyledText
                                size="0.875rem"
                                weight="500"
                                color={currentTheme.font1}
                            >
                                {contentInfo.sub_title}
                            </StyledText>
                        </TitleBox>
                    </FlexBox>
                </FeedTitle>
                {/*피드 본문*/}
                <FeedArticle>
                    <PictureWrap>
                        <Picture src={contentInfo.content_img} />
                    </PictureWrap>
                    <StyledText
                        size="1rem"
                        weight="500"
                        color={currentTheme.font1}
                    >
                        {contentInfo.post}
                    </StyledText>
                    <div>
                        {contentInfo.tags.map((tag) => {
                            return (
                                <StyledText
                                    size="1rem"
                                    weight="500"
                                    color={currentTheme.primary}
                                    key={tag}
                                >
                                    {"#" + tag + " "}
                                </StyledText>
                            )
                        })}
                    </div>
                </FeedArticle>
                {/*이모지, 댓글 등 커뮤니케이션 영역*/}
                <FeedFooter>
                    <CommunicationBox>
                        {emojiInfo.total_count != 0 ? (
                            <IconBox>
                                <SmallIcon src={process.env.PUBLIC_URL + `/icon/${emojiInfo.maxKey}.svg`} />
                                <SmallIcon src={process.env.PUBLIC_URL + `/icon/${emojiInfo.nextMaxKey}.svg`} />
                                <StyledText
                                    size="1rem"
                                    weight="500"
                                    color={currentTheme.font1}
                                >
                                    {emojiInfo.total_count}
                                </StyledText>
                            </IconBox>
                        ) : null}
                        {contentInfo.comment_info == [] ? null : (
                            <IconBox>
                                <SmallIcon src={process.env.PUBLIC_URL + "/icon/comment-fill.svg"} />
                                <StyledText
                                    size="1rem"
                                    weight="500"
                                    color={currentTheme.font1}
                                >
                                    {contentInfo.comment_info.length}
                                </StyledText>
                            </IconBox>
                        )}
                        <IconBox>
                            <SmallIcon src={process.env.PUBLIC_URL + "/icon/addEmoji.svg"} filter={currentFilter.font1} />
                            <SmallIcon src={process.env.PUBLIC_URL + "/icon/addComment.svg"} filter={currentFilter.font1} />
                        </IconBox>
                    </CommunicationBox>
                    <SmallIcon src={process.env.PUBLIC_URL + "/icon/report.svg"} filter={currentFilter.font1} />
                </FeedFooter>
            </FeedBox>
        </ThemeProvider>
    )
}

let FlexBox = styled.div`
    ${({ theme }) => theme.flexBox.rowLeftCenter};
    gap: 1rem;
    width:100%;
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
    background-color: ${({ bgcolor }) => bgcolor};
    flex-direction: column;
    // box-shadow: 0px 0.5rem 1.5rem 0px rgba(0, 0, 0, 0.15);
    width: calc(100% - 5rem);
    padding: 1.75rem 2.5rem;
    margin: 1rem;
    border-radius: 0.5rem;
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
    flex-shrink: 1;
    flex-glow: 1;
`;
let ProfileImgWrapper = styled.div`
    width: 4rem;
    height: 4rem;
    flex-shrink: 0;
`;
let ProfileImg = styled.img`
    ${({ theme }) => theme.common.circleImg};
`;
let MediumIcon = styled.img`
    ${({ theme }) => theme.iconSize.medium};
    filter: ${({ filter }) => filter};
`;
let SmallIcon = styled.img`
    ${({ theme }) => theme.iconSize.small};
    filter: ${({ filter }) => filter};
`;
let FeedTitle = styled.div`
    ${({ theme }) => theme.flexBox.columnLeftCenter};
    width: 100%;
    margin: 1.5rem 0 1rem 0;
`;
let AchieveCount = styled.span`
    ${({ theme }) => theme.flexBox.rowCenter};
    border: 1px solid ${({ color }) => color};
    width: 3rem;
    height: 1rem;
    border-radius: 0.5rem;
`;
let TitleBox = styled.div`
    ${({ theme }) => theme.flexBox.columnLeftCenter};
    width: 50%;
    margin: 1rem 0;
`;
let FeedArticle = styled.div`
    ${({ theme }) => theme.flexBox.columnLeftCenter};
    width:100%;
    gap:1rem;
`;
let PictureWrap = styled.div`
    padding-top: 65%;
    position: relative;
    width: 100%;
`;
let Picture = styled.img`
    height: 100%;
    position: absolute;
    width: 100%;
    object-fit: cover;
    left: 0;
    top: 0;
    border-radius:0.25rem;
`;
let FeedFooter = styled.div`
    ${({ theme }) => theme.flexBox.rowSpaceBetween};
    width: 100%;
`;
let CommunicationBox = styled.div`
    ${({ theme }) => theme.flexBox.rowLeftCenter};
    gap: 1rem;
    margin: 1rem 0;
`;
let IconBox = styled.div`
    ${({ theme }) => theme.flexBox.rowLeftCenter};
    gap: 0.5rem;
`

export default Feed;