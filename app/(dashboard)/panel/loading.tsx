import { HeaderSkeleton } from "@/components/shared/header";

export default function PanelLoading() {
    return (
        <div className="flex flex-col min-h-full animate-pulse">
            <HeaderSkeleton showTitle rightActionsCount={2} />
            <div className="flex-1 p-8 md:p-10 space-y-4 pl-10 pr-10">
                <div className="space-y-2 px-4">
                    <div className="h-4 w-40 bg-muted rounded-md mx-6" />
                    <div className="mt-8 space-y-3 px-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
