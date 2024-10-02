import {
    BellIcon,
    FileTextIcon,
    GlobeIcon,
    InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

import { WiDayLightning } from "react-icons/wi";

const features = [
    {
        Icon: WiDayLightning,
        name: "Environmental Monitoring",
        description: "We automatically log sensor data and alerts in real-time for effective urban management, including flood monitoring, seismic activity detection, intelligent waste management, traffic flow optimization, and noise pollution monitoring.",        
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3 font-poppins",
    },
    {
        Icon: InputIcon,
        name: "Comprehensive Data Search",
        description: "Easily search through all sensor data and alerts from a single platform.",
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 font-poppins",
    },
    {
        Icon: GlobeIcon,
        name: "Multilingual",
        description: "Supports 100+ languages and counting.",
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4 font-poppins",
    },
    {
        Icon: FileTextIcon,
        name: "Data Preservation",
        description: "We automatically log sensor data and alerts in real-time for effective urban management.",
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2 font-poppins",
    },
    {
        Icon: BellIcon,
        name: "Notifications",
        description:
        "Get alerts for flood risks, seismic activity, and key urban events.",
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4 font-poppins",
    },
];

function BentoDemo() {
    return (
        <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
                <BentoCard key={feature.name} {...feature} />
            ))}
        </BentoGrid>
    );
}

export default BentoDemo;

