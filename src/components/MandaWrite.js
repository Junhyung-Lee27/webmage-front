import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import { useSelector } from "react-redux";


function MandaWrite() {
  const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

  const user = useSelector((state) => state.user);
  const authToken = useSelector((state) => state.user.authToken);

  const [mainTitle, setMainTitle] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const initialInputValues = Array(8).fill().map(() => Array(9).fill(''));
  const [inputValues, setInputValues] = useState(initialInputValues);

  const [subsId, setSubsId] = useState([]);
  const [contentsId, setContentsId] = useState([]);


  async function handleAddButtonClick() {
    setIsButtonDisabled(true); // 버튼 비활성화
  
    const requestDataCreate = {
      user: user.userId,
      main_title: mainTitle,
      success: false,
    };
  
    try {
      const createResponse = await axios.post(`${BASE_URL}/manda/create/`, requestDataCreate, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      // 요청이 성공하면 원하는 작업을 수행
      console.log('POST 요청 성공', createResponse.data);
      const mainId = createResponse.data.main.id;
      console.log(mainId);

      // POST 요청 이후 GET 요청 보내기
      try {
        const getResponse = await axios.get(`${BASE_URL}/manda/mandamain/${mainId}`);
        // GET 요청의 응답 데이터를 추출하고 필요한 부분을 가공할 수 있습니다.
        const data = getResponse.data;

        const newSubsId = data.subs.map((sub) => sub.id);
        const newContentsId = data.contents.map((content) => content.id);

        setSubsId(newSubsId);
        setContentsId(newContentsId);

        console.log('GET 요청 성공', subsId, contentsId);
      } catch (error) {
        // GET 요청이 실패하면 오류 처리
        console.error('GET 요청 실패', error);
      }


    } catch (error) {
      // 요청이 실패하면 오류 처리
      console.error('POST 요청 실패', error);
    } finally {
      setIsButtonDisabled(false); // 요청 완료 후 여전히 버튼 비활성화
    }
  }
  


  async function handleSaveBtnClick() {
    const contentData = contentsId.map((id) => {
      return {
        id: id,
        content: '임시용',
        success_count: 0
      };
    });
  
    const contentsRequestData = {
      contents: contentData,
    };
  
    try {
      const contentsResponse = await axios.post(`${BASE_URL}/manda/edit/content/`, contentsRequestData, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      // Process the contents response as needed
      console.log('contents POST 요청 성공', contentsResponse.data);
    } catch (error) {
      // Handle errors for the contents POST request
      console.error('contents POST 요청 실패', error);
    }
  
    const subsData = subsId.map((id, listIndex) => {
      return {
        id: id,
        sub_title: inputValues[listIndex][0],
        success: true, // success 필드에는 원하는 값 사용
      };
    });
  
    const requestData = {
      subs: subsData,
    };
  
    try {
      const response = await axios.post(`${BASE_URL}/manda/edit/sub/`, requestData, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });
      // Process the subs response as needed
      console.log('subs POST 요청 성공', response.data);
    } catch (error) {
      // Handle errors for the subs POST request
      console.error('subs POST 요청 실패', error);
    }
  }
  

  function handleMainInputChange(event) {
    setMainTitle(event.target.value);
  }

  function handleInputChange(e, listIndex, index) {
    const newValue = e.target.value;
    setInputValues((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[listIndex][index] = newValue;
      return newInputValues;
    });
  }


  return (
    <div>
      <ContentsContainer>
        <MainAdd>
          <MainInput
              type="text"
              placeholder="main_title"
              value={mainTitle}
              onChange={handleMainInputChange}
            />
          <AddTitleButton onClick={handleAddButtonClick} disabled={isButtonDisabled}>핵심 목표 등록</AddTitleButton>
          <SaveBtn onClick={handleSaveBtnClick}>만다라트 저장</SaveBtn>
        </MainAdd>

        <SubGroup>
          {Array(8)
            .fill(0)
            .map((_, listIndex) => (
              <StyledList key={listIndex}>
                {Array(9)
                  .fill(0)
                  .map((_, index) => (
                    <StyledListItem key={index}>
                      <StyledInput
                        type="text"
                        placeholder={index === 0 ? `세부목표 ${listIndex+1}` : `실천 계획 ${index}`}
                        value={inputValues[listIndex][index]} // 값을 표시하고 사용자 입력을 추적합니다.
                        onChange={(e) => handleInputChange(e, listIndex, index)} // 입력 값이 변경될 때 호출됩니다.
                      />
                    </StyledListItem>
                  ))}
              </StyledList>
            ))}
        </SubGroup>
      </ContentsContainer>
    </div>
  );
};


const ContentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 1000px;
  height: 646px;
  margin-left: 198px;
  margin-top: -15px;
  flex-shrink: 0;
  gap: 15px;
`;

const MainAdd = styled.div`
  display: flex;
  // justify-contents: center;
`

const MainInput = styled.input`
  display: flex;
  width: 200px;
  height: 30px;
  border: 1px solid #ddd;
  margin-right: 10px;
`;

const AddTitleButton = styled.button`
  width: 120px;
  height: 30px;
  border: none;
  background: #6c63ff;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 100px;
`;

const SaveBtn = styled.button`
  width: 120px;
  height: 30px;
  border: none;
  background: green;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const SubGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`
const StyledList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 230px;
  height: 300px;
`;

const StyledListItem = styled.li`
  width: 200px;
  height: 30px;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  border: none; 
  border-bottom: 1px solid #ddd;
`;

export default MandaWrite;
