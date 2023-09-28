"use client"

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';
import { BiMap } from "react-icons/bi"

// A condicional para garantir que o código só seja executado no lado do cliente
let L;
let Icon: new (arg0: { iconUrl: string; iconSize: number[]; }) => any;
if (typeof window !== "undefined") {
  L = require('leaflet');
  Icon = L.Icon;
}

type ESP = {
  _id: string;
  lat: number;
  long: number;
  readings: {
    temperatura: number;
    umidade: number;
    data: Date;
  }[];
};

function calculateBounds(espData: ESP[]): [[number, number], [number, number]] | null {
  if (espData.length === 0) return null;

  const lats = espData.map(esp => esp.lat);
  const lngs = espData.map(esp => esp.long);

  return [
    [Math.min(...lats), Math.min(...lngs)],
    [Math.max(...lats), Math.max(...lngs)]
  ];
}

function BoundsSetter({ bounds }: { bounds: [[number, number], [number, number]] | null }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);

  return null;
}

function createSvgIcon(svg: JSX.Element) {
  const svgString = ReactDOMServer.renderToString(svg);
  const iconUrl = new URL(`data:image/svg+xml;base64,${btoa(svgString)}`);

  // A condicional para garantir que o código só seja executado no lado do cliente
  if (Icon) {
    return new Icon({
      iconUrl: iconUrl.href,
      iconSize: [30, 30]
    });
  }
  return null;
}

export default function Previsao() {
  const [espData, setEspData] = useState<ESP[]>([]);

  useEffect(() => {
    const fetchEspData = async () => {
      try {
        toast.info('Buscando ESPs...');
        const response = await fetch('/api/getIds');
        const ids: string[] = await response.json();
        toast.success('ESPs carregados com sucesso!');

        // Now, fetch the data for each ESP
        const espDataPromises = ids.map(id => fetch(`/api/getDados`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id }),
        }).then(res => res.json()));

        const allEspData: ESP[] = await Promise.all(espDataPromises);
        setEspData(allEspData);
      } catch (error) {
        toast.error('Erro ao buscar ESPs.');
      }
    };

    fetchEspData();
  }, []);

  const bounds = calculateBounds(espData);

  const beerIcon = createSvgIcon(<BiMap />);

  return (
    <div>
      <MapContainer style={{ width: '650px', height: '400px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {espData.map(esp => (
          <Marker key={esp._id} position={[esp.lat, esp.long]} icon={beerIcon}>
            <Popup>
              ESP: {esp._id}
            </Popup>
          </Marker>
        ))}
        <BoundsSetter bounds={bounds} />
      </MapContainer>
    </div>
  );
}