import axios from "axios";
import { BASE_URL } from "./../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled, { ThemeProvider } from "styled-components";
import componentTheme from "./theme";
import { useDispatch, useSelector } from "react-redux";
import { setMain, setSubs, setContents } from "../store/mandaSlice";

function MandaTitle() {
  const dispatch = useDispatch();

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 만다라트 선택 상태
  const [isOpen, setIsOpen] = useState(false);
  const [mandaMainList, setMandaMainList] = useState(null);
  const [titles, setTitles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);

  // 디버깅
  const manda = useSelector((state) => state.manda);
  const main = manda.main;

  // 현재 사용자
  const userId = useSelector((state) => state.user.userId);
  const authToken = useSelector((state) => state.user.authToken);

  // 드롭다운 펼치기, 줄이기 동작
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 만다라트 드롭다운 리스트 불러오기
  useEffect(() => {
    axios
      .get(`${BASE_URL}/manda/${userId}/`, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data.reverse();
        
        // 리스트 불러온 후 동작
        const mainTitles = fetchedData.map((main) => main.main_title);
        setTitles(mainTitles);
        setSelectedTitle(mainTitles[0]);
        dispatch(setMain(fetchedData[0]));
        setMandaMainList(fetchedData);
      })
      .catch((error) => {
        console.error("데이터를 불러오는 동안 오류가 발생했습니다: ", error);
      });
  }, [userId, authToken]);

  // 만다라트 드롭다운 리스트 선택 동작
  const selectTitle = async (title, index) => {
    console.log(title);
    console.log(index);
    setSelectedIndex(index);
    setSelectedTitle(title);
    setIsOpen(false);
  };

  // 선택된 타이틀로 manda.main 상태 업데이트
  useEffect(() => {
  if (mandaMainList && typeof selectedIndex === 'number') {
    const newMain = mandaMainList[selectedIndex];
    dispatch(setMain(newMain));
  }
}, [mandaMainList, selectedIndex]);
  
  // 만다라트 - 메인 작성 상태
  const [isWritingMandaMain, setIsWritingMandaMain] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <DropdownButton onClick={toggleDropdown}>
          <DropdownIcon src={process.env.PUBLIC_URL + "/manda/arrow-down.svg"} />
          {selectedTitle ? selectedTitle : ""}
        </DropdownButton>
        <DropdownList isOpen={isOpen}>
          {titles.map((title, index) => (
            <ListItem key={index} onClick={() => selectTitle(title, index)}>
              {title}
            </ListItem>
          ))}
        </DropdownList>
        <ButtonGroup>
          <EditIcon src={process.env.PUBLIC_URL + "/manda/edit-btn.svg"} />
          <DeleteIcon src={process.env.PUBLIC_URL + "/manda/delete-btn.svg"} />
        </ButtonGroup>
        <AddManda
          onClick={() => {
            setIsWritingMandaMain(true);
          }}
        >
          + 만다라트 추가
        </AddManda>
      </Container>
      {isWritingMandaMain === true && (
        <WriteMandaMain theme={theme} setIsWritingMandaMain={setIsWritingMandaMain} />
      )}
    </ThemeProvider>
  );
}

function WriteMandaMain({ theme, setIsWritingMandaMain }) {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  // 핵심 목표 입력 값
  const [mandaMain, setMandaMain] = useState("");

  // 사용자 정보
  const user = useSelector((state) => state.user);

  // 핵심 목표 생성 요청
  const handleSubmit = async (authToken, userId, mainTitle) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/manda/create/`,
        {
          user: userId,
          main_title: mainTitle,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      // 요청 성공 시 처리
      dispatch(setMain(response.data.main));
      dispatch(setSubs(response.data.subs));
      dispatch(setContents(response.data.contents));
      navigate("/manda/write");
    } catch (error) {
      console.error("요청 실패:", error);
      alert("핵심 목표는 30자 이하로 입력해주세요");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          가장 달성하고 싶은 <Highlight>핵심 목표</Highlight>가 무엇인가요?
        </ModalTitle>
        <Guideline>
          <GuidelineList>구체적이고 측정 가능한 목표를 설정하세요</GuidelineList>
          <GuidelineList>언제까지 달성할지 설정하세요</GuidelineList>
          <GuidelineList>자신에게 중요하고 의미있는 목표를 설정하세요</GuidelineList>
          <GuidelineList>
            예를 들어, "건강하고 균형 잡힌 삶을 위해 1년 안에 10kg 감량하기"와 같이 작성할 수 있어요
          </GuidelineList>
        </Guideline>
        <StyledTextArea
          placeholder="핵심 목표를 작성해주세요"
          value={mandaMain}
          onChange={(e) => setMandaMain(e.target.value)}
        ></StyledTextArea>
        <Buttons>
          <StyledButton
            color={theme.color.font1}
            backgroundcolor={theme.color.bg3}
            border="none"
            onClick={() => setIsWritingMandaMain(false)}
          >
            취소
          </StyledButton>
          <StyledButton
            color="white"
            backgroundcolor={theme.color.primary}
            onClick={() => handleSubmit(user.authToken, user.userId, mandaMain)}
          >
            완료
          </StyledButton>
        </Buttons>
      </ModalContent>
    </ModalOverlay>
  );
}

const Container = styled.div`
  position: relative;
  margin-top: 20px;
  display: flex;
  max-width: 774px;
`;

const DropdownButton = styled.button`
  background: inherit;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  color: ${({ theme }) => theme.color.font1};
`;

const DropdownIcon = styled.img`
  margin-right: 8px;
  width: 25px;
  height: 25px;
`;

const DropdownList = styled.ul`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background-color: #fff;
  list-style: none;
  width: 256px;
  max-height: 200px;
  overflow-y: auto;
  top: 100%;
  z-index: 2;
  border-radius: 8px;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
`;

const ListItem = styled.li`
  padding: 10px 10px 10px 38px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  color: #555;

  &:hover {
    background-color: #ddd;
  }
`;

const ButtonGroup = styled.div`
  position: relative;
  margin-left: 10px;
  display: flex;

  &:hover {
    cursor: pointer;
  }
`;

const EditIcon = styled.img`
  margin-right: 10px;
`;

const DeleteIcon = styled.img`
  margin-right: 10px;
`;

const AddManda = styled.button`
  width: 150px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #6c63ff;
  border: none;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  position: absolute;
  right: 6px;
  top: 0;
  z-index: 1;

  &:hover {
    background-color: #251f4b;
    cursor: pointer;
  }
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
  padding: 56px 80px;
  border-radius: 8px;
  width: 808px;
  max-height: 100%;
`;

let ModalTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.font1};
  margin-bottom: 40px;
  text-align: center;
  width: 100%;
`;

let Guideline = styled.ul`
  box-sizing: content-box;
  padding: 16px 24px;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg2};
  cursor: default;
  width: 100%;
  margin-bottom: 24px;
`;

let GuidelineList = styled.li`
  font-size: 14px;
  line-height: 48px;
  color: ${({ theme }) => theme.color.font1};

  &::before {
    content: "•";
    padding-right: 12px;
  }
`;

let Highlight = styled.span`
  color: ${({ theme }) => theme.color.primary};
`;

let StyledTextArea = styled.textarea`
  box-sizing: content-box;
  padding: 16px 24px;
  font-size: 16px;
  height: 64px;
  line-height: 24px;
  color: ${({ theme }) => theme.color.font2};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg};
  width: 100%;
`;

let Buttons = styled.div`
  box-sizing: content-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 8px;
  margin-top: 32px;
  padding: 8px 16px;
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

export default MandaTitle;
