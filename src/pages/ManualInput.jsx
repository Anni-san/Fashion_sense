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

    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Allow only numbers
        if (value === '' || /^\d+$/.test(value)) {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleBlur = (e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    const isFormValid = Object.values(formData).every(val => val.length > 0);

    const handleSubmit = () => {
        if (isFormValid) {
            saveMeasurements(formData);
            navigate('/processing');
        } else {
            // Mark all as touched to show errors
            const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
            setTouched(allTouched);
        }
    };

    return (
        <PageWrapper showHeader={true} showFooter={false}>
            <div className={styles.container}>
                <div className={styles.stepIndicator}>Step 1 of 3</div>
                <h2 className={styles.heading}>Enter measurements</h2>

                <div className={styles.formGrid}>
                    <InputGroup
                        label="Height" unit="cm" name="height"
                        value={formData.height} onChange={handleChange} onBlur={handleBlur}
                        error={touched.height && !formData.height}
                    />
                    <InputGroup
                        label="Weight" unit="kg" name="weight"
                        value={formData.weight} onChange={handleChange} onBlur={handleBlur}
                        error={touched.weight && !formData.weight}
                    />
                    <InputGroup
                        label="Chest" unit="cm" name="chest"
                        value={formData.chest} onChange={handleChange} onBlur={handleBlur}
                        error={touched.chest && !formData.chest}
                    />
                    <InputGroup
                        label="Waist" unit="cm" name="waist"
                        value={formData.waist} onChange={handleChange} onBlur={handleBlur}
                        error={touched.waist && !formData.waist}
                    />
                    <InputGroup
                        label="Hips" unit="cm" name="hips"
                        value={formData.hips} onChange={handleChange} onBlur={handleBlur}
                        error={touched.hips && !formData.hips}
                    />
                </div>

                <div className={styles.actionArea}>
                    <PrimaryButton onClick={handleSubmit} disabled={!isFormValid} style={{ maxWidth: '400px' }}>
                        Continue
                    </PrimaryButton>
                </div>
            </div>
        </PageWrapper>
    );
};

const InputGroup = ({ label, unit, name, value, onChange, onBlur, error }) => (
    <div className={`${styles.inputGroup} ${error ? styles.error : ''}`}>
        <label>{label}</label>
        <div className={styles.inputWrapper}>
            <input
                type="text"
                inputMode="numeric"
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                autoComplete="off"
            />
            <span className={styles.unit}>{unit}</span>
        </div>
    </div>
);

export default ManualInput;
