import { AppSidebar } from "@/components/main/app-sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconImg from "leaflet/dist/images/marker-icon.png";
import markerShadowImg from "leaflet/dist/images/marker-shadow.png";
import { Acceleration } from "@/components/earthquake_chart/Acceleration";
import { Strain } from "@/components/earthquake_chart/Strain";
import { VibrationIntensity } from "@/components/earthquake_chart/VibrationIntensity";

const markerIcon = L.icon({
  iconUrl: markerIconImg,
  shadowUrl: markerShadowImg,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface earthquakeData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  date: string;
  latitude: number;
  longitude: number;
  strain: number;
  vibrationIntensity: number;
}

interface ResponseData {
  text: string;
}

export default function EarthquakeMonitoring() {
  const [Data, setData] = useState<earthquakeData[]>([]);
  const [cleanedData, setcleanedData] = useState<String>(" ");
  const [loading, setLoading] = useState(false);

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.get<ResponseData>(
        "https://metrominds.onrender.com/earthquake_suggestions"
      );
      const responseText = res.data.text;

      const cleanedResponse = responseText.replace(/\*/g, "");
      setcleanedData(cleanedResponse);

      console.log(cleanedResponse);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://metrominds.onrender.com/dashboard-data"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.earthquake);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const latitude = Data[0]?.latitude || 10;
  const longitude = Data[0]?.longitude || 77;

  const position: [number, number] = [latitude, longitude];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbItem>
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbLink href="/Dashboard/EarthquakeMonitoring">
                  Earthquake Monitoring
                </BreadcrumbLink>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Acceleration />
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <Strain />
            <VibrationIntensity />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4 pt-0 mt-5">
          <h1 className="text-2xl font-extrabold mt-2 mb-0">
            Current Readings
          </h1>
          <p className="text-sm mt-0 mb-5">
            This displays the current readings for various parameters.
          </p>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Strain</CardTitle>
                  <CardDescription>{Data[0]?.date || "N/A"}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-extrabold text-primary">
                    {Data[0]?.strain || "N/A"} m
                  </p>
                </CardContent>
                <CardFooter>
                  <CardDescription>Updated 5 minutes ago</CardDescription>
                </CardFooter>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Vibration Intensity</CardTitle>
                  <CardDescription>{Data[0]?.date || "N/A"}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-extrabold text-primary">
                    {Data[0]?.vibrationIntensity || "N/A"} m/s
                  </p>
                </CardContent>
                <CardFooter>
                  <CardDescription>Updated 5 minutes ago</CardDescription>
                </CardFooter>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Water Level</CardTitle>
                  <CardDescription>{Data[0]?.date || "N/A"}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-extrabold text-primary">
                    {Data[0]?.acceleration.x || "N/A"} ,{" "}
                    {Data[0]?.acceleration.y || "N/A"} ,{" "}
                    {Data[0]?.acceleration.z || "N/A"}
                  </p>
                </CardContent>
                <CardFooter>
                  <CardDescription>Updated 5 minutes ago</CardDescription>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mb-3 mt-3">
          <div className="grid auto-rows-min gap-4">
            {position ? (
              <MapContainer
                center={position}
                zoom={7}
                style={{ height: "500px", width: "100%", borderRadius: "10px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position} icon={markerIcon}>
                  <Popup>
                    <strong style={{ fontWeight: "700" }}>Max78000fthr</strong>
                    <br />
                    Strain : {Data[0]?.strain || "N/A"}
                    <br />
                    Vibration Intensity : {Data[0]?.vibrationIntensity ||
                      "N/A"}{" "}
                    %
                    <br />
                    Acceleration : {Data[0]?.acceleration.x || "N/A"} ,{" "}
                    {Data[0]?.acceleration.y || "N/A"} ,{" "}
                    {Data[0]?.acceleration.z || "N/A"} m
                    <br />
                    Date : {Data[0]?.date || "N/A"}
                    <br />
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-0 p-4 pt-0 mb-3 mt-5">
          <h1 className="text-2xl font-extrabold mt-2 mb-1">
            Earthquake Prediction Alerts
          </h1>
          <p className="text-sm mt-0 mb-5">
            This displays earthquake risk predictions based on current seismic
            data.
          </p>

          <div className="mb-5">
            <Card>
              <CardHeader>
                <CardTitle>
                  Earthquake Risk Based on Current Seismic Activity
                </CardTitle>
                <CardDescription>Current Risk Levels</CardDescription>
              </CardHeader>
              <CardContent className="text-justify">
                {loading ? (
                  <p className="font-normal text-sm text-primary">
                    Loading prediction...
                  </p>
                ) : cleanedData.length > 10 ? (
                  <p className="font-normal text-sm text-primary">
                    {cleanedData}
                  </p>
                ) : (
                  <p className="text-sm mt-2">
                    Click the "Get Prediction" button below for further
                    insights.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <CardDescription>
                  <button
                    style={{
                      marginTop: "2%",
                      fontFamily: "Poppins",
                      fontWeight: "400",
                      letterSpacing: "0.7px",
                      fontSize: "13px",
                      backgroundColor: "blue",
                      padding: "5px 20px 5px 20px",
                      borderRadius: "10px",
                    }}
                    onClick={handleSubmit}
                    disabled={loading} // Disable the button while loading
                  >
                    {loading ? "Getting Prediction..." : "Get Prediction"}
                  </button>
                </CardDescription>
              </CardFooter>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
