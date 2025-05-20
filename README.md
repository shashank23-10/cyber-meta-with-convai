JSON Parameters.
{
    "MetaLocation":"OT-Network",
   "Internet":{}
   "IT-Network": {
       "Compromised":true
   },
   "OT-Network": {
       "Compromised":true
   },
   "Workstation": {
       "USB": true,
       "Compromised":true
   },
   "Valves": {
           "Valve1": true,
           "Valve2": true,
           "Tank1": 80,
           "Tank2": 80,
   },
   "Pre-Heater":{
		"Preheater": true,
        "Distillation": true,
        "Flare": true,
   }
}

Locations:
The location in the metaverse is controlled via the “MetaLocation” parameter in the JSON, this can be set to Internet, IT-Network, OT-Network, Workstation, Valves, or Pre-Heater. Based on the value set for this parameter the user is loaded in the respective locations.
Internet: The environment contains a dark room with a single computer with multiple terminal windows
IT-Network: The user is loaded in the IT work in front of the workstations.
OT-Network: The user is loaded in the control room facing the server room.
Workstation: The user is loaded in the control room facing the SCADA and other displays.
Valves: The user is loaded in the plant, near the storage tanks and the valves.
Pre-Heater: The user is loaded in the plant, near the preheater and the distillation column.

Scenario 1 (Full Scenario)
Attacker moves from the Internet to IT-Network, then from the IT network to the OT Network, and finally compromising the PLC tags to impact the process in the refinery.
Scene 1:
"MetaLocation":"Internet"
In the beginning the user is loaded in the Internet location where the we can see a computer in a dark room with multiple terminal/Command prompt windows open (Any generic hacker looking scene).
Scene 2:
"MetaLocation":"IT-Network"
The user is loaded in the IT room in front of the desks, where the computer plays a predefined video recording.
"IT-Network": {
"Compromised":true
}
When the above parameter is set to false, a normal video recording of a computer screen is displayed on the monitor. Showing normal working.
When the above parameter is set to true, indicates that the system has been compromised, in this case play a different video, which shows multiple command prompts opening and closing indicating the attack.
If “Compromised” is false, play video 1 on the IT system.
If ”Compromised” is true play video 2 on the IT system.
Alert message: “A unauthorized user has gained access to the IT network”.

Scene 3:
"MetaLocation":"OT-Network"
"OTNetwork": {
"Compromised":true
},

Load the user in the OT-Network, if the compromised it true, load the user in the control room, but the user should be facing the server room. if the “Compromised” parameter is set to false, no animations and alerts need to be shown, when it is set to true, show the server highlighted in red outlines, indicating that the OT-Network has been compromised.
If “Compromised” is false, show the server room in normal colors.
If ”Compromised” is true, show the servers in server room blinking red.
Alert message: An unauthorized used has gained access to the OT network.

Scene 4:
"MetaLocation":" Workstation ",
"Workstation": {
"USB": false,
"Compromised":true
},

Load the user in the control room, point the users view towards the SCADA and other screens in the control room. if the “Compromised” parameter is set to false, play a video that shows a normal working of the screens, if the parameter is set to true, play a different video that shows abnormal behavior.
Alert message: An unauthorized used has gained access to the OT network.
If “USB” is false.
And if “Compromised” is false, play video 1 on the IT system.
And if ”Compromised” is true, play video 2 on the IT system.

Scene 5:
"MetaLocation":" Valves "
Load the user in the refinery, pointing the users view towards the storage tanks and the valves.
"PLC": {
"Tags": {
"Valve1": true,
"Valve2": true,
"Tank1": 80,
"Tank2": 80,
}
}

Valves 1 and 2 show the status of the valves connected to the storage tanks, when the value of valve1 and valve2 parameter is true, that indicated normal working. When these parameters are set to false, indicates that the valves have been shut, and the storage tanks are overflowing. When the value is set to false, highlight the valves and the storage tanks in red, indicating the compromised components.
if “Valve1” and “Valve2” is true, show the plant tanks and valves in normal colors.
if “Valve1” and “Valve2” is false, show the plant tanks and valves blinking in red colors.
Value of tank1 and tank2 to be displayed near the tanks.
Alert-Message: the attacker has compromised the out valves of the crude oil storage tanks

Scene 6:
"MetaLocation":" Pre-Heater "
Load the user in the refinery, pointing the users view towards the preheater unit and the distillation column.
"PLC": {
"Tags": {
"Preheater": true,
"Distillation": true,
"Flare": true,
}
}

The preheater parameter is set to true, indicates that the preheater unit is working and enabled, when the attacker compromises the preheater the preheater, distillation, flare parameters are set to false, indicating that these components have been shut down. When compromised, show the compromised components blinking in red color.
if “Preheater” is true, show the preheater in normal colors.
if “Preheater” is false, show the preheater blinking in red colors.
if “Distillation” is true, show the Distillation in normal colors.
if “Distillation” is false, show the Distillation blinking in red colors.
if “Flare” is true, show the Flare in normal colors.
if “Flare” is false, show the Flare blinking in red colors.
Alert-message: an attacker has compromised the distillation process and shut down critical components.

Ransomware Scenario
Scene 1:
"MetaLocation":"IT-Network, OT-Network, Workstation, Valves, or Pre-Heater”.
The user can be loaded in any location, initially the user is loaded in the Workstation location.
"Ransomeware":false

When the ransomware parameter is set to false, no animations or alerts are shown, everything is working normally.
When the ransomware parameter is set to true, when the user is in the IT-Network, show the ransomware video on the IT system screen, similarly play the same ransomware video on all the screens in all the locations.
When the user is in the Valve or Pre-Heater location, highlight all components in the plant and show that the plant is not operational.
Alert-message: an attacker has compromised the distillation process and shut down critical components.
if “Ransomeware” is false, load the use to the location, when the user is in IT-Network, OT-Network, Workstation locations, play video 1. And Valves, or Pre-Heater location show the components in normal colors.
if “Ransomeware” is true, load the use to the location, when the user is in IT-Network, OT-Network, Workstation locations, play video 3(Ransomware message), And Valves, or Pre-Heater location show the components blinking in red color.

Video is 3rd vide, explain.

USB Scenario.
"MetaLocation":"Workstation”
The user is loaded in the workstation location, the users view is pointed towards the CPU kept on the desk next to the workstation, the user is shown a USB device that has been plugged in to the desktop.
"Workstation": {
"USB": true,
"Compromised":true
},

When the USB parameter is set to true, show a USB device plugged in to the desktop/CPU. If the USB parameter is set to false, no USB is shown. Normal working video is played.
When the Compromised parameter is set to false, play video 1 showing normal working, when the compromised parameter is set to true, indicating attacker has compromised the system, play video 2 which shows random command prompts popping up indicating compromise.
If “USB” is true, show a USB device plugged into the CPU.
And if “Compromised” is false, play video 1 on the IT system.
And if ”Compromised” is true, play video 2 on the IT system.

After this,
Reuse scene 5 and scene 6 from Scenario 1.
