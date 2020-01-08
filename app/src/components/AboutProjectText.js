import React from 'react';
import { darkTheme } from '../utils/StyleUtils';
import styled from 'styled-components';

const IntroArea = styled.section`
    border: 8px solid ${darkTheme.sectionArea};
    margin-top: 20px;
    background-color: ${darkTheme.sectionArea};
    border-radius: 8px;
    width: 80%;
    margin-right: auto;
    margin-left: auto;
`;


export default Text => {
    return (
        <IntroArea>
            <h3><b>Predlagatelj bivanja</b></h3>
            <p>Brezplačno iskanje občin za mlade družine na podlagi odprtih podatkov iz portala OPSI</p>
            <p>Vsaka izmed občin je sortirana na podlagi <b>indeksa</b>, ki določa kako prijazna je ta občina do mlade družine</p>
        </IntroArea>
    )
}