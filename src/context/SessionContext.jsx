import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const [measurementMode, setMeasurementMode] = useState(null); // 'manual' | 'camera'
    const [measurements, setMeasurements] = useState(null);
    const [scannedImage, setScannedImage] = useState(null);
    const [scannedImages, setScannedImages] = useState({
        front: null,
        left: null,
        right: null
    });

    const startSession = (mode) => {
        setMeasurementMode(mode);
    };

    const saveMeasurements = (data) => {
        setMeasurements(data);
    };

    const saveScannedImage = (image) => {
        setScannedImage(image);
    };

    const saveStepImage = (step, image) => {
        setScannedImages(prev => ({
            ...prev,
            [step]: image
        }));
    };

    const resetSession = () => {
        setMeasurementMode(null);
        setMeasurements(null);
        setScannedImage(null);
        setScannedImages({
            front: null,
            left: null,
            right: null
        });
        // Any other session cleanup
    };

    return (
        <SessionContext.Provider value={{
            measurementMode,
            measurements,
            scannedImage,
            scannedImages,
            startSession,
            saveMeasurements,
            saveScannedImage,
            saveStepImage,
            resetSession
        }}>
            {children}
        </SessionContext.Provider>
    );
};
