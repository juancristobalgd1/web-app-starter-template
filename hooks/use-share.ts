import { useCallback, useState } from "react";

interface ShareOptions {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
}

export function useShare() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const isSupported = typeof navigator !== "undefined" && !!navigator.share;
    const canShareFiles = typeof navigator !== "undefined" && !!navigator.canShare;

    const share = useCallback(async (options: ShareOptions) => {
        if (!isSupported) {
            const err = new Error("Web Share API not supported");
            setError(err);
            return { supported: false, success: false, error: err };
        }

        setLoading(true);
        setError(null);

        try {
            if (options.files && canShareFiles) {
                if (!navigator.canShare({ files: options.files })) {
                    throw new Error("Files cannot be shared");
                }
            }

            await navigator.share(options);
            setLoading(false);
            return { supported: true, success: true };
        } catch (err: any) {
            setLoading(false);
            if (err.name !== "AbortError") {
                setError(err);
            }
            return { supported: true, success: false, error: err };
        }
    }, [isSupported, canShareFiles]);

    return {
        share,
        loading,
        error,
        isSupported,
        canShareFiles,
    };
}
