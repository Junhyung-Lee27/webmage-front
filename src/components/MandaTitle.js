import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import { useSelector } from "react-redux";

function MandaTitle() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const currentFilter = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const navigate = useNavigate();

  const [titles, setTitles] = useState([]);
  const userId = useSelector((state) => state.user.userId);
  const authToken = useSelector((state) => state.user.authToken);

  useEffect(() => {
    // API 요청을 보내어 데이터를 가져옵니다.
    axios.get(`http://127.0.0.1:8000/manda/${userId}/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      }
    })
      .then((response) => {
        // main_title 필드만 추출하여 titles 상태 업데이트
        const data = response.data;
        const mainTitles = data.map((item) => item.main_title);
        setTitles(mainTitles);
      })
      .catch((error) => {
        console.error('데이터를 불러오는 동안 오류가 발생했습니다: ', error);
      });
  }, [userId, authToken]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectTitle = (title) => {
    setSelectedTitle(title);
    setIsOpen(false);
    // 여기에서 선택한 표 제목에 따라 다른 동작을 수행할 수 있습니다.
  };

  

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <DropdownButton onClick={toggleDropdown}>
          <DropdownIcon src={process.env.PUBLIC_URL + "/manda/arrow-down.svg"} />
          {selectedTitle ? selectedTitle : titles[0]}
        </DropdownButton>
        <DropdownList isOpen={isOpen}>
          {titles.map((title, index) => (
            <ListItem key={index} onClick={() => selectTitle(title)}>
              {title}
            </ListItem>
          ))}
        </DropdownList>
        <ButtonGroup>
          <EditIcon src={process.env.PUBLIC_URL + "/manda/edit-btn.svg"} />
          <DeleteIcon src={process.env.PUBLIC_URL + "/manda/delete-btn.svg"} />
        </ButtonGroup>
        <AddManda onClick={()=>{ navigate('/manda/write') }}>+ 만다라트 추가</AddManda>
      </Container>
    </ThemeProvider>
  );
}

const Container = styled.div`
  position: relative;
  margin-left: 198px;
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
`;

const DropdownIcon = styled.img`
  margin-right: 8px;
  width: 25px;
  height: 25px;
`;


const DropdownList = styled.ul`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #FFF;
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
`

const EditIcon = styled.img`
  margin-right: 10px;
`

const DeleteIcon = styled.img`
  margin-right: 10px;
`

const AddManda = styled.button`
  width: 150px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #6C63FF;
  border: none;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFF;
  font-size: 16px;
  font-weight: 700;
  position: absolute;
  right: 6px;
  top: 0;
  z-index: 1;

  &:hover {
    background-color: #251F4B;
    cursor: pointer;
  }
`

export default MandaTitle;