import { HeaderSkeleton } from "@/components/shared/header";

export default function DocumentsLoading() {
    return (
        <div className="flex flex-col min-h-full animate-pulse">
            <HeaderSkeleton showTitle rightActionsCount={0} />
            <div className="flex-1 p-8 md:p-10">
                <div className="flex gap-1 mb-4 bg-muted p-1 rounded-xl">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex-1 h-8 rounded-lg bg-background/50" />
                    ))}
                </div>
                <div className="space-y-3 mt-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-muted rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
