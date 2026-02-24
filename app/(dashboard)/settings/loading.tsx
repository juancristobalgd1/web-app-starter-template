import { HeaderSkeleton } from "@/components/shared/header";

export default function SettingsLoading() {
    return (
        <div className="flex flex-col min-h-full animate-pulse">
            <HeaderSkeleton showTitle rightActionsCount={0} />
            <div className="flex-1 p-4">
                {[...Array(3)].map((_, s) => (
                    <div key={s} className="mb-6">
                        <div className="h-3 w-20 bg-muted rounded-md mb-3 ml-4" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3">
                                <div className="h-8 w-8 bg-muted rounded-full" />
                                <div className="flex-1 space-y-1.5">
                                    <div className="h-3.5 w-32 bg-muted rounded-md" />
                                    <div className="h-3 w-48 bg-muted/70 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
