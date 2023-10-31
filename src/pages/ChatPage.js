import styled, { ThemeProvider } from "styled-components";
import theme from "../components/theme";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const myNickname = "me"
const chatting_list = [
    {
        id: "1",
        userinfo: {
            nickname: "test1",
            profile_img: process.env.PUBLIC_URL + "/testImg/profile1.jpg",
        },
        latest_chat: {
            nickname: "test1",
            upload_date: new Date(2023, 9, 21, 3, 24, 0),
            content: "안녕하세요"
        },
        chat_list: [
            {
                nickname: "test1",
                upload_date: new Date(2023, 9, 21, 3, 24, 0),
                content: "안녕하세요"
            },
            {
                nickname: "test1",
                upload_date: new Date(2023, 9, 21, 2, 24, 0),
                content: "안녕하세요2"
            },
            {
                nickname: "me",
                upload_date: new Date(2023, 9, 21, 1, 24, 0),
                content: "안녕하세요"
            },
            {
                nickname: "me",
                upload_date: new Date(2023, 9, 20, 3, 24, 0),
                content: "안녕하세요3"
            },
            {
                nickname: "test1",
                upload_date: new Date(2023, 9, 20, 2, 24, 0),
                content: "안녕하세요111"
            },
        ]
    },
    {
        id: "2",
        userinfo: {
            nickname: "test2",
            profile_img: process.env.PUBLIC_URL + "/testImg/profile2.jpg",
        },
        latest_chat: {
            nickname: "test2",
            upload_date: new Date(2023, 9, 21, 3, 24, 0),
            content: "안녕하세요"
        },
        chat_list: [
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 21, 3, 24, 0),
                content: "안녕하세요"
            },
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 21, 2, 24, 0),
                content: "안녕하세요2"
            },
            {
                nickname: "me",
                upload_date: new Date(2023, 9, 21, 1, 24, 0),
                content: "안녕하세요3333333333"
            },
            {
                nickname: "me",
                upload_date: new Date(2023, 9, 20, 3, 24, 0),
                content: "안녕하세요3"
            },
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 20, 2, 24, 0),
                content: "안녕하세요111"
            },
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 20, 2, 24, 0),
                content: "안녕하세요111"
            },
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 20, 2, 24, 0),
                content: "안녕하세요111"
            },
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 20, 2, 24, 0),
                content: "안녕하세요111"
            },
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 20, 2, 24, 0),
                content: "안녕하세요111"
            },
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 20, 2, 24, 0),
                content: "안녕하세요111"
            },
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 20, 2, 24, 0),
                content: "안녕하세요111"
            },
            {
                nickname: "test2",
                upload_date: new Date(2023, 9, 20, 2, 24, 0),
                content: "안녕하세요111"
            },
        ]
    }
]

