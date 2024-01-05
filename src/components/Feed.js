import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import FollowButton from "./FollowButton";
import FeedWriteModal from "./FeedWriteModal";
import { BASE_URL } from "./../config";
import axios from "axios";
import FeedFooter from "./FeedFooter";
import { setSelectedUser } from "../store/selectedUserSlice";
import { useNavigate } from "react-router-dom";
import { setFeeds } from "../store/feedSlice";

function Feed({
  id, // 컴포넌트 고유 id
  userInfo,
  feedInfo,
  show,
  setShow,
  handleShow,
  feedMode,
  setFeedMode,
  fetchFeeds,
  currentPage,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 옵션 메뉴
  const selectedUser = useSelector((state) => state.selectedUser);
  const feeds = useSelector((state) => state.feed.feeds);

  // 특정 유저의 프로필 불러오기 함수
  const handleSelectedUser = async (userId, authToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/profile/${userId}`, {
        headers: {
          accept: "application/json",
          Authorization: `Token ${authToken}`,
        },
      });

      dispatch(setSelectedUser(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  // 날짜 형식 변환
  const formatDateAgo = (dateString) => {
    const date = new Date(dateString);
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

  // 태그 형태 변환
  const parseTagsString = (tagsString) => {
    return tagsString.split(",").map((tag) => tag.trim().replace(/"/g, ""));
  };

  const imgUrl = "";

  // 팔로우 처리
  const followOnFeed = async () => {
    const updatedFeeds = feeds.map((feed) => {
      if (feed.userInfo.id === userInfo.id) {
        return {
          ...feed,
          userInfo: {
            ...feed.userInfo,
            is_following: true, // 팔로우 상태 업데이트
          },
        };
      }
      return feed;
    });

    dispatch(setFeeds(updatedFeeds));
  };

  // 언팔로우 처리
  const unfollowOnFeed = async () => {
    const updatedFeeds = feeds.map((feed) => {
      if (feed.userInfo.id === userInfo.id) {
        return {
          ...feed,
          userInfo: {
            ...feed.userInfo,
            is_following: false, // 언팔로우 상태 업데이트
          },
        };
      }
      return feed;
    });

    dispatch(setFeeds(updatedFeeds));
  };

  return (
    <ThemeProvider theme={theme}>
      <FeedBox id={id}>
        <FeedBody>
          {/*유저정보 및 팔로우버튼/메뉴버튼 */}
          <FeedHeader>
            <UserInfo>
              <ProfileImgWrapper
                onClick={() => {
                  handleSelectedUser(userInfo.id, user.authToken);
                  navigate(`/manda/${selectedUser.username}`);
                }}
              >
                <ProfileImg src={process.env.PUBLIC_URL + "/testImg/profile2.jpg"} />
              </ProfileImgWrapper>
              <TextBox>
                <UserName
                  onClick={() => {
                    handleSelectedUser(userInfo.id, user.authToken);
                    navigate(`/manda/${selectedUser.username}`);
                  }}
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
                >
                  {userInfo.userPosition}
                </StyledText>
                <StyledText size="13px" weight="500" color={theme.color.font2} lineHeight="16px">
                  {formatDateAgo(feedInfo.created_at)}
                </StyledText>
              </TextBox>
            </UserInfo>

            <OptionButtons>
              {userInfo.id !== user.userId && (
                <FollowButton
                  userInfo={userInfo}
                  onFollow={() => followOnFeed(userInfo.id, user.authToken)}
                  onUnfollow={() => unfollowOnFeed(userInfo.id, user.authToken)}
                />
              )}
              <OptionWrapper>
                <FeedOptionIcon
                  src={process.env.PUBLIC_URL + "/icon/menu-horizontal.svg"}
                  onClick={() => {
                    setIsMenuOpen((prevState) => !prevState);
                  }}
                ></FeedOptionIcon>
                {isMenuOpen && (
                  <OptionMenu
                    user={user}
                    userInfo={userInfo}
                    feedInfo={feedInfo}
                    show={show}
                    setShow={setShow}
                    handleShow={handleShow}
                    feedMode={feedMode}
                    setFeedMode={setFeedMode}
                    fetchFeeds={fetchFeeds}
                    currentPage={currentPage}
                    theme={theme}
                  ></OptionMenu>
                )}
              </OptionWrapper>
            </OptionButtons>
          </FeedHeader>
          {/* 경계선 */}
          <HorizontalLine />
          {/* 만다라트, 이미지 + 피드 */}
          <FeedContents>
            {/*피드 본문*/}
            <FeedArticle>
              <MandaInfoContainer>
                <MandaInfo>
                  <MandaInfoTitle>핵심 목표</MandaInfoTitle>
                  <MandaInfoText>{feedInfo.main_title}</MandaInfoText>
                </MandaInfo>
                <MandaInfo>
                  <MandaInfoTitle>세부 목표</MandaInfoTitle>
                  <MandaInfoText>{feedInfo.sub_title}</MandaInfoText>
                </MandaInfo>
                <MandaInfo>
                  <MandaInfoTitle>실천 방법</MandaInfoTitle>
                  <MandaInfoText>{feedInfo.content}</MandaInfoText>
                </MandaInfo>
              </MandaInfoContainer>
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
                {parseTagsString(feedInfo.tags).map((tag, index) => {
                  return (
                    <StyledText
                      size="14px"
                      weight="500"
                      color={theme.color.primary}
                      key={tag + index}
                    >
                      {"#" + tag + " "}
                    </StyledText>
                  );
                })}
              </FeedTags>
            </FeedArticle>
            {/* 이미지 영역 */}
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
        <FeedFooter feedInfo={feedInfo}></FeedFooter>
      </FeedBox>
    </ThemeProvider>
  );
}

function OptionMenu({
  userInfo,
  feedInfo,
  show,
  setShow,
  handleShow,
  feedMode,
  setFeedMode,
  user,
  fetchFeeds,
  currentPage,
  theme,
}) {
  // 상태 관리
  const [isOpenReportFeedModal, setIsOpenReportFeedModal] = useState(false); // 피드 차단 모달
  const [isOpenDeleteFeedModal, setIsOpenDeleteFeedModal] = useState(false); // 피드 삭제 모달
  const [isOpenBlockUserModal, setIsOpenBlockUserModal] = useState(false); // 유저 차단 모달
  const [isReportFeedSuccess, setIsReportFeedSuccess] = useState(false); // 피드 신고 상태

  // 사용자 차단 결정 후 피드 재로드
  const onBlockUserCompleted = () => {
    fetchFeeds(user, currentPage);
  };

  return (
    <OptionLayout>
      <OptionList>
        {user.userId === userInfo.id ? (
          <>
            <Option
              onClick={() => {
                setFeedMode("EDIT");
                handleShow();
              }}
            >
              게시물 수정
            </Option>
            {feedMode === "EDIT" && show === true && (
              <FeedWriteModal
                show={show}
                setShow={setShow}
                userId={user.userId}
                authToken={user.authToken}
                feedMode={feedMode}
                feedInfo={feedInfo}
                user={user}
                currentPage={currentPage}
                fetchFeeds={fetchFeeds}
              ></FeedWriteModal>
            )}
            <Option onClick={() => setIsOpenDeleteFeedModal(true)}>게시물 삭제</Option>
            {isOpenDeleteFeedModal === true && (
              <DeleteFeedModal
                theme={theme}
                setIsOpenDeleteFeedModal={setIsOpenDeleteFeedModal}
                feedId={feedInfo.id}
                user={user}
                currentPage={currentPage}
                fetchFeeds={fetchFeeds}
              />
            )}
          </>
        ) : (
          <>
            <Option onClick={() => setIsOpenReportFeedModal(true)}>게시물 신고</Option>
            {isOpenReportFeedModal === true && (
              <ReportFeedModal
                theme={theme}
                setIsOpenReportFeedModal={setIsOpenReportFeedModal}
                setIsOpenBlockUserModal={setIsOpenBlockUserModal}
                user={user}
                feedInfo={feedInfo}
                currentPage={currentPage}
                fetchFeeds={fetchFeeds}
                setIsReportFeedSuccess={setIsReportFeedSuccess}
              />
            )}
            <Option onClick={() => setIsOpenBlockUserModal(true)}>유저 차단</Option>
            {isOpenBlockUserModal === true && (
              <BlockUserModal
                theme={theme}
                setIsOpenBlockUserModal={setIsOpenBlockUserModal}
                user={user}
                userInfo={userInfo}
                currentPage={currentPage}
                fetchFeeds={fetchFeeds}
                isReportFeedSuccess={isReportFeedSuccess}
              />
            )}
          </>
        )}
      </OptionList>
    </OptionLayout>
  );
}

function DeleteFeedModal({
  theme,
  setIsOpenDeleteFeedModal,
  feedId,
  user,
  currentPage,
  fetchFeeds,
}) {
  const handleDeleteFeed = async (user, feedId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/feed/delete/${feedId}/`,
        {},
        {
          headers: {
            Authorization: `Token ${user.authToken}`,
          },
        }
      );
      alert("게시물이 성공적으로 삭제되었습니다");
      fetchFeeds(user, currentPage);
      setIsOpenDeleteFeedModal(false);
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("게시물 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          게시물을 <Highlight>삭제</Highlight>하시겠습니까?
        </ModalTitle>
        <Buttons>
          <StyledButton
            onClick={() => setIsOpenDeleteFeedModal(false)}
            color={theme.color.font1}
            backgroundcolor={theme.color.bg3}
            border="none"
          >
            돌아가기
          </StyledButton>
          <StyledButton
            onClick={() => handleDeleteFeed(user, feedId)}
            color="white"
            backgroundcolor={theme.color.primary}
          >
            삭제
          </StyledButton>
        </Buttons>
      </ModalContent>
    </ModalOverlay>
  );
}

function BlockUserModal({
  theme,
  setIsOpenBlockUserModal,
  user,
  userInfo,
  currentPage,
  fetchFeeds,
  isReportFeedSuccess,
}) {
  const handleBlockUser = async (user, targetUser) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/block/`,
        { blocked_id: targetUser },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user.authToken}`,
          },
        }
      );
      alert("유저가 차단되었습니다");
      setIsOpenBlockUserModal(false);
      fetchFeeds(user, currentPage);
    } catch (error) {
      console.error("Failed to block:", error);
      alert("유저 차단 중 오류가 발생했습니다.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          {userInfo.userName} 유저를 <Highlight>차단</Highlight>하시겠습니까?
        </ModalTitle>
        <Buttons>
          <StyledButton
            onClick={() => {
              setIsOpenBlockUserModal(false);
              if (isReportFeedSuccess) {
                fetchFeeds(user, currentPage);
              }
            }}
            color={theme.color.font1}
            backgroundcolor={theme.color.bg3}
            border="none"
          >
            돌아가기
          </StyledButton>
          <StyledButton
            onClick={() => handleBlockUser(user, userInfo.id)}
            color="white"
            backgroundcolor={theme.color.primary}
          >
            차단
          </StyledButton>
        </Buttons>
      </ModalContent>
    </ModalOverlay>
  );
}

