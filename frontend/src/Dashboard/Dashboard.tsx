import { useEffect, useState } from "react";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';


import Navbar from "@/AddedWidget/Navbar";
import './Dashboard.css';
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    // ArcElement,
    // BarElement,
    Legend,
    Filler,
} from "chart.js";
import Footer from "@/AddedWidget/Footer";
import Headerbar from "@/AddedWidget/headerbar";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
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


function Dashboard() {
    const [floodLocations, setFloodLocations] = useState<Location[]>([]);
    const [floodData, setFloodData] = useState<SensorData>({});
    const deviceId = "max78000fthr";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://metrominds.onrender.com/flood_monitoring_data", {
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

                setFloodData(data);

            } catch (error) {
                console.error("Error fetching flood data:", error);
            }
        };

        fetchData();
    }, [deviceId]);


    useEffect(() => {
        const fetchFloodData = async () => {
            try {
                const response = await axios.get('https://metrominds.onrender.com/flood_monitoring_data_all');
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


    const diffwaterlevel = parseFloat(
        (Number(floodData.current_waterLevel) - Number(floodData.previous1_waterLevel)).toFixed(2)
    );

    const diffrainfall = parseFloat(
        (Number(floodData.current_rainfall) - Number(floodData.previous1_rainfall)).toFixed(2)
    );

    const diffflowrate = parseFloat(
        (Number(floodData.current_flowRate) - Number(floodData.previous1_flowRate)).toFixed(2)
    );

    const diffsoil = parseFloat(
        (Number(floodData.current_soilMoisture) - Number(floodData.previous1_soilMoisture)).toFixed(2)
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
                    floodData.previous5_waterLevel,
                    floodData.previous4_waterLevel,
                    floodData.previous3_waterLevel,
                    floodData.previous2_waterLevel,
                    floodData.previous1_waterLevel,
                    floodData.current_waterLevel,
                ],
                borderColor: "rgb(108, 71, 255,1)",
                backgroundColor: "rgb(108, 71, 255,0.3)",
                fill: "start",
            },
        ],
    };

    const chartData1 = {
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
                label: "Rainfall (mm)",
                data: [
                    floodData.previous5_rainfall,
                    floodData.previous4_rainfall,
                    floodData.previous3_rainfall,
                    floodData.previous2_rainfall,
                    floodData.previous1_rainfall,
                    floodData.current_rainfall,
                ],
                borderColor: "rgb(108, 71, 255,1)",
                backgroundColor: "rgb(108, 71, 255,0.3)",
                fill: "start",
            },
        ],
    };


    const chartData2 = {
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
                label: "Flow rate (m³/s)",
                data: [
                    floodData.previous5_flowRate,
                    floodData.previous4_flowRate,
                    floodData.previous3_flowRate,
                    floodData.previous2_flowRate,
                    floodData.previous1_flowRate,
                    floodData.current_flowRate,
                ],
                borderColor: "rgb(108, 71, 255,1)",
                backgroundColor: "rgb(108, 71, 255,0.3)",
                fill: "start",
            },
        ],
    };

    const chartData3 = {
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
                label: "Soil Moisture (%)",
                data: [
                    floodData.previous5_soilMoisture,
                    floodData.previous4_soilMoisture,
                    floodData.previous3_soilMoisture,
                    floodData.previous2_soilMoisture,
                    floodData.previous1_soilMoisture,
                    floodData.current_soilMoisture,
                ],
                borderColor: "rgb(108, 71, 255,1)",
                backgroundColor: "rgb(108, 71, 255,0.3)",
                fill: "start",
            },
        ],
    };

    const options = {
        scales: {
            y: {
                min: 0,
                max: 6,
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
                    stepSize: 3,
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

    const options1 = {
        scales: {
            y: {
                min: 0,
                max: 30,
                grid: {
                    display: false,
                },
                title: {
                    display: false,
                    text: "Rainfall (mm)",
                    font: {
                        family: "Poppins",
                        size: 12,
                    },
                },
                ticks: {
                    stepSize: 15,
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

    const options2 = {
        scales: {
            y: {
                min: 0,
                max: 6,
                grid: {
                    display: false,
                },
                title: {

                    display: false,
                    text: "Flow rate (m³/s)",
                    font: {
                        family: "Poppins",
                        size: 12,
                    },
                },
                ticks: {
                    stepSize: 3,
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


    const options3 = {
        scales: {
            y: {
                min: 0,
                max: 50,
                grid: {
                    display: false,
                },
                title: {

                    display: false,
                    text: "Temperature (°C)",
                    font: {
                        family: "Poppins",
                        size: 12,
                    },
                },
                ticks: {
                    stepSize: 25,
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


    return (
        <>
            <Navbar />

            <Headerbar/>

            <div className="dashboard-1">
                <h1>Flood Monitoring Dashboard</h1>
                <p>Stay Informed with Real-Time Flood Data and Insights</p>
                <div className="dashboard-2">
                    <div className="dashboard-3">
                        <h1>Water Level - Meter</h1>
                        <Line data={chartData} options={options} />
                    </div>
                    <div className="dashboard-3">
                        <h1>Rainfall - Millimeters</h1>
                        <Line data={chartData1} options={options1} />
                    </div>
                    <div className="dashboard-3">
                        <h1>Flow Rate - m³/s</h1>
                        <Line data={chartData2} options={options2} />

                    </div>
                    <div className="dashboard-3">
                        <h1>Soil Moisture - %</h1>
                        <Line data={chartData3} options={options3} />

                    </div>

                </div>
            </div>


            <div className="dashboard-4">
                <h1>Flood Risk Assessment</h1>
                <p>Evaluate the immediate flood risks based on live data.</p>
                <div className="dashboard-5">
                    <div className="dashboard-6">
                        <h2>Water Level</h2>
                        <h1>{floodData.current_waterLevel}</h1>
                        {diffwaterlevel >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffwaterlevel} m</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffwaterlevel} m</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Rainfall</h2>
                        <h1>{floodData.current_rainfall}</h1>
                        {diffrainfall >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffrainfall} mm</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffrainfall} mm</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Flow Rate</h2>
                        <h1>{floodData.current_flowRate}</h1>
                        {diffflowrate >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffflowrate} m³/s</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffflowrate} m³/s</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Soil Moisture</h2>
                        <h1>{floodData.current_soilMoisture}</h1>
                        {diffsoil >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffsoil} %</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffsoil} %</h2>
                        )}
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
                                        Water Level : {loc.current_waterLevel !== undefined ? loc.current_waterLevel : "N/A"} m
                                        <br />
                                        Rainfall : {loc.current_rainfall !== undefined ? loc.current_rainfall : "N/A"} mm
                                        <br />
                                        Flow Rate : {loc.current_flowRate !== undefined ? loc.current_flowRate : "N/A"} m³/s
                                        <br />
                                        Soil Moisture : {loc.current_soilMoisture !== undefined ? loc.current_soilMoisture : "N/A"} %
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
                            <td>Water Level</td>
                            <td>Rainfall</td>
                            <td>Flowrate</td>
                            <td>Soil Moisture</td>
                        </tr>

                        <tr>
                            <td>{floodData.current_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_waterLevel} m</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_rainfall} mm</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_flowRate} m³/s</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_soilMoisture} %</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous1_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_waterLevel} m</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_rainfall} mm</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_flowRate} m³/s</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_soilMoisture} %</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous2_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_waterLevel} m</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_rainfall} mm</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_flowRate} m³/s</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_soilMoisture} %</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous3_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_waterLevel} m</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_rainfall} mm</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_flowRate} m³/s</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_soilMoisture} %</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous4_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_waterLevel} m</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_rainfall} mm</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_flowRate} m³/s</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_soilMoisture} %</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous5_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_waterLevel} m</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_rainfall} mm</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_flowRate} m³/s</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_soilMoisture} %</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Footer/>
        </>
    );
}

export default Dashboard;
