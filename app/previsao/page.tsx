"use client"
import React, { useEffect, useState } from 'react';
import { Button, Select, SelectItem, Spacer } from "@nextui-org/react";
import { toast } from 'react-toastify';
import DataCard from '@/components/dataCard';

export default function Previsao() {
  const [espList, setEspList] = useState([]);
  const [selectedEsp, setSelectedEsp] = useState<string | null>(null);
  const [espData, setEspData] = useState(null);

  useEffect(() => {
    const fetchEspList = async () => {
      try {
        toast.info('Buscando ESPs...');
        const response = await fetch('/api/getIds');
        const ids = await response.json();
        setEspList(ids);
        toast.success('ESPs carregados com sucesso!');
      } catch (error) {
        toast.error('Erro ao buscar ESPs.');
      }
    };

    fetchEspList();
  }, []);

  const handleEspChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const espId = event.target.value;
    setSelectedEsp(espId);

    try {
      toast.info(`Buscando dados do ${espId}...`);
      const response = await fetch('/api/getDadosESP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: espId
        }),
      });

      const data = await response.json();
      setEspData(data);
      toast.success(`Dados do ${espId} carregados com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao buscar dados do ${espId}.`);
    }
  };

  return (
    <div className='flex flex-col items-start'>
      <Select
        className='min-w-[350px]'
        label="Selecione um ESP"
        placeholder="Selecione um ESP"
        selectionMode="single"
        value={selectedEsp}
        onChange={handleEspChange}
      >
        {espList.map(espId => (
          <SelectItem key={espId}>
            {espId}
          </SelectItem>
        ))}
      </Select>

      {espData && (
        <div className='mt-4'>
          <h2>Dados do {selectedEsp}</h2>
          <div className='columns-1 gap-4'>
            {Object.keys(espData[0]).filter(key => key !== 'data' && key !== '_id').map(key => (
              <div key={key}>
                <DataCard title={key} data={espData} />
                <Spacer y={1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}