import { useState, useEffect } from 'react';

export interface OrientationState {
  isLandscape: boolean;
  isPortrait: boolean;
  isMobileLandscape: boolean;
  windowWidth: number;
  windowHeight: number;
}

/**
 * デバイスの向きや画面サイズを監視するカスタムフック
 * スマホ横画面（高低比率が小さく横長）の判定を提供
 */
export function useOrientation(): OrientationState {
  const [state, setState] = useState<OrientationState>(() => {
    if (typeof window === 'undefined') {
      return {
        isLandscape: true,
        isPortrait: false,
        isMobileLandscape: false,
        windowWidth: 1024,
        windowHeight: 768,
      };
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isLandscape = width > height;
    return {
      isLandscape,
      isPortrait: !isLandscape,
      isMobileLandscape: isLandscape && height < 550,
      windowWidth: width,
      windowHeight: height,
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      setState({
        isLandscape,
        isPortrait: !isLandscape,
        isMobileLandscape: isLandscape && height < 550,
        windowWidth: width,
        windowHeight: height,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return state;
}
