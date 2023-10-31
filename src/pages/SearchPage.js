import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import UserRecommend from "../components/UserRecommend";
import MandaSimple from "../components/MandaSimple";
import Feed from "../components/Feed";
import componentTheme from "./../components/theme";

function SearchPage() {
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 피드 정보
  const feedInfo = [
    {
      userInfo: {
        profile_img: process.env.PUBLIC_URL + "/testImg/profile1.jpg",
        userName: "김도언",
        userPosition: "ESTsoft 오르미 2기 강사",
        isFallowing: false
      },
      contentInfo: {
        id: 1,
        content: "토요일 오전 알고리즘 보충수업",
        main_title: "오르미 2기 모두 취업시키기",
        sub_title: "교육생 알고리즘 역량 강화",
        upload_date: new Date(2023, 9, 21, 3, 24, 0),
        content_count: 2,
        content_img: process.env.PUBLIC_URL + "/testImg/feedImg1.jpg",
        post: "📢 주말 알고리즘 보충 수업에 참여해준 우리 오르미 여러분! 이번 주말에는 열심히 보충 수업을 진행했습니다. 새로운 내용과 풍부한 연습 문제로 더 나은 알고리즘 역량을 키워보세요. 이번 주에 배운 내용을 다시 한 번 리뷰하고, 미처 이해하지 못한 부분을 해결해보세요! 💪💡",
        tags: [
          "알고리즘",
          "보충수업",
          "교육생",
          "프로그래밍",
          "지식갱신",
        ],
        emoji_count: {
          like: 10,
          dislike: 0,
          heart: 6,
          smile: 4,
          sad: 1,
          angry: 1,
        },
        comment_info: [
          {
            username: "오르미",
            comment: "오늘 수업 잘들었습니다!",
            upload_date: new Date(2023, 9, 21, 6, 18, 0),
          },
        ]
      }
    },
    {
      userInfo: {
        profile_img: process.env.PUBLIC_URL + "/testImg/profile2.jpg",
        userName: "오르미",
        userPosition: "ESTsoft 오르미 2기",
        isFallowing: false
      },
      contentInfo: {
        id: 2,
        content: "알고리즘 공부하기!",
        main_title: "개발자로 취업하기",
        sub_title: "알고리즘 실력 키우기",
        upload_date: new Date(2023, 9, 20, 3, 24, 0),
        content_count: 6,
        content_img: process.env.PUBLIC_URL + "/testImg/feedImg2.jpg",
        post: "우리 오르미 최고의 강사님이신 김도언 강사님께서 주말 보충 수업을 해주셨다. 이번주에 보충한 알고리즘은 DP인데, 항상 어렵게 느껴졌던 부분이라 더욱 집중해서 들었다. 강사님의 보충 수업을 들으니 이해가 잘 되는 것 같았다.",
        tags: [
          "오르미2기",
          "남은기간화이팅",
          "알고리즘",
          "보충수업",
        ],
        emoji_count: {
          like: 13,
          dislike: 2,
          heart: 4,
          smile: 1,
          sad: 0,
          angry: 0,
        },
        comment_info: [
          {
            username: "이스트",
            comment: "대단하세요!",
            upload_date: new Date(2023, 9, 21, 6, 18, 0),
          },
          {
            username: "김도언",
            comment: "잘 하고 계십니다",
            upload_date: new Date(2023, 9, 24, 1, 20, 0),
          }
        ]
      }
    }
  ]

  // 각 사용자의 정보와 axios URL 설정
  const users = [
    { id: 1, name: "User 1", axiosURL: "http://15.164.217.203:8000/manda/mandamain/1" },
    { id: 2, name: "User 2", axiosURL: "http://15.164.217.203:8000/manda/mandamain/2" },
    { id: 3, name: "User 3", axiosURL: "http://15.164.217.203:8000/manda/mandamain/3" },
    { id: 4, name: "User 4", axiosURL: "http://15.164.217.203:8000/manda/mandamain/4" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Header></Header>
        <Contents>
          <OtherManda>
            {users.map((user) => (
              <MandaSimple key={user.id} axiosURL={user.axiosURL} />
            ))}
          </OtherManda>
          <HorizontalBorder />
          <Row>
            <Feeds>
              {feedInfo.map((feed) => (
                <Feed
                  key={feed.contentInfo.id}
                  userInfo={feed.userInfo}
                  contentInfo={feed.contentInfo}
                />
              ))}
            </Feeds>
            <VerticalBorder />
            <Recommends>
              <UserRecommend />
              <UserRecommend />
              <UserRecommend />
            </Recommends>
          </Row>
        </Contents>
      </PageLayout>
    </ThemeProvider>
  );
}

let PageLayout = styled.div`
  ${({ theme }) => theme.component.font.importPretendard};
  font-family: Pretendard-Regular;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.bg};
`;

let Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 28px 196px 80px 196px;
`;

const OtherManda = styled.div`
  display: flex;
  gap: 40px;
`

let HorizontalBorder = styled.hr`
  border: 1px solid ${({ theme }) => theme.color.border};
  width: 100%;
  margin: initial;
`

let VerticalBorder = styled.hr`
  border: 1px solid ${({ theme }) => theme.color.border};
  width: 1;
  height: 100%;
  margin: initial;
`

let Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  gap: 38px;
`;

let Feeds = styled.div`
  width:100%;
  margin: 32px 0px 0px -40px;
  display: flex;
  flex-direction:column;
  align-items: center;
`;

let Recommends = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: auto;
  margin-top: 48px;
`

export default SearchPage;
