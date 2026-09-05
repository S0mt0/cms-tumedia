import {
  Bot,
  Camera,
  Cpu,
  Gamepad2,
  Headphones,
  House,
  Laptop,
  MonitorSmartphone,
  PlugZap,
  Rocket,
  Smartphone,
  Tv,
  Watch,
} from "lucide-react";

export const marqueeIconOptions = [
  { id: "smartphone", label: "Smartphone", Icon: Smartphone },
  { id: "bot", label: "Robot", Icon: Bot },
  { id: "laptop", label: "Laptop", Icon: Laptop },
  { id: "gamepad", label: "Gamepad", Icon: Gamepad2 },
  { id: "headphones", label: "Headphones", Icon: Headphones },
  { id: "home", label: "Smart home", Icon: House },
  { id: "camera", label: "Camera", Icon: Camera },
  { id: "cpu", label: "Processor", Icon: Cpu },
  { id: "monitor", label: "Display", Icon: MonitorSmartphone },
  { id: "plug", label: "Connected device", Icon: PlugZap },
  { id: "rocket", label: "Launch", Icon: Rocket },
  { id: "tv", label: "Television", Icon: Tv },
  { id: "watch", label: "Wearable", Icon: Watch },
] as const;

export const marqueeIconIds = marqueeIconOptions.map((option) => option.id) as [
  (typeof marqueeIconOptions)[number]["id"],
  ...(typeof marqueeIconOptions)[number]["id"][]
];

export type MarqueeIconKey = (typeof marqueeIconOptions)[number]["id"];
