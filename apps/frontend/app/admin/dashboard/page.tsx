"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Download, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataGrid, type Column, type SortColumn } from "react-data-grid";
import "react-data-grid/lib/styles.css";

interface Player {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  residential_area: string;
  firm_name: string;
  designation: string;
  registration_status: string;
  payment_status: string | null;
  created_at: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const credentials = localStorage.getItem("admin_credentials");
        if (!credentials) {
          router.push("/admin");
          return;
        }

        const [username, password] = atob(credentials).split(":");

        const response = await fetch(
          `/api/admin/players?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        );

        if (response.status === 401) {
          localStorage.removeItem("admin_credentials");
          router.push("/admin");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }

        const data = await response.json();
        setPlayers(data.players);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch players",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [router]);

  const filteredPlayers = useMemo(() => {
    if (!searchTerm) return players;

    const term = searchTerm.toLowerCase();
    return players.filter(
      (p) =>
        p.first_name.toLowerCase().includes(term) ||
        p.last_name.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        p.phone.includes(term) ||
        p.firm_name.toLowerCase().includes(term),
    );
  }, [players, searchTerm]);

  const sortedPlayers = useMemo(() => {
    if (sortColumns.length === 0) return filteredPlayers;

    return [...filteredPlayers].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = (sortCol: SortColumn) => {
          const aVal = a[sortCol.columnKey as keyof Player];
          const bVal = b[sortCol.columnKey as keyof Player];

          // Handle null/undefined values
          if (aVal == null && bVal == null) return 0;
          if (aVal == null) return sortCol.direction === "ASC" ? -1 : 1;
          if (bVal == null) return sortCol.direction === "ASC" ? 1 : -1;

          // Compare values
          if (aVal < bVal) return sortCol.direction === "ASC" ? -1 : 1;
          if (aVal > bVal) return sortCol.direction === "ASC" ? 1 : -1;
          return 0;
        };

        const result = comparator(sort);
        if (result !== 0) return result;
      }
      return 0;
    });
  }, [filteredPlayers, sortColumns]);

  const gridColumns: Column<Player>[] = [
    { key: "first_name", name: "First Name", sortable: true, width: 120 },
    { key: "last_name", name: "Last Name", sortable: true, width: 120 },
    { key: "email", name: "Email", sortable: true, width: 200 },
    { key: "phone", name: "Phone", sortable: true, width: 130 },
    {
      key: "residential_area",
      name: "Area",
      sortable: true,
      width: 150,
    },
    { key: "firm_name", name: "Firm", sortable: true, width: 150 },
    {
      key: "designation",
      name: "Designation",
      sortable: true,
      width: 130,
    },
    {
      key: "registration_status",
      name: "Registration",
      sortable: true,
      width: 140,
      renderCell: (props: { row: Player }) => (
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
            props.row.registration_status === "PAID"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
          }`}
        >
          {props.row.registration_status}
        </span>
      ),
    },
    {
      key: "payment_status",
      name: "Payment",
      sortable: true,
      width: 130,
      renderCell: (props: { row: Player }) =>
        props.row.payment_status ? (
          <span
            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
              props.row.payment_status === "CAPTURED"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400"
            }`}
          >
            {props.row.payment_status}
          </span>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">—</span>
        ),
    },
    {
      key: "created_at",
      name: "Registered At",
      sortable: true,
      width: 130,
      renderCell: (props: { row: Player }) =>
        props.row.created_at
          ? new Date(props.row.created_at).toLocaleDateString()
          : "—",
    },
  ];

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const credentials = localStorage.getItem("admin_credentials");
      if (!credentials) {
        router.push("/admin");
        return;
      }

      const [username, password] = atob(credentials).split(":");

      const response = await fetch(
        `/api/admin/players/csv?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to export CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `players-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_credentials");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Manage and view all registered players
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats and Export */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border border-slate-200 bg-white/95 shadow-lg dark:border-slate-700 dark:bg-slate-800/90">
            <CardHeader>
              <CardTitle>Total Players</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {filteredPlayers.length}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white/95 shadow-lg dark:border-slate-700 dark:bg-slate-800/90">
            <CardHeader>
              <CardTitle>Paid Players</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {
                  filteredPlayers.filter((p) => p.payment_status === "CAPTURED")
                    .length
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Search by name, email, phone, or firm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 h-10 rounded-lg border-slate-200 bg-white/80 px-4 text-slate-900 placeholder:text-slate-400 shadow-sm focus-visible:border-blue-400 focus-visible:ring-blue-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-900/40"
          />
          <Button
            onClick={handleExportCSV}
            disabled={exporting || filteredPlayers.length === 0}
            className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
          >
            {exporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </>
            )}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-lg border-2 border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Excel-like Grid Viewer */}
        <Card className="border border-slate-200 bg-white/95 shadow-lg dark:border-slate-700 dark:bg-slate-800/90 overflow-hidden">
          <CardHeader>
            <CardTitle>Players Data Grid</CardTitle>
            <CardDescription>
              {filteredPlayers.length} player
              {filteredPlayers.length !== 1 ? "s" : ""} displayed (Excel-like
              viewer with sorting)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPlayers.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                No players found
              </div>
            ) : (
              <div className="w-full" style={{ height: "600px" }}>
                <DataGrid
                  columns={gridColumns}
                  rows={sortedPlayers}
                  defaultColumnOptions={{
                    sortable: true,
                    resizable: true,
                  }}
                  sortColumns={sortColumns}
                  onSortColumnsChange={setSortColumns}
                  className="rdg-light"
                  style={{
                    height: "100%",
                    fontSize: "14px",
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-8 border border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle>Excel-like Spreadsheet Features</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Sort columns:</strong> Click on any column header to
                sort ascending/descending
              </li>
              <li>
                <strong>Resize columns:</strong> Drag the column borders to
                resize
              </li>
              <li>
                <strong>Search:</strong> Use the search bar to filter players by
                name, email, phone, or firm
              </li>
              <li>
                <strong>Export:</strong> Click &quot;Export CSV&quot; to
                download the data for Google Sheets
              </li>
              <li>
                <strong>Scroll:</strong> Use the scrollbars to navigate through
                large datasets
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
