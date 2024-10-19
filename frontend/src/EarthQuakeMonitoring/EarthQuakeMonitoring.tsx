import { useEffect, useState } from "react";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';

import Navbar from "@/AddedWidget/Navbar";
import './EarthQuakeMonitoring.css';
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

function EarthQuakeMonitoring() {
    const [floodLocations, setFloodLocations] = useState<Location[]>([]);
    const [floodData, setFloodData] = useState<SensorData>({});
    const deviceId = "max78000fthr";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://metrominds.onrender.com/Earthquake_monitoring_data", {
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
                const response = await axios.get('https://metrominds.onrender.com/Earthquake_monitoring_data_all');
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

    const diffseismicActivity = parseFloat(
        (Number(floodData.current_seismicActivity) - Number(floodData.previous1_seismicActivity)).toFixed(2)
    );

    const diffacceleration = parseFloat(
        (Number(floodData.current_acceleration) - Number(floodData.previous1_acceleration)).toFixed(2)
    );

    const diffstrain = parseFloat(
        (Number(floodData.current_strain) - Number(floodData.previous1_strain)).toFixed(2)
    );

    const diffdepth = parseFloat(
        (Number(floodData.current_depth) - Number(floodData.previous1_depth)).toFixed(2)
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
                    floodData.previous5_seismicActivity,
                    floodData.previous4_seismicActivity,
                    floodData.previous3_seismicActivity,
                    floodData.previous2_seismicActivity,
                    floodData.previous1_seismicActivity,
                    floodData.current_seismicActivity,
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
                label: "Acceleration (mm)",
                data: [
                    floodData.previous5_acceleration,
                    floodData.previous4_acceleration,
                    floodData.previous3_acceleration,
                    floodData.previous2_acceleration,
                    floodData.previous1_acceleration,
                    floodData.current_acceleration,
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
                label: "strain (m³/s)",
                data: [
                    floodData.previous5_strain,
                    floodData.previous4_strain,
                    floodData.previous3_strain,
                    floodData.previous2_strain,
                    floodData.previous1_strain,
                    floodData.current_strain,
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
                    floodData.previous5_depth,
                    floodData.previous4_depth,
                    floodData.previous3_depth,
                    floodData.previous2_depth,
                    floodData.previous1_depth,
                    floodData.current_depth,
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
                max: 0.5,
                grid: {
                    display: false,
                },
                title: {
                    display: false,
                    text: "Acceleration (mm)",
                    font: {
                        family: "Poppins",
                        size: 12,
                    },
                },
                ticks: {
                    stepSize: 0.25,
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
                    text: "Strain (m³/s)",
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
                    text: "Depth (°C)",
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

            <div className="dashboard-1">
                <h1>Earthquake Monitoring Dashboard</h1>
                <p>Stay Informed with Real-Time Flood Data and Insights</p>
                <div className="dashboard-2">
                    <div className="dashboard-3">
                        <h1>SeismicActivity - Joules</h1>
                        <Line data={chartData} options={options} />
                    </div>
                    <div className="dashboard-3">
                        <h1>Acceleration - m/s²</h1>
                        <Line data={chartData1} options={options1} />
                    </div>
                    <div className="dashboard-3">
                        <h1>Strain</h1>
                        <Line data={chartData2} options={options2} />

                    </div>
                    <div className="dashboard-3">
                        <h1>Depth - m</h1>
                        <Line data={chartData3} options={options3} />

                    </div>

                </div>
            </div>


            <div className="dashboard-4">
                <h1>Earthquake Risk Assessment</h1>
                <p>Evaluate the immediate Earthquake risks based on live data.</p>
                <div className="dashboard-5">
                    <div className="dashboard-6">
                        <h2>SeismicActivity</h2>
                        <h1>{floodData.current_seismicActivity}</h1>
                        {diffseismicActivity >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffseismicActivity} Joules</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffseismicActivity} Joules</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Acceleration</h2>
                        <h1>{floodData.current_acceleration}</h1>
                        {diffacceleration >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffacceleration} m/s²</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffacceleration} m/s²</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Strain</h2>
                        <h1>{floodData.current_strain}</h1>
                        {diffstrain >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffstrain}</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffstrain}</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Depth</h2>
                        <h1>{floodData.current_depth}</h1>
                        {diffdepth >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffdepth} m</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffdepth} m</h2>
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
                                        SeismicActivity : {loc.current_seismicActivity !== undefined ? loc.current_seismicActivity : "N/A"} J
                                        <br />
                                        Acceleration : {loc.current_acceleration !== undefined ? loc.current_acceleration : "N/A"} m/s²
                                        <br />
                                        Strain : {loc.current_strain !== undefined ? loc.current_strain : "N/A"}
                                        <br />
                                        Depth : {loc.current_depth !== undefined ? loc.current_depth : "N/A"} m
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
                            <td>SeismicActivity</td>
                            <td>Acceleration</td>
                            <td>Strain</td>
                            <td>Depth</td>
                        </tr>

                        <tr>
                            <td>{floodData.current_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_seismicActivity} J</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_acceleration} m/s²</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_strain}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.current_depth} m</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous1_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_seismicActivity} J</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_acceleration} m/s²</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_strain}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous1_depth} m</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous2_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_seismicActivity} J</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_acceleration} m/s²</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_strain}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous2_depth} m</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous3_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_seismicActivity} J</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_acceleration} m/s²</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_strain}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous3_depth} m</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous4_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_seismicActivity} J</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_acceleration} m/s²</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_strain}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous4_depth} m</td>
                        </tr>

                        <tr>
                            <td>{floodData.previous5_time}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_seismicActivity} J</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_acceleration} m/s²</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_strain}</td>
                            <td style={{ color: "#4F7D96" }}>{floodData.previous5_depth} m</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Footer/>
        </>
    );
}

export default EarthQuakeMonitoring;