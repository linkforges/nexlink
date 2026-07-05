import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  subtitle?: string;
}

export function KPICard({ title, value, icon: Icon, trend, subtitle }: KPICardProps) {
  return (
    <Card className="group frosted-panel transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01] hover:border-cyan-400/40">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-2xl font-semibold text-white">{value}</p>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/25 to-fuchsia-500/25 text-cyan-100 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && <p className="mt-3 text-xs font-medium text-emerald-400">{trend} from last period</p>}
      </CardContent>
    </Card>
  );
}