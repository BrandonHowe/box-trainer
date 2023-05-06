import React, { useRef, useState } from "react";
import "./App.css";

enum Mode {
    None,
    EnGuarde,
    Ready,
    Fence,
    Ghost,
    Lunge
}

const backgroundColors: Record<Mode, string> = {
    [Mode.None]: "grey",
    [Mode.EnGuarde]: "hsl(0, 50%, 50%)",
    [Mode.Ready]: "hsl(50, 50%, 50%)",
    [Mode.Fence]: "hsl(90, 50%, 50%)",
    [Mode.Ghost]: "hsl(200, 50%, 50%)",
    [Mode.Lunge]: "hsl(270, 50%, 50%)"
}

const modeText: Record<Mode, string> = {
    [Mode.None]: "Waiting to start...",
    [Mode.EnGuarde]: "En guarde...",
    [Mode.Ready]: "Ready...",
    [Mode.Fence]: "Fence!",
    [Mode.Ghost]: "Ghost!",
    [Mode.Lunge]: "Lunge!"
}

const App = () => {
    const [mode, setMode] = useState(Mode.None);
    const [enGuardeDelay, setEnGuardeDelay] = useState(3000);
    const [readyDelay, setReadyDelay] = useState(2000);
    const [fenceTime, setFenceTime] = useState(500);
    
    const [secondaryActionsEnabled, setSecondaryActionsEnabled] = useState(true);
    const [secondaryTime, setSecondaryTime] = useState(5000);
    const [ghostProportion, setGhostProportion] = useState(0.5);

    const [settingsVisible, setSettingsVisible] = useState(false);

    const currentTimeout = useRef<NodeJS.Timeout | null>(null);

    const toggleSettings = () => {
        setSettingsVisible(u => !u);
        stop();
    }

    //#region timers
    const enGuarde = () => {
        setMode(Mode.EnGuarde);
        currentTimeout.current = setTimeout(ready, enGuardeDelay);
    }

    const ready = () => {
        setMode(Mode.Ready);
        currentTimeout.current = setTimeout(fence, readyDelay);
    }

    const fence = () => {
        setMode(Mode.Fence);
        currentTimeout.current = setTimeout(nextAction, fenceTime);
    }

    const nextAction = () => {
        if (!secondaryActionsEnabled) {
            enGuarde();
            return;
        }
        const ghost = Math.random() < ghostProportion;
        setMode(ghost ? Mode.Ghost : Mode.Lunge);
        currentTimeout.current = setTimeout(enGuarde, secondaryTime);
    }

    const stop = () => {
        if (currentTimeout.current) {
            clearTimeout(currentTimeout.current);
            setMode(Mode.None);
        }
    }
    //#endregion timers

    return <div style={{ backgroundColor: backgroundColors[mode] }} className="app">
        <div className="modeText">
            { modeText[mode] }
        </div>
        <div className="settingsToggleButton" onClick={ toggleSettings }>
            &#9881;
        </div>
        { mode === Mode.None && <div className="startButton" onClick={ enGuarde }>
            Start practice
        </div> }
        { settingsVisible && <div className="settingsPage">
            <div className="settingsContent">
                <div className="setting">
                    <label htmlFor="enguarde">En guarde time</label>
                    <input name="enguarde" value={ enGuardeDelay } onChange={ e => setEnGuardeDelay(+e.target.value) } />
                </div>
                <div className="setting">
                    <label htmlFor="enguarde">Ready time</label>
                    <input name="enguarde" value={ readyDelay } onChange={ e => setReadyDelay(+e.target.value) } />
                </div>
                <div className="setting">
                    <label htmlFor="enguarde">Fence time</label>
                    <input name="enguarde" value={ fenceTime } onChange={ e => setFenceTime(+e.target.value) } />
                </div>
                <div className="setting">
                    <label htmlFor="secEn">Secondary enabled</label>
                    <input name="secEn" checked={ secondaryActionsEnabled } onChange={ e => setSecondaryActionsEnabled(u => !u) } type="checkbox" />
                </div>
                <div className="setting">
                    <label htmlFor="secTime">Secondary time</label>
                    <input name="secTime" value={ secondaryTime } onChange={ e => setSecondaryTime(+e.target.value) } />
                </div>
                <div className="setting">
                    <label htmlFor="ghost">Ghost proportion</label>
                    <input name="ghost" value={ ghostProportion } onChange={ e => setGhostProportion(+e.target.value) } />
                </div>
            </div>
        </div> }
    </div>
};

export default App;
