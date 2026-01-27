"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Download, LogOut, Eye, X, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataGrid, type Column, type SortColumn } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import {
  adminGetConfig,
  adminUpdateConfig,
  approvePlayer,
  rejectPlayer,
} from "@/lib/api";

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
  payment_amount?: number;
  created_at: string | null;
  played_before?: string;
  batting_type?: string;
  bowling_type?: string;
  wicket_keeper?: string;
  name_on_jersey?: string;
  tshirt_size?: string;
  waist_size?: number;
  played_jypl_s7?: string;
  jypl_s7_team?: string;
  sr_no?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [regOpen, setRegOpen] = useState<boolean | null>(null);
  const [regUpdating, setRegUpdating] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

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
          `/api/admin/players?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&page=${page}&limit=${limit}`,
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
        setTotal(data.total);
        setTotalPaid(data.total_paid);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch players",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [router, page, limit]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const credentials = localStorage.getItem("admin_credentials");
        if (!credentials) {
          router.push("/admin");
          return;
        }

        const [username, password] = atob(credentials).split(":");
        const config = await adminGetConfig(username, password);
        setRegOpen(config.registration_open);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch config");
      }
    };

    fetchConfig();
  }, [router]);

  const handleToggleRegistration = async () => {
    if (regOpen === null) return;
    setRegUpdating(true);
    try {
      const credentials = localStorage.getItem("admin_credentials");
      if (!credentials) {
        router.push("/admin");
        return;
      }

      const [username, password] = atob(credentials).split(":");
      const updated = await adminUpdateConfig(username, password, !regOpen);
      setRegOpen(updated.registration_open);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update config");
    } finally {
      setRegUpdating(false);
    }
  };

  const handleApprove = async (playerId: string) => {
    setApproving(playerId);
    try {
      const credentials = localStorage.getItem("admin_credentials");
      if (!credentials) {
        router.push("/admin");
        return;
      }
      const [username, password] = atob(credentials).split(":");
      await approvePlayer(playerId, username, password);

      // Update local state
      setPlayers(
        players.map((p) =>
          p.id === playerId ? { ...p, registration_status: "APPROVED" } : p,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve player");
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (playerId: string) => {
    setRejecting(playerId);
    try {
      const credentials = localStorage.getItem("admin_credentials");
      if (!credentials) {
        router.push("/admin");
        return;
      }
      const [username, password] = atob(credentials).split(":");
      await rejectPlayer(playerId, username, password);

      // Update local state
      setPlayers(
        players.map((p) =>
          p.id === playerId ? { ...p, registration_status: "REJECTED" } : p,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject player");
    } finally {
      setRejecting(null);
    }
  };

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
    { key: "sr_no", name: "Sr. No.", width: 70, frozen: true },
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
          ? new Date(
              props.row.created_at.endsWith("Z")
                ? props.row.created_at
                : props.row.created_at + "Z",
            ).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
    },
    {
      key: "actions",
      name: "Actions",
      width: 140,
      sortable: false,
      renderCell: (props: { row: Player }) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              window.location.href = `mailto:${props.row.email}`;
            }}
            title="Send Email"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30 h-7 w-7 p-0"
          >
            <Mail className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedPlayer(props.row);
              setDetailsDialogOpen(true);
            }}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/30 h-7 text-xs flex-1"
          >
            <Eye className="mr-1 h-3 w-3" />
            Manage
          </Button>
        </div>
      ),
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

        {/* Pending Approvals Section */}
        {players.some((p) => p.registration_status === "WAITLIST") && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50/50 dark:border-yellow-900/40 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                <Loader2 className="h-5 w-5 animate-spin" />
                Pending Approvals
              </CardTitle>
              <CardDescription className="text-yellow-700 dark:text-yellow-500">
                The following players are waiting for approval.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {players
                  .filter((p) => p.registration_status === "WAITLIST")
                  .map((player) => (
                    <Card
                      key={player.id}
                      className="border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {player.first_name} {player.last_name}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {player.email}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400">
                            {player.created_at
                              ? new Date(
                                  player.created_at.endsWith("Z")
                                    ? player.created_at
                                    : player.created_at + "Z",
                                ).toLocaleTimeString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(player.id)}
                            disabled={!!approving || !!rejecting}
                            className="bg-green-600 text-white hover:bg-green-700 flex-1 h-8 text-xs"
                          >
                            {approving === player.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReject(player.id)}
                            disabled={!!approving || !!rejecting}
                            className="bg-red-600 text-white hover:bg-red-700 flex-1 h-8 text-xs"
                          >
                            {rejecting === player.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <>
                                <X className="mr-1 h-3 w-3" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats and Export */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border border-slate-200 bg-white/95 shadow-lg dark:border-slate-700 dark:bg-slate-800/90">
            <CardHeader>
              <CardTitle>Total Players</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {total}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white/95 shadow-lg dark:border-slate-700 dark:bg-slate-800/90">
            <CardHeader>
              <CardTitle>Paid Players</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                {totalPaid}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {players.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, total)} of {total} players
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page * limit >= total || loading}
            >
              Next
            </Button>
          </div>
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
          <div className="flex items-center gap-2">
            {regOpen !== null && (
              <span
                className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                  regOpen
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {regOpen ? "Registration Open" : "Registration Closed"}
              </span>
            )}
            <Button
              onClick={handleToggleRegistration}
              disabled={regUpdating || regOpen === null}
              className={
                regOpen
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }
            >
              {regUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : regOpen ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Close Form
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Open Form
                </>
              )}
            </Button>
          </div>
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
                  rows={
                    sortedPlayers.map((p, i) => ({
                      ...p,
                      sr_no: (page - 1) * limit + i + 1,
                    })) as Player[]
                  }
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

      {/* Details Modal */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Player Details</DialogTitle>
            <DialogDescription>
              Complete registration information for{" "}
              {selectedPlayer
                ? `${selectedPlayer.first_name} ${selectedPlayer.last_name}`
                : "player"}
            </DialogDescription>
          </DialogHeader>

          {selectedPlayer && (
            <div className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      First Name
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.first_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Last Name
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Email
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Phone
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Residential Area
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.residential_area}
                    </p>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                  Professional Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Firm Name
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.firm_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Designation
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.designation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cricket Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                  Cricket Profile
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Batting Type
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white capitalize">
                      {selectedPlayer.batting_type || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Bowling Type
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white capitalize">
                      {selectedPlayer.bowling_type || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Wicket Keeper
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white capitalize">
                      {selectedPlayer.wicket_keeper || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Jersey Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                  Jersey Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Name on Jersey
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.name_on_jersey || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      T-Shirt Size
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.tshirt_size || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Waist Size
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.waist_size
                        ? `${selectedPlayer.waist_size}"`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* JYPL Season 8 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                  JYPL Season 8
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Played in Season 8
                    </p>
                    <p className="mt-1 text-slate-900 dark:text-white capitalize">
                      {selectedPlayer.played_jypl_s7 || "—"}
                    </p>
                  </div>
                  {selectedPlayer.played_jypl_s7 === "yes" && (
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Team Name
                      </p>
                      <p className="mt-1 text-slate-900 dark:text-white">
                        {selectedPlayer.jypl_s7_team || "—"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Registration Status */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                  Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Registration Status
                    </p>
                    <p className="mt-1">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                          selectedPlayer.registration_status === "PAID"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {selectedPlayer.registration_status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Payment Status
                    </p>
                    <p className="mt-1">
                      {selectedPlayer.payment_status ? (
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                            selectedPlayer.payment_status === "CAPTURED"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {selectedPlayer.payment_status}
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400">
                          —
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Registered At
                    </span>
                    <p className="mt-1 text-slate-900 dark:text-white">
                      {selectedPlayer.created_at
                        ? new Date(
                            selectedPlayer.created_at.endsWith("Z")
                              ? selectedPlayer.created_at
                              : selectedPlayer.created_at + "Z",
                          ).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6"></div>
              {/* Actions Section Removed */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
