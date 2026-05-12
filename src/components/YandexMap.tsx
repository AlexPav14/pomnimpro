"use client";

import { useEffect, useRef } from "react";

interface Burial {
  id: string;
  full_name: string;
  lat: number;
  lng: number;
  birth_date: string | null;
  death_date: string | null;
}

interface Props {
  burials: Burial[];
}

declare global {
  interface Window {
    ymaps: any;
    ymapsReady: boolean;
  }
}

export default function YandexMap({ burials }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new window.ymaps.Map(mapRef.current, {
        center: [64.5401, 40.5182],
        zoom: 10,
        controls: ["zoomControl", "fullscreenControl"],
      });

      mapInstanceRef.current = map;

      burials.forEach(burial => {
        const birthYear = burial.birth_date ? new Date(burial.birth_date).getFullYear() : null;
        const deathYear = burial.death_date ? new Date(burial.death_date).getFullYear() : null;
        const years = birthYear && deathYear ? `${birthYear}–${deathYear}` : "";

        const placemark = new window.ymaps.Placemark(
          [burial.lat, burial.lng],
          {
            balloonContentHeader: burial.full_name,
            balloonContentBody: years,
            balloonContentFooter: `<a href="/burial/${burial.id}" style="color:#1E3A5F;font-size:12px;">Открыть паспорт →</a>`,
            hintContent: burial.full_name,
          },
          {
            preset: "islands#darkBlueCircleDotIcon",
          }
        );

        map.geoObjects.add(placemark);
      });
    }

    if (window.ymaps) {
      window.ymaps.ready(initMap);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_KEY}&lang=ru_RU`;
    script.async = true;
    script.onload = () => window.ymaps.ready(initMap);
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [burials]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: "460px" }}
    />
  );
}
