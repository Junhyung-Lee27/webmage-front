import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./../config";
import Manda from "../components/Manda";
import { setContents, setMain, setPrivacy, setSubs } from "../store/mandaSlice";

function MandaWrite({ writeMode, setWriteMode, selectedSubIndex, setSelectedSubIndex }) {
  const dispatch = useDispatch();
  
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태 관리
  const [isMainTitleSaveBtnActive, setIsMainTitleSaveBtnActive] = useState(false);
  const [isSubTitleSaveBtnActive, setIsSubTitleSaveBtnActive] = useState(false);
  const user = useSelector((state) => state.user); // 유저 상태
  let manda = useSelector((state) => state.manda); // 만다라트 상태
  const main = manda.main;
  const subs = manda.subs;
  const contents = manda.contents;

  // 입력 상태
  const [textInputs, setTextInputs] = useState(Array(8).fill(null));
  const [mainTitle, setMainTitle] = useState(manda.main.main_title || "");

  // main_title 작성 버튼 활성화/비활성화
  useEffect(() => {
    setIsMainTitleSaveBtnActive(mainTitle !== manda.main.main_title);
  }, [mainTitle, manda.main.main_title]);

  const handleSubmitMainTitle = async (authToken) => {
    try {
      // 서버로 메인 타이틀 데이터 전송
      const response = await axios.patch(`${BASE_URL}/manda/edit/main/`,
        { id: manda.main.id,
          main_title: mainTitle 
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      
      if (response.status === 200) {
        dispatch(setMain(response.data));
      }
    } catch (error) {
      console.error("mandaMain API 에러:", error);
    }
  };

  // sub_title, contents 작성 버튼 활성화/비활성화 (null 값을 빈 문자열로 변환해서 비교)
  useEffect(() => {
    const checkDifferences = () => {
      // subs 배열에서 sub_title과 textInputs 비교
      if (writeMode === "SUB") {
        const subTitles = subs.map((sub) => sub.sub_title || "");
        const isDifferent = textInputs.some((input, index) => (input || "") !== subTitles[index]);
        setIsSubTitleSaveBtnActive(isDifferent);
      }
      // contents 배열에서 selectedSubIndex에 해당하는 sub_id와 일치하는 contents.content와 textInputs 비교
      else if (writeMode === "CONTENT") {
        const selectedSubId = subs[selectedSubIndex]?.id;
        const relatedContents = contents.filter((content) => content.sub_id === selectedSubId);
        const contentTexts = relatedContents.map((content) => content.content || "");
        const isDifferent = textInputs.some(
          (input, index) => (input || "") !== contentTexts[index]
        );
        setIsSubTitleSaveBtnActive(isDifferent);
      }
    };

    // 0.1초 후에 checkDifferences 함수 실행
    const timeoutId = setTimeout(checkDifferences, 100);

    // 컴포넌트가 언마운트되거나 의존성이 변경될 때 setTimeout 취소
    return () => clearTimeout(timeoutId);
  }, [textInputs, subs, contents, writeMode, selectedSubIndex]);

  return (
    <ThemeProvider theme={theme}>
      <MandaWriteLayout>
        <MyManda>
          <Row padding="0px 24px">
            {/* <MainTitle>{manda.main.main_title}</MainTitle> */}
            <MainTitle value={mainTitle} onChange={(e) => setMainTitle(e.target.value)}></MainTitle>
            <StyledButton
              width="120px"
              height="32px"
              isSaveBtnActive={isMainTitleSaveBtnActive}
              onClick={() => {
                if (isMainTitleSaveBtnActive) {
                  handleSubmitMainTitle(user.authToken);
                }
              }}
            >
              저장
            </StyledButton>
          </Row>
          <Manda
            writeMode={writeMode}
            setWriteMode={setWriteMode}
            selectedSubIndex={selectedSubIndex}
            setSelectedSubIndex={setSelectedSubIndex}
          />
        </MyManda>
        <WriteBoxComponent
          manda={manda}
          writeMode={writeMode}
          selectedSubIndex={selectedSubIndex}
          textInputs={textInputs}
          setTextInputs={setTextInputs}
          isSubTitleSaveBtnActive={isSubTitleSaveBtnActive}
        />
      </MandaWriteLayout>
    </ThemeProvider>
  );
}

// 세부목표 및 실천방법 작성 컴포넌트
function WriteBoxComponent({
  manda,
  writeMode,
  selectedSubIndex,
  textInputs,
  setTextInputs,
  isSubTitleSaveBtnActive,
}) {
  const dispatch = useDispatch();

  // 유저 인증 토큰
  const authToken = useSelector((state) => state.user.authToken);

  // 작성 중인 필드의 인덱스 상태
  const [focusedIndex, setFocusedIndex] = useState(null);

  // 입력 변경 핸들러
  const handleTextInputChange = (index, value) => {
    const newTextInputs = [...textInputs];
    newTextInputs[index] = value;
    setTextInputs(newTextInputs);
  };

  // 입력 상태 초기화
  useEffect(() => {
    // Subs 초기화 (데이터가 없을 경우 blank로 표시)
    if (writeMode === "SUB") {
      const initialSubTitles = manda.subs.map((sub) => sub.sub_title || "");
      setTextInputs(initialSubTitles);
    }
    // Contents 초기화 (subId에 해당하는 contents 필터링 & 데이터가 없을 경우 blank로 표시)
    else if (writeMode === "CONTENT") {
      const subId = manda.subs[selectedSubIndex].id;
      const filteredContents = manda.contents.filter((item) => item.sub_id === subId);
      const initialContents = filteredContents.map((contents) => contents.content || "");
      setTextInputs(initialContents);
    }
  }, [manda, writeMode, selectedSubIndex]);

  // sub_title 수정 요청 전송
  const handleSubmitSub = async () => {
    // 전송 데이터 준비
    const dataToSend = manda.subs.map((sub, index) => ({
      id: sub.id,
      sub_title: textInputs[index],
    }));

    // 요청 시도
    try {
      const response = await axios.post(
        `${BASE_URL}/manda/edit/sub/`,
        { subs: dataToSend },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      // 요청 성공 (스토어의 Subs 상태 업데이트)
      dispatch(setSubs(response.data));
    } catch (error) {
      // 요청 실패
      console.error("mandaSub API 에러 :", error);
    }
  };

  // contents 수정 요청 전송
  const handleSubmitContents = async () => {
    // subId에 해당하는 contents 필터링 및 전송 데이터 준비
    const subId = manda.subs[selectedSubIndex].id;
    const filteredContents = manda.contents.filter((item) => item.sub_id === subId);
    const dataToSend = filteredContents.map((content, index) => ({
      id: content.id,
      content: textInputs[index],
      success_count: content.success_count,
    }));

    // 요청 시도
    try {
      const response = await axios.post(
        `${BASE_URL}/manda/edit/content/`,
        { contents: dataToSend },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      // 필터링된 객체의 content 업데이트
      const updatedContents = filteredContents.map((item, index) => {
        return { ...item, content: response.data[index].content };
      });
      // 업데이트된 객체를 원래 배열에 다시 결합
      const finalContents = manda.contents.map((item) => {
        const updatedItem = updatedContents.find((updated) => updated.id === item.id);
        return updatedItem || item;
      });
      // 스토어의 Contents 상태 업데이트
      dispatch(setContents(finalContents));
    } catch (error) {
      // 요청 실패
      console.error("mandaContents API 에러 :", error);
    }
  };

  // privacy 상태 관리
  const [privacyInput, setPrivacyInput] = useState(manda.privacy);

  // privacy 변경 핸들러
  const handlePrivacyChange = (event) => {
    setPrivacyInput(event.target.value);
  };

  // privacy 변경 여부 확인
  const isPrivacyChanged = privacyInput !== manda.privacy;

  // privacy 수정 요청 전송
  const handleSubmitPrivacy = async (authToken) => {
    // 요청 시도
    try {
      const response = await axios.patch(
        `${BASE_URL}/manda/edit/main/`,
        {
          id: manda.main.id,
          privacy: privacyInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      if (response.status === 204) {
        dispatch(setPrivacy(privacyInput));
      }
    } catch (error) {
      console.error("Privacy update error:", error);
    }
  };

  return (
    <WriteBox>
      {writeMode === "SUB" ? (
        <WriteBoxTitle>
          이제 핵심 목표를 이루기 위한 <br />
          <Highlight>세부 목표</Highlight>를 작성해주세요
        </WriteBoxTitle>
      ) : (
        <WriteBoxTitle>
          세부 목표({manda.subs[selectedSubIndex].sub_title})를
          <br /> <Highlight>달성하기 위한 방법</Highlight>을 작성해주세요
        </WriteBoxTitle>
      )}
      <WriteList>
        {textInputs.map((inputs, index) => (
          <ListItem key={index}>
            <Number isFocused={focusedIndex === index}>{index + 1}</Number>
            <ItemInput
              value={inputs || ""} // 입력된 값이 null일 경우 ""으로 변경
              onChange={(e) => handleTextInputChange(index, e.target.value)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
            />
          </ListItem>
        ))}
      </WriteList>
      {/* privacy 옵션 선택 */}
      <PrivacyOptions>
        <WriteBoxTitle> 공개 범위 설정 </WriteBoxTitle>
        <OptionWrapper>
          <Option value="public" checked={privacyInput === "public"} onChange={handlePrivacyChange} />
          <OptionText>전체 공개</OptionText>
        </OptionWrapper>
        <OptionWrapper>
          <Option
            value="followers"
            checked={privacyInput === "followers"}
            onChange={handlePrivacyChange}
          />
          <OptionText>팔로우 공개</OptionText>
        </OptionWrapper>
        <OptionWrapper>
          <Option value="private" checked={privacyInput === "private"} onChange={handlePrivacyChange} />
          <OptionText>나만 보기</OptionText>
        </OptionWrapper>
      </PrivacyOptions>
      <StyledButton
        height="42px"
        isSaveBtnActive={isPrivacyChanged || isSubTitleSaveBtnActive}
        onClick={() => {
          if (isPrivacyChanged || isSubTitleSaveBtnActive) {
            if (isPrivacyChanged) {
              handleSubmitPrivacy(authToken);
            }
            if (isSubTitleSaveBtnActive) {
              if (writeMode === "SUB") {
                handleSubmitSub();
              } else if (writeMode === "CONTENT") {
                handleSubmitContents();
              }
            }
          }
        }}
      >
        저장
      </StyledButton>
    </WriteBox>
  );
}

const MyManda = styled.div`
  width: 848px;

  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg};
  overflow: hidden;
`;

let MainTitle = styled.input`
  width: 100%;
  height: 50px;
  padding: 0px 16px;
  font-size: 20px;
  font-weight: 600;
  line-height: 50px;
  border: none;
  outline: none;
`;

let MandaWriteLayout = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: ${({ padding }) => padding};
  gap: 24px;
`;

let Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${({ padding }) => padding};
  gap: 24px;
`;

let WriteBox = styled.div`
  position: fixed;
  right: calc((100% - 1280px) / 2);
  
  width: 408px;
  /* max-height: calc(100vh - 88px); */
  max-height: 760px;
  padding: 40px 24px;
  gap: 16px;
  
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.color.bg};
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  
  /* 스크롤 바 스타일 */
  overflow-y: auto;
    &::-webkit-scrollbar {
    width: 10px;  // 스크롤바 너비
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.color.font2};  // 스크롤바 썸(핸들) 색상
    border-radius: 5px;
  }
`;

let WriteBoxTitle = styled.span`
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  margin-bottom: 8px;

  flex-shrink: 0;
`;

let Highlight = styled(WriteBoxTitle)`
  color: ${({ theme }) => theme.color.primary};
`;

let WriteList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 16px;
  width: 100%;

  flex-shrink: 0;
`;

let ListItem = styled.li`
  height: 24px;
  width: 100%;
  display: flex;
  gap: 8px;
`;

let Number = styled.span`
  width: 24px;
  height: 24px;
  color: ${({ theme, isFocused }) => (isFocused ? theme.color.secondary : theme.color.font2)};
  font-weight: ${({ isFocused }) => (isFocused ? 600 : 500)};
  text-align: center;
  font-size: 20px;
  line-height: 20px;
`;

let ItemInput = styled.input`
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  width: 100%;

  &:focus {
    outline: none;
    border-bottom: 2px solid ${({ theme }) => theme.color.secondary};
  }
`;

let PrivacyOptions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  flex-shrink: 0;

  cursor: default;
`

let OptionWrapper = styled.div`
  width: 100%;
  padding: 12px 8px;

  display: flex;
  align-items: center;
  gap: 12px;

  border-radius: 8px;
  &:hover {
    background: ${({ theme }) => theme.color.bg3};
  }
`

let OptionText = styled.span`
  color: ${({ theme }) => theme.color.font1};
`


let Option = styled.input.attrs({ type: 'radio', name: 'privacy'})`
  width: 24px;
  height: 24px;
  cursor: pointer;
`

let StyledButton = styled.button`
  height: ${({ height }) => height};
  width: ${({ width = "100%" }) => width};
  font-size: 16px;
  /* font-weight: 600; */
  line-height: 20px;
  letter-spacing: 4px;
  color: ${({ isSaveBtnActive, theme }) =>
    isSaveBtnActive ? theme.color.bg : theme.color.font1};
  background: ${({ isSaveBtnActive, theme }) =>
    isSaveBtnActive ? theme.color.primary : theme.color.bg3};
  border: 1px solid
    ${({ isSaveBtnActive, theme }) => (isSaveBtnActive ? theme.color.primary : theme.color.border)};
  border-radius: 8px;
  outline: none;

  flex-shrink: 0;

  cursor: pointer;
`;

export default MandaWrite;
