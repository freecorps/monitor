import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { BiMap } from "react-icons/bi";
import 'leaflet/dist/leaflet.css';

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

type LeafletMapProps = {
    espData: ESP[];
    onMapClick: (event: any) => void;
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

function calculateBounds(espData: ESP[]): [[number, number], [number, number]] | null {
    if (espData.length === 0) return null;

    const lats = espData.map(esp => esp.lat);
    const lngs = espData.map(esp => esp.long);

    return [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)]
    ];
}

const LeafletMap: React.FC<LeafletMapProps> = ({ espData, onMapClick }) => {
    const beerIcon = createSvgIcon(<BiMap />);

    if (!espData || espData.length === 0) {
        return <p>Carregando mapa...</p>; // ou outro placeholder de sua escolha
    }

    function LocationMarker() {
        const [position, setPosition] = useState(null);
        const map = useMapEvents({
            click(event) {
                onMapClick(event);
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
    );
}

export default LeafletMap;