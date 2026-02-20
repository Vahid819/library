export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
