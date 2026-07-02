import { useMemo, useState } from "react";
import { AlertTriangle, Clock3, Plus, Search, ShieldAlert, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import DashboardHeader from "./components/DashboardHeader";


// import CreateIncidentDialog from "./components/CreateIncidentDialog";
import MetricCard from "./components/MatricCard";
import IncidentColumn from "./components/IncidentColumn";

const columns = [
  {
    key: "open",
    title: "Open",
    hint: "Drop new incidents here",
  },
  {
    key: "investigating",
    title: "Investigating",
    hint: "Active debugging",
  },
  {
    key: "resolved",
    title: "Resolved",
    hint: "Ready for postmortem",
  },
];

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  /**
   * Replace with TanStack Query
   */

  const incidents: any[] = [];
  const users: any[] = [];

  const stats = {
    total: 18,
    avgMttr: 34,
    bySeverity: {
      critical: 3,
    },
    onCall: [1, 2, 3],
  };

  const metrics = [
  {
    title: "Total Incidents",
    value: stats.total,
    icon: AlertTriangle,
    trend: 12,
  },
  {
    title: "Average MTTR",
    value: `${stats.avgMttr}m`,
    icon: Clock3,
    trend: -8,
  },
  {
    title: "Critical",
    value: stats.bySeverity.critical,
    icon: ShieldAlert,
  },
  {
    title: "On Call",
    value: stats.onCall.length,
    icon: Users,
  },
];

  const filtered = useMemo(() => {
    return incidents.filter((incident) =>
      `${incident.title} ${incident.service} ${incident.severity}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [incidents, query]);

  return (
    <section className="space-y-8">

      <DashboardHeader />

      <div className="flex flex-col gap-4 lg:flex-row">

        <div className="relative flex-1">

          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            className="pl-10 h-11"
            placeholder="Search incident, service or severity..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

        </div>

        <Button
          size="lg"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 size-4" />
          Create Incident
        </Button>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        {metrics.map((metric) => (
    <MetricCard
      key={metric.title}
      title={metric.title}
      value={metric.value}
      trend={metric.trend}
      icon={<metric.icon className="size-5" />}
    />
  ))}

      </div>

      <div className="grid gap-6 xl:grid-cols-3">

        {columns.map((column) => (
          <IncidentColumn
            key={column.key}
            title={column.title}
            hint={column.hint}
            status={column.key}
            incidents={filtered.filter(
              (i: any) => i.status === column.key
            )}
          />
        ))}

      </div>

      {/* <CreateIncidentDialog
        open={open}
        onOpenChange={setOpen}
        users={users}
      /> */}

    </section>
  );
}