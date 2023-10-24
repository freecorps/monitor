"use client"
import React, { useState } from 'react';
import { Button, Input, Spacer } from "@nextui-org/react";
import { toast } from 'react-toastify';
import DataCard from '@/components/dataCard';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import "@/styles/bg.css"
import { title } from '@/components/primitives';

type Reading = {
  data: {
    [key: string]: any;
  };
  timestamp: Date;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Previsao() {
  const [espInput, setEspInput] = useState<string>('');
  const [selectedEsp, setSelectedEsp] = useState<string | undefined>(undefined);
  const [espData, setEspData] = useState<Reading[] | null>(null);
  const [dateRange, setDateRange] = useState<Value>([new Date(), new Date()]);

  const handleSearch = async () => {
    const espId = espInput;
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

      const readings: Reading[] = await response.json();
      setEspData(readings);
      toast.success(`Dados do ${espId} carregados com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao buscar dados do ${espId}.`);
    }
  };

  const handleDateChange = (value: Value) => {
    setDateRange(value);
  }

  let filteredReadings = espData || [];

  if (Array.isArray(dateRange) && dateRange[0] && dateRange[1]) {
    filteredReadings = filteredReadings.filter(reading =>
      new Date(reading.timestamp) >= dateRange[0]! && new Date(reading.timestamp) <= dateRange[1]!
    );
  }

  return (
    <div className='flex flex-col items-center'>
      <div className="galaxy"></div>
      <div className='flex flex-col gap-4'>
        <h1 className={title()}>Monitoramento de sensores</h1>
        <div className='flex flex-row gap-4'>
          <Input
            type='text'
            placeholder='Digite o ID de um ESP'
            value={espInput}
            onChange={(e) => setEspInput(e.target.value)}
          ></Input>

          <Button
            onClick={handleSearch}
          >Pesquisar</Button>
        </div>
        <div>
          <DateTimeRangePicker value={dateRange} onChange={handleDateChange} />
        </div>
      </div>

      {filteredReadings && filteredReadings.length > 0 && (
        <div className='mt-4'>
          <h2>Dados do {selectedEsp}</h2>
          <div className='columns-1 gap-4'>
            {Object.keys(filteredReadings[0].data).filter(key => key !== 'data' && key !== '_id' && key !== 'readings').map(key => (
              <div key={key}>
                <DataCard title={key} data={filteredReadings.map(reading => reading.data)} />
                <Spacer y={1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}