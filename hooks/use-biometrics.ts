import { useCallback, useState } from "react";

export function useBiometrics() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isSupported = typeof window !== "undefined" &&
        !!window.PublicKeyCredential &&
        typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function";

    const checkAvailability = useCallback(async () => {
        if (!isSupported) return false;
        return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    }, [isSupported]);

    // Note: This is a simplified helper. A real WebAuthn implementation 
    // requires server-side coordination for challenges and verification.
    const authenticate = useCallback(async (challenge: string, rpName: string, userName: string) => {
        if (!isSupported) {
            setError("Biometrics not supported");
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            // Simplified example of a credential request
            // In reality, 'challenge' must be a BufferSource from the server
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
                    rp: { name: rpName },
                    user: {
                        id: Uint8Array.from(userName, c => c.charCodeAt(0)),
                        name: userName,
                        displayName: userName
                    },
                    pubKeyCredParams: [{ alg: -7, type: "public-key" }], // ES256
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required"
                    }
                }
            });

            setLoading(false);
            return credential;
        } catch (err: any) {
            setLoading(false);
            setError(err.message || "Biometric authentication failed");
            return null;
        }
    }, [isSupported]);

    return {
        isSupported,
        loading,
        error,
        checkAvailability,
        authenticate,
    };
}
