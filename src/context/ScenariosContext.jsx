import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './SocketContext';
import { scenarioAnnotationList } from '../config/scenarioConfig';

const ScenariosContext = createContext();

export const useScenarios = () => useContext(ScenariosContext);

export const ScenariosProvider = ({ children }) => {
    const { state, emitStateUpdate, connected } = useSocket();
    const [activeVideos, setActiveVideos] = useState({});
    const [activeHighlights, setActiveHighlights] = useState({});

    const getCurrentLocation = () => {
        const location = scenarioAnnotationList.find(loc => loc.MetaLocation === state.MetaLocation);
        return location ? {
            MetaLocation: state.MetaLocation,
            position: location.position,
            lookAt: location.lookAt,
            videoSurfaceName: location.videoSurfaceName,
            highlightSurfaceNames: location.highlightSurfaceNames,
            normal_clip: location.normal_clip,
            compromised_clip: location.compromised_clip
        } : null;
    };

    const getCurrentSceneTrigger = () => {
        const location = scenarioAnnotationList.find(loc => loc.MetaLocation === state.MetaLocation);
        if (!location || !location.subAnnotations) return null;

        return location.subAnnotations.find(trigger => {
            return Object.entries(trigger.condition).every(([key, value]) => {
                const statePath = key.split('.');
                let currentValue = state;
                for (const part of statePath) {
                    currentValue = currentValue[part];
                }
                return currentValue === value;
            });
        });
    };

    // State update functions
    const updateLocation = (location) => {
        if (scenarioAnnotationList.some(loc => loc.MetaLocation === location)) {
            const newState = {
                ...state,
                MetaLocation: location
            };
            emitStateUpdate(newState);
        }
    };

    const updateITNetwork = (compromised) => {
        const newState = {
            ...state,
            "IT-Network": {
                ...state["IT-Network"],
                Compromised: compromised
            }
        };
        emitStateUpdate(newState);
    };

    const updateOTNetwork = (compromised) => {
        const newState = {
            ...state,
            "OT-Network": {
                ...state["OT-Network"],
                Compromised: compromised
            }
        };
        emitStateUpdate(newState);
    };

    const updateWorkstation = (compromised, usb) => {
        const newState = {
            ...state,
            Workstation: {
                ...state.Workstation,
                Compromised: compromised !== undefined ? compromised : state.Workstation.Compromised,
                USB: usb !== undefined ? usb : state.Workstation.USB
            }
        };
        emitStateUpdate(newState);
    };

    const updateValves = (valve1, valve2) => {
        const newState = {
            ...state,
            Valves: {
                ...state.Valves,
                Valve1: valve1 !== undefined ? valve1 : state.Valves.Valve1,
                Valve2: valve2 !== undefined ? valve2 : state.Valves.Valve2
            }
        };
        emitStateUpdate(newState);
    };

    const updateTanks = (tank1, tank2) => {
        const newState = {
            ...state,
            Valves: {
                ...state.Valves,
                Tank1: tank1 !== undefined ? tank1 : state.Valves.Tank1,
                Tank2: tank2 !== undefined ? tank2 : state.Valves.Tank2
            }
        };
        emitStateUpdate(newState);
    };

    const updatePreHeater = (preheater, distillation, flare) => {
        const newState = {
            ...state,
            "Pre-Heater": {
                ...state["Pre-Heater"],
                Preheater: preheater !== undefined ? preheater : state["Pre-Heater"].Preheater,
                Distillation: distillation !== undefined ? distillation : state["Pre-Heater"].Distillation,
                Flare: flare !== undefined ? flare : state["Pre-Heater"].Flare
            }
        };
        emitStateUpdate(newState);
    };

    const resetState = () => {
        const initialState = {
            MetaLocation: "Internet",
            Internet: {},
            Ransomware: false,
            "IT-Network": {
                Compromised: false
            },
            "OT-Network": {
                Compromised: false
            },
            Workstation: {
                USB: false,
                Compromised: false
            },
            Valves: {
                Valve1: true,
                Valve2: true,
                Tank1: 80,
                Tank2: 80,
            },
            "Pre-Heater": {
                Preheater: false,
                Distillation: false,
                Flare: false,
            }
        };
        emitStateUpdate(initialState);
    };

    const updateRansomware = (enabled) => {
        const newState = {
            ...state,
            Ransomware: enabled
        };
        emitStateUpdate(newState);
    };

    return (
        <ScenariosContext.Provider
            value={{
                state,
                connected,
                activeVideos,
                activeHighlights,
                scenarios: scenarioAnnotationList,
                getCurrentLocation,
                getCurrentSceneTrigger,
                updateLocation,
                updateITNetwork,
                updateOTNetwork,
                updateWorkstation,
                updateValves,
                updateTanks,
                updatePreHeater,
                updateRansomware,
                resetState
            }}
        >
            {children}
        </ScenariosContext.Provider>
    );
};
