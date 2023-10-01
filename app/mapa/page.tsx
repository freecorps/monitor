"use client"

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';
import { BiMap } from "react-icons/bi"
import * as ml5 from 'ml5';

export async function getServerSideProps() {
  return { props: {} };
}

function ClientOnly({ children, ...delegated }: any) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}

import dynamic from 'next/dynamic';
import { MapContainer as OriginalMapContainer, TileLayer, Marker, useMap, Popup, useMapEvents } from 'react-leaflet';

const MapContainer = dynamic(() => Promise.resolve(OriginalMapContainer), {
  ssr: false,  // Isso garantirá que o MapContainer só seja renderizado no lado do cliente
  loading: () => <p>Carregando...</p>
});


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
  const [modelAI, setModel] = useState<any>(null);

  // Inicialize o modelo aqui
  const neuralNetworkOptions = {
    inputs: ['lat', 'lng'],
    outputs: ['temperature', 'humidity'],
    task: 'regression',
    debug: true,
    layers: [
      { type: 'dense', units: 32, activation: 'relu' },
      { type: 'dense', units: 16, activation: 'relu' },
      { type: 'dense', units: 2 }
    ]
  };

  const model = ml5.neuralNetwork(neuralNetworkOptions);

  useEffect(() => {
    const fetchEspData = async () => {
      try {
        toast.info('Buscando ESPs...');
        const response = await fetch('/api/getIds');
        const ids: string[] = await response.json();
        toast.success('ESPs carregados com sucesso!');

        const espDataPromises = ids.map(id => fetch(`/api/getDados`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id }),
        }).then(res => res.json()));

        const allEspData: ESP[] = await Promise.all(espDataPromises);
        setEspData(allEspData);

        toast.info('Treinando modelo...');

        allEspData.forEach(esp => {
          esp.readings.forEach(reading => {
            model.addData([esp.lat, esp.long], [reading.temperatura, reading.umidade]);
          });
        });

        model.train(() => {
          console.log('Model trained!');
        });

        toast.success('Modelo treinado com sucesso!');

        setModel(model);

      } catch (error) {
        toast.error('Erro ao buscar ESPs.');
      }
    };

    fetchEspData();
  }, []);

  const handleMapClick = (event: any) => {
    const { lat, lng } = event.latlng;

    if (modelAI) {
      modelAI.predict([lat, lng], (err: any, results: any) => {
        if (err) {
          console.error(err);
          return;
        }

        const predictedTemperature = results[0].value;
        const predictedHumidity = results[1].value;
        toast.success(`Predicted temperature: ${predictedTemperature}`, {
          toastId: 'temperatura'
        });
        toast.success(`Predicted humidity: ${predictedHumidity}`, {
          toastId: 'umidade'
        });
      });
    } else {
      toast.error('Modelo não treinado!');
    }
  };

  const beerIcon = createSvgIcon(<BiMap />);

  function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
      click(event) {
        handleMapClick(event);
      },
      locationfound(e: any) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position} icon={beerIcon}>
        <Popup>
          Você está aqui.
        </Popup>
      </Marker>
    );
  }

  const bounds = calculateBounds(espData);

  return (
    <div>
      <ClientOnly>
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
          <LocationMarker />
        </MapContainer>
      </ClientOnly>
    </div>
  );
}
