import React, { useEffect, useState } from 'react';
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
}

const ML5Predictor: React.FC<ML5PredictorProps> = ({ espData, onPrediction, setMapClickHandler }) => {
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

    const handleMapClick = (lat: number, lng: number) => {
        if (modelAI) {
            modelAI.predict([lat, lng], (err: any, results: any) => {
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
    };

    useEffect(() => {
        if (espData && espData.length > 0) {
            toast.info('Treinando modelo...');

            espData.forEach(esp => {
                esp.readings.forEach(reading => {
                    model.addData([esp.lat, esp.long], [reading.temperatura, reading.umidade]);
                });
            });

            model.train(() => {
                console.log('Model trained!');
                toast.success('Modelo treinado com sucesso!');
                setModel(model);
            });
        }
    }, [espData]);

    useEffect(() => {
        setMapClickHandler(handleMapClick);
        
        // Limpar ao desmontar, se necessário
        return () => {
            setMapClickHandler(() => {});
        };
    }, [setMapClickHandler]);

    return null;
}

export default ML5Predictor;
