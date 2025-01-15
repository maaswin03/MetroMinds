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
import { Weight } from "@/components/waste_chart/Weight";
import { Temperature } from "@/components/waste_chart/Temperature";
import { MetersFilled } from "@/components/waste_chart/MetersFilled";

const markerIcon = L.icon({
  iconUrl: markerIconImg,
  shadowUrl: markerShadowImg,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Wastedata {
  date: string;
  temperature: number;
  latitude: number;
  longitude: number;
  totalWeight: number;
  metersFilled: number;
  fire: boolean;
}

export default function WasteMonitoring() {
  const [Data, setData] = useState<Wastedata[]>([]);

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
        setData(data.waste);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const overfilledBins = Data.filter((item) => item.metersFilled > 5);

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
                <BreadcrumbLink href="/Dashboard/WasteMonitoring">
                  Smart Trash Bins
                </BreadcrumbLink>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Weight />
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <Temperature />
            <MetersFilled />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-0 p-4 pt-0">
          <h1 className="text-2xl font-extrabold mt-2 mb-0">
            Noise Monitoring Map
          </h1>
          <p className="text-sm mt-0 mb-3">
            This map shows the smart bins and their weight across various
            locations.
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
                      Total Weight: {item.totalWeight || "N/A"} m
                      <br />
                      Meters Filled: {item.metersFilled || "N/A"} %
                      <br />
                      Fire: {item.fire ? "Yes" : "No"}
                      <br />
                      Temperature: {item.temperature || "N/A"} °C
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

        {overfilledBins.length > 0 && (
          <div className="flex flex-1 flex-col gap-0 p-4 pt-0 mt-5 bg-black text-white">
            <h1 className="text-2xl font-extrabold mt-2 mb-0">
              Alert: Overfilled Smart Bins
            </h1>
            <p className="text-sm mt-0 mb-3">
              These bins have exceeded the safe threshold of 80% and require
              attention.
            </p>
            <table className="min-w-full bg-black border border-gray-400 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Meters Filled (m)
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Fire Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                {overfilledBins.map((bin, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2 text-center">{bin.metersFilled}m</td>
                    <td className="px-4 py-2 text-center">{bin.date}</td>
                    <td className="px-4 py-2 text-center">{bin.fire ? "Yes" : "No"}</td>
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
