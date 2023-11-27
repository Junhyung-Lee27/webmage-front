import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import FollowButton from "./FollowButton";

function Feed({ userInfo, feedInfo, isFollowing, updateFollowingStatus}) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태관리
  const user = useSelector((state) => state.user);

  const [emojiInfo, setEmojiInfo] = useState({}); //피드 최다 이모지 및 총 이모지 갯수 표시를 위한 변수
  const [isEmojiModalOpen, setIsEmojiModalOpen] = useState(false);

  const formatDateAgo = (dateString) => {
    const date = new Date(dateString); // 문자열 -> Date 객체로 변환
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
  };

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
  };

  const parseTagsString = (tagsString) => {
    return tagsString.split(",").map((tag) => tag.trim().replace(/"/g, ""));
  };

  const openEmojiModal = () => {};

  useEffect(() => {
    setEmojiInfo(getEmojiInfo(feedInfo.emoji_count));
  }, [feedInfo]);

  const imgUrl = "";

  return (
    <ThemeProvider theme={theme}>
      <FeedBox bgcolor={theme.color.bg}>
        <FeedBody>
          {/*유저정보 및 팔로우버튼/메뉴버튼 */}
          <FeedHeader>
            <UserInfo>
              <ProfileImgWrapper>
                <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"} />
              </ProfileImgWrapper>
              <TextBox>
                <UserName
                  size="14px"
                  weight="600"
                  color={theme.color.font1}
                  margin="0 0 2px 0"
                  lineHeight="18px"
                  cursor="pointer"
                >
                  {userInfo.userName}
                </UserName>
                <StyledText
                  size="13px"
                  weight="500"
                  color={theme.color.font2}
                  margin="0 0 8px 0"
                  lineHeight="16px"
                  cursor="pointer"
                >
                  {userInfo.userPosition}
                </StyledText>
                <StyledText size="13px" weight="500" color={theme.color.font2} lineHeight="16px">
                  {formatDateAgo(feedInfo.created_at)}
                </StyledText>
              </TextBox>
            </UserInfo>
            {/* {userInfo.userName !== user.username && <FollowButton />} */}
            <OptionButtons>
              <FollowButton
                userInfo={userInfo}
                isFollowing={isFollowing}
                updateFollowingStatus={updateFollowingStatus}
              />
              <FeedOptionIcon src={process.env.PUBLIC_URL + "/icon/menu-horizontal.svg"} />
            </OptionButtons>
          </FeedHeader>
          {/* 경계선 */}
          <HorizontalLine />
          {/* 만다라트, 이미지 + 피드 */}
          <FeedContents>
            {/*피드 본문*/}
            <FeedArticle>
              <StyledText
                size="14px"
                weight="400"
                color={theme.color.font1}
                lineHeight="140%"
                // margin="16px 0px 0px 0px"
              >
                {feedInfo.post}
              </StyledText>
              <FeedTags>
                {parseTagsString(feedInfo.tags).map((tag) => {
                  return (
                    <StyledText size="14px" weight="500" color={theme.color.primary} key={tag}>
                      {"#" + tag + " "}
                    </StyledText>
                  );
                })}
              </FeedTags>
            </FeedArticle>
            {/* 만다라트, 이미지 영역 */}
            <PictureWrap>
              <PrevBtn src={process.env.PUBLIC_URL + "/icon/prev-image-btn.svg"}></PrevBtn>
              <NextBtn src={process.env.PUBLIC_URL + "/icon/next-image-btn.svg"}></NextBtn>
              <Picture src={process.env.PUBLIC_URL + "/testImg/feedImg1.jpg"} />
            </PictureWrap>
          </FeedContents>
        </FeedBody>
        {/* 경계선 */}
        <HorizontalLine />
        {/*이모지, 댓글 등 커뮤니케이션 영역*/}
        <FeedFooter>
          <CommunicationBox>
            {emojiInfo.total_count != 0 ? (
              <IconBox>
                <SmallIcon src={process.env.PUBLIC_URL + `/icon/${emojiInfo.maxKey}.svg`} />
                <SmallIcon src={process.env.PUBLIC_URL + `/icon/${emojiInfo.nextMaxKey}.svg`} />
                <StyledText size="1rem" weight="500" color={theme.color.font1}>
                  {emojiInfo.total_count}
                </StyledText>
              </IconBox>
            ) : null}
            {feedInfo.comment_info == [] ? null : (
              <IconBox>
                <SmallIcon src={process.env.PUBLIC_URL + "/icon/comment-fill.svg"} />
                <StyledText size="1rem" weight="500" color={theme.color.font1}>
                  {feedInfo.comment_info.length}
                </StyledText>
              </IconBox>
            )}
            <IconBox>
              <SmallIcon
                src={process.env.PUBLIC_URL + "/icon/addEmoji.svg"}
                filter={theme.filter.font1}
              />
              <SmallIcon
                src={process.env.PUBLIC_URL + "/icon/addComment.svg"}
                filter={theme.filter.font1}
              />
            </IconBox>
          </CommunicationBox>
        </FeedFooter>
      </FeedBox>
    </ThemeProvider>
  );
}

let FlexBox = styled.div`
  ${({ theme }) => theme.component.flexBox.rowLeftCenter};
  width: 100%;
  gap: 8px;
`;

let StyledText = styled.span`
  font-size: ${({ size }) => size};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
  margin: ${({ margin }) => margin};
  line-height: ${({ lineHeight }) => lineHeight};

  cursor: ${({ cursor }) => cursor};
`;

let UserName = styled(StyledText)`
  width: fit-content;
  &:hover {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.color.font1};
  }
`;

let FeedBox = styled.div`
  ${({ theme }) => theme.component.flexBox.rowCenter};
  background-color: ${({ bgcolor }) => bgcolor};
  flex-direction: column;
  box-shadow: 0px 0.5rem 1.5rem 0px rgba(0, 0, 0, 0.15);
  /* width: calc(100% - 5rem); */
  box-sizing: border-box;
  width: 100%;
  padding: 1.75rem 2.5rem;
  margin: 1rem;
  border-radius: 0.5rem;
  cursor: default;
`;

let FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

let OptionButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

let UserInfo = styled.div`
  ${({ theme }) => theme.component.flexBox.rowCenter};
  gap: 0.75rem;
`;

let TextBox = styled.div`
  width: calc(100% - 4rem);
  height: 60px;
  flex-shrink: 1;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
`;

let ProfileImgWrapper = styled.div`
  width: 60px;
  height: 60px;
  flex-shrink: 0;

  cursor: pointer;
`;

let ProfileImg = styled.img`
  ${({ theme }) => theme.component.common.circleImg};
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.color.border};
`;

let MediumIcon = styled.img`
  ${({ theme }) => theme.component.iconSize.small};
`;

let SmallIcon = styled.img`
  ${({ theme }) => theme.component.iconSize.small};
  filter: ${({ filter }) => filter};
`;

let FeedOptionIcon = styled(MediumIcon)`
  box-sizing: content-box;
  padding: 2px;
  /* margin: -4px -4px 0px 0px; */
  border-radius: 50%;
  border: none;
  cursor: pointer;
  &:hover {
    transition: 0.3s;
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let FeedContents = styled.div`
  display: flex;
  gap: 24px;
`

let FeedBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

let FeedArticle = styled.div`
  display: flex;
  flex-direction: column;
  width: 292px;
`;

let FeedTags = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
`;

let PrevBtn = styled.img`
  position: absolute;
  width: 56px;
  height: 100%;
  background-color: ${({ theme }) => theme.color.font1};
  left: 0;
  border-radius: 4px 0px 0px 4px;

  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  cursor: pointer;
`;

let NextBtn = styled.img`
  position: absolute;
  width: 56px;
  height: 100%;
  background-color: ${({ theme }) => theme.color.font1};
  right: 0;
  border-radius: 0px 4px 4px 0px;

  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  cursor: pointer;
`;

let PictureWrap = styled.div`
  width: 370px;
  height: 208px;
  position: relative;

  &:hover ${PrevBtn}, &:hover ${NextBtn} {
    opacity: 0.6;
    pointer-events: all;
  }
`;

let Picture = styled.img`
  width: 100%;
  height: 208px;
  object-fit: cover;
  border-radius: 4px;
`;

let HorizontalLine = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.color.border};
  width: 100%;
  margin: 16px 0px;
`

let FeedFooter = styled.div`
  ${({ theme }) => theme.component.flexBox.rowSpaceBetween};
  width: 100%;
`;

let CommunicationBox = styled.div`
  ${({ theme }) => theme.component.flexBox.rowLeftCenter};
  gap: 1rem;
  margin: 1rem 0;
`;

let IconBox = styled.div`
  ${({ theme }) => theme.component.flexBox.rowLeftCenter};
  gap: 0.5rem;
`;

export default Feed;
