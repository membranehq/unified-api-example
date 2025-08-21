import { Badge } from "@/components/ui/badge";
import appObjectConfig from "@/lib/app-object-config";

interface RecordTypeBadgeProps {
  recordType: string;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

export function RecordTypeBadge({
  recordType,
  variant = "secondary",
  className
}: RecordTypeBadgeProps) {
  const Icon = appObjectConfig[recordType as keyof typeof appObjectConfig]?.icon;

  return (
    <Badge variant={variant} className={className}>
      {Icon && (
        <Icon className="w-3.5 h-3.5 text-muted-foreground mr-1" />
      )}
      {recordType}
    </Badge>
  );
} 