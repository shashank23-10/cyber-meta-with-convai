import React from 'react';
import alertIcon from '../assets/alert_icon.png';
import alertMessageBox from '../assets/alert_message.png'; // red border PNG

const Alert = ({
message = 'An attacker has compromised the distillation process and shut down critical components.',
visible = true,
position = { top: '30px', right: '30px' }
}) => {
if (!visible) return null;

const blinkAnimation = {
animation: 'blink 1s infinite',
};

return (
<div
    style={{
    position: 'fixed',
    zIndex: 10000,
    ...position,
    width: 'max-content',
    minWidth: '22vw',
    maxWidth: '28vw',
    height: 'auto',
    padding: '40px 40px 30px 40px', // extra top padding for icon
    color: '#fff',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    backgroundImage: `url(${alertMessageBox})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    textAlign: 'center',
    lineHeight: '1.5',
    transition: 'all 0.3s ease-in-out',
    }}
>
    <img
    src={alertIcon}
    alt="Alert"
    style={{
        position: 'absolute',
        top: '10px',
        width: '32px',
        height: '32px',
        filter: 'drop-shadow(0 0 4px red)',
        marginBottom: '48px',
        ...blinkAnimation,
    }}
    />
    <div
    style={{
        fontSize: '1rem',
        fontWeight: 'bold',
        wordBreak: 'break-word',
    }}
    >
    {message}
    </div>

    {/* Blinking keyframes */}
    <style>
    {`
        @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.2; }
        }
    `}
    </style>
</div>
);
};

export default Alert;
