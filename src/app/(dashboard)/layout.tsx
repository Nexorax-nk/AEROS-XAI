import { TelemetryProvider } from "@/context/TelemetryContext";
import { NavigationSidebar } from "@/components/NavigationSidebar";
import { TopHeader } from "@/components/TopHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TelemetryProvider>
      <NavigationSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 bg-[#000]">
        <TopHeader />
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#000]">
          {children}
        </div>
      </div>
    </TelemetryProvider>
  );
}
