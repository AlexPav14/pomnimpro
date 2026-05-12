"use client";

import dynamic from "next/dynamic";

const YandexMap = dynamic(() => import("@/components/YandexMap"), { ssr: false });

interface Burial {
  id: string;
  full_name: string;
  lat: number;
  lng: number;
  birth_date: string | null;
  death_date: string | null;
}

export default function MapWrapper({ burials }: { burials: Burial[] }) {
  return <YandexMap burials={burials} />;
}
