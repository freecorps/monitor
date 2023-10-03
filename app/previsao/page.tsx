"use client"
import React, { useEffect, useState } from 'react';
import { Select, SelectItem, Spacer } from "@nextui-org/react";
import { toast } from 'react-toastify';
import DataCard from '@/components/dataCard';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

type Reading = {
  temperatura: number;
  umidade: number;
  data: Date;
};

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function Previsao() {
  const [espList, setEspList] = useState<string[]>([]);
  const [selectedEsp, setSelectedEsp] = useState<string | undefined>(undefined);
  const [espData, setEspData] = useState<Reading[] | null>(null);
  const [dateRange, setDateRange] = useState<Value>([new Date(), new Date()]);

  useEffect(() => {
    const fetchEspList = async () => {
      try {
        toast.info('Buscando ESPs...');
        const response = await fetch('/api/getIds');
        const ids: string[] = await response.json();
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
      new Date(reading.data) >= dateRange[0]! && new Date(reading.data) <= dateRange[1]!
    );
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col gap-4'>
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

        <div>
          <DateTimeRangePicker value={dateRange} onChange={handleDateChange} />
        </div>
      </div>

      {filteredReadings && filteredReadings.length > 0 && (
        <div className='mt-4'>
          <h2>Dados do {selectedEsp}</h2>
          <div className='columns-1 gap-4'>
            {Object.keys(filteredReadings[0]).filter(key => key !== 'data' && key !== '_id' && key !== 'readings').map(key => (
              <div key={key}>
                <DataCard title={key} data={filteredReadings} />
                <Spacer y={1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}