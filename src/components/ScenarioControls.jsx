import React, { useState } from 'react';
import { useScenarios } from '../context/ScenariosContext';
import { useSocket } from '../context/SocketContext';
import { scenarioAnnotationList } from '../config/scenarioConfig';
import './ScenarioControls.css';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Alert from './Alert';
import Location from './Location';
import ConvAiIntegration from '../ConvAiIntegration';


import usbIcon from '../assets/usb-icon.jpg';

const alertMessages = {
    'IT-Network':    'An unauthorized user has gained access to the IT network.',
    'OT-Network':    'An unauthorized user has gained access to the OT network.',
    'Workstation':   'An unauthorized user has gained access to the workstation.',
    'Valves':        'The attacker has compromised the out-valves of the crude oil storage tanks',
    'Pre-Heater':    'An attacker has compromised the distillation process and shut down critical components.',
    'USB':           'A USB device was used to compromise the workstation.',
    'Ransomware':    'Ransomware has been detected in the system! Critical systems are being encrypted.'
};

const ScenarioControls = () => {
const {
state,
updateLocation,
updateITNetwork,
updateOTNetwork,
updateWorkstation,
updateValves,
updateTanks,
updatePreHeater,
updateRansomware,
resetState
} = useScenarios();

const { connected, error } = useSocket();
const [isOpen, setIsOpen] = useState(true);

const handleControlChange = (updateFn, ...args) => {
if (!connected) {
    console.warn('Not connected to server, changes will not be saved');
    return;
}
updateFn(...args);
};

const { MetaLocation } = state;

const isITCompromised      = MetaLocation === 'IT-Network' && !!state['IT-Network']?.Compromised;
const isOTCompromised      = MetaLocation === 'OT-Network' && !!state['OT-Network']?.Compromised;
const isWorkCompromised    = MetaLocation === 'Workstation' && !!state.Workstation?.Compromised;
const isUSBInserted        = MetaLocation === 'Workstation' && !!state.Workstation?.USB;
const isValveCompromised   = MetaLocation === 'Valves' && (!state.Valves?.Valve1 || !state.Valves?.Valve2);
const isPreHeaterCompromised =
    MetaLocation === 'Pre-Heater' &&
    (state['Pre-Heater']?.Preheater ||
    state['Pre-Heater']?.Distillation ||
    state['Pre-Heater']?.Flare);
const isRansomwareActive   = state.Ransomware;

// show any of these cases
const showAlert =
    isITCompromised ||
    isOTCompromised ||
    isUSBInserted    || 
    isWorkCompromised ||
    isValveCompromised ||
    isPreHeaterCompromised ||
    isRansomwareActive;

let alertMessage = '';
if (isRansomwareActive) {
    alertMessage = alertMessages['Ransomware'];
} else if (isUSBInserted) {
    alertMessage = alertMessages['USB'];
} else {
    alertMessage = alertMessages[MetaLocation] || '';
}

return (
<>
{isUSBInserted && (
<img
    src={usbIcon}
    alt="USB Connected"
    style={{
    position: 'absolute',
    top: '1vh',
    left: '90%',
    transform: 'translateX(-89vw)', 
    width: '10%',
    height: 'auto',
    zIndex: 1000,
    border: '4px solid red'
    }}
/>
)}

<div className={`scenarios-wrapper ${isOpen ? 'open' : 'collapsed'}`} >

    <Location location={MetaLocation} visible={true} />

    <IconButton
    className="toggle-button"
    onClick={() => setIsOpen(!isOpen)}
    size="small"
    >
    {isOpen ? <CloseIcon /> : <MenuIcon />}
    </IconButton>

    {showAlert && (
    <Alert
        message={alertMessage}
        visible={true}
        position={
        isOpen
            ? { top: '20px', right: '360px' }
            : { top: '20px', right: '80px' }
        }
    />

    )}

    <ConvAiIntegration
    // for the chat panel itself
    positionStyle={{
        position: 'absolute',
        right: isOpen ? '360px' : '60px',
        transition: 'right 0.5s ease',
    }}
    // for the little toggle-icon
    iconPositionStyle={{
        position: 'absolute',
        right: isOpen ? '360px' : '60px',
        transition: 'right 0.5s ease',
    }}
    />


    {isOpen && (
    <div className="scenario-controls">
        <div className="connection-status">
        <span
            className={`status-indicator ${
            connected ? 'connected' : 'disconnected'
            }`}
        />
        <span>{connected ? ' Connected' : ' Disconnected'}</span>
        {error && <span className="error-message">{error}</span>}
        </div>

        <div className="control-section">
        <h4>Location</h4>
        <select
            value={MetaLocation}
            onChange={(e) =>
            handleControlChange(updateLocation, e.target.value)
            }
            disabled={!connected}
        >
            {scenarioAnnotationList.map((loc) => (
            <option key={loc.MetaLocation} value={loc.MetaLocation}>
                {loc.title || loc.MetaLocation}
            </option>
            ))}
        </select>
        </div>

        <div className="control-section">
        <h4>Ransomware Status</h4>
        <div className="control-grid">
            <label className="control-item">
            <span>Enable Ransomware</span>
            <input
                type="checkbox"
                checked={state.Ransomware}
                onChange={(e) =>
                handleControlChange(updateRansomware, e.target.checked)
                }
                disabled={!connected}
            />
            </label>
        </div>
        </div>

        <div className="control-section">
        <h4>Network Status</h4>
        <div className="control-grid">
            <label className="control-item">
            <span>IT-Network Compromised</span>
            <input
                type="checkbox"
                checked={state['IT-Network']?.Compromised}
                onChange={(e) =>
                handleControlChange(updateITNetwork, e.target.checked)
                }
                disabled={!connected}
            />
            </label>
            <label className="control-item">
            <span>OT-Network Compromised</span>
            <input
                type="checkbox"
                checked={state['OT-Network']?.Compromised}
                onChange={(e) =>
                handleControlChange(updateOTNetwork, e.target.checked)
                }
                disabled={!connected}
            />
            </label>
        </div>
        </div>

        <div className="control-section">
        <h4>Workstation</h4>
        <div className="control-grid">
            <label className="control-item">
            <span>System Compromised</span>
            <input
                type="checkbox"
                checked={state.Workstation?.Compromised}
                onChange={(e) =>
                updateWorkstation(
                    e.target.checked,
                    state.Workstation?.USB
                )
                }
            />
            </label>
            <label className="control-item">
            <span>USB Connected</span>
            <input
                type="checkbox"
                checked={state.Workstation?.USB}
                onChange={(e) =>
                updateWorkstation(
                    state.Workstation?.Compromised,
                    e.target.checked
                )
                }
            />
            </label>
        </div>
        </div>

        <div className="control-section">
        <h4>Valves & Tanks</h4>
        <div className="control-grid">
            <label className="control-item">
            <span>Valve 1</span>
            <input
                type="checkbox"
                checked={state.Valves?.Valve1}
                onChange={(e) =>
                updateValves(e.target.checked, state.Valves?.Valve2)
                }
            />
            </label>
            <label className="control-item">
            <span>Valve 2</span>
            <input
                type="checkbox"
                checked={state.Valves?.Valve2}
                onChange={(e) =>
                updateValves(state.Valves?.Valve1, e.target.checked)
                }
            />
            </label>
            <div className="slider-control">
            <span>Tank 1: {state.Valves?.Tank1}%</span>
            <input
                type="range"
                min="0"
                max="100"
                value={state.Valves?.Tank1 || 0}
                onChange={(e) =>
                updateTanks(
                    parseInt(e.target.value, 10),
                    state.Valves?.Tank2
                )
                }
            />
            </div>
            <div className="slider-control">
            <span>Tank 2: {state.Valves?.Tank2}%</span>
            <input
                type="range"
                min="0"
                max="100"
                value={state.Valves?.Tank2 || 0}
                onChange={(e) =>
                updateTanks(
                    state.Valves?.Tank1,
                    parseInt(e.target.value, 10)
                )
                }
            />
            </div>
        </div>
        </div>

        <div className="control-section">
        <h4>Pre-Heater System</h4>
        <div className="control-grid">
            <label className="control-item">
            <span>Preheater</span>
            <input
                type="checkbox"
                checked={state['Pre-Heater']?.Preheater}
                onChange={(e) =>
                updatePreHeater(
                    e.target.checked,
                    state['Pre-Heater']?.Distillation,
                    state['Pre-Heater']?.Flare
                )
                }
            />
            </label>
            <label className="control-item">
            <span>Distillation</span>
            <input
                type="checkbox"
                checked={state['Pre-Heater']?.Distillation}
                onChange={(e) =>
                updatePreHeater(
                    state['Pre-Heater']?.Preheater,
                    e.target.checked,
                    state['Pre-Heater']?.Flare
                )
                }
            />
            </label>
            <label className="control-item">
            <span>Flare</span>
            <input
                type="checkbox"
                checked={state['Pre-Heater']?.Flare}
                onChange={(e) =>
                updatePreHeater(
                    state['Pre-Heater']?.Preheater,
                    state['Pre-Heater']?.Distillation,
                    e.target.checked
                )
                }
            />
            </label>
        </div>
        </div>

        <div className="control-section">
        <button onClick={resetState}>Reset All Systems</button>
        </div>
    </div>
    )}
</div>

</>
);
};

export default ScenarioControls;
