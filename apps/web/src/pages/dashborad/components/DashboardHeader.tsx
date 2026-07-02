import {
  Activity,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardHeader() {
  return (
    <Card className="overflow-hidden border-primary/15 bg-liner-to-r from-primary/10 via-background to-background">
      <CardContent className="flex flex-col justify-between gap-8 p-8 lg:flex-row lg:items-center">
        <div className="space-y-4">
          <Badge
            variant="secondary"
            className="gap-2 px-3 py-1 font-semibold tracking-wide"
          >
            <Activity className="size-3.5" />
            Incident Management
          </Badge>

          <div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Reliability Command Center
            </h1>

            <p className="mt-3 max-w-2xl text-muted-foreground">
              Monitor incidents, coordinate response, and resolve issues
              before they impact your customers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-background/60 backdrop-blur">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-3 text-primary">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  SLA Health
                </p>

                <h3 className="text-xl font-bold">
                  99.8%
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-red-500/10 p-3 text-red-500">
                <AlertTriangle className="size-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Active Alerts
                </p>

                <h3 className="text-xl font-bold">
                  3
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}