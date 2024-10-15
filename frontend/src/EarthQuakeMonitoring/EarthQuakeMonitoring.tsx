import { useEffect, useState } from "react";
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

function EarthQuakeMonitoring() {
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
                <h1>Flood Monitoring Dashboard</h1>
                <p>Stay Informed with Real-Time Flood Data and Insights</p>
                <div className="dashboard-2">
                    <div className="dashboard-3">
                        <h1>SeismicActivity - Meter</h1>
                        <Line data={chartData} options={options} />
                    </div>
                    <div className="dashboard-3">
                        <h1>Acceleration - Millimeters</h1>
                        <Line data={chartData1} options={options1} />
                    </div>
                    <div className="dashboard-3">
                        <h1>Strain - m³/s</h1>
                        <Line data={chartData2} options={options2} />

                    </div>
                    <div className="dashboard-3">
                        <h1>Depth - %</h1>
                        <Line data={chartData3} options={options3} />

                    </div>

                </div>
            </div>


            <div className="dashboard-4">
                <h1>Flood Monitoring Dashboard</h1>
                <p>Stay Informed with Real-Time Flood Data and Insights</p>
                <div className="dashboard-5">
                    <div className="dashboard-6">
                        <h2>SeismicActivity</h2>
                        <h1>{floodData.current_seismicActivity}</h1>
                        {diffseismicActivity >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffseismicActivity} m</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffseismicActivity} m</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Acceleration</h2>
                        <h1>{floodData.current_acceleration}</h1>
                        {diffacceleration >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffacceleration} mm</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffacceleration} mm</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Strain</h2>
                        <h1>{floodData.current_strain}</h1>
                        {diffstrain >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffstrain} m³/s</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffstrain} m³/s</h2>
                        )}
                    </div>
                    <div className="dashboard-6">
                        <h2>Soil Moisture</h2>
                        <h1>{floodData.current_depth}</h1>
                        {diffdepth >= 0 ? (
                            <h2 style={{ color: "green" }}>+ {diffdepth} %</h2>
                        ) : (
                            <h2 style={{ color: "red" }}>{diffdepth} %</h2>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default EarthQuakeMonitoring;