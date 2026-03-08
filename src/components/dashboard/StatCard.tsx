import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "warm" | "cool" | "accent";
  delay?: number;
}

const StatCard = ({ title, value, icon: Icon, trend, variant = "default", delay = 0 }: StatCardProps) => {
  const variantStyles = {
    default: "bg-card",
    warm: "gradient-warm",
    cool: "gradient-cool", 
    accent: "gradient-gold",
  };

  const isGradient = variant !== "default";

  return (
    <div
      className={cn(
        "rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in",
        variantStyles[variant]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium",
            isGradient ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-3xl font-bold mt-2 animate-count-up",
            isGradient ? "text-primary-foreground" : "text-foreground"
          )} style={{ animationDelay: `${delay + 200}ms` }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                trend.isPositive
                  ? isGradient ? "bg-primary-foreground/20 text-primary-foreground" : "bg-success/10 text-success"
                  : isGradient ? "bg-primary-foreground/20 text-primary-foreground" : "bg-destructive/10 text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className={cn(
                "text-xs",
                isGradient ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          isGradient ? "bg-primary-foreground/20" : "bg-muted"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            isGradient ? "text-primary-foreground" : "text-primary"
          )} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
