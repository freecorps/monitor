import React from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { Line } from 'react-chartjs-2';

interface DataCardProps {
    title: string;
    data: any[];
}

export const DataCard: React.FC<DataCardProps> = ({ title, data }) => {

    function transformDataForChart(dataArray: any[], key: string) {
        return {
            labels: dataArray.map(item => new Date(item.data).toLocaleString()),
            datasets: [{
                label: key,
                data: dataArray.map(item => item[key]),
                fill: true,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }]
        };
    }

    const chartData = transformDataForChart(data, title);
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: title,
            },
        },
    };

    return (
        <Card className="md:max-w-[650px] md:min-w-[500px] max-w-[600px] min-w-[450px]">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-md">{title}</p>
                </div>
            </CardHeader>
            <CardBody>
                <Line data={chartData} options={chartOptions} />
            </CardBody>
        </Card>
    );
}

export default DataCard;
