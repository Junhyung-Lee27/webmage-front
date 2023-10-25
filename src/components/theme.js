import styled from "styled-components";

//픽셀 컨버팅 함수
const pixelToRem = (size) => `${size / 16}rem`;

const font = {
    importPretendard: `
    @font-face {
        font-family: 'Pretendard-Regular';
        src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
        font-weight: 400;
        font-style: normal;
    }
    `,
};

const flexBox = {
    rowLeftCenter: `
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    `,
    rowCenter: `
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    `,
    rowSpaceBetween: `
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    `,
    columnCenter: `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    `,
    columnLeftCenter: `
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    `
};

const common = {
    layout: `
        display: flex;
        justify-content: center;
        background-color: ${(props) => props.theme.bg};
    `,
    circleImg: `
        width: 100%;
        height: 100%;
        object-fit: cover;
        margin: auto;
        border-radius: 50%;
    `
};

const iconSize = {
    large: `
        width: 2.25rem;
        height: 2.25rem;
    `,
    medium: `
        width: 2rem;
        height: 2rem;
    `,
    small: `
        width: 1.5rem;
        height: 1.5rem;
    `,
}

const theme = {
    font,
    flexBox,
    common,
    iconSize,
};

export default theme;