import styled, { ThemeProvider } from "styled-components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import componentTheme from "./theme";
import axios from "axios";

function TodoList({ date, todos }) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  // 작성 중 상태 관리
  const [isWriting, setIsWriting] = useState(false);

  // 현재 사용자 정보
  const user = useSelector((state) => state.user);

  // 날짜 구하기
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let filteredTodos;

  if (date === "Today") {
    filteredTodos = todos.filter((todo) => todo.todo_date.toDateString() === today.toDateString());
  } else if (date === "Tomorrow") {
    filteredTodos = todos.filter(
      (todo) => todo.todo_date.toDateString() === tomorrow.toDateString()
    );
  } else {
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 6);
    filteredTodos = todos.filter((todo) => todo.todo_date >= today && todo.todo_date <= endOfWeek);
  }

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Container>
          <Header>
            <DateLabel>{date}</DateLabel>
            <AddBtn onClick={() => setIsWriting(true)}>+</AddBtn>
          </Header>
          <TodoBox>
            {filteredTodos.map((todo) => (
              <CheckboxLabel key={todo.id}>
                <CheckboxInput
                  type="checkbox"
                  imageurl={process.env.PUBLIC_URL + "/icon/checked.svg"}
                ></CheckboxInput>
                <Contents>
                  <Title>{todo.title}</Title>
                  <Detail>{todo.detail}</Detail>
                </Contents>
              </CheckboxLabel>
            ))}
          </TodoBox>
        </Container>
      </Layout>
      {isWriting === true && <TodoWrite theme={theme} />}
    </ThemeProvider>
  );
}

function TodoWrite({ theme }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 서버에서 데이터 가져오기
    axios.get("").then((response) => {
      setItems([
        {
          id: 1,
          name: "아이템 1",
        },
        {
          id: 2,
          name: "아이템 2",
        },
        {
          id: 3,
          name: "아이템 3",
        },
      ]);
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ModalOverlay>
        <ModalContent>
          <ModalTitle>목표를 선택하고 투두리스트를 만들어보세요.</ModalTitle>
          <LabelText>
            <label htmlFor="username">핵심 목표</label>
          </LabelText>
          <StyledBox>8구단 드래프트 1순위</StyledBox>
          <LabelText>
            <label htmlFor="username">세부 목표</label>
          </LabelText>
          <DropdownContainer>
            <DropdownButton onClick={() => setIsOpen(!isOpen)}>선택</DropdownButton>
            {isOpen && (
              <DropdownMenu>
                {items.map((item) => (
                  <DropdownItem key={item.id}>{item.name}</DropdownItem>
                ))}
              </DropdownMenu>
            )}
            <Downarrow src={process.env.PUBLIC_URL + "/icon/expand-more.svg"}></Downarrow>
          </DropdownContainer>
        </ModalContent>
      </ModalOverlay>
    </ThemeProvider>
  );
}

let Layout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 18px;

  /* 임시 속성 */
  margin-bottom: 80px;
`;

let Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

let Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

let DateLabel = styled.div`
  color: ${({ theme }) => theme.color.font1};
  font-size: 20px;
  font-weight: 700;
`;

let AddBtn = styled.button`
  border: none;
  border-radius: 20%;
  background-color: ${({ theme }) => theme.color.bg2};
  font-size: 24px;

  &:hover {
    background-color: ${({ theme }) => theme.color.bg3};
  }
`;

let TodoBox = styled.div`
  background: ${({ theme }) => theme.color.bg};
  width: 338px;
  padding: 28px 16px;
  box-shadow: 0 8px 24px 0px rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

let CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  user-select: none;
  gap: 16px;
`;

let CheckboxInput = styled.input`
  // 체크 해제상태
  appearance: none;
  width: 32px;
  height: 32px;
  border: 2px solid ${({ theme }) => theme.color.primary};
  border-radius: 50%;
  // 체크된 상태
  &:checked {
    background: center url(${({ imageurl }) => imageurl}) no-repeat;
    background-size: 80%;
    background-color: ${({ theme }) => theme.color.primary};
  }
`;

let Contents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

let Title = styled.div`
  color: ${({ theme }) => theme.font2};
  font-size: 12px;
  font-weight: 500;
  height: 16px;
`;

let Detail = styled.div`
  color: ${({ theme }) => theme.font1};
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
  height: auto;

  /* text-decoration-line: strikethrough; */
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
  padding: 54px 64px;
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

let LabelText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.font1};
  margin: 24px 0px 0px 0px;
  cursor: ${({ cursor = "default" }) => cursor};
`;

let StyledBox = styled.div`
  box-sizing: content-box;
  padding: 8px 16px;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
  color: ${({ theme }) => theme.color.font2};
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg2};
  margin-top: 8px;
  cursor: default;
  width: 100%;
`;

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  box-sizing: content-box;
  height: 24px;
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg2};
  display: flex;
  justify-content: space-between;
`;

const DropdownButton = styled.button`
  width: 100%;
  height: 24px;
  cursor: pointer;
  border: none;
  text-align: left;
  background-color: transparent;
`;

const Downarrow = styled.img`
  ${({ theme }) => theme.component.iconSize.small};
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 240px;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bg2};
  list-style-type: none;
  overflow: hidden;
`;

const DropdownItem = styled.li`
  height: 24px;
  line-height: 24px;
  padding: 8px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.color.font1};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.color.primary};
    color: white;
  }
`;

export default TodoList;
