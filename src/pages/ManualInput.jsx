import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import PageWrapper from '../components/common/PageWrapper';
import PrimaryButton from '../components/common/PrimaryButton';
import styles from './ManualInput.module.css';

const ManualInput = () => {
    const navigate = useNavigate();
    const { saveMeasurements } = useSession();
    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        chest: '',
        waist: '',
        hips: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Allow only numbers
        if (value === '' || /^\d+$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const isFormValid = Object.values(formData).every(val => val.length > 0);

    const handleSubmit = () => {
        if (isFormValid) {
            saveMeasurements(formData);
            navigate('/processing');
        }
    };

    return (
        <PageWrapper showHeader={true} showFooter={false}>
            <div className={styles.container}>
                <h2 className={styles.heading}>Enter your measurements</h2>

                <div className={styles.formGrid}>
                    <div className={styles.inputGroup}>
                        <label>Height (cm)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            placeholder="175"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Weight (kg)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            placeholder="70"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Chest (cm)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="chest"
                            value={formData.chest}
                            onChange={handleChange}
                            placeholder="96"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Waist (cm)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="waist"
                            value={formData.waist}
                            onChange={handleChange}
                            placeholder="80"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Hips (cm)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            name="hips"
                            value={formData.hips}
                            onChange={handleChange}
                            placeholder="95"
                        />
                    </div>
                </div>

                <div className={styles.actionArea}>
                    <PrimaryButton onClick={handleSubmit} disabled={!isFormValid} style={{ maxWidth: '300px' }}>
                        Continue
                    </PrimaryButton>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ManualInput;
