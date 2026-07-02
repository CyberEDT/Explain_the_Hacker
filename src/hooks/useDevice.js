import { useState, useEffect } from 'react';

/**
 * Custom hook for native-like device detection.
 * Avoids traditional CSS media queries in favor of actual User-Agent parsing
 * for distinct mobile behaviors (like iOS safe areas).
 */
export default function useDevice() {
    const [deviceInfo, setDeviceInfo] = useState({
        isIOS: false,
        isAndroid: false,
        isMobile: false,
        isDesktop: true,
        // SSR safe fallback
        userAgent: '',
    });

    useEffect(() => {
        const ua = window.navigator.userAgent || window.navigator.vendor || window.opera;
        
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
        
        // Detect Android
        const isAndroid = /android/i.test(ua);
        
        // General mobile fallback (includes other mobile platforms)
        const isMobile = isIOS || isAndroid || /webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        
        setDeviceInfo({
            isIOS,
            isAndroid,
            isMobile,
            isDesktop: !isMobile,
            userAgent: ua,
        });
    }, []);

    return deviceInfo;
}
