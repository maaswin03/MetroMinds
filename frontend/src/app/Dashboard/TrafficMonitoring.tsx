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
import { TrafficDensityChart } from "@/components/traffic_chart/Trafficdensity";
import { VehicleCountChart } from "@/components/traffic_chart/vehiclecount";

const markerIcon = L.icon({
  iconUrl: markerIconImg,
  shadowUrl: markerShadowImg,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface TrafficData {
  date: string;
  vehicleCount: number;
  latitude: number;
  longitude: number;
  trafficDensity: number;
  trafficLevel: string;
}

export default function TrafficMonitoring() {
  const [data, setData] = useState<TrafficData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://metrominds.onrender.com/dashboard-data"
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result.traffic);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const highTrafficLocations = data.filter((item) => item.trafficDensity > 100);

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
                <BreadcrumbLink href="/Dashboard/TrafficMonitoring">
                  Traffic Monitoring
                </BreadcrumbLink>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <TrafficDensityChart />
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <VehicleCountChart />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-0 p-4 pt-0 mb-0 mt-0">
          <h1 className="text-2xl font-extrabold mt-2 mb-0">
            Traffic Monitoring Map
          </h1>
          <p className="text-sm mt-0 mb-3">
            This map shows the traffic density and vehicle count across various
            locations.
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mb-3 mt-0">
          <div className="grid auto-rows-min gap-4">
            {data.length > 0 ? (
              <MapContainer
                center={[data[0]?.latitude || 10, data[0]?.longitude || 77]}
                zoom={15}
                style={{ height: "500px", width: "100%", borderRadius: "10px" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {data.map((item, index) => (
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
                      Vehicle Count: {item.vehicleCount || "N/A"}
                      <br />
                      Traffic Density: {item.trafficDensity || "N/A"}{" "}
                      vehicles/km²
                      <br />
                      Traffic Level: {item.trafficLevel || "N/A"}
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

        {highTrafficLocations.length > 0 && (
          <div className="flex flex-1 flex-col gap-0 p-4 pt-0 mt-5 bg-black text-white">
            <h1 className="text-2xl font-extrabold mt-2 mb-0">
              Alert: High Traffic Density
            </h1>
            <p className="text-sm mt-0 mb-3">
              These locations have exceeded the safe threshold for traffic
              density.
            </p>
            <table className="min-w-full bg-black border border-gray-400 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Location
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Vehicle Count
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-center">
                    Traffic Density (vehicles/km²)
                  </th>
                </tr>
              </thead>
              <tbody>
                {highTrafficLocations.map((item, index) => (
                  <tr key={index} className="border-b border-gray-400">
                    <td className="px-4 py-2 text-center">{index + 1}</td>
                    <td className="px-4 py-2 text-center">
                      {item.vehicleCount}
                    </td>
                    <td className="px-4 py-2 text-center">{item.date}</td>
                    <td className="px-4 py-2 text-center">
                      {item.trafficDensity} vehicles/km²
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
