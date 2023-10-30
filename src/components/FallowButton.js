import styled from "styled-components";
import { useSelector } from "react-redux";

function FallowButton({ isFallowing }) {
    const currentTheme = useSelector((state) => state.theme.themes[state.theme.currentTheme]);
    return (
        isFallowing ? (
            <Fallowing color={currentTheme.primary} colorhover={currentTheme.secondary}>
                팔로잉
            </Fallowing>
        ) : (
            <Fallow bgcolor={currentTheme.bg3} color={currentTheme.font2} colorhover={currentTheme.primary}>
                +팔로우
            </Fallow>
        )
    )
}

let Fallow = styled.button`
    border: 2px solid ${({ color }) => color};
    color: ${({ color }) => color};
    background-color: ${({ bgcolor }) => bgcolor};
    border-radius: 1rem;
    width: 6rem;
    height: 2rem;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.25rem 1rem;
    flex-shrink: 0;
    &:hover {
        border: 1px solid ${({ colorhover }) => colorhover};
        background-color: ${({ colorhover }) => colorhover};
        color: #fff;
        transition: 0.5s;
      }
`;
let Fallowing = styled.button`
    border: 2px solid ${({ color }) => color};
    background-color: ${({ color }) => color};
    color: #fff;
    border-radius: 1rem;
    width: 6rem;
    height: 2rem;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.25rem 1rem;
    flex-shrink: 0;
    &:hover {
        border: 1px solid ${({ colorhover }) => colorhover};
        background-color: ${({ colorhover }) => colorhover};
        transition: 0.5s;
      }
`;

export default FallowButton;