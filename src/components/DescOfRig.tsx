import React from 'react';
import { Vehicle } from '../interfaces/sharedInterfaces';

interface DescOfRigProps {
    rigOfWho: string;
    rig: Vehicle | undefined;
};

const DescOfRig: React.FC<DescOfRigProps> = ({ rigOfWho, rig}): React.ReactElement => {

    return (
        <>
            <h4>{rigOfWho}</h4>
            <p>{rig?.desc}</p>
            {rig?.descImg && (
                <img
                    src={`${process.env.PUBLIC_URL}/img/${rig?.descImg}`}
                    alt={`${rig.name} description`}
                    style={{ maxWidth: '200px' }}
                />
            )}
        </>
    );
}

export default DescOfRig;