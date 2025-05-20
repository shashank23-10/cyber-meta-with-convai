import React, { useEffect, useRef } from 'react';
import { useScenarios } from '../context/ScenariosContext';
import { scenarioAnnotationList } from '../config/scenarioConfig';
import { useGLTF, Html } from '@react-three/drei';
import HighlightManager from './HighlightManager';
import { VideoSurface } from './VideoSurface';
import tankLabel from '../assets/tank_label.png';
import valveLabel from '../assets/valve_label.png';
import tankLabel1 from '../assets/tank_label_1.png';

const MODEL_PATH = "/cyber-scene_v_05.glb";

function determineActiveObjectNames(currentState) {
    const activeNames = [];
    const currentLocConfig = scenarioAnnotationList.find(loc => loc.MetaLocation === currentState.MetaLocation);

    if (!currentLocConfig) return activeNames;

    switch (currentState.MetaLocation) {
        case "Pre-Heater":
            if (currentState['Pre-Heater']?.Preheater && currentLocConfig.preheaterHighlightSurfaces) {
                activeNames.push(...currentLocConfig.preheaterHighlightSurfaces);
            }
            if (currentState['Pre-Heater']?.Distillation && currentLocConfig.distillationHighlightSurfaces) {
                activeNames.push(...currentLocConfig.distillationHighlightSurfaces);
            }
            if (currentState['Pre-Heater']?.Flare && currentLocConfig.flareHighlightSurfaces) {
                activeNames.push(...currentLocConfig.flareHighlightSurfaces);
            }
            break;
        case "Valves":
            if (!currentState.Valves?.Valve1 && currentLocConfig.valve1HighlightSurfaces) {
                activeNames.push(...currentLocConfig.valve1HighlightSurfaces);
            }
            if (!currentState.Valves?.Valve2 && currentLocConfig.valve2HighlightSurfaces) {
                activeNames.push(...currentLocConfig.valve2HighlightSurfaces);
            }
            break;
        default:
            const isCompromised = currentState[currentLocConfig.MetaLocation]?.Compromised;
            if (isCompromised && currentLocConfig.highlightSurfaceNames) {
                activeNames.push(...currentLocConfig.highlightSurfaceNames);
            }
    }

    return activeNames;
}

