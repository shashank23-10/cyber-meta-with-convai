// Central configuration for scenarios and video paths
export const scenarioAnnotationList = [
  {
    title: "Internet",
    MetaLocation: "Internet",
    description: "A dark room with a single computer and multiple terminal windows open.",
    position: [-19.5, 2, 38],
    lookAt: [-17, 2, 50],
    videoSurfaceName: "Screens",
    highlightSurfaceNames: [],
    normal_clip: ["/videos/normal.mp4"],
    compromised_clip: ["/videos/compromised.mp4"],
    ransomware_clip: ["/videos/ransomware.mp4"],
  },
  {
    title: "IT-Network",
    MetaLocation: "IT-Network",
    description: "An office with multiple workstations and monitors.",
    position: [-18, 2, 28],
    lookAt: [-13, 2, 28],
    videoSurfaceName: "IT_Doorwall001_2",
    highlightSurfaceNames: [], //["Workstation_1", "Workstation_2"],
    normal_clip: ["/videos/normal.mp4"],
    compromised_clip: ["/videos/compromised.mp4"],
    ransomware_clip: ["/videos/ransomware.mp4"],
  },
  {
    title: "OT-Network",
    MetaLocation: "OT-Network",
    description: "The control room facing the server rack.",
    position: [-15, 2, 29],
    lookAt: [-21, 2, 30],
    videoSurfaceName: null,
    highlightSurfaceNames: ["IT_Doorwall001_33"],
    normal_clip: ["/videos/normal.mp4"],
    compromised_clip: ["/videos/compromised.mp4"],
    ransomware_clip: ["/videos/ransomware.mp4"],
  },
  {
    title: "Workstation",
    MetaLocation: "Workstation",
    description: "Control room workstation showing SCADA and other displays.",
    position: [-21.5, 2, 13],
    lookAt: [-30, 2, 13.0],
    videoSurfaceName: "Roof_Circle_Light_38_4",
    highlightSurfaceNames: [], //["Main_Desk_1", "Main_Desk_2"],
    normal_clip: ["/videos/normal.mp4"],
    compromised_clip: ["/videos/compromised.mp4"],
    ransomware_clip: ["/videos/ransomware.mp4"],
  },
  {
    title: "Valves",
    MetaLocation: "Valves",
    description: "Plant area near storage tanks and their valves.",
    position: [19.7, 3.5, 2.9],
    lookAt: [25, 5.5, 28],
    videoSurfaceName: null,
    valve1HighlightSurfaces: ["Supply_Pipes_40"],
    valve2HighlightSurfaces: ["Supply_Pipes_39"],
    Tank1: 80,
    Tank2: 80,
    highlightSurfaceNames: [],
    normal_clip: ["/videos/normal.mp4"],
    compromised_clip: ["/videos/compromised.mp4"],
    ransomware_clip: ["/videos/ransomware.mp4"],
  },
  {
    title: "Pre-Heater",
    MetaLocation: "Pre-Heater",
    description: "Plant area near the preheater unit and distillation column.",
    position: [17.8, 3.5, -2.9],
    lookAt: [-7, 8.5, -26],
    videoSurfaceName: null,
    preheaterHighlightSurfaces: ["Supply_Pipes_27", "Supply_Pipes_28"],
    distillationHighlightSurfaces: ["Supply_Pipes_14"],
    flareHighlightSurfaces: ["Supply_Pipes_5", "Supply_Pipes_3"],
    highlightSurfaceNames: [],
    normal_clip: ["/videos/normal.mp4"],
    compromised_clip: ["/videos/compromised.mp4"],
    ransomware_clip: ["/videos/ransomware.mp4"],
  },
];

export const fullScenarioConfig = {
  "Internet": {},
  "IT-Network": { compromised: true },
  "OT-Network": { compromised: true },
  "Workstation": { compromised: true },
  "Valves": { Valve1: false, Valve2: false, Tank1: 80, Tank2: 80 },
  "Pre-Heater": { preheater: true, distillation: true, flare: true },
};

export const ransomwareScenarioConfig = {
  "Internet": { compromised: true, ransomware_clip: true },
  "IT-Network": { compromised: true, ransomware_clip: true },
  "OT-Network": { compromised: true, ransomware_clip: true },
  "Workstation": { compromised: true, ransomware_clip: true },
};

export const INITIAL_STATE = {
  "MetaLocation": "Internet",
  "Ransomware": false,
  "IT-Network": {
    Compromised: false,
    ActiveAlerts: [],
  },
  "OT-Network": {
    Compromised: false,
    ActiveAlerts: [],
  },
  "Workstation": {
    Compromised: false,
    USB: false,
    ActiveAlerts: [],
  },
  "Pre-Heater": {
    Preheater: false,
    Distillation: false,
    Flare: false,
  },
  "Valves": {
    Valve1: true,
    Valve2: true,
    Tank1: 80,
    Tank2: 80,
  },
};
