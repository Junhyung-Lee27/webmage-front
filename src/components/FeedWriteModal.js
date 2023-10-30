import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.min.css';

import theme from './theme';


function FeedWriteModal() {
    const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);

    const [show, setShow] = useState(false);
    const [imgFile, setImgFile] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const imgRef = useRef();
    const dragRef = useRef(null);
    const fileId = useRef(0);

    const handleClose = () => {
        setShow(false);
        setImgFile("");
    }
    const handleShow = () => setShow(true);
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
                        object: file
                    }
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

    return (
        <ThemeProvider theme={theme}>
            <WriteFeed bgcolor={currentTheme.primary} onClick={handleShow}>
                <StyledText
                    size="1rem"
                    weight="700"
                    color={currentTheme.bg}
                    align="center"
                >피드 작성</StyledText>
            </WriteFeed>

            <Modal show={show} onHide={handleClose} backdrop="static"  >
                <Modal.Header className="border-0" style={{ background: `${currentTheme.bg2}` }}>
                    <Modal.Title>
                        <StyledText
                            size="1.25rem"
                            weight="700"
                            color={currentTheme.font1}
                        >
                            실천 기록 작성하기
                        </StyledText>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ background: `${currentTheme.bg2}` }}>
                    <FeedInput
                        placeholdertextcolor='red'
                        placeholder='내용을 입력해주세요...'
                        bgcolor={currentTheme.bg3}
                        color={currentTheme.font1}
                        rows={8}
                    />
                    <PictureWrap>
                        <Picture src={imgFile == "" ? process.env.PUBLIC_URL + "/input_image.svg" : imgFile} />
                    </PictureWrap>
                    <input
                        type="file"
                        accept="image/*"
                        id="addImg"
                        onChange={saveImgFile}
                        ref={imgRef}
                    />
                    <Dropdown>
                        <StyledText
                            size="1rem"
                            weight="500"
                            color={currentTheme.font1}
                        >
                            핵심목표
                        </StyledText>
                        <StyledSelect bgcolor={currentTheme.bg3} color={currentTheme.font1}>
                            <option value="1">1</option>
                        </StyledSelect>
                    </Dropdown>
                    <Dropdown>
                        <StyledText
                            size="1rem"
                            weight="500"
                            color={currentTheme.font1}
                        >
                            세부목표
                        </StyledText>
                        <StyledSelect bgcolor={currentTheme.bg3} color={currentTheme.font1}>
                            <option value="1">1</option>
                        </StyledSelect>
                    </Dropdown>
                    <Dropdown>
                        <StyledText
                            size="1rem"
                            weight="500"
                            color={currentTheme.font1}
                        >
                            실천방법
                        </StyledText>
                        <StyledSelect bgcolor={currentTheme.bg3} color={currentTheme.font1}>
                            <option value="1">1</option>
                        </StyledSelect>
                    </Dropdown>
                </Modal.Body>
                <Modal.Footer className="border-0" style={{ background: `${currentTheme.bg2}` }}>
                    <Button className="btn_close" variant="secondary" onClick={handleClose}>
                        작성완료
                    </Button>
                    <Button className="btn_close" variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                </Modal.Footer>
            </Modal>
        </ThemeProvider>
    )
}

let StyledText = styled.span`
    font-size: ${({ size }) => size};
    font-weight: ${({ weight }) => weight};
    color: ${({ color }) => color};
    text-align: ${({ align }) => align};
    margin: ${({ margin }) => margin};
`;
let WriteFeed = styled.button`
    width:250px;
    height: 60px;
    border:none;
    border-radius:4px;
    ${({ theme }) => theme.flexBox.rowCenter};
    background-color: ${({ bgcolor }) => bgcolor};
    margin-left:3rem;
`;
let FeedInput = styled.textarea`
    width:100%;
    border: 0;
    padding :1rem;
    background-color: ${({ bgcolor }) => bgcolor};
    color: ${({ color }) => color};
    border-radius: 0.5rem;
    &::placeholder{
        color: ${({ color }) => color};
        opacity: 0.5;
    }
`
let StyledButton = styled.button`
    width:100%
`
let PictureWrap = styled.div`
    padding-top: 65%;
    position: relative;
    width: 100%;
`;
let Picture = styled.img`
    height: 100%;
    position: absolute;
    width: 100%;
    object-fit: cover;
    left: 0;
    top: 0;
    border-radius:0.25rem;
`;
let Dropdown = styled.div`
    ${({ theme }) => theme.flexBox.columnLeftCenter};
    gap:0.5rem;
    margin: 1rem 0;
`
let StyledSelect = styled.select`
    width: 100%;
    padding: 0.5rem;
    border: 0;
    background-color: ${({ bgcolor }) => bgcolor};
    color: ${({ color }) => color};
`
export default FeedWriteModal;