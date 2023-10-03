import React, { useEffect, useRef, useCallback } from 'react';
import * as ml5 from 'ml5';
import { toast } from 'react-toastify';

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

type ML5PredictorProps = {
    espData: ESP[];
    onPrediction: (temperature: number, humidity: number) => void;
    setMapClickHandler: (handler: (lat: number, lng: number) => void) => void;
    setIsModelTrained: (isTrained: boolean) => void;
}

const model = ml5.neuralNetwork({
    inputs: ['lat', 'lng'],
    outputs: ['temperature', 'humidity'],
    task: 'regression',
    debug: true,
    layers: [
        { type: 'dense', units: 32, activation: 'relu' },
        { type: 'dense', units: 16, activation: 'relu' },
        { type: 'dense', units: 2 }
    ]
});

const ML5Predictor: React.FC<ML5PredictorProps> = ({ espData, onPrediction, setMapClickHandler }) => {
    const modelAIRef = useRef<any>(model); // Ref para o modelo
    const isModelTrainedRef = useRef(false); // Ref para rastrear se o modelo foi treinado

    const handleMapClick = useCallback((lat: number, lng: number) => {
        if (isModelTrainedRef.current) {
            modelAIRef.current.predict([lat, lng], (err: any, results: any) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const predictedTemperature = results[0].value;
                const predictedHumidity = results[1].value;
                onPrediction(predictedTemperature, predictedHumidity);
            });
        } else {
            toast.error('Modelo não treinado! Aguarde alguns segundos!');
        }
    }, [onPrediction]);

    useEffect(() => {
        if (espData && espData.length > 0 && !isModelTrainedRef.current) {
            toast.info('Treinando modelo...');
            espData.forEach(esp => {
                esp.readings.forEach(reading => {
                    modelAIRef.current.addData([esp.lat, esp.long], [reading.temperatura, reading.umidade]);
                });
            });

            modelAIRef.current.train(() => {
                console.log('Model trained!');
                toast.success('Modelo treinado com sucesso!');
                isModelTrainedRef.current = true;
            });
        }
    }, [espData]);

    useEffect(() => {
        setMapClickHandler(handleMapClick);
    }, [setMapClickHandler, handleMapClick]);

    return null;
}

export default ML5Predictor;
