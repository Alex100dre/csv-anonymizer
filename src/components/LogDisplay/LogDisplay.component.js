import React, {useState, useEffect, useRef} from 'react';
import { Console, Hook, Unhook } from 'console-feed';
import {Content, Window, WindowBar, WindowButton, WindowButtonsContainer, WindowTitle} from "./LogDisplay.style";

const LogDisplay = () => {
    const [logs, setLogs] = useState([]);
    const refContent = useRef(null);
    // run once!
    useEffect(() => {
        Hook(
            window.console,
            (log) => setLogs((currLogs) => [...currLogs, log]),
            false
        );
        return () => Unhook(window.console);
    }, []);

    useEffect(() => {
        if (refContent !== null && refContent.current) {
            refContent.current.scrollTop = refContent.current.scrollHeight;
        }
        // console.log(refContent.current);
    }, [logs]);

    return (
        <Window>
            <WindowBar>
                <WindowButtonsContainer>
                    <WindowButton variant="close" />
                    <WindowButton variant="minimize" />
                    <WindowButton variant="maximize" />
                </WindowButtonsContainer>
                <WindowTitle>
                    Console
                </WindowTitle>
            </WindowBar>
            <Content ref={refContent}>
                <Console logs={logs} variant="dark" />
            </Content>
        </Window>
    );
};

export { LogDisplay };