export default function Cyberscene() {
    const { scene } = useGLTF(MODEL_PATH);
    const { state } = useScenarios();
    const modelRef = useRef();
    const [activeMaterialObjects, setActiveMaterialObjects] = React.useState([]);

    useEffect(() => {
        if (!scene || !state) return;
        const objectNamesToHighlight = determineActiveObjectNames(state);
        const materialsToHighlight = [];

        objectNamesToHighlight.forEach(name => {
            const object = scene.getObjectByName(name);
            if (object) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => materialsToHighlight.push(mat));
                } else if (object.material) {
                    materialsToHighlight.push(object.material);
                }
            }
        });

        setActiveMaterialObjects(Array.from(new Set(materialsToHighlight)));
    }, [state, scene]);

    const getVideoIdFromPath = (path) => {
        if (!path) return null;
        const parts = path.split('/');
        const filename = parts.pop();
        return filename.split('.')[0];
    };

    if (!scene) return null;

    //find title for the current MetaLocation
    const currentConfig = scenarioAnnotationList.find(
        loc => loc.MetaLocation === state.MetaLocation
    );
    const displayName = currentConfig?.title || state.MetaLocation;

    return (
        <>
            <primitive
                ref={modelRef}
                object={scene}
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                scale={[1, 1, 1]}
            />
            <HighlightManager highlightedMaterialObjects={activeMaterialObjects} isActive={true} />

            {/*
            <Html fullscreen>
                <div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    minWidth: '100px',
                    padding: '8px 36px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: 'rgba(0, 0, 0, 0.85)',
                    border: '2px solid #00eaff',
                    borderRadius: '6px',
                    boxShadow: `
                        0 0 4px #00eaff,
                        0 0 8px #00eaff,
                        0 0 12px #00eaff
                    `,
                    clipPath: 'polygon(0% 0%, 88% 0%, 100% 15%, 100% 100%, 12% 100%, 0% 85%)',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transition: 'all 0.3s ease'
                }}
                >
                {displayName}
                </div>
            </Html>*/}


            {state.MetaLocation === "Valves" && (
                <>
                    <Html
                        position={[13, 8.2, 22]} 
                        center
                        transform
                        distanceFactor={10}
                        rotation={[0, Math.PI, 0]}
                    >
                        <div style={{
                            backgroundImage: `url(${tankLabel})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            width: '220px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            textAlign: 'center',
                            pointerEvents: 'none',
                            userSelect: 'none',
                        }}>
                            Crude Oil Storage Tank
                        </div>
                    </Html>
                    <Html
                    position={[13, 6.5, 22]}
                    center
                    rotation={[0, Math.PI, 0]}
                    distanceFactor={10}
                    transform
                    >
                    <div
                        style={{
                        backgroundImage: `url(${tankLabel1})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: '220px',
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        }}
                    >
                        <div style={{ fontSize: '10px' }}>Tank 1</div>
                        <div style={{ fontSize: '20px' }}>{state.Valves?.Tank1}%</div>
                    </div>
                    </Html>

                    <Html
                    position={[17, 4.25, 22]}
                    center
                    transform
                    distanceFactor={10}
                    rotation={[0, Math.PI, 0]}
                    >
                    <div
                        style={{
                        backgroundImage: `url(${valveLabel})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: '180px',
                        height: '50px',
                        display: 'flex',
                        flexDirection: 'column', // Stack vertically
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        }}
                    >
                        <div style={{ fontSize: '10px' }}>Valve 1</div>
                        <div style={{ fontSize: '20px' }}>{state.Valves?.Valve1 ? 1 : 0}</div>
                    </div>
                    </Html>

                    <Html
                        position={[32, 8.2, 22]}
                        center
                        transform
                        distanceFactor={10}
                        rotation={[0, Math.PI, 0]}
                    >
                        <div style={{
                            backgroundImage: `url(${tankLabel})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            width: '220px',
                            height: '60px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            textAlign: 'center',
                            pointerEvents: 'none',
                            userSelect: 'none',
                        }}>
                            Crude Oil Storage Tank
                        </div>
                    </Html>
                    <Html
                    position={[33, 6.5, 22]}
                    center
                    rotation={[0, Math.PI, 0]}
                    distanceFactor={10}
                    transform
                    >
                    <div
                        style={{
                        backgroundImage: `url(${tankLabel1})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: '220px',
                        height: '60px',
                        display: 'flex',
                        flexDirection: 'column', // vertical stack
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        }}
                    >
                        <div style={{ fontSize: '10px' }}>Tank 2</div>
                        <div style={{ fontSize: '20px' }}>{state.Valves?.Tank2}%</div>
                    </div>
                    </Html>

                    <Html
                    position={[20, 4.25, 22]}
                    center
                    transform
                    distanceFactor={10}
                    rotation={[0, Math.PI, 0]}
                    >
                    <div
                        style={{
                        backgroundImage: `url(${valveLabel})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        width: '180px',
                        height: '50px',
                        display: 'flex',
                        flexDirection: 'column', // Stack vertically
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        }}
                    >
                        <div style={{ fontSize: '10px' }}>Valve 2</div>
                        <div style={{ fontSize: '20px' }}>{state.Valves?.Valve2 ? 1 : 0}</div>
                    </div>
                    </Html>

                </>
            )}

            {scenarioAnnotationList.map(location => {
                if (!location.videoSurfaceName) return null;

                const part = scene.getObjectByName(location.videoSurfaceName);
                if (!part || !part.material) return null;

                const isLocationActive = state.MetaLocation === location.MetaLocation;
                const isCompromised = state[location.MetaLocation]?.Compromised;
                const isRansomware = state.Ransomware;

                let videoId = null;
                if (isLocationActive) {
                    videoId =  isRansomware ? getVideoIdFromPath(location.ransomware_clip?.[0]) : isCompromised
                        ? getVideoIdFromPath(location.compromised_clip?.[0])
                        : getVideoIdFromPath(location.normal_clip?.[0]);
                }

                return videoId ? (
                    <VideoSurface
                        key={`${location.MetaLocation}-${videoId}`}
                        mesh={part}
                        videoId={videoId}
                        isActive={isLocationActive}
                        loop={true}
                        autoplay={true}
                    />
                ) : null;
            })}
        </>
    );
}

useGLTF.preload(MODEL_PATH)
