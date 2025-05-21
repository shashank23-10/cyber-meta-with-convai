import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useConvaiClient } from "./hooks/useConvaiClient";
import { Experience } from "./components/Experience";
import ChatBubble from "./components/chat/Chat";
import { FaMicrophone } from "react-icons/fa";
import InsertCommentIcon from '@mui/icons-material/InsertComment';

const ConvAiIntegration = () => {
const convaiApiKey = "40fb8118ec1dbc8b4b76a13208efdd0d";
const characterId = "ad24dcfc-2f15-11f0-b949-42010a7be01f";
const { client } = useConvaiClient(characterId, convaiApiKey);

const [panelOpen, setPanelOpen] = useState(true);
const [listening, setListening] = useState(false);

useEffect(() => {
const down = e => e.key.toLowerCase() === "t" && setListening(true);
const up   = e => e.key.toLowerCase() === "t" && setListening(false);

window.addEventListener("keydown", down);
window.addEventListener("keyup",   up);
return () => {
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup",   up);
};
}, []);

const styles = {
openBtn: {
    position: "absolute", right: 36, bottom: 36,
    width: 24, height: 24,
    cursor: "pointer", zIndex: 1100,
},
openIcon: {
    width: "100%", height: "100%",
    padding: "12px",
    border: "2px solid #e8b403",
    borderRadius: "50%",
    color: "#e8b403",
},
panelBodyContainer: {
    position: "absolute", right: 25, bottom: 75,
    width: "24vw", height: "65vh",
    background: "transparent", zIndex: 1050,
    display: "flex", flexDirection: "column",
    padding: "30px 0",
},
panelBody: {
    flex: 1,
    padding: "0.75rem 2rem",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
},
body: { flex: 1, display: "flex", flexDirection: "column" },
avatarContainer: { flex: 1.6, position: "relative" },
avatarCanvas: { width: "100%", height: "100%", background: "transparent" },
talkHint: {
    position: "absolute", bottom: 4,
    width: "100%", display: "flex",
    justifyContent: "center", alignItems: "center",
    zIndex: 5,
},
talkBox: {
    display: "flex", alignItems: "center", gap: 8,
    borderRadius: 30, padding: "6px 12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s ease",
},
micWrapper: {
    width: 24, height: 24, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    backgroundColor: "#e74c3c",
},
micInActive: { color: "#fff", fontSize: "14px" },
micActive:   { color: "#fff", fontSize: "14px", animation: "pulse 1s infinite" },
talkText:    { fontSize: "0.85rem", color: "#fff" },
chatContainer: {
    flex: 0.5, paddingLeft: "8px", background: "transparent",
},
};

return (
<>
    <div style={styles.openBtn} onClick={() => setPanelOpen(!panelOpen)}>
    <InsertCommentIcon style={styles.openIcon} />
    </div>

    {panelOpen && (
    <div style={styles.panelBodyContainer}>
        <div style={styles.panelBody}>
        <KeyboardControls map={[
            { name: "forward",  keys: ["ArrowUp","w"] },
            { name: "backward", keys: ["ArrowDown","s"] },
            { name: "left",     keys: ["ArrowLeft","a"] },
            { name: "right",    keys: ["ArrowRight","d"] },
            { name: "sprint",   keys: ["Shift"] },
            { name: "jump",     keys: ["Space"] },
        ]}>
            <div style={styles.body}>
            <div style={styles.avatarContainer}>
                <Canvas
                style={styles.avatarCanvas}
                shadows gl={{ alpha: true }}
                camera={{ position: [0, 0.026, 1.8], fov: 25 }}
                >
                <Experience client={client} />
                </Canvas>
                <div style={styles.talkHint}>
                <div
                    style={{
                    ...styles.talkBox,
                    backgroundColor: listening
                        ? "rgba(159, 158, 156, 0.8)"
                        : "rgba(159, 158, 156, 0.6)"
                    }}
                >
                    <div style={styles.micWrapper}>
                    <FaMicrophone style={listening ? styles.micActive : styles.micInActive} />
                    </div>
                    <span style={styles.talkText}>
                    Press <strong>[T]</strong> to talk
                    </span>
                </div>
                </div>
            </div>
            <div style={styles.chatContainer}>
                <ChatBubble client={client} chatHistory="Show" />
            </div>
            </div>
        </KeyboardControls>
        </div>
    </div>
    )}
</>
);
};

export default ConvAiIntegration;