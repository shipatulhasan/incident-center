import { Inbox } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Clock3,
  Server,
  UserRound,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";




interface IncidentColumnProps {
  title: string;
  status: string;
  hint: string;
  incidents: any[];
}

interface IncidentCardProps {
  incident: any;
}

const severityVariant = {
  critical:
    "border-red-500/30 bg-red-500/10 text-red-500",

  high:
    "border-orange-500/30 bg-orange-500/10 text-orange-500",

  medium:
    "border-primary/30 bg-primary/10 text-primary",

  low:
    "border-green-500/30 bg-green-500/10 text-green-500",
};


export default function IncidentColumn({
  title,
  hint,
  status,
  incidents,
}: IncidentColumnProps) {
  function handleDrop(
    e: React.DragEvent<HTMLDivElement>,
  ) {
    e.preventDefault();

    const id = e.dataTransfer.getData("id");

    console.log(id, status);

    /**
     * call mutation here
     */
  }

  return (
    <Card
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="min-h-[650px] border-border/60"
    >
      <CardHeader className="border-b pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {title}
          </CardTitle>

          <Badge variant="secondary">
            {incidents.length}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {hint}
        </p>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {incidents.length === 0 && (
          <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed text-center">
            <Inbox className="mb-4 size-10 text-muted-foreground" />

            <p className="font-medium">
              No incidents
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Drag an incident here
            </p>
          </div>
        )}

        {incidents.map((incident) => (
          <IncidentCard
            key={incident._id}
            incident={incident}
          />
        ))}
      </CardContent>
    </Card>
  );
}





 function IncidentCard({
  incident,
}: IncidentCardProps) {
  return (
    <Link
      draggable
      to={`/incidents/${incident._id}`}
      onDragStart={(e) =>
        e.dataTransfer.setData(
          "id",
          incident._id
        )
      }
    >
      <Card className="cursor-grab transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg active:cursor-grabbing">
        <CardContent className="space-y-5 p-5">
          {/* Top */}

          <div className="flex items-center justify-between gap-3">
            <Badge
              variant="outline"
              className={cn(
                "capitalize font-semibold",
                severityVariant[
                  incident.severity as keyof typeof severityVariant
                ]
              )}
            >
              {incident.severity}
            </Badge>

            <Badge
              variant="secondary"
              className="gap-1"
            >
              <Server className="size-3" />

              {incident.service}
            </Badge>
          </div>

          {/* Title */}

          <div>
            <h3 className="line-clamp-2 text-lg font-semibold">
              {incident.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
              {incident.description}
            </p>
          </div>

          {/* Footer */}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback>
                  {incident.assignedTo?.name
                    ?.split(" ")
                    .map(
                      (
                        n: string
                      ) => n[0]
                    )
                    .join("")
                    .slice(0, 2) || (
                    <UserRound className="size-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  Assigned
                </span>

                <span className="text-sm font-medium">
                  {incident.assignedTo
                    ?.name ||
                    "Unassigned"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <Clock3 className="size-3.5" />

                MTTR
              </div>

              <p className="text-sm font-semibold">
                {incident.mttrMinutes ??
                  "—"}
                m
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}