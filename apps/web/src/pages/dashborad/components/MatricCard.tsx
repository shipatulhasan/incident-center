import {
  ArrowDown,
  ArrowUp,
  Minus,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon?: React.ReactNode;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
}: MetricCardProps) {
  const positive = trend !== undefined && trend > 0;
  const negative = trend !== undefined && trend < 0;

  return (
    <Card className="group transition-all border-border/40
group
border-border/40
bg-card
shadow-md

duration-300
hover:-translate-y-1
hover:shadow-2xl
hover:border-primary">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <h2 className="text-4xl font-bold tracking-tight">
              {value}
            </h2>

            {subtitle && (
              <p className="text-sm text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {icon && (
            <div className="rounded-xl border bg-primary/10 p-3 text-primary">
              {icon}
            </div>
          )}
        </div>

        {trend !== undefined && (
          <div
            className={cn(
              "mt-6 flex items-center gap-2 text-sm font-medium",
              positive && "text-green-500",
              negative && "text-red-500",
              trend === 0 && "text-muted-foreground"
            )}
          >
            {positive && (
              <ArrowUp className="size-4" />
            )}

            {negative && (
              <ArrowDown className="size-4" />
            )}

            {trend === 0 && (
              <Minus className="size-4" />
            )}

            {trend > 0 && `+${trend}%`}
            {trend < 0 && `${trend}%`}
            {trend === 0 && "No change"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}