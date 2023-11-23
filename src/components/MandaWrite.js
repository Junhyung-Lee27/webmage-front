import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "./../config";
import Manda from "../components/Manda";
import { setContents, setSubs } from "../store/mandaSlice";

function MandaWrite() {
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
  const [isSaveBtnActive, setIsSaveBtnActive] = useState(false); // '저장' 버튼 활성화 상태
  const user = useSelector((state) => state.user); // 유저 상태
  let manda = useSelector((state) => state.manda); // 만다라트 상태
  const main = manda.main;
  const subs = manda.subs;
  const contents = manda.contents;

  // 입력 상태
  const [textInputs, setTextInputs] = useState(Array(8).fill(null));

  // 버튼 활성화/비활성화 (null 값을 빈 문자열로 변환해서 비교)
  useEffect(() => {
    const checkDifferences = () => {
      // subs 배열에서 sub_title과 textInputs 비교
      if (writeMode === "SUB") {
        const subTitles = subs.map((sub) => sub.sub_title || "");
        const isDifferent = textInputs.some((input, index) => (input || "") !== subTitles[index]);
        setIsSaveBtnActive(isDifferent);
      }
      // contents 배열에서 selectedSubIndex에 해당하는 sub_id와 일치하는 contents.content와 textInputs 비교
      else if (writeMode === "CONTENT") {
        const selectedSubId = subs[selectedSubIndex]?.id;
        const relatedContents = contents.filter((content) => content.sub_id === selectedSubId);
        const contentTexts = relatedContents.map((content) => content.content || "");
        const isDifferent = textInputs.some(
          (input, index) => (input || "") !== contentTexts[index]
        );
        setIsSaveBtnActive(isDifferent);
      }
    };

    // 0.1초 후에 checkDifferences 함수 실행
    const timeoutId = setTimeout(checkDifferences, 100);

    // 컴포넌트가 언마운트되거나 의존성이 변경될 때 setTimeout 취소
    return () => clearTimeout(timeoutId);
  }, [textInputs, subs, contents, writeMode, selectedSubIndex]);

  return (
    <ThemeProvider theme={theme}>
      <MainTitle>{manda.main.main_title}</MainTitle>
      <Row>
        <Manda
          writeMode={writeMode}
          setWriteMode={setWriteMode}
          selectedSubIndex={selectedSubIndex}
          setSelectedSubIndex={setSelectedSubIndex}
        />
        <WriteBoxComponent
          manda={manda}
          writeMode={writeMode}
          selectedSubIndex={selectedSubIndex}
          textInputs={textInputs}
          setTextInputs={setTextInputs}
          isSaveBtnActive={isSaveBtnActive}
        />
      </Row>
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
  isSaveBtnActive,
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
      <StyledButton
        isSaveBtnActive={isSaveBtnActive}
        onClick={() => {
          if (isSaveBtnActive) {
            if (writeMode === "SUB") {
              handleSubmitSub();
            } else if (writeMode === "CONTENT") {
              handleSubmitContents();
            }
          }
        }}
      >
        저장
      </StyledButton>
    </WriteBox>
  );
}

let MainTitle = styled.h1`
  padding: 5px;
  font-size: 20px;
  font-weight: 700;
`;

let Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

let WriteBox = styled.div`
  width: 402px;
  height: 628px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.bg};
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 24px;
  margin-top: 12px;
`;

let WriteBoxTitle = styled.span`
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
`;

let Highlight = styled(WriteBoxTitle)`
  color: ${({ theme }) => theme.color.primary};
`;

let WriteList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
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

let StyledButton = styled.button`
  height: 42px;
  width: 100%;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  color: white;
  background: ${({ isSaveBtnActive, theme }) =>
    isSaveBtnActive ? theme.color.primary : theme.color.font2};
  border: 1px solid
    ${({ isSaveBtnActive, theme }) => (isSaveBtnActive ? theme.color.primary : theme.color.font2)};
  border-radius: 8px;
  outline: none;
  cursor: pointer;
`;

export default MandaWrite;
