import { useNavigate } from "react-router-dom";  // Import useNavigate
import { AppSidebar } from "@/components/main/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import "./Home.css";
import BentoDemo from "./BentoDemo";
import { Globe } from "@/components/ui/globe";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Particles from "@/components/ui/particles";

export default function FloodMonitoring() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/Dashboard/FloodMonitoring");
  };

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
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="home-1">
          <div className="home-2">
            <h1>The Ultimate Platform for Smart Urban Management</h1>
            <p>
              Need more than urban management tools? MetroMinds provides
              embeddable interfaces and intuitive dashboards for efficient
              urban management.
            </p>
            <RainbowButton
              style={{
                marginTop: "2%",
                fontFamily: "Poppins",
                fontWeight: "400",
                letterSpacing: "0.7px",
                fontSize: "13px",
              }}
              onClick={handleButtonClick}
            >
              Start building for free
            </RainbowButton>
          </div>
          <Particles
            className="absolute inset-0"
            quantity={1000}
            ease={80}
            refresh
          />
        </div>

        <div className="home-3">
          <div className="home-5">
            <h1>Everything You Need for Urban Management</h1>
            <p>
              Ever feel like urban management needs evolve constantly?
              MetroMinds adapts to the latest trends and best practices to
              ensure efficient city operations.
            </p>
          </div>
          <div className="home-4">
            <BentoDemo />
          </div>
        </div>

        <div className="home-6">
          <div className="home-7">
            <div className="home-8">
              <Globe />
            </div>
          </div>
          <div className="home-7">
            <div className="home-9">
              <h1>Transforming India with Sustainable Urban Management</h1>
              <p>
                Ready to explore? Visit the MetroMinds dashboard for intuitive
                tools and interfaces that streamline urban management.
              </p>
              <RainbowButton
                style={{
                  marginTop: "2%",
                  fontFamily: "Poppins",
                  fontWeight: "400",
                  letterSpacing: "0.7px",
                  fontSize: "13px",
                }}
                onClick={handleButtonClick}
              >
                Go to dashboard
              </RainbowButton>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
