import { DashboardHeader } from "@/components/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3f0e9] flex flex-col">
      <DashboardHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
