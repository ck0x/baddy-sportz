"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  RotateCcw,
  Search,
  Trash2,
  Table as TableIcon,
  Rows,
  Download,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface OrderRecord {
  id: string;
  createdAt: string; // ISO
  status: OrderStatus;
  customerName: string;
  contactNumber: string;
  email: string;
  racketBrand: string;
  racketModel: string;
  stringType: string;
  serviceType: string;
  additionalNotes: string;
  // Future fields (prepped for backend) – may be empty now
  requestedTensionMains?: number;
  requestedTensionCross?: number;
  actualTensionMains?: number;
  actualTensionCross?: number;
}

type OrderStatus = "pending" | "in-progress" | "ready" | "picked-up";

const STATUS_SEQUENCE: OrderStatus[] = [
  "pending",
  "in-progress",
  "ready",
  "picked-up",
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  ready: "Ready",
  "picked-up": "Picked Up",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "picked-up": "bg-slate-200 text-slate-700 border-slate-300",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const storeId = Number(
    process.env.NEXT_PUBLIC_DEFAULT_STORE_ID || process.env.STORE_ID || 1
  );

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders?storeId=${storeId}`);
      if (!res.ok) throw new Error("api fetch failed");
      const json = await res.json();
      const apiOrders = (json.data || []).map((j: any) => ({
        id: String(j.id),
        createdAt: j.created_at,
        status: (j.status === "in_progress"
          ? "in-progress"
          : j.status) as OrderStatus,
        customerName: j.customer_name,
        contactNumber: j.contact_number,
        email: j.email,
        racketBrand: j.racket_brand,
        racketModel: j.racket_model,
        stringType: j.string_type,
        serviceType: j.service_type?.toLowerCase() || "standard",
        additionalNotes: j.additional_notes || "",
      })) as OrderRecord[];
      setOrders(apiOrders);
      // sync to localStorage for offline fallback
      try {
        localStorage.setItem("racketOrders", JSON.stringify(apiOrders));
      } catch {}
    } catch (err) {
      console.warn("Using localStorage fallback", err);
      try {
        const raw = localStorage.getItem("racketOrders");
        if (raw) setOrders(JSON.parse(raw));
      } catch {}
    }
  }, [storeId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const persist = (next: OrderRecord[]) => {
    setOrders(next);
    try {
      localStorage.setItem("racketOrders", JSON.stringify(next));
    } catch {}
  };

  const serverPatch = async (id: string, payload: any) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
  };

  const advanceStatus = (id: string) => {
    let changed: OrderRecord | undefined;
    const nextOrders = orders.map((o) => {
      if (o.id !== id) return o;
      const idx = STATUS_SEQUENCE.indexOf(o.status);
      if (idx === -1 || idx === STATUS_SEQUENCE.length - 1) return o;
      changed = { ...o, status: STATUS_SEQUENCE[idx + 1] };
      return changed;
    });
    persist(nextOrders);
    if (changed) serverPatch(changed.id, { status: changed.status });
  };

  const revertStatus = (id: string) => {
    let changed: OrderRecord | undefined;
    const nextOrders = orders.map((o) => {
      if (o.id !== id) return o;
      const idx = STATUS_SEQUENCE.indexOf(o.status);
      if (idx <= 0) return o;
      changed = { ...o, status: STATUS_SEQUENCE[idx - 1] };
      return changed;
    });
    persist(nextOrders);
    if (changed) serverPatch(changed.id, { status: changed.status });
  };

  const deleteOrder = (id: string) => {
    if (!confirm("Delete this order?")) return;
    persist(orders.filter((o) => o.id !== id));
    try {
      fetch(`/api/orders/${id}`, { method: "DELETE" });
    } catch {}
  };

  const bulkAdvance = () => {
    persist(
      orders.map((o) => {
        if (!selectedIds.has(o.id)) return o;
        const idx = STATUS_SEQUENCE.indexOf(o.status);
        if (idx === -1 || idx === STATUS_SEQUENCE.length - 1) return o;
        return { ...o, status: STATUS_SEQUENCE[idx + 1] };
      })
    );
    setSelectedIds(new Set());
  };

  const bulkDelete = () => {
    if (!selectedIds.size) return;
    if (!confirm(`Delete ${selectedIds.size} selected order(s)?`)) return;
    persist(orders.filter((o) => !selectedIds.has(o.id)));
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // (moved below filtered)

  const exportCSV = () => {
    const rows = [
      [
        "id",
        "createdAt",
        "status",
        "customerName",
        "contactNumber",
        "email",
        "racketBrand",
        "racketModel",
        "stringType",
        "serviceType",
        "requestedTensionMains",
        "requestedTensionCross",
        "actualTensionMains",
        "actualTensionCross",
        "additionalNotes",
      ],
      ...orders.map((o) => [
        o.id,
        o.createdAt,
        o.status,
        o.customerName,
        o.contactNumber,
        o.email || "",
        o.racketBrand,
        o.racketModel,
        o.stringType || "",
        o.serviceType,
        o.requestedTensionMains?.toString() || "",
        o.requestedTensionCross?.toString() || "",
        o.actualTensionMains?.toString() || "",
        o.actualTensionCross?.toString() || "",
        (o.additionalNotes || "").replace(/\n/g, " "),
      ]),
    ];
    const csv = rows
      .map((r) =>
        r
          .map((cell) => {
            if (cell.includes(",") || cell.includes('"')) {
              return '"' + cell.replace(/"/g, '""') + '"';
            }
            return cell;
          })
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `racket-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        o.customerName.toLowerCase().includes(s) ||
        o.racketModel.toLowerCase().includes(s) ||
        o.racketBrand.toLowerCase().includes(s)
      );
    });
  }, [orders, statusFilter, search]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((o) => selectedIds.has(o.id));
  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      if (allVisibleSelected) {
        const next = new Set(prev);
        filtered.forEach((o) => next.delete(o.id));
        return next;
      }
      const next = new Set(prev);
      filtered.forEach((o) => next.add(o.id));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col 2xl:flex-row gap-4 2xl:items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Orders</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Manage racket stringing workflow. (Local only until backend
              added.)
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search name / model"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-56"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {STATUS_SEQUENCE.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setViewMode(viewMode === "cards" ? "table" : "cards")
              }
              title={viewMode === "cards" ? "Table view" : "Card view"}
            >
              {viewMode === "cards" ? (
                <TableIcon className="h-4 w-4" />
              ) : (
                <Rows className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={exportCSV}
              title="Export CSV"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!confirm("Reset ALL orders?")) return;
                persist([]);
              }}
            >
              Clear All
            </Button>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <Card className="border-emerald-300/50 bg-emerald-50/60">
            <CardContent className="p-4 flex flex-wrap gap-3 items-center text-sm">
              <span className="font-medium">{selectedIds.size} selected</span>
              <Button size="sm" variant="outline" onClick={bulkAdvance}>
                Advance Status
              </Button>
              <Button size="sm" variant="outline" onClick={bulkDelete}>
                Delete
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds(new Set())}
                className="text-slate-500"
              >
                Clear Selection
              </Button>
            </CardContent>
          </Card>
        )}

        {filtered.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center space-y-4">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="text-slate-600">No orders match your filters.</p>
              <p className="text-slate-500 text-sm">
                Submit one through the intake form.
              </p>
            </CardContent>
          </Card>
        ) : viewMode === "cards" ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((o) => {
              const idx = STATUS_SEQUENCE.indexOf(o.status);
              const next = STATUS_SEQUENCE[idx + 1];
              const prev = STATUS_SEQUENCE[idx - 1];
              const selected = selectedIds.has(o.id);
              return (
                <Card
                  key={o.id}
                  className={`shadow-sm hover:shadow-md transition-shadow border-slate-200 relative ${
                    selected ? "ring-2 ring-emerald-400" : ""
                  }`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("button")) return;
                    toggleSelect(o.id);
                  }}
                >
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-emerald-600"
                      checked={selected}
                      onChange={() => toggleSelect(o.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <CardHeader className="pb-2 pt-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">
                          {o.customerName}
                        </CardTitle>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(o.createdAt).toLocaleString()} •{" "}
                          {o.serviceType}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`border px-2 py-0.5 text-xs font-medium rounded ${
                          STATUS_COLOR[o.status]
                        }`}
                      >
                        {STATUS_LABEL[o.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="text-slate-500">Racket</div>
                      <div className="font-medium">
                        {o.racketBrand || "—"} {o.racketModel}
                      </div>
                      <div className="text-slate-500">String</div>
                      <div>
                        {o.stringType || (
                          <span className="text-slate-400">(n/a)</span>
                        )}
                      </div>
                      <div className="text-slate-500">Contact</div>
                      <div>{o.contactNumber}</div>
                      {o.email && (
                        <>
                          <div className="text-slate-500">Email</div>
                          <div className="truncate">{o.email}</div>
                        </>
                      )}
                    </div>
                    {o.additionalNotes && (
                      <div className="pt-2 border-t text-slate-600 text-xs leading-relaxed">
                        {o.additionalNotes}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      {prev && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => revertStatus(o.id)}
                          title="Revert"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      {next && (
                        <Button
                          size="sm"
                          onClick={() => advanceStatus(o.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                        >
                          {STATUS_LABEL[next]}
                        </Button>
                      )}
                      {!next && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteOrder(o.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-auto">
                <Table className="min-w-[1000px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-emerald-600"
                          checked={allVisibleSelected}
                          onChange={toggleSelectAllVisible}
                        />
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Racket</TableHead>
                      <TableHead>String</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-40">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((o) => {
                      const idx = STATUS_SEQUENCE.indexOf(o.status);
                      const next = STATUS_SEQUENCE[idx + 1];
                      const prev = STATUS_SEQUENCE[idx - 1];
                      const selected = selectedIds.has(o.id);
                      return (
                        <TableRow
                          key={o.id}
                          className={selected ? "bg-emerald-50" : ""}
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-emerald-600"
                              checked={selected}
                              onChange={() => toggleSelect(o.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {o.customerName}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`border px-2 py-0.5 text-xs font-medium rounded ${
                                STATUS_COLOR[o.status]
                              }`}
                            >
                              {STATUS_LABEL[o.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {o.racketBrand || "—"} {o.racketModel}
                          </TableCell>
                          <TableCell>
                            {o.stringType || (
                              <span className="text-slate-400">(n/a)</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {o.serviceType}
                          </TableCell>
                          <TableCell className="text-xs space-y-1">
                            <div>{o.contactNumber}</div>
                            {o.email && (
                              <div className="text-slate-500 truncate max-w-[160px] text-[10px]">
                                {o.email}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-xs whitespace-nowrap">
                            {new Date(o.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {prev && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => revertStatus(o.id)}
                                  title="Revert"
                                  className="h-7 px-2"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              )}
                              {next && (
                                <Button
                                  size="sm"
                                  onClick={() => advanceStatus(o.id)}
                                  className="h-7 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                  {STATUS_LABEL[next]}
                                </Button>
                              )}
                              {!next && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteOrder(o.id)}
                                  title="Delete"
                                  className="h-7 px-2"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