function ChatPage() {
    const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
    const [chatInfo, setChatInfo] = useState(chatting_list);
    const [selectedChat, setSelectedChat] = useState({});
    const [unread, setUnread] = useState(true);
    let renderedDate = "";

    const onClickUnread = () => {
        setUnread((current) => !current);
    }
    const onClickChatList = (event) => {
        let currentChat = chatInfo.find(item => item.id === event.target.id);
        sortChat(currentChat.chat_list);
        setSelectedChat(currentChat);
    }
    const formatDateAgo = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
        if (years > 0) {
            return `${years}년 전`;
        } else if (months > 0) {
            return `${months}개월 전`;
        } else if (days > 6) {
            const weeks = Math.floor(days / 7);
            return `${weeks}주일 전`;
        } else if (days > 0) {
            return `${days}일 전`;
        } else if (hours > 0) {
            return `${hours}시간 전`;
        } else if (minutes > 0) {
            return `${minutes}분 전`;
        } else {
            return `${seconds}초 전`;
        }
    }
    const formatDateTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? '오후' : '오전';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0시는 12시로 표시

        minutes = minutes < 10 ? '0' + minutes : minutes; // 1자리 숫자일 경우 0을 붙여서 2자리로 표시
        return ampm + ' ' + hours + ':' + minutes;
    }
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}.${month}.${day}`;
    }
    const sortChat = (chat_list) => {
        chat_list.sort(function (a, b) {
            return a.upload_date - b.upload_date;
        });
    }
    const renderDate = (date) => {
        renderedDate = date.toDateString();
        return (<ColFlexBox>
            <StyledText
                size="0.75rem"
                weight="500"
                color={currentTheme.font2}
                margin="0.5rem 0"
            >
                {formatDate(date)}
            </StyledText>
        </ColFlexBox>)
    }
    return (
        <ThemeProvider theme={theme}>
            <Header />
            <Layout>
                <PageBox>
                    <ChatList>
                        <ChatDiv>
                            <StyledText
                                size="0.875rem"
                                weight="700"
                                color={currentTheme.font1}
                            >{myNickname}</StyledText>
                            <FlexBox>
                                <StyledText
                                    size="0.625rem"
                                    weight="500"
                                    color={currentTheme.font1}
                                    onClick={onClickUnread}
                                    style={{
                                        cursor: "pointer"
                                    }}
                                >안읽은 메세지만 보기</StyledText>
                                <StyledCheckBox
                                    htmlFor="unread"
                                    onClick={onClickUnread}
                                    bgcolor={unread ? currentTheme.primary : "transparent"}
                                />
                            </FlexBox>
                        </ChatDiv>
                        {chatInfo.map((chat) => {
                            return (
                                <ChatDiv
                                    id={chat.id}
                                    style={{ cursor: "pointer" }}
                                    onClick={onClickChatList}
                                    bgcolor={selectedChat.id == chat.id ? currentTheme.bg3 : currentTheme.bg}
                                >
                                    <ProfileImgWrapper>
                                        <ProfileImg id={chat.id} src={chat.userinfo.profile_img} />
                                    </ProfileImgWrapper>
                                    <ChatInfo id={chat.id}>
                                        <ChatInfoHeader>
                                            <StyledText
                                                size="0.75rem"
                                                weight="500"
                                                color={currentTheme.font1}
                                                id={chat.id}
                                            >{chat.userinfo.nickname}</StyledText>
                                            <StyledText
                                                size="0.625rem"
                                                weight="500"
                                                color={currentTheme.font2}
                                                id={chat.id}
                                            >{formatDateAgo(chat.latest_chat.upload_date)}</StyledText>
                                        </ChatInfoHeader>
                                        <StyledText
                                            size="0.75rem"
                                            weight="500"
                                            color={currentTheme.font1}
                                            id={chat.id}
                                        >{chat.latest_chat.content}</StyledText>
                                    </ChatInfo>
                                </ChatDiv>
                            )
                        })}
                    </ChatList>
                    <ChatContent>
                        {Object.keys(selectedChat).length === 0 ? (
                            <StyledText
                                size="1rem"
                                weight="500"
                                color={currentTheme.font1}
                                margin="3rem"
                            >채팅 목록에서 선택해주세요</StyledText>
                        ) : (
                            <ColFlexBox style={{ height: "100%" }}>
                                <ChatDiv>
                                    <StyledText
                                        size="0.875rem"
                                        weight="700"
                                        color={currentTheme.font1}
                                    >{selectedChat.userinfo.nickname}</StyledText>
                                </ChatDiv>
                                <ColTopFlexBox style={{ height: "100%" }}>
                                    {selectedChat.chat_list.map((chat) => {
                                        return (
                                            <ColFlexBox>
                                                {chat.upload_date.toDateString() !== renderedDate ? renderDate(chat.upload_date) : null}
                                                {chat.nickname === myNickname ? (
                                                    <MyChatDiv>
                                                        <StyledText
                                                            size="0.75rem"
                                                            weight="500"
                                                            color={currentTheme.font2}
                                                        >
                                                            {formatDateTime(chat.upload_date)}
                                                        </StyledText>
                                                        <ChatBox bgcolor={currentTheme.primary}>
                                                            <StyledText
                                                                size="0.75rem"
                                                                weight="500"
                                                                color={currentTheme.bg}
                                                            >
                                                                {chat.content}
                                                            </StyledText>
                                                        </ChatBox>
                                                    </MyChatDiv>
                                                ) : (
                                                    <YourChatDiv>
                                                        <ChatBox bgcolor={currentTheme.bg3}>
                                                            <StyledText
                                                                size="0.75rem"
                                                                weight="500"
                                                                color={currentTheme.font1}
                                                            >
                                                                {chat.content}
                                                            </StyledText>
                                                        </ChatBox>
                                                        <StyledText
                                                            size="0.75rem"
                                                            weight="500"
                                                            color={currentTheme.font2}
                                                        >
                                                            {formatDateTime(chat.upload_date)}
                                                        </StyledText>
                                                    </YourChatDiv>
                                                )}
                                            </ColFlexBox>
                                        )
                                    })}
                                </ColTopFlexBox>
                                <ChatForm>
                                    <ChatInput rows="5" placeholder="메세지를 입력해주세요" />
                                    <SubmitButton>전송</SubmitButton>
                                </ChatForm>
                            </ColFlexBox>
                        )}
                    </ChatContent>
                </PageBox>
            </Layout>
        </ThemeProvider>
    )
}

let Layout = styled.div`
  display: flex;
  height: calc(100vh - 56px);
  flex-direction: column;
  justify-content: center;
  align-items:center;
  gap: 160px;
  background-color: ${(props) => props.theme.bg};
