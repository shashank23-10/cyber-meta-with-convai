export const scenarioAnnotationList = [
    {
        MetaLocation: "Internet",
        title: "Internet",
        description: "External network access point",
        position: [-17.1, 1.5, 35.755],
        lookAt: [-18.167, 1.5, 40],
        videoSurfaces: [
            {
                id: "screen1",
                partName: "terminal_screen_1",
                defaultVideo: "/videos/normal.mp4",
                compromisedVideo: "/videos/compromised.mp4"
            }
        ],
        alerts: ["Unauthorized access detected from external network"]
    },
    {
        MetaLocation: "IT-Network",
        title: "IT Network",
        description: "Internal IT infrastructure",
        position: [-17.5, 1.5, 25.5],
        lookAt: [-16.5, 1.5, 27.5],
        videoSurfaces: [
            {
                id: "monitor1",
                partName: "monitor_screen_1",
                defaultVideo: "/videos/normal.mp4",
                compromisedVideo: "/videos/compromised.mp4"
            }
        ],
        highlightParts: [
            {
                id: "itSystem",
                parts: [
                    { name: "computer1", partName: "computer_1" },
                    { name: "computer2", partName: "computer_2" }
                ],
                defaultColor: "#ffffff",
                compromisedColor: "#ff0000"
            }
        ],
        alerts: ["Unauthorized access detected in IT network"]
    },
    {
        MetaLocation: "OT-Network",
        title: "OT Network",
        description: "Operational Technology network",
        position: [-18, 1.5, 15],
        lookAt: [-18, 1.5, 18],
        highlightParts: [
            {
                id: "serverRoom",
                parts: [
                    { name: "server1", partName: "server_1" },
                    { name: "server2", partName: "server_2" },
                    { name: "server3", partName: "server_3" }
                ],
                defaultColor: "#ffffff",
                compromisedColor: "#ff0000"
            }
        ],
        alerts: ["Unauthorized access detected in OT network"]
    },
    {
        MetaLocation: "Workstation",
        title: "Workstation",
        description: "Control system workstation",
        position: [-16.1, 1.5, 13.0],
        lookAt: [-23, 1.5, 13.0],
        videoSurfaces: [
            {
                id: "scada1",
                partName: "scada_screen_1",
                defaultVideo: "/videos/normal.mp4",
                compromisedVideo: "/videos/compromised.mp4"
            },
            {
                id: "scada2",
                partName: "scada_screen_2",
                defaultVideo: "/videos/normal.mp4",
                compromisedVideo: "/videos/compromised.mp4"
            }
        ],
        highlightParts: [
            {
                id: "usb",
                parts: [
                    { name: "usbPort", partName: "usb_port" }
                ],
                defaultColor: "#ffffff",
                activeColor: "#ffff00"
            }
        ],
        alerts: ["Unauthorized access detected at workstation"]
    },
    {
        MetaLocation: "Valves",
        title: "Valves & Tanks",
        description: "Storage tank control system",
        position: [20.460, 2.5, -2.074],
        lookAt: [0.148, 2.5, 14],
        highlightParts: [
            {
                id: "tank1System",
                parts: [
                    { name: "Tank_01_1", partName: "tank_01_1" },
                    { name: "Tank_01_2", partName: "tank_01_2" },
                    { name: "Tank_01_3", partName: "tank_01_3" },
                    { name: "Tank_01_4", partName: "tank_01_4" },
                    { name: "Valve1", partName: "valve_1" }
                ],
                defaultColor: "#ffffff",
                compromisedColor: "#ff0000"
            },
            {
                id: "tank2System",
                parts: [
                    { name: "Tank_02_1", partName: "tank_02_1" },
                    { name: "Tank_02_2", partName: "tank_02_2" },
                    { name: "Tank_02_3", partName: "tank_02_3" },
                    { name: "Tank_02_4", partName: "tank_02_4" },
                    { name: "Valve2", partName: "valve_2" }
                ],
                defaultColor: "#ffffff",
                compromisedColor: "#ff0000"
            }
        ],
        alerts: ["Unauthorized valve control detected"]
    },
    {
        MetaLocation: "Pre-Heater",
        title: "Pre-Heater",
        description: "Process control system",
        position: [-2.340, 1.5, 3.013],
        lookAt: [-2.340, 1.5, 18.013],
        highlightParts: [
            {
                id: "processSystem",
                parts: [
                    { name: "Preheater", partName: "preheater_unit" },
                    { name: "Distillation", partName: "distillation_column" },
                    { name: "Flare", partName: "flare_stack" }
                ],
                defaultColor: "#ffffff",
                compromisedColor: "#ff0000"
            }
        ],
        alerts: ["Unauthorized process control detected"]
    }
]; 