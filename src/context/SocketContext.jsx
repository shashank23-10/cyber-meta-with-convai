import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);
const receiverUrl = "http://54.235.30.184:8766"; //"http://localhost:8766";
const senderUrl = "http://54.235.30.184:8765"; //"http://localhost:8766";
export const SocketProvider = ({ children }) => {
    const [receiveSocket, setReceiveSocket] = useState(null);
    const [sendSocket, setSendSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [state, setState] = useState({
        MetaLocation: "Internet",
        Internet: {},
        Ransomware: false,
        "IT-Network": { Compromised: false },
        "OT-Network": { Compromised: false },
        Workstation: { USB: false, Compromised: false },
        Valves: { Valve1: true, Valve2: true, Tank1: 80, Tank2: 80 },
        "Pre-Heater": { Preheater: false, Distillation: false, Flare: false }
    });

    const RansomWareState = {
        MetaLocation: "",
        Internet: {},
        Ransomware: true,
        "IT-Network": { Compromised: true },
        "OT-Network": { Compromised: true },
        Workstation: { USB: false, Compromised: true },
        Valves: { Valve1: false, Valve2: false, Tank1: 80, Tank2: 80 },
        "Pre-Heater": { Preheater: true, Distillation: true, Flare: true }
    }

    useEffect(() => {
        // setup receive socket
        const recv = io(receiverUrl, {
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 10,
            withCredentials: false,
            transports: ['websocket', 'polling']
        });

        recv.on('connect', () => {
            console.log('Connected to receive socket');
            setConnected(true);
            setError(null);
            recv.emit('get_initial_state');
        });

        recv.on('connect_error', (err) => {
            console.error('Receive socket error:', err);
            setError(err.message);
            setConnected(false);
        });

        recv.on('disconnect', (reason) => {
            console.log('Receive socket disconnected:', reason);
            setConnected(false);
            if (reason === 'io server disconnect') recv.connect();
        });

        recv.on('json_data', (data) => {
            console.log('Received state update:', data);
            if (data && typeof data === 'object') {
                const validData = Object.entries(data).reduce((acc, [key, value]) => {
                    if (value != null) acc[key] = value;
                    return acc;
                }, {});
                if (Object.keys(validData).length) {
                    if (validData.Ransomware) {
                        RansomWareState.MetaLocation = validData.MetaLocation;
                        setState(prev => ({ ...prev, ...RansomWareState }));
                        console.log('State updated with:', RansomWareState);
                    } else {
                        setState(prev => ({ ...prev, ...validData }));
                        console.log('State updated with:', validData);
                    }

                }
            } else {
                console.error('Invalid state data received:', data);
            }
        });

        setReceiveSocket(recv);

        // setup send socket
        const send = io(senderUrl, {
            withCredentials: false,
            transports: ['websocket', 'polling']
        });
        send.on('connect', () => console.log('Connected to send socket'));
        send.on('connect_error', (err) => console.error('Send socket error:', err));
        send.on('ack', (data) => {
            console.log('Send socket acknowledgment:', data);
        });
        setSendSocket(send);

        return () => {
            recv.off(); recv.close();
            send.off(); send.close();
        };
    }, []);

    const emitStateUpdate = (newState) => {
        if (!sendSocket) {
            console.error('Send socket not initialized');
            return;
        }
        if (!connected) {
            console.warn('Receive socket disconnected, cannot sync state.');
        }

        try {
            console.log('Emitting state update to send socket:', newState);
            sendSocket.emit('json_data', newState);
        } catch (err) {
            console.error('Error emitting state update:', err);
            receiveSocket?.emit('get_initial_state');
        }
    };

    return (
        <SocketContext.Provider
            value={{ receiveSocket, sendSocket, connected, error, state, emitStateUpdate }}
        >
            {children}
        </SocketContext.Provider>
    );
};