`;
let PageBox = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: center;
    width: 1080px;
    @media screen and (max-width: 1080px) {
        width: 100vw;
    }
    padding:0 1rem;
    ${({ theme }) => theme.font.importPretendard};
    font-family: Pretendard-Regular;
    height:100%;
`;
let FlexBox = styled.div`
    ${({ theme }) => theme.flexBox.rowCenter};
    gap: 0.5rem;
`;
let ColFlexBox = styled.div`
    ${({ theme }) => theme.flexBox.columnCenter};
    width:100%;
    gap: 0.5rem;
`;
let ColTopFlexBox = styled.div`
    ${({ theme }) => theme.flexBox.columnCenterTop};
    width:100%;
    height:100%;
    gap: 0.5rem;
    padding: 1rem;
    overflow: auto;
`;
let StyledText = styled.span`
    font-size: ${({ size }) => size};
    font-weight: ${({ weight }) => weight};
    color: ${({ color }) => color};
    text-align: ${({ align }) => align};
    margin: ${({ margin }) => margin};
`;
let StyledCheckBox = styled.label`
    display: inline-block;
    width: 0.875em;
    height: 0.875rem;
    border: 0.125rem solid ${(props) => props.theme.border};
    padding:0.125rem;
    background-color: ${({ bgcolor }) => bgcolor};
    cursor: pointer;
`;
let ChatList = styled.div`
    ${({ theme }) => theme.flexBox.columnCenterTop};
    flex-basis: 16.875rem;
    height: 100%;
    flex-shrink: 0;
    border-right: 1px solid ${(props) => props.theme.border};
    border-left: 1px solid ${(props) => props.theme.border};
`;
let ChatContent = styled.div`
    ${({ theme }) => theme.flexBox.columnCenterTop};
    flex-basis: 50.625rem;
    height: 100%;
    border-right: 1px solid ${(props) => props.theme.border};
`;
let ChatDiv = styled.div`
    ${({ theme }) => theme.flexBox.rowSpaceBetween};
    padding:1rem;
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.border};
    background-color: ${({ bgcolor }) => bgcolor};
`;
let ProfileImgWrapper = styled.div`
    width: 3rem;
    height: 3rem;
`;
let ProfileImg = styled.img`
    ${({ theme }) => theme.common.circleImg};
`;
let ChatInfo = styled.div`
    ${({ theme }) => theme.flexBox.columnLeftCenter};
    width: calc(100% - 4rem);
    gap: 0.5rem;
`;
let ChatInfoHeader = styled.div`
    ${({ theme }) => theme.flexBox.rowLeftCenter};
    gap: 0.5rem;
`;
let MyChatDiv = styled.div`
    width:100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: end;
    margin: 0.5rem 0;
    gap: 0.5rem;
`
let YourChatDiv = styled.div`
    width:100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: end;
    margin: 0.5rem 0;
    gap: 0.5rem;
`
let ChatBox = styled.div`
    width:17rem;
    padding:1.25rem 1.5rem;
    background-color: ${({ bgcolor }) => bgcolor};
    border-radius:1rem;
`
let ChatForm = styled.form`
    width:calc(100% - 2rem);
    border: 1px solid ${(props) => props.theme.border};
    border-radius:0.5rem;
    padding: 1rem;
    display:flex;
    flex-direction: column;
    align-items:end;
    gap: 0.5rem;
    margin:1rem;
`
let ChatInput = styled.input`
    width:100%;
    padding: 1rem;
    border: 0;
    background-color: ${(props) => props.theme.bg};
`
let SubmitButton = styled.button`
    background-color: ${(props) => props.theme.bg3};
    color: ${(props) => props.theme.font1};
    border: 0;
    border-radius:0.25rem;
    padding: 0.5rem 1rem;
    &:hover{
        background-color: ${(props) => props.theme.primary};
        color: ${(props) => props.theme.bg};
    }
`
export default ChatPage;