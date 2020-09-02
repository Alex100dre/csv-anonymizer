import styled from 'styled-components';

export const WindowBar = styled.div`
  height: 20px;
  background-color: #292A2D;
  display: flex;
  border-bottom: 1px solid #555;
`;

export const WindowButtonsContainer = styled.div`
  display: flex;
  margin-left: 9px;
  width: 60px;
  
  & > div:first-child {
    margin-left: 0;
  }
`;

const buttonsVariants = {
    close: {
        backgroundColor: '#fb4948',
        borderColor: 'rgba(214,46,48,.15)'
    },
    minimize: {
        backgroundColor: '#fdb225',
        borderColor: 'rgba(213,142,27,.15)'
    },
    maximize: {
        backgroundColor: '#2ac833',
        borderColor: 'rgba(30,159,32,.15)'
    },

}

export const WindowButton = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin: 5px 0 0 9px;
  background: ${ ({variant}) => variant ? buttonsVariants[variant].backgroundColor : buttonsVariants.close.backgroundColor};
  border: 1px solid ${ ({variant}) => variant ? buttonsVariants[variant].borderColor : buttonsVariants.close.borderColor};
  position: relative;
`;

export const WindowTitle = styled.span`
  flex-grow: 1;
  text-align: center;
`;

export const Window = styled.div`
  background-color: #242424;
  border: 1px solid #555;
  border-radius: 5px;
`;

export const Content = styled.div`
  height: 300px;
  overflow-y: auto;
`;

