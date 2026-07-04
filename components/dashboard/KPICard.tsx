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
    <Card className="border-white/10 bg-slate-950/70 transition-all duration-200 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-[0_18px_60px_rgba(59,130,246,0.15)]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-2xl font-semibold text-white">{value}</p>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/25 to-purple-500/25 text-blue-200">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && <p className="mt-3 text-xs font-medium text-emerald-400">{trend} from last period</p>}
      </CardContent>
    </Card>
  );
}