import { useEffect, useState } from "react";
import Navbar from "@/AddedWidget/Navbar";
import './Dashboard.css';
import { Line} from "react-chartjs-2";
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
                const response = await fetch("http://127.0.0.1:5100/flood_monitoring_data", {
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
                label: "Temperature (°C)",
                data: [
                    floodData.previous5_waterLevel,
                    floodData.previous4_waterLevel,
                    floodData.previous3_waterLevel,
                    floodData.previous2_waterLevel,
                    floodData.previous1_waterLevel,
                    floodData.current_waterLevel,
                ],
                borderColor: "rgb(46, 141, 78)",
                backgroundColor: "rgb(46, 141, 78,0.3)",
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
                label: "Temperature (°C)",
                data: [
                    floodData.previous5_rainfall,
                    floodData.previous4_rainfall,
                    floodData.previous3_rainfall,
                    floodData.previous2_rainfall,
                    floodData.previous1_rainfall,
                    floodData.current_rainfall,
                ],
                borderColor: "rgb(46, 141, 78)",
                backgroundColor: "rgb(46, 141, 78,0.3)",
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
                border: {
                    color: 'black',
                    width: 1,
                },
                title: {

                    display: false,
                    text: "Temperature (°C)",
                    font: {
                        family: "Poppins",
                        size: 15,
                    },
                },
                ticks: {
                    stepSize: 2,
                    font: {
                        family: "Poppins",
                        size: 13,
                    },
                },
            },
            x: {
                grid: {
                    display: false,
                },
                border: {
                    color: 'black',
                    width: 1,
                },
                title: {
                    display: false,
                    text: "Time (hours)",
                    font: {
                        family: "Poppins",
                        size: 15,
                    },
                },
                ticks: {
                    font: {
                        family: "Poppins",
                        size: 13,
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
                    text: "Temperature (°C)",
                    font: {
                        family: "Poppins",
                        size: 15,
                    },
                },
                ticks: {
                    stepSize: 10,
                    font: {
                        family: "Poppins",
                        size: 13,
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
                        size: 15,
                    },
                },
                ticks: {
                    font: {
                        family: "Poppins",
                        size: 13,
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
                <h1>MetroMinds Dashboard</h1>
                <p>Your Central Hub for Smart City Management</p>
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

                    </div>
                    <div className="dashboard-3">

                    </div>
                    <div className="dashboard-3">

                    </div>
                    <div className="dashboard-3">

                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;