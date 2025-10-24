import { Card } from "@/components/ui/card";

export default function AlbumSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-muted" />
      <div className="p-4 space-y-2">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-1/4" />
      </div>
    </Card>
  );
}
