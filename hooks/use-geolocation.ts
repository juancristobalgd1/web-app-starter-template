import { useState } from "react";

export function useGeolocation() {
  const [loadingLocation, setLoadingLocation] = useState(false);

  const getLocation = (onSuccess: (location: string) => void) => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          let locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          try {
            // Using OpenStreetMap Nominatim for reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`
            );

            if (response.ok) {
              const data = await response.json();
              if (data.address) {
                const city =
                  data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  data.address.municipality ||
                  "";
                const country = data.address.country || "";

                if (city && country) {
                  locationString = `${city}, ${country}`;
                } else if (data.display_name) {
                  locationString = data.display_name.split(",").slice(0, 3).join(",");
                }
              }
            }
          } catch (e) {
            console.warn("Reverse geocoding failed", e);
          }

          onSuccess(locationString);
        } catch (error) {
          console.error("Error processing location:", error);
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error obtaining location:", error);
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return { getLocation, loadingLocation };
}
