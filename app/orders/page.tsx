"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, RotateCcw, Search, Trash2 } from "lucide-react";

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

  // Load orders from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("racketOrders");
      if (raw) {
        const parsed = JSON.parse(raw) as OrderRecord[];
        setOrders(parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      }
    } catch (e) {
      console.error("Failed to parse orders", e);
    }
  }, []);

  const persist = (next: OrderRecord[]) => {
    setOrders(next);
    try {
      localStorage.setItem("racketOrders", JSON.stringify(next));
    } catch (e) {
      console.error("Persist failed", e);
    }
  };

  const advanceStatus = (id: string) => {
    persist(
      orders.map((o) => {
        if (o.id !== id) return o;
        const idx = STATUS_SEQUENCE.indexOf(o.status);
        if (idx === -1 || idx === STATUS_SEQUENCE.length - 1) return o;
        return { ...o, status: STATUS_SEQUENCE[idx + 1] };
      })
    );
  };

  const revertStatus = (id: string) => {
    persist(
      orders.map((o) => {
        if (o.id !== id) return o;
        const idx = STATUS_SEQUENCE.indexOf(o.status);
        if (idx <= 0) return o;
        return { ...o, status: STATUS_SEQUENCE[idx - 1] };
      })
    );
  };

  const deleteOrder = (id: string) => {
    if (!confirm("Delete this order?")) return;
    persist(orders.filter((o) => o.id !== id));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Orders</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Manage racket stringing workflow. Data is local to this browser.
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
              onClick={() => {
                if (!confirm("Reset ALL orders?")) return;
                persist([]);
              }}
            >
              Clear All
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center space-y-4">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
              <p className="text-slate-600">No orders match your filters.</p>
              <p className="text-slate-500 text-sm">Submit one through the intake form.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((o) => {
              const idx = STATUS_SEQUENCE.indexOf(o.status);
              const next = STATUS_SEQUENCE[idx + 1];
              const prev = STATUS_SEQUENCE[idx - 1];
              return (
                <Card key={o.id} className="shadow-sm hover:shadow-md transition-shadow border-slate-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg">{o.customerName}</CardTitle>
                        <div className="text-xs text-slate-500 mt-1">
                          {new Date(o.createdAt).toLocaleString()} • {o.serviceType}
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`border px-2 py-0.5 text-xs font-medium rounded ${STATUS_COLOR[o.status]}`}
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
                      <div>{o.stringType || <span className="text-slate-400">(n/a)</span>}</div>
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
                        <Button size="sm" variant="outline" onClick={() => revertStatus(o.id)} title="Revert">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                      {next && (
                        <Button size="sm" onClick={() => advanceStatus(o.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1">
                          {STATUS_LABEL[next]}
                        </Button>
                      )}
                      {!next && (
                        <Button size="sm" variant="outline" onClick={() => deleteOrder(o.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
