import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute requireAuth requireAdmin>
      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-xl uppercase tracking-widest">
          Admin Dashboard
        </h1>

        <p className="opacity-60">
          Upload tracks, manage merch, control access.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/upload"
            className="surface p-4 hover:bg-neutral-800 transition"
          >
            <h3 className="uppercase text-sm tracking-widest">
              Upload Track / Merch
            </h3>
            <p className="text-sm opacity-60 mt-1">
              Add new music and merch products
            </p>
          </Link>

        </div>
      </main>
    </ProtectedRoute>
  );
}
