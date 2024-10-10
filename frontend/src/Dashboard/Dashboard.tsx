import { useEffect, useState } from "react";
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

function Dashboard() {
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

    const diffwaterlevel = Math.round(
        Number(floodData.current_waterLevel) - Number(floodData.previous1_waterLevel)
    );

    const diffrainfall = Math.round(
        Number(floodData.current_rainfall) - Number(floodData.previous1_rainfall)
    );

    const diffflowrate = Math.round(
        Number(floodData.current_flowRate) - Number(floodData.previous1_flowRate)
    );

    const diffsoil = Math.round(
        Number(floodData.current_soilMoisture) - Number(floodData.previous1_soilMoisture)
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
                <h1>Flood Monitoring Dashboard</h1>
                <p>Stay Informed with Real-Time Flood Data and Insights</p>
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
        </>
    );
}

export default Dashboard;