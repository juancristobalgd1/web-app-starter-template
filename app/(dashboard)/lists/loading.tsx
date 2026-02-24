import { HeaderSkeleton } from "@/components/shared/header";

export default function ListsLoading() {
    return (
        <div className="flex flex-col min-h-full animate-pulse">
            <HeaderSkeleton showTitle rightActionsCount={0} />
            <div className="flex-1 p-8 md:p-10">
                <div className="flex gap-2 mb-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-8 w-24 bg-muted rounded-full" />
                    ))}
                </div>
                <div className="space-y-3 mt-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 bg-muted rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
