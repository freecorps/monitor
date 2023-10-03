"use client"

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

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

const DynamicLeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <p>Carregando...</p>
});

const DynamicML5Predictor = dynamic(() => import('@/components/ML5Predictor'), {
  ssr: false,
  loading: () => <p>Carregando...</p>
});

export default function Previsao() {
  const [espData, setEspData] = useState<ESP[]>([]);
  const mapClickHandlerRef = useRef<(lat: number, lng: number) => void>(() => { });
  const [modelIsTrained, setModelIsTrained] = useState(false);

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

      } catch (error) {
        toast.error('Erro ao buscar ESPs.');
      }
    };

    fetchEspData();
  }, []);

  const handlePrediction = (temperature: number, humidity: number) => {
    toast.success(`Predicted temperature: ${temperature}`, {
      toastId: 'temperatura'
    });
    toast.success(`Predicted humidity: ${humidity}`, {
      toastId: 'umidade'
    });
  };

  return (
    <div>
      <ClientOnly>
        <DynamicML5Predictor
          espData={espData}
          onPrediction={handlePrediction}
          setMapClickHandler={(handler) => { mapClickHandlerRef.current = handler; }}
          setIsModelTrained={setModelIsTrained}
        />
        <DynamicLeafletMap espData={espData} onMapClick={(event) => {
          const { lat, lng } = event.latlng;
          mapClickHandlerRef.current(lat, lng);
        }} />
      </ClientOnly>
    </div>
  );
}
