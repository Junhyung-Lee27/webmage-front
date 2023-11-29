import React, { useState, useRef, useCallback, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import componentTheme from "./theme";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import { BASE_URL } from "./../config";
import { current } from "@reduxjs/toolkit";

export default function FeedWriteModal({
  userId,
  authToken,
  feedInfo,
  closeModal,
  show,
  setShow,
  handleShow,
  feedMode,
  fetchFeeds,
  user,
  currentPage,
}) {
  // 테마
  const colorTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
  const filterTheme = useSelector((state) => state.theme.filters[state.theme.currentTheme]);
  const theme = {
    color: colorTheme,
    filter: filterTheme,
    component: componentTheme,
  };

  const [imgFile, setImgFile] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [feedContent, setFeedContent] = useState(""); // 피드 내용
  const [feedHash, setFeedHash] = useState(""); // 피드 해시태그

  const [mainOptions, setMainOptions] = useState([]); // 핵심목표 상태
  const [subsOptions, setSubsOptions] = useState([]); // 서브목표 상태
  const [contentsOptions, setContentsOptions] = useState([]); // 실천방법 상태
  const [selectedMainOption, setSelectedMainOption] = useState(null); // 선택된 핵심목표 상태
  const [selectedSub, setSelectedSub] = useState(null); // 선택된 세부목표 상태
  const [selectedContent, setSelectedContent] = useState(null);

  const imgRef = useRef();
  const dragRef = useRef(null);
  const fileId = useRef(0);

  // 게시물 내용 초기화 (수정 : 기존 내용 불러오기 / 생성 : 공백)
  useEffect(() => {
    if (feedInfo) {
      setFeedContent(feedInfo.post); // 내용
      setFeedHash(feedInfo.tags); // 해시태그
      setImgFile(feedInfo.content_img); //

      // 핵심목표, 서브목표, 실천방법 설정
      const mainOption = mainOptions.find((option) => option.main_title === feedInfo.main_title);
      const subOption = subsOptions.find((sub) => sub.sub_title === feedInfo.sub_title);
      const contentOption = contentsOptions.find((content) => content.content === feedInfo.content);

      setSelectedMainOption(mainOption);
      setSelectedSub(subOption);
      setSelectedContent(contentOption);
    }
  }, [feedInfo, mainOptions, subsOptions, contentsOptions]);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 핵심목표 ~ 실천방법 선택 로직
  const handleMainChange = (event) => {
    const selectedId = event.target.value;
    const selectedOption = mainOptions.find((option) => option.id === parseInt(selectedId));
    setSelectedMainOption(selectedOption);
  };

  const handleSubChange = (event) => {
    const selectedId = event.target.value;
    const selectedOption = subsOptions.find((sub) => sub.id === parseInt(selectedId));
    setSelectedSub(selectedOption);
  };

  const handleContentChange = (event) => {
    const selectedId = event.target.value;
    const selectedOption = contentsOptions.find((content) => content.id === parseInt(selectedId));
    setSelectedContent(selectedOption);
  };

  useEffect(() => {
    // 핵심목표 가져오기
    const fetchMainOptions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/manda/${userId}/`, {
          headers: {
            Authorization: `Token ${authToken}`, // 헤더에 토큰 추가
          },
        });
        setMainOptions(response.data); // 서버로부터 받은 데이터를 상태에 저장
      } catch (error) {
        console.error("Failed to fetch main options:", error);
      }
    };
    Promise.all([fetchMainOptions()]).then(() => {
      setLoading(false);
    });
  }, [userId, authToken]);

  useEffect(() => {
    if (selectedMainOption) {
      // subOptions, contOptions 가져오기
      const fetchSubsAndContents = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/manda/mandamain/${selectedMainOption.id}`, {
            headers: {
              Authorization: `Token ${authToken}`, // 헤더에 토큰 추가
            },
          });
          setSubsOptions(response.data.subs);
          setContentsOptions(response.data.contents);
        } catch (error) {
          console.error("Failed to fetch subs and contents:", error);
        }
      };

      Promise.all([fetchSubsAndContents()]).then(() => {
        setLoading(false);
      });
    }
  }, [selectedMainOption, authToken]); // 핵심목표 선택하면 나머지 가져옴

  const [filteredContentsOptions, setFilteredContentsOptions] = useState([]);

  useEffect(() => {
    if (selectedSub) {
      const matchedContents = contentsOptions.filter(
        (content) => content.sub_id === selectedSub.id
      );
      setFilteredContentsOptions(matchedContents);
    }
  }, [selectedSub, contentsOptions]);

  // 실천 기록 작성
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (feedMode === "WRITE") {
      // FormData 객체 생성
      const formData = new FormData();

      formData.append("user", userId);
      formData.append("feed_contents", feedContent);
      formData.append("feed_hash", feedHash);
      if (imgFile) {
        formData.append("feed_image", imgRef.current.files[0]);
      }
      formData.append("main_id", selectedMainOption?.id || "");
      formData.append("sub_id", selectedSub?.id || "");
      formData.append("cont_id", selectedContent?.id || "");

      try {
        const response = await axios.post(`${BASE_URL}/feed/write/`, formData, {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201) {
          alert("게시물이 성공적으로 작성되었습니다.");
          fetchFeeds(user, currentPage);
          handleClose();
        } else {
          alert("게시물 작성에 실패했습니다.");
        }
      } catch (error) {
        console.error("Failed to submit:", error);
        alert("게시물 작성 중 오류가 발생했습니다.");
      }
    } else if (feedMode === "EDIT") {
      const formData = new FormData();
      if (feedContent !== feedInfo.post) {
        formData.append("feed_contents", feedContent);
      }
      if (feedHash !== feedInfo.tags) {
        formData.append("feed_hash", feedHash);
      }
      if (imgFile && imgFile !== feedInfo.content_img) {
        formData.append("feed_image", imgFile);
      }
      if (selectedMainOption && selectedMainOption.id !== feedInfo.main_id) {
        formData.append("main_id", selectedMainOption.id);
      }
      if (selectedSub && selectedSub.id !== feedInfo.sub_id) {
        formData.append("sub_id", selectedSub.id);
      }
      if (selectedContent && selectedContent.id !== feedInfo.cont_id) {
        formData.append("cont_id", selectedContent.id);
      }
      try {
        const response = await axios.patch(`${BASE_URL}/feed/edit/${feedInfo.id}/`, formData, {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("게시물이 성공적으로 수정되었습니다.");
        fetchFeeds(user, currentPage);
        handleClose(); // 모달 닫기
      } catch (error) {
        // 오류 처리
        console.error(error);
        alert("게시물 수정 중 오류가 발생했습니다.");
      }
    }
  };

  const handleClose = () => {
    setShow(false);
    setImgFile("");
  };

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  const onChangeFiles = useCallback(
    (event) => {
      let selectFiles = [];
      let tempFiles = files;

      if (event.type === "drop") {
        selectFiles = event.dataTransfer.files;
      } else {
        selectFiles = event.target.files;
      }

      for (const file of selectFiles) {
        tempFiles = [
          ...tempFiles,
          {
            id: fileId.current++,
            object: file,
          },
        ];
      }
      setFiles(tempFiles);
    },
    [files]
  );

  const handleFilterFile = useCallback(
    (id) => {
      setFiles(files.filter((file) => file.id !== id));
    },
    [files]
  );

  const handleDragIn = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDragOut = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      onChangeFiles(event);
      setIsDragging(false);
    },
    [onChangeFiles]
  );

  const initDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  const resetDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", handleDragIn);
      dragRef.current.removeEventListener("dragleave", handleDragOut);
      dragRef.current.removeEventListener("dragover", handleDragOver);
      dragRef.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  // 로딩 중 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header className="border-1" style={{ background: `${theme.color.bg}` }}>
          <Modal.Title style={{ width: "100%", textAlign: "center" }}>
            <StyledText size="1.25rem" weight="700" color={theme.color.font1}>
              {feedMode === "WRITE" ? "게시물 작성" : "게시물 수정"}
            </StyledText>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: `${theme.color.bg}` }}>
          <FeedInput
            placeholder="내용을 입력해주세요..."
            bgcolor={theme.color.bg2}
            color={theme.color.font1}
            rows={6}
            value={feedContent}
            onChange={(e) => setFeedContent(e.target.value)}
          />
          <FeedInput
            placeholder="해시태그를 입력해주세요..."
            bgcolor={theme.color.bg2}
            color={theme.color.font1}
            rows={1}
            value={feedHash}
            onChange={(e) => setFeedHash(e.target.value)}
          />
          {imgFile == "" ? (
            <PictureWrap bgcolor={theme.color.bg2}>
              <ImageInput
                src={imgFile == "" ? process.env.PUBLIC_URL + "/input_image.svg" : imgFile}
              />
            </PictureWrap>
          ) : (
            <PictureWrap bgcolor={theme.color.bg2}>
              <Picture
                src={imgFile == "" ? process.env.PUBLIC_URL + "/input_image.svg" : imgFile}
              />
            </PictureWrap>
          )}
          <input type="file" accept="image/*" id="addImg" onChange={saveImgFile} ref={imgRef} />
          <Dropdown>
            <StyledText size="1rem" weight="500" color={theme.color.font1}>
              핵심목표
            </StyledText>
            <StyledSelect
              value={selectedMainOption ? selectedMainOption.id : ""}
              onChange={handleMainChange}
              bgcolor={theme.color.bg2}
              color={theme.color.font1}
            >
              <option value="" disabled>
                선택하세요
              </option>
              {mainOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.main_title}
                </option>
              ))}
            </StyledSelect>
          </Dropdown>
          <Dropdown>
            <StyledText size="1rem" weight="500" color={theme.color.font1}>
              세부목표
            </StyledText>
            <StyledSelect
              value={selectedSub ? selectedSub.id : ""}
              onChange={handleSubChange}
              bgcolor={theme.color.bg2}
              color={theme.color.font1}
            >
              <option value="" disabled>
                선택하세요
              </option>
              {subsOptions.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.sub_title}
                </option>
              ))}
            </StyledSelect>
          </Dropdown>
          <Dropdown>
            <StyledText size="1rem" weight="500" color={theme.color.font1}>
              실천방법
            </StyledText>
            <StyledSelect
              value={selectedContent ? selectedContent.id : ""}
              onChange={handleContentChange}
              bgcolor={theme.color.bg2}
              color={theme.color.font1}
            >
              <option value="" disabled>
                선택하세요
              </option>
              {filteredContentsOptions.map((content) => (
                <option key={content.id} value={content.id}>
                  {content.content}
                </option>
              ))}
            </StyledSelect>
          </Dropdown>
        </Modal.Body>
        <Modal.Footer className="border-0" style={{ background: `${theme.color.bg}` }}>
          <Button className="btn_close" variant="secondary" onClick={handleSubmit}>
            {feedMode === "WRITE" ? "작성 완료" : "수정 완료"}
          </Button>
          <Button className="btn_close" variant="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </ThemeProvider>
  );
}

