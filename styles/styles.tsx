import styled, { css } from "styled-components"

export const theme = {
  primary: "hsl(180, 4%, 91%)",
  primaryAccent: "hsl(180, 4%, 81%)",
  primaryDark: "hsl(180, 4%, 61%)",
  secondaryDark: "hsl(220, 48%, 30%)",
  secondary: "hsl(220, 48%, 40%)",
  secondaryLight: "hsl(220, 48%, 50%)",
  secondaryFade: "hsl(220, 48%, 75%)",
  error: "hsl(0,40%,50%)",
  commonWidth: "768px",
};


export const Error = styled.div`
  color: ${props => props.theme.error};
  font-weight: 600;
  height: 1rem;
  font-size: 1rem;
`;
export const Element = styled.div<{flex: number}>`
  flex: ${props => props.flex};
  position: relative;
`;

export const Label = styled.label`
  position: relative;
  color: ${theme.secondary};
`;

export const Wrapper = styled.div`
  max-width: ${props => props.theme.commonWidth};
  @media only screen and (max-width: 1000px) {
    max-width: 400px;
  }
  width: 100%;
`;

export const Input = styled.input`
  display: block;
  background: transparent;
  border: none;
  border-bottom: solid 2px ${theme.secondaryFade};
  color: ${theme.secondary};
  font-size: 1.5rem;
  width: 100%;
  margin-bottom: 32px;
  &:focus {
    outline-width: 0;
    border-color: ${theme.secondaryLight};
  }
`;

export const Checkbox = styled.input`
  height: 16px;
  width: 16px;
  margin-right: 12px;
  background: transparent;
`

export const button = css`
  appearance: button;
  position: relative;
  padding: 15px 36px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: white;
  background: ${theme.secondary};
  box-shadow: 2px 2px 5px ${theme.secondaryDark};
  border: none;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  &:hover {
    transform: translateY(-2px);
    background: ${theme.secondaryDark};
  }
  &:active {
    transform: translateY(-1px);
  }
  &:active {
    background: ${theme.secondaryDark};
  }
  &:disabled {
    opacity: 0.5;
    cursor: initial;
  }
  @media only screen and (max-width: 768px) {
    padding: 13px 25px;
  }
`;