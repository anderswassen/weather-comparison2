'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeocodeResult } from '@/lib/types';

interface LocationMapProps {
  location1: GeocodeResult | null;
  location2: GeocodeResult | null;
}

export function LocationMap({ location1, location2 }: LocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on Sweden
    mapRef.current = L.map(mapContainerRef.current).setView([62.5, 17.5], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const bounds: L.LatLngExpression[] = [];

    // Create blue marker icon for location 1
    const blueIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Create red marker icon for location 2
    const redIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    if (location1) {
      const marker = L.marker([location1.coordinates.lat, location1.coordinates.lon], {
        icon: blueIcon,
      })
        .addTo(mapRef.current)
        .bindPopup(location1.name);
      markersRef.current.push(marker);
      bounds.push([location1.coordinates.lat, location1.coordinates.lon]);
    }

    if (location2) {
      const marker = L.marker([location2.coordinates.lat, location2.coordinates.lon], {
        icon: redIcon,
      })
        .addTo(mapRef.current)
        .bindPopup(location2.name);
      markersRef.current.push(marker);
      bounds.push([location2.coordinates.lat, location2.coordinates.lon]);
    }

    // Fit map to show all markers
    if (bounds.length === 2) {
      mapRef.current.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [50, 50] });
    } else if (bounds.length === 1) {
      mapRef.current.setView(bounds[0] as L.LatLngExpression, 8);
    }
  }, [location1, location2]);

  return (
    <div className="relative isolate z-0 h-full min-h-[300px] w-full overflow-hidden rounded-lg">
      <div ref={mapContainerRef} className="h-full w-full" />
      {!location1 && !location2 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-800/80">
          <p className="text-gray-500 dark:text-gray-400">Select locations to see them on the map</p>
        </div>
      )}
    </div>
  );
}
