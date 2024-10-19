import { useEffect, useState } from "react";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';

import Navbar from "@/AddedWidget/Navbar";
import './Citysoundmonitoring.css';
import { Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    ArcElement,
    // BarElement,
    Legend,
    Filler,
} from "chart.js";
import Footer from "@/AddedWidget/Footer";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface SensorData {
    [key: string]: any;
}

const markerIcon = new L.Icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface Location {
    [key: string]: any;
}

function Citysoundmonitoring() {
    const chartSize = {height: 370 };
    const [floodLocations, setFloodLocations] = useState<Location[]>([]);
    const [floodData, setFloodData] = useState<SensorData>({});
    const deviceId = "max78000fthr";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://metrominds.onrender.com/City_sound_monitoring_data", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ device_id: deviceId }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                const stringifiedData = convertToStrings(data);

                setFloodData(stringifiedData);

            } catch (error) {
                console.error("Error fetching flood data:", error);
            }
        };

        fetchData();
    }, [deviceId]);

    const convertToStrings = (obj: any): any => {
        const result: any = {};
        for (const key in obj) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
                result[key] = convertToStrings(obj[key]);
            } else {
                result[key] = String(obj[key]);
            }
        }
        return result;
    };


    useEffect(() => {
        const fetchFloodData = async () => {
            try {
                const response = await axios.get('https://metrominds.onrender.com/City_sound_monitoring_data');
                const floodData: Location[] = response.data;

                console.log("Flood Data:", floodData);


                const validFloodData = floodData
                    .map(location => {
                        if (location.latitude !== undefined && location.longitude !== undefined) {
                            return {
                                ...location,
                                coordinates: [location.latitude, location.longitude],
                            };
                        }
                        return null;
                    })
                    .filter(location => location !== null);

                if (validFloodData.length > 0) {
                    setFloodLocations(validFloodData);
                } else {
                    console.warn("No valid flood locations found");
                    setFloodLocations([]);
                }

            } catch (error) {
                console.error('Error fetching flood data:', error);
            }
        };

        fetchFloodData();
    }, []);

    const diffnoiseLevel = parseFloat(
        (Number(floodData.current_noiseLevel) - Number(floodData.previous1_noiseLevel)).toFixed(2)
    );

    const chartData = {
        labels: [
            floodData.previous5_time,
            floodData.previous4_time,
            floodData.previous3_time,
            floodData.previous2_time,
            floodData.previous1_time,
            floodData.current_time,
        ],
        datasets: [
            {
                label: "Water Level (m)",
                data: [
                    floodData.previous5_noiseLevel,
                    floodData.previous4_noiseLevel,
                    floodData.previous3_noiseLevel,
                    floodData.previous2_noiseLevel,
                    floodData.previous1_noiseLevel,
                    floodData.current_noiseLevel,
                ],
                borderColor: "rgb(108, 71, 255,1)",
                backgroundColor: "rgb(108, 71, 255,0.3)",
                fill: "start",
            },
        ],
    };

    const chartData1 = {
        labels: ['Traffic', 'Construction', 'Crowd', 'Birds'],
        datasets: [
            {
                label: 'Noise Source Identified',
                data: [3, 1, 1, 1],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }
        ]
    };


    const options = {
        scales: {
            y: {
                min: 0,
                max: 150,
                grid: {
                    display: false,
                },
                title: {

                    display: false,
                    text: "Water Level (m)",
                    font: {
                        family: "Poppins",
                        size: 12,
                    },
                },
                ticks: {
                    stepSize: 75,
                    font: {
                        family: "Poppins",
                        size: 12,
                    },
                },
            },
            x: {
                grid: {
                    display: false,
                },
                title: {
                    display: false,
                    text: "Time (hours)",
                    font: {
                        family: "Poppins",
                        size: 12,
                    },
                },
                ticks: {
                    font: {
                        family: "Poppins",
                        size: 12,
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };


    console.log(typeof floodData.current_compliance);

    const options1 = {
        responsive: true,
        plugins: {
            legend: {
                display:false,
            },
            title: {
                display: true,
                text: 'Noise Sources Identified',
                font: {
                    family: "Poppins",
                    size: 15,
                    weight:300,
                    color: "black",
                },
                padding: {
                    bottom: 20,
                }
            }
        }
    };

    return (
        <>
            <Navbar />

            <div className="dashboard-1">
                <h1>Sound Monitoring Dashboard</h1>
                <p>Stay Informed with Real-Time Flood Data and Insights</p>
                <div className="dashboard-2">
                    <div className="dashboard-3" style={{height: chartSize.height }}>
                        <h1>Noise Level - dB</h1>
                        <Line data={chartData} options={options} />
                    </div>
                    <div className="dashboard-3" style={{height: chartSize.height }}>
                        {/* <h1>Acceleration - Millimeters</h1> */}
                        <Pie data={chartData1} options={options1} />
                    </div>
                </div>
            </div>


            <div className="dashboard-4">
                <h1>Sound Risk Assessment</h1>
                <p>Stay Informed with Real-Time Sound Data and Insights</p>
                <div className="dashboard-5">
                    <div className="dashboard-6">
                        <h2>NoiseLevel</h2>
                        <h1>{floodData.current_noiseLevel}</h1>
                        {diffnoiseLevel >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffnoiseLevel} dB</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffnoiseLevel} dB</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>SourceIdentified</h2>
                        <h1>{floodData.current_sourceIdentified}</h1>
                        {floodData.previous1_sourceIdentified == floodData.current_sourceIdentified ? (
                            <h2 style={{ color: "green" }}>+ {floodData.current_sourceIdentified}</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{floodData.previous1_sourceIdentified}</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Compliance</h2>
                        {floodData.current_compliance == "true" ? (
                            <h1>True</h1>
                        ) : (
                            <h1>False</h1>
                        )}
                        {floodData.previous1_sourceIdentified == "true" ? (
                            <h2 style={{ color: "green" }}>True</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>False</h2>
                        )}
                    </div>

                    <div className="dashboard-6">
                        <h2>Location</h2>
                        <h1>{floodData.device_location}</h1>
                        <h2 style={{ color: "green" }}>Current Location</h2>
                    </div>

                </div>
            </div>


            <div className="dashboard-7">
                <h1>Sensor Network Locations</h1>
                <p>See where sensors are placed to collect real-time data.</p>
                <div className="dashboard-8">
                    <MapContainer
                        center={[11.0254, 77.1246]}
                        zoom={10}
                        style={{ height: '500px', width: '100%', fontFamily: 'Poppins', letterSpacing: '0.7px', fontWeight: '300' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        {floodLocations.map((loc, index) => (
                            loc.coordinates && loc.coordinates.length === 2 ? (
                                <Marker key={index} position={loc.coordinates} icon={markerIcon}>
                                    <Popup>
                                        <strong style={{ fontWeight: '700' }}>{loc.device_location || "Unknown Device"}</strong>
                                        <br />
                                        Noise Level : {loc.current_noiseLevel !== undefined ? loc.current_noiseLevel : "N/A"} dB
                                        <br />
                                        Source Identified : {loc.current_sourceIdentified !== undefined ? loc.current_sourceIdentified : "N/A"}
                                        <br />
                                        Compliance : {loc.current_compliance == "true" ? "true" : "false"}
                                        <br />
                                        Date : {loc.current_date || "N/A"}
                                        <br />
                                        Time : {loc.current_time || "N/A"}
                                        <br />
                                    </Popup>
                                </Marker>
                            ) : null
                        ))}

                    </MapContainer>

                </div>
            </div>


            <div className="dashboard-9">
                <h1>Historical Data</h1>
                <p>Analyzing historical data reveals trends and insights</p>
                <table className="dashboard-10">
                    <tbody>

                        <tr id="dash12">
                            <td>Date</td>
                            <td>Noise Level</td>
                            <td>Source Identified</td>
                            <td>Compliance</td>
                        </tr>

                        <tr>
                            <td>{floodData.current_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_noiseLevel} dB</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_sourceIdentified}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_compliance}</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous1_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_noiseLevel} dB</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_sourceIdentified}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_compliance}</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous2_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_noiseLevel} dB</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_sourceIdentified}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_compliance}</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous3_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_noiseLevel} dB</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_sourceIdentified}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_compliance}</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous4_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_noiseLevel} dB</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_sourceIdentified}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_compliance}</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous5_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_noiseLevel} dB</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_sourceIdentified}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_compliance}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Footer/>
        </>
    );
}

export default Citysoundmonitoring;