let StyledText = styled.span`
  font-size: ${({ size }) => size};
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  text-align: ${({ align }) => align};
  margin: ${({ margin }) => margin};
`;

let FeedInput = styled.textarea`
  width: 100%;
  height: ${({ height }) => height};
  border: 0;
  padding: 1rem;
  background-color: ${({ bgcolor }) => bgcolor};
  color: ${({ color }) => color};
  border-radius: 0.5rem;
  &::placeholder {
    color: ${({ color }) => color};
    opacity: 0.5;
  }
  margin: 1rem 0;
`;
let PictureWrap = styled.div`
  padding-top: 50%;
  margin-bottom: 16px;
  position: relative;
  width: 100%;
  border-radius: 0.25rem;
  background-color: ${({ bgcolor }) => bgcolor};
`;
let Picture = styled.img`
  height: 100%;
  position: absolute;
  width: 100%;
  object-fit: cover;
  left: 0;
  top: 0;
  border-radius: 0.25rem;
`;
let ImageInput = styled.img`
  height: 50%;
  width: 50%;
  position: absolute;
  object-fit: scale-down;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 0.25rem;
`;
let Dropdown = styled.div`
  ${({ theme }) => theme.component.flexBox.columnLeftCenter};
  gap: 0.5rem;
  margin: 1rem 0;
`;
let StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 0;
  background-color: ${({ bgcolor }) => bgcolor};
  color: ${({ color }) => color};
`;
