import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4 text-center underline">
        <Link href="/dashboard">Home</Link>
      </h2>
      {children}
    </div>
  );
}