function ReportFeedModal({
  theme,
  setIsOpenReportFeedModal,
  setIsOpenBlockUserModal,
  user,
  feedInfo,
  setIsReportFeedSuccess,
}) {
  // 상태 관리
  const [reportReason, setReportReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  // 게시물 신고 처리
  const handleReportFeed = async (user, targetFeed, reason, otherReason) => {
    if (!reason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    let finalReason = reason === "기타" ? otherReason : reason;

    try {
      const response = await axios.post(
        `${BASE_URL}/feed/report/`,
        { reported_id: targetFeed, reason: finalReason },
        {
          headers: { "Content-Type": "application/json", Authorization: `Token ${user.authToken}` },
        }
      );
      alert("해당 게시물이 신고되었습니다");
      setIsReportFeedSuccess(true); // 신고 상태 -> true
      setIsOpenReportFeedModal(false); // 신고 모달 -> off
      setIsOpenBlockUserModal(true); // 유저 차단 모달 -> on
    } catch (error) {
      console.error("Failed to Report:", error);
      alert("피드 게시물 신고 중 오류가 발생했습니다.");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          게시물을 <Highlight>신고</Highlight>하시겠습니까?
        </ModalTitle>
        <DropdownMenu value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
          <option value="">신고 사유 선택...</option>
          <option value="스팸 또는 광고">스팸 또는 광고</option>
          <option value="혐오 발언 또는 괴롭힘">혐오 발언 또는 괴롭힘</option>
          <option value="부적절한 내용">부적절한 내용</option>
          <option value="저작권 침해">저작권 침해</option>
          <option value="기타">기타</option>
        </DropdownMenu>
        {reportReason === "기타" && (
          <TextField
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="신고 사유 입력"
          />
        )}
        <Buttons>
          <StyledButton
            onClick={() => setIsOpenReportFeedModal(false)}
            color={theme.color.font1}
            backgroundcolor={theme.color.bg3}
            border="none"
          >
            돌아가기
          </StyledButton>
          <StyledButton
            onClick={() => handleReportFeed(user, feedInfo.id, reportReason, otherReason)}
            color="white"
            backgroundcolor={theme.color.primary}
          >
            신고
          </StyledButton>
        </Buttons>
      </ModalContent>
    </ModalOverlay>
  );
}

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
  flex-direction: column;
  /* box-shadow: 0px 0.5rem 1.5rem 0px rgba(0, 0, 0, 0.15); */
  /* width: calc(100% - 5rem); */
  box-sizing: border-box;
  width: 100%;
  padding: 24px 32px;
  background-color: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
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
`;

let OptionWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

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

let OptionLayout = styled.div`
  ${({ theme }) => theme.component.shadow.default};
  position: absolute;
  z-index: 5;
  top: 100%;
  right: calc(100% - 1.4rem);
  width: 160px;
  height: fit-content;
  background-color: ${({ theme }) => theme.color.bg};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.border};
`;

let OptionContainer = styled.div`
  position: relative;
`;

let OptionList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: initial;
  padding: initial;
`;

let Option = styled.li`
  padding: 16px 24px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let FeedContents = styled.div`
  display: flex;
  gap: 24px;
`;

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

let MandaInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};

  margin-bottom: 24px;

  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  padding: 12px 16px;
`;

let MandaInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

let MandaInfoTitle = styled.span`
  background-color: ${({ theme }) => theme.color.bg3};
  padding: 4px 8px;
  border-radius: 8px;
`;

let MandaInfoText = styled.span`
  flex: 1;
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
  height: 276px;
  position: relative;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border};
  overflow: hidden;

  &:hover ${PrevBtn}, &:hover ${NextBtn} {
    opacity: 0.6;
    pointer-events: all;
  }
`;

let Picture = styled.img`
  width: 100%;
  height: 276px;
  object-fit: cover;
  border-radius: 8px;
`;

let HorizontalLine = styled.div`
  border-top: 1px solid ${({ theme }) => theme.color.border};
  width: 100%;
  margin: 16px 0px;
`;

let ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 검정색 배경에 70% 투명도 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

let ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.color.bg};
  padding: 40px 80px;
  border-radius: 8px;
  width: 500px;
  max-height: 100%;
`;

let ModalTitle = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.font1};
  margin-bottom: 32px;
  text-align: center;
  width: 100%;
`;
let Highlight = styled.span`
  color: ${({ theme }) => theme.color.primary};
`;

const DropdownMenu = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

let Buttons = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 8px;
  /* margin-top: 32px; */
  padding: 8px 0px;
`;

let StyledButton = styled.button`
  height: 42px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  width: 50%;
  padding: 12px 24px;
  color: ${({ color }) => color};
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  border: none;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

export default Feed;
