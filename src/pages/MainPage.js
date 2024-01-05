import styled, { ThemeProvider } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Manda from "../components/Manda";
import MandaTitle from "../components/MandaTitle";
import TodoList from "../components/TodoList";
import componentTheme from "../components/theme";
import axios from "axios";
import { BASE_URL } from "./../config";
import { setUser } from "../store/userSlice";
import UserProfile from "../components/UserProfile";
import { setSelectedUser } from "../store/selectedUserSlice";
import { setFeeds } from "../store/feedSlice";
import Feed from "../components/Feed";

function MainPage() {
  const dispatch = useDispatch();

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 유저 상태
  const user = useSelector((state) => state.user);
  let selectedUser = useSelector((state) => state.selectedUser);

  // 만다라트 작성 상태
  const [currPage, setCurrPage] = useState("");

  // 사용자 프로필 업데이트 (user.Id 변경되었을 경우)
  useEffect(() => {
    const fetchData = async (userId, authToken) => {
      try {
        const response = await axios.get(`${BASE_URL}/user/profile/${userId}`, {
          headers: {
            accept: "application/json",
            Authorization: `Token ${authToken}`,
          },
        });
        dispatch(
          setUser({
            userId: response.data.userId,
            username: response.data.username,
            userImg: response.data.userImg,
            userPosition: response.data.userPosition,
            userInfo: response.data.userInfo,
            userHash: response.data.userHash,
            userEmail: response.data.userEmail,
            userProvider: response.data.userProvider,
            followerCount: response.data.followerCount,
            successCount: response.data.successCount,
          })
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchData(user.userId, user.authToken);

    // currPage 상태 변환
    setCurrPage("MAIN");
  }, [user.userId]);

  // selectedUser 디폴트 설정
  useEffect(() => {
    // 만약 selectedUser가 비어 있고 user 정보가 있다면, user로 selectedUser 설정
    if (!selectedUser || (Object.keys(selectedUser).length === 0 && user.username !== "")) {
      dispatch(setSelectedUser(user));
    }
  }, [user.username]);

  // 피드 상태
  const feeds = useSelector((state) => state.feed.feeds); // 피드 상태
  const [currentPage, setCurrentPage] = useState(1); // 피드 페이지네이션 번호
  const [isFeedLoaded, setIsFeedLoaded] = useState(false); // 피드 로드 상태
  const [hasMoreFeeds, setHasMoreFeeds] = useState(true); // 더 불러올 피드가 있는지
  const [show, setShow] = useState(false); // 피드 작성, 편집 모달 노출 상태
  const [feedMode, setFeedMode] = useState(""); // 피드 작성, 편집 모드 구분

  // 피드 관련 상태 초기화 (selectedUser 변경 시)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [selectedUser]);

  // 피드 게시물 생성, 편집 모달
  const handleShow = () => setShow(true);

  // axios 요청 취소 인스턴스
  const axiosCancelSource = useRef(axios.CancelToken.source());

  // 피드 불러오기 (selectedUser가 있을 경우에만 실행)
  useEffect(() => {
    // 이전 요청 취소 및 새로운 취소 토큰 생성
    axiosCancelSource.current.cancel("Previous request cancelled");
    axiosCancelSource.current = axios.CancelToken.source();

    // 선택된 유저의 피드 불러오기
    if (Object.keys(selectedUser).length !== 0 && user.authToken) {
      fetchSelectedUserFeeds(user, selectedUser, currentPage, axiosCancelSource.current.token)
        .then(() => {
          setIsFeedLoaded(true); // 요청 성공했을 때
        })
        .catch((error) => {
          if (!axios.isCancel(error)) {
            console.error("Error in feed loading: ", error); // 요청 중 오류 발생했을 때
          }
        });
    }
  }, [selectedUser, currentPage]);

  // 선택된 유저 피드 불러오기
  async function fetchSelectedUserFeeds(currentUser, selectedUser, currentPage, cancelToken) {
    if (hasMoreFeeds === false) {
      return;
    } else if (hasMoreFeeds) {
      const response = await axios.get(
        `${BASE_URL}/feed/${selectedUser.userId}/?query=${selectedUser.userId}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Token ${currentUser.authToken}`,
          },
          cancelToken: cancelToken,
        }
      );

      // 더 이상 페이지 없음
      if (response.data.message === "No more pages") {
        setHasMoreFeeds(false);
        return;
      }

      // 요청 성공
      if (response.status === 200) {
        if (currentPage > 1) {
          dispatch(setFeeds([...feeds, ...response.data])); // 기존 피드에 추가
          console.log("my feeds loaded");
        } else {
          dispatch(setFeeds(response.data)); // 피드 초기화
        }
      }
    }
  }

  // Intersection Observer 설정 (스크롤이 하단에 도달했을 때 감지)
  useEffect(() => {

    if (!isFeedLoaded || !hasMoreFeeds) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => prevPage + 1); // 페이지 번호 증가
          setIsFeedLoaded(false);
        }
      },
      { threshold: 1.0 }
    );

    // 관찰할 대상 요소 지정
    const target = document.getElementById("feedEnd");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target); // 정리 작업
    };
  }, [isFeedLoaded && hasMoreFeeds]);

  // 투두리스트 샘플 데이터
  // const todoInfo = [
  //   {
  //     id: 1,
  //     title: "알고리즘 3문제 풀이",
  //     detail: "백준 7579번, 2293번, 2629번 풀기",
  //     todo_date: new Date(2023, 9, 31, 12, 34, 56),
  //   },
  //   {
  //     id: 2,
  //     title: "포트폴리오 최신화",
  //     detail: "프로젝트 성과 정리",
  //     todo_date: new Date(2023, 9, 31, 12, 34, 56),
  //   },
  //   {
  //     id: 3,
  //     title: "면접 준비",
  //     detail: "면접 스터디 구하기",
  //     todo_date: new Date(2023, 10, 1, 12, 34, 56),
  //   },
  //   {
  //     id: 4,
  //     title: "30분 달리기",
  //     detail: "9시 러닝크루 모임 참석",
  //     todo_date: new Date(2023, 10, 1, 12, 34, 56),
  //   },
  //   {
  //     id: 5,
  //     title: "자바스크립트 공부",
  //     detail: "비동기 처리에 대한 깊은 이해와 실습",
  //     todo_date: new Date(2023, 10, 3, 14, 34, 56),
  //   },
  //   {
  //     id: 6,
  //     title: "디자인 패턴 학습",
  //     detail: "싱글톤 패턴과 팩토리 패턴에 대해 조사",
  //     todo_date: new Date(2023, 10, 4, 16, 34, 56),
  //   },
  // ];

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Body>
          <Stadardized>
            <TopGroup>
              <FixedLeftSide>
                <UserProfile />
                {/* <MandaLog>만다라트 실천 캘린더</MandaLog> */}
              </FixedLeftSide>
              <MyManda>
                <MandaTitle />
                <Manda currPage={currPage} setCurrPage={setCurrPage} />
              </MyManda>
              <Advertise>광고</Advertise>
            </TopGroup>
            <Feeds>
              {feeds.map((feed, index) => (
                <Feed
                  id={`feed-${feed.feedInfo.id}`}
                  key={index}
                  userInfo={feed.userInfo}
                  feedInfo={feed.feedInfo}
                  show={show}
                  setShow={setShow}
                  handleShow={handleShow}
                  feedMode={feedMode}
                  setFeedMode={setFeedMode}
                  user={user}
                  currentPage={currentPage}
                  fetchFeeds={fetchSelectedUserFeeds}
                />
              ))}
              {!hasMoreFeeds && <span>더 이상 불러올 게시물이 없습니다.</span>}
              <div id="feedEnd" /> {/* 스크롤 감지를 위한 요소 */}
            </Feeds>
            {/* <TodoGroup>
                <TodoList date="Today" todos={todoInfo}>
                  오늘
                </TodoList>
                <TodoList date="Tomorrow" todos={todoInfo}>
                  내일
                </TodoList>
                <TodoList date="This Week" todos={todoInfo}>
                  이번 주
                </TodoList>
              </TodoGroup> */}
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
  background-color: ${({ theme }) => theme.color.bg2};
  height: 100%;
`;

let Body = styled.div`
  display: flex;
  align-content: space-between;
  justify-content: center;
  width: 100%;
  margin-top: 64px; // height of Header
`;

let Stadardized = styled.div`
  display: flex;
  flex-direction: column;
  width: 1280px;
  gap: 24px;
  margin-top: 24px;
  margin-bottom: 80px;
`;

const TopGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

const FixedLeftSide = styled.div`
  position: fixed;
  width: 256px;
  left: calc((100% - 1280px) / 2);

  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Advertise = styled.aside`
  width: 256px;
  height: 500px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
`;

const MyManda = styled.div`
  margin-left: calc(256px + 24px);
  width: 720px;

  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg};
  overflow: hidden;
`;

const MandaLog = styled.div`
  width: 256px;
  height: 376px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.color.bg};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
`;

let Feeds = styled.div`
  width: 720px;
  margin-left: calc(256px + 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

// const TodoGroup = styled.div`
//   display: flex;
//   flex-direction: column;
// `

// const TodoList = styled.div`
//   display: inline-flex;
//   width: 338px;
//   height: 230px;
//   background: grey;
//   color: white;
// `

export default MainPage;
