import { useState, useCallback } from 'react';

export interface GeolocationState {
  loading: boolean;
  coords: { latitude: number; longitude: number } | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    coords: null,
    error: null,
  });

  const getCurrentLocation = useCallback((onSuccess?: (lat: number, lon: number) => void) => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        coords: null,
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setState({
          loading: false,
          coords,
          error: null,
        });
        if (onSuccess) {
          onSuccess(coords.latitude, coords.longitude);
        }
      },
      (error) => {
        let errorMsg = 'Failed to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission was denied. You can search for your city above.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            errorMsg = 'The request to get user location timed out.';
            break;
        }
        setState({
          loading: false,
          coords: null,
          error: errorMsg,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    getCurrentLocation,
    clearError,
  };
}
