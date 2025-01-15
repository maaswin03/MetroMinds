import { AirTemperature } from "@/components/flood_chart/AirTemperature";
import { FlowRate } from "@/components/flood_chart/FlowRate";
import { RainfallIntensity } from "@/components/flood_chart/RainfallIntensity";
import { SoilMoisture } from "@/components/flood_chart/SoilMoisture";
import { WaterLevel } from "@/components/flood_chart/Waterlevel";
import { AppSidebar } from "@/components/main/app-sidebar";
import { useState, useEffect } from "react";
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

const markerIcon = L.icon({
  iconUrl: markerIconImg,
  shadowUrl: markerShadowImg,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface flooddata {
  airTemperature: number;
  date: string;
  flowRate: number;
  latitude: number;
  longitude: number;
  rainfallIntensity: number;
  soilMoisture: number;
  waterLevel: number;
}

export default function FloodMonitoring() {
  const [Data, setData] = useState<flooddata[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5200/dashboard-data"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data.flood);
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
                <BreadcrumbLink href="/Dashboard/FloodMonitoring">
                  Flood Monitoring
                </BreadcrumbLink>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <RainfallIntensity />
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <FlowRate />
            <AirTemperature />
            <SoilMoisture />
            <WaterLevel />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4 pt-0 mt-5">
          <h1 className="text-2xl font-extrabold mt-2 mb-0">
            Current Readings
          </h1>
          <p className="text-sm mt-0 mb-5">
            This displays the current readings for various parameters.
          </p>
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Rainfall Intensity</CardTitle>
                  <CardDescription>{Data[0]?.date || "N/A"}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-extrabold text-primary">
                    {Data[0]?.rainfallIntensity || "N/A"} m
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
                  <CardTitle>Soil Moisture</CardTitle>
                  <CardDescription>{Data[0]?.date || "N/A"}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-extrabold text-primary">
                    {Data[0]?.soilMoisture || "N/A"} %
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
                    {Data[0]?.waterLevel || "N/A"} m
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
                  <CardTitle>Air Temperature</CardTitle>
                  <CardDescription>{Data[0]?.date || "N/A"}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-extrabold text-primary">
                    {Data[0]?.airTemperature || "N/A"} °C
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
                    Rainfall Intensity : {Data[0]?.rainfallIntensity|| "N/A"} m
                    <br />
                    Soil Moisture :{" "}
                    {Data[0]?.soilMoisture || "N/A"} %
                    <br />
                    Water Level :{" "}
                    {Data[0]?.waterLevel || "N/A"} m 
                    <br />
                    Air Temperature : {Data[0]?.airTemperature || "N/A"} °C
                    <br />
                    Flow Rate : {Data[0]?.flowRate || "N/A"} °C
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
      </SidebarInset>
    </SidebarProvider>
  );
}
