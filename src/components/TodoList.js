import styled, { ThemeProvider } from "styled-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import componentTheme from "./theme";

function TodoList( {date, todos} ) {
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

  todos.forEach((todo) => console.log(todo.todo_date.toDateString()));

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Container>
          <DateLabel>{date}</DateLabel>
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
    </ThemeProvider>
  );
}

let Layout = styled.div`
  display: flex;
  flex-direction: row;
  gap: 18px;
  
  /* 임시 속성 */
  margin-bottom : 80px;
`

let Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

let DateLabel = styled.div`
  color: ${({ theme }) => theme.color.font1};
  font-size: 20px;
  font-weight: 700;
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
`

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

export default TodoList;
