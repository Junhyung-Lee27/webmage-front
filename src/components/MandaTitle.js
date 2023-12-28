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
  let navigate = useNavigate();

  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 상태 관리
  const manda = useSelector((state) => state.manda); // 만다라트 상태
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 상태
  const [mandaMainList, setMandaMainList] = useState(null); // 드롭다운 리스트 상태
  const [titles, setTitles] = useState([]); // 만다라트 제목 상태
  const [selectedIndex, setSelectedIndex] = useState(null); // 선택된 입력 index 상태
  const [selectedTitle, setSelectedTitle] = useState(null); // 선택된 제목 상태
  const [isOpenMandaMainModal, setIsOpenMandaMainModal] = useState(false); // 만다라트 작성 모달 상태
  const [isOpenDeleteMandaModal, setIsOpenDeleteMandaModal] = useState(false); // 만다라트 삭제 모달 상태
  const user = useSelector((state) => state.user); // 현재 사용자
  const selectedUser = useSelector((state) => state.selectedUser);

  //// 드롭다운 ////
  // 드롭다운 동작
  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

  // 만다라트 리스트 불러오기
  useEffect(() => {
    const fetchData = async (authToken) => {
      try {
        const response = await axios.get(`${BASE_URL}/manda/${user.userId}/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });

        // 리스트 불러온 후 동작
        const fetchedData = response.data.reverse();

        // setMandaMainList(fetchedData);

        const mainTitles = fetchedData.map((main) => main.main_title);
        setTitles(mainTitles);

        // 선택 상태 업데이트
        setSelectedTitle(mainTitles[0]);
        dispatch(setMain(fetchedData[0]));
      } catch (error) {
        console.error("만다라트 리스트 불러오기 에러 : ", error);
      }
    };
    fetchData(user.authToken);
  }, [user.userId]);

  // 드롭다운 리스트 선택
  // const selectTitle = async (title, index) => {
  //   setSelectedIndex(index);
  //   setSelectedTitle(title);
  //   setIsOpen(false);
  // };

  // 드롭다운에서 선택한 타이틀로 manda.main 업데이트
  // useEffect(() => {
  //   if (mandaMainList && typeof selectedIndex === "number") {
  //     const newMain = mandaMainList[selectedIndex];
  //     dispatch(setMain(newMain));
  //   }
  // }, [selectedIndex]);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Title>{selectedTitle ? selectedTitle : ""}</Title>
        {user.userId === selectedUser.userId ? (
          manda.main === undefined ? (
            <AddManda
              onClick={() => {
                setIsOpenMandaMainModal(true);
              }}
            >
              + 만다라트 만들기
            </AddManda>
          ) : (
            <ButtonGroup>
              <IconTextButton onClick={() => navigate("/manda/write")}>
                <EditIcon src={process.env.PUBLIC_URL + "/manda/edit-btn.svg"} />
                <ButtonText>수정</ButtonText>
              </IconTextButton>
              <IconTextButton
                onClick={() => {
                  setIsOpenDeleteMandaModal(true);
                }}
              >
                <DeleteIcon src={process.env.PUBLIC_URL + "/manda/delete-btn.svg"} />
                <ButtonText>삭제</ButtonText>
              </IconTextButton>
            </ButtonGroup>
          )
        ) : null}
        {/* <DropdownButton> */}
        {/* 만다라트를 여러 개 만드는 기능은 추후에 버그 해결 후 업데이트 예정 */}
        {/* <DropdownIcon
            src={process.env.PUBLIC_URL + "/manda/arrow-down.svg"}
            // onClick={toggleDropdown}
          /> */}
        {/* </DropdownButton> */}
        {/* <DropdownList isOpen={isOpen}>
          {titles.map((title, index) => (
            <ListItem key={index} onClick={() => selectTitle(title, index)}>
              {title}
            </ListItem>
          ))}
        </DropdownList> */}
      </Container>

      {isOpenMandaMainModal === true && (
        <WriteMandaMainModal theme={theme} setIsOpenMandaMainModal={setIsOpenMandaMainModal} />
      )}
      {isOpenDeleteMandaModal === true && (
        <DeleteMandaModal
          theme={theme}
          setIsOpenDeleteMandaModal={setIsOpenDeleteMandaModal}
          manda={manda}
          user={user}
          setSelectedTitle={setSelectedTitle}
        />
      )}
    </ThemeProvider>
  );
}

function WriteMandaMainModal({ theme, setIsOpenMandaMainModal }) {
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
            onClick={() => setIsOpenMandaMainModal(false)}
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

function DeleteMandaModal({ theme, manda, user, setIsOpenDeleteMandaModal, setSelectedTitle }) {
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");

  const handleDeleteManda = async (user) => {
    if (inputValue === manda.main.main_title) {
      try {
        const response = await axios.post(
          `${BASE_URL}/manda/delete/${manda.main.id}`,
          {},
          {
            headers: {
              Authorization: `Token ${user.authToken}`,
            },
          }
        );

        // 만다라트 삭제 성공 후 로직
        window.location.reload(); // 페이지 리로드
        alert("만다라트 삭제가 완료되었습니다");
      } catch (error) {
        // 요청 실패
        console.error("만다라트 삭제 API 에러 :", error);
      }
    } else {
      alert("입력한 값이 일치하지 않습니다");
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>
          정말 만다라트를 <Highlight>삭제</Highlight>하시겠어요? 😢
        </ModalTitle>
        <Guideline>
          <GuidelineList>만다라트는 삭제 후 다시 복구할 수 없습니다.</GuidelineList>
          <GuidelineList>만다라트를 삭제하더라도 실천기록 게시물은 유지됩니다.</GuidelineList>
        </Guideline>
        <StyledText
          fontSize="14px"
          fontWeight="500"
          color={theme.color.font2}
          margin="0px 0px 12px 0px"
          align="left"
        >
          삭제 확인을 위해 <Highlight>{manda.main.main_title}</Highlight>을(를) 입력해주세요.
        </StyledText>
        <StyledForm
          type="text"
          placeholder="입력"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        ></StyledForm>
        <Buttons>
          <StyledButton
            onClick={() => setIsOpenDeleteMandaModal(false)}
            color={theme.color.font1}
            backgroundcolor={theme.color.bg3}
            border="none"
          >
            돌아가기
          </StyledButton>
          <StyledButton
            onClick={() => handleDeleteManda(user)}
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

const Container = styled.div`
  position: relative;
  width: 720px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 24px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.color.font1};
  font-size: 20px;
  font-weight: 700;
  margin-right: auto;
  cursor: default;
`;

const DropdownButton = styled.button`
  width: 240px;
  height: 34px;
  background: inherit;
  border: none;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  /* gap: 8px; */
`;

const IconTextButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;

  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.color.bg3};
  }
`;

const AddManda = styled.button`
  width: 160px;
  height: 34px;
  flex-shrink: 0;

  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.primary};

  display: flex;
  justify-content: center;
  align-items: center;

  color: #fff;
  font-size: 16px;
  font-weight: 700;

  &:hover {
    background-color: ${({ theme }) => theme.color.secondary};
    cursor: pointer;
  }
`;

const EditIcon = styled.img`
  ${({ theme }) => theme.component.iconSize.small};
  filter: ${({ theme }) => theme.filter.font2};
`;

const DeleteIcon = styled.img`
  ${({ theme }) => theme.component.iconSize.small};
  filter: ${({ theme }) => theme.filter.font2};
`;

const ButtonText = styled.span`
  color: ${({ theme }) => theme.color.font2};
  font-size: 14px;
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
  box-sizing: border-box;
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
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 8px;
  margin-top: 32px;
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

let StyledText = styled.span`
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ color }) => color};
  margin: ${({ margin }) => margin};
  text-align: ${({ align }) => align};
  width: 100%;
`;
let StyledForm = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg2};
  /* margin-bottom: 40px; */
  &::placeholder {
    color: ${({ theme }) => theme.color.font2};
    opacity: 0.5;
  }
  &:focus {
    outline: 2px solid ${({ theme }) => theme.color.primary};
  }
`;

export default MandaTitle;
