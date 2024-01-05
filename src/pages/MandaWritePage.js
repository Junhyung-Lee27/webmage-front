import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import MandaWrite from "../components/MandaWrite";
import MandaSimpleRecommend from "../components/MandaSimpleRecommend";
import componentTheme from "../components/theme";
import axios from "axios";
import { BASE_URL } from "./../config";
import { useEffect, useRef, useState } from "react";

function MandaWritePage() {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태 관리
  const [writeMode, setWriteMode] = useState("SUB"); // 작성 상태 관리 (SUB, CONTENT 중 무엇을 작성하고 있는지)
  const [selectedSubIndex, setSelectedSubIndex] = useState(); // 현재 포커스된 3*3 테이블 상태 (초기 상태 = 가운데)
  const propsToMandaWrite = {
    writeMode,
    setWriteMode,
    selectedSubIndex,
    setSelectedSubIndex,
  };
  const user = useSelector((state) => state.user);
  const manda = useSelector((state) => state.manda);
  
  // MandaSimples 관련 상태
  const [mandaSimples, setMandaSimples] = useState([]);
  const [isMandaSimpleScrolling, setIsMandaSimpleScrolling] = useState(false); // 스크롤 중 상태
  const mandaSimpleScrollContainerRef = useRef(null);

  useEffect(() => {
    // writeMode가 'SUB'일 경우
    if (writeMode === "SUB" && manda.main.main_title) {
      fetchRecommendedSubMandas(user.authToken, manda.main.main_title, "main_title");
    }
    // writeMode가 'CONTENT'일 경우
    else if (writeMode === "CONTENT" && selectedSubIndex != null && manda.subs[selectedSubIndex]) {
      fetchRecommendedSubMandas(
        user.authToken,
        manda.subs[selectedSubIndex].sub_title,
        "sub_title",
        manda.subs[selectedSubIndex].id
      );
    }
  }, [writeMode, selectedSubIndex, manda.main.main_title]);

  // 추천된 세부 목표 또는 실천 방법을 요청하는 함수
  const fetchRecommendedSubMandas = async (authToken, title, titleType, subId = null) => {
    
    try {
      const postData = {
        [titleType]: title,
      };

      // 'CONTENT' 모드일 때 sub_id 추가
      if (subId && titleType === "sub_title") {
        postData.sub_id = subId;
      }

      // axios 요청
      const response = await axios.post(`${BASE_URL}/manda/recommend/mandasimple/`, postData, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (response.status === 200) {
        setMandaSimples(response.data);
      }
    } catch (error) {
      console.error("추천된 세부 목표 또는 실천 방법 요청 실패:", error);
    }
  };

  // [MandaSimple] 스크롤 이동 간격
  const scrollDistance = (((848 - 2 - 32 - 16 * 2) / 3) * 2) + (16 * 2)

  // [MandaSimple] 이전 페이지로 이동
  const handleMandaSimplePrevClick = () => {
    if (isMandaSimpleScrolling) return; // 스크롤 중이면 아무것도 하지 않음
    setIsMandaSimpleScrolling(true); // 스크롤 시작

    if (mandaSimpleScrollContainerRef.current) {
      mandaSimpleScrollContainerRef.current.scrollLeft -= scrollDistance;
    }

    setTimeout(() => {
      setIsMandaSimpleScrolling(false);
    }, 500);
  };

  // [MandaSimple] 다음 페이지로 이동
  const handleMandaSimpleNextClick = async () => {
    if (isMandaSimpleScrolling) return;
    setIsMandaSimpleScrolling(true);

    // writeMode가 'SUB'일 경우
    if (writeMode === "SUB" && manda.main.main_title) {
      fetchRecommendedSubMandas(user.authToken, manda.main.main_title, "main_title");
    }
    // writeMode가 'CONTENT'일 경우
    else if (writeMode === "CONTENT" && selectedSubIndex != null && manda.subs[selectedSubIndex]) {
      fetchRecommendedSubMandas(
        user.authToken,
        manda.subs[selectedSubIndex].sub_title,
        "sub_title",
        manda.subs[selectedSubIndex].id
      );
    }

    if (mandaSimpleScrollContainerRef.current) {
      mandaSimpleScrollContainerRef.current.scrollLeft += scrollDistance;
    }

    setTimeout(() => {
      setIsMandaSimpleScrolling(false);
    }, 500);
  };

  return (
    <ThemeProvider theme={theme}>
      <PageLayout backgroundcolor={theme.color.bg2}>
        <Header></Header>
        <Body>
          <Stadardized>
            <MandaWrite {...propsToMandaWrite} />
            <OtherMandaBox>
              <Title>
                {writeMode === "SUB" && (
                  <>
                    <Highlight>{manda.main.main_title}</Highlight>
                    와(과) 유사한 <Highlight2>핵심목표</Highlight2>와{" "}
                    <Highlight2>세부목표</Highlight2>
                  </>
                )}
                {writeMode === "CONTENT" &&
                  selectedSubIndex != null &&
                  manda.subs[selectedSubIndex] && (
                    <>
                      <Highlight>{manda.subs[selectedSubIndex].sub_title}</Highlight>
                      와(과) 유사한 <Highlight2>세부목표</Highlight2>와{" "}
                      <Highlight2>실천방법</Highlight2>
                    </>
                  )}
              </Title>
              {mandaSimples.length > 0 && (
                <>
                  <PrevButton
                    onClick={handleMandaSimplePrevClick}
                    src={process.env.PUBLIC_URL + "/icon/prev-image-btn.svg"}
                    top="44%"
                  />
                  <NextButton
                    onClick={handleMandaSimpleNextClick}
                    src={process.env.PUBLIC_URL + "/icon/next-image-btn.svg"}
                    top="44%"
                  />
                </>
              )}
              <OtherMandas ref={mandaSimpleScrollContainerRef} length={mandaSimples.length}>
                {mandaSimples && mandaSimples.length > 0 ? (
                  mandaSimples.map((mandaSimple) => (
                    <MandaSimpleRecommend
                      key={mandaSimple.id}
                      mandaSimple={mandaSimple}
                      writeMode={writeMode}
                    />
                  ))
                ) : (
                  <NoResult>유사한 만다라트가 없습니다.</NoResult>
                )}
              </OtherMandas>
            </OtherMandaBox>
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
  background-color: ${({ backgroundcolor }) => backgroundcolor};
  height: 100%;
`;

let Body = styled.div`
  display: flex;
  align-content: space-between;
  justify-content: center;
  width: 100%;
  margin-top: 64px; // height of Header Component
`;

let Stadardized = styled.div`
  margin-top: 24px;
  margin-bottom: 80px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 1280px;
`;

const ScrollButton = styled.img`
  position: absolute;
  top: ${({ top }) => top};
  z-index: 99;
  width: 64px;
  height: 80px;

  background-color: ${({ theme }) => theme.color.font1};
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  cursor: pointer;

  &:hover {
    border: 1px solid ${({ theme }) => theme.color.secondary};
  }
`;

const PrevButton = styled(ScrollButton)`
  border-radius: 8px;
  left: -16px;
`;

const NextButton = styled(ScrollButton)`
  border-radius: 8px;
  right: -16px;
`;

let OtherMandaBox = styled.div`
  position: relative;
  width: 848px;
  padding: 16px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg};

  &:hover ${PrevButton}, &:hover ${NextButton} {
    opacity: 0.6;
    pointer-events: all;
  }
`;

const Title = styled.div`
  color: ${({ theme }) => theme.color.font2};
  line-height: 20px;
  
  width: 100%;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.color.primary};
  font-size: 20px;
  font-weight: 600;
  margin-right: 2px;
`

const Highlight2 = styled.span`
  color: ${({ theme }) => theme.color.secondary};
  font-size: 16px;
  font-weight: 600;
`

const OtherMandas = styled.div`
  width: 100%;
  max-height: 256px;

  display: flex;
  flex-direction: ${({ length }) => (length > 5 ? "column" : "row")};
  flex-wrap: wrap;
  gap: 16px;

  overflow-x: scroll;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

const NoResult = styled.div`
  width: 100%;
  height: 256px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${({ theme }) => theme.color.font2};
`;

export default MandaWritePage;
