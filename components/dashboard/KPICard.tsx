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
    <Card className="bg-[#1A1A1A] border-gray-800 hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-blue-500/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-blue-400" />
          </div>
        </div>
        {trend && <p className="text-xs text-green-400 mt-2">{trend} from last period</p>}
      </CardContent>
    </Card>
  );
}