import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";

function MandaTitle() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const navigate = useNavigate();

  const titles = ["8구단 드래프트 1순위", "프론트엔드 개발자 취업", "백엔드 개발자 이직"]; 

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectTitle = (title) => {
    setSelectedTitle(title);
    setIsOpen(false);
    // 여기에서 선택한 표 제목에 따라 다른 동작을 수행할 수 있습니다.
  };

  return (
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
        <AddManda onClick={()=>{ navigate('/manda/write') }}>+ 만다라트 추가</AddManda>
      </ButtonGroup>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  margin-left: 198px;
`;

const DropdownButton = styled.button`
  color: #222;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 20px;
  font-weight: 700;
  line-height: normal;
`;

const DropdownIcon = styled.img`
  margin-right: 10px;
`;

const DropdownList = styled.ul`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  background-color: #FFF;
  list-style: none;
  padding-left: 15px;
  width: 260px;
  max-height: 200px;
  overflow-y: auto;  
`;

const ListItem = styled.li`
  padding: 10px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;

  &:hover {
    background-color: #ddd;
  }
`;

const ButtonGroup = styled.div`
  position: relative;
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

  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFF;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;

  &:hover {
    background-color: #ddd;
    cursor: pointer;
  }
`

export default MandaTitle;