import React from 'react';
import locationBox from '../assets/location_pop_up.png'; // Your location box background

const Location = ({
location = 'Pre-Heater',
visible = true,
position = { bottom: '20px', left: '20px' },
}) => {
if (!visible) return null;

return (
<div
    style={{
    position: 'fixed',
    zIndex: 10000,
    ...position,
    width: 'max-content',
    minWidth: '180px',
    maxWidth: '280px',
    padding: '16px 24px',
    color: '#fff',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: '16px',
    backgroundImage: `url(${locationBox})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    textAlign: 'center',
    pointerEvents: 'none',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)',
    transition: 'all 0.3s ease-in-out',
    }}
>
    {location}
</div>
);
};

export default Location;
