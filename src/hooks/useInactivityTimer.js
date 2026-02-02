import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useCart } from '../context/CartContext';
import { INACTIVITY_TIMEOUT_MS } from '../config/appConfig';

export const useInactivityTimer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetSession } = useSession();
    const { clearCart } = useCart();

    const resetApp = useCallback(() => {
        // Only reset if we are not already at the splash screen
        if (location.pathname !== '/') {
            console.log('Inactivity timeout - resetting app');
            resetSession();
            clearCart();
            navigate('/');
        }
    }, [navigate, resetSession, clearCart, location.pathname]);

    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(resetApp, INACTIVITY_TIMEOUT_MS);
        };

        // Events to listen for
        const events = ['mousemove', 'mousedown', 'touchstart', 'keydown', 'click', 'scroll'];

        // Attach listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Initial start
        resetTimer();

        // Cleanup
        return () => {
            clearTimeout(timeoutId);
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [resetApp]);
};
