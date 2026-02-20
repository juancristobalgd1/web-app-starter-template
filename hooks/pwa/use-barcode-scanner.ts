import { useCallback, useState, useEffect } from "react";

interface Barcode {
    rawValue: string;
    format: string;
    boundingBox: DOMRectReadOnly;
    cornerPoints: { x: number; y: number }[];
}

export function useBarcodeScanner() {
    const [isSupported, setIsSupported] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsSupported("BarcodeDetector" in window);
    }, []);

    const scan = useCallback(async (imageSource: ImageBitmapSource) => {
        if (!isSupported) {
            setError("BarcodeDetector API not supported");
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            // In a real scenario, we might want to let the user choose formats
            const formats = ["qr_code", "ean_13", "code_128"];
            const detector = new (window as any).BarcodeDetector({ formats });
            const barcodes: Barcode[] = await detector.detect(imageSource);

            setLoading(false);
            return barcodes;
        } catch (err: any) {
            setLoading(false);
            setError(err.message || "Failed to scan barcode");
            return null;
        }
    }, [isSupported]);

    return {
        isSupported,
        loading,
        error,
        scan,
    };
}
