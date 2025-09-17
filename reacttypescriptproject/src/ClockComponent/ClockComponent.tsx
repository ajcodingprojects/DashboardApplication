import './ClockComponent.css';
import * as React from 'react';

function ClockComponent(): React.JSX.Element {
    React.useEffect(() => {
        setInterval(() => {
            let clock = document.getElementById("clock-comp");
            let now = new Date()
            clock.innerHTML = now.toLocaleTimeString();
        }, 1000);
    }, []);

    return (
        <>
            <div id="date-comp">{new Date().toLocaleDateString()}</div>
            <div id="clock-comp">{new Date().toLocaleTimeString()}</div>
        </>
    );
}

export default ClockComponent;