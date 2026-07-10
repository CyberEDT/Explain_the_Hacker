/**
 * Custom hook for native-like device detection.
 * Avoids traditional CSS media queries in favor of actual User-Agent parsing
 * for distinct mobile behaviors like iOS safe areas.
 */
export default function useDevice() {
    const ua = window.navigator.userAgent || window.navigator.vendor || window.opera;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /android/i.test(ua);
    const isMobile = isIOS || isAndroid || /webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    return {
        isIOS,
        isAndroid,
        isMobile,
        isDesktop: !isMobile,
        userAgent: ua,
    };
}
