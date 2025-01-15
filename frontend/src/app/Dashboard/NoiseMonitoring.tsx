import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/main/app-sidebar";
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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconImg from "leaflet/dist/images/marker-icon.png";
import markerShadowImg from "leaflet/dist/images/marker-shadow.png";
import { PeakSoundLevelChart } from "@/components/noise_chart/peakSoundLevel";
import { NoiseLevelChart } from "@/components/noise_chart/noiselevel";
import { DurationOfSoundEvents } from "@/components/noise_chart/DurationOfSoundEvents";

const markerIcon = L.icon({
  iconUrl: markerIconImg,
  shadowUrl: markerShadowImg,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Noisedata {
  date: string;
  peakSoundLevel: number;
  latitude: number;
  longitude: number;
  noiseLevel: number;
  durationOfSoundEvents: number;
}

export default function NoiseMonitoring() {
  const [Data, setData] = useState<Noisedata[]>([]);

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
        setData(data.noise);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const highNoiseLocations = Data.filter((item) => item.peakSoundLevel > 90);

  console.log(highNoiseLocations)

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
                <BreadcrumbLink href="/Dashboard/NoiseMonitoring">
                  Noise Monitoring
                </BreadcrumbLink>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <PeakSoundLevelChart />
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <NoiseLevelChart />
            <DurationOfSoundEvents />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-0 p-4 pt-0">
          <h1 className="text-2xl font-extrabold mt-2 mb-0">
            Current Readings
          </h1>
          <p className="text-sm mt-0 mb-3">
            This displays the current readings for various parameters.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mb-3 mt-0">
          <div className="grid auto-rows-min gap-4">
            {Data.length > 0 ? (
              <MapContainer
                center={[Data[0]?.latitude || 10, Data[0]?.longitude || 77]}
                zoom={15}
                style={{ height: "500px", width: "100%", borderRadius: "10px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {Data.map((item, index) => (
                  <Marker
                    key={index}
                    position={[item.latitude, item.longitude]}
                    icon={markerIcon}
                  >
                    <Popup>
                      <strong style={{ fontWeight: "700" }}>
                        Location {index + 1}
                      </strong>
                      <br />
                      Peak Sound Level: {item.peakSoundLevel || "N/A"} Db
                      <br />
                      Noise Level : {item.noiseLevel || "N/A"} Db
                      <br />
                      Duration Of SoundEvents:{" "}
                      {item.durationOfSoundEvents || "N/A"} Sec
                      <br />
                      Date: {item.date || "N/A"}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
        </div>

        {highNoiseLocations.length > 0 && (
          <div className="flex flex-1 flex-col gap-0 p-4 pt-0 mt-5 bg-black text-white">
            <h1 className="text-2xl font-extrabold mt-2 mb-0">
              Alert: High Noise Levels
            </h1>
            <p className="text-sm mt-0 mb-3">
              These locations have exceeded the safe threshold for noise levels.
            </p>
            <table className="min-w-full bg-black border border-gray-400 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Noise Level (dB)
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Duration of Sound Events (Sec)
                  </th>
                </tr>
              </thead>
              <tbody>
                {highNoiseLocations.map((item, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2 text-center">
                      {item.noiseLevel} dB
                    </td>
                    <td className="px-4 py-2 text-center">{item.date}</td>
                    <td className="px-4 py-2 text-center">
                      {item.durationOfSoundEvents} sec
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
