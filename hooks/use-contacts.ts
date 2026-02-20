import { useState, useCallback, useEffect } from "react";

export interface ContactProperty {
    name?: string[];
    tel?: string[];
    email?: string[];
    address?: any[];
    icon?: any[];
}

export interface SelectedContact {
    name?: string;
    tel?: string;
    email?: string;
}

export function useContacts() {
    const [isSupported, setIsSupported] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if the Contact Picker API is supported
        setIsSupported("contacts" in navigator && "ContactsManager" in window);
    }, []);

    const selectContacts = useCallback(async (multiple = false) => {
        if (!("contacts" in navigator)) {
            setError("Contact Picker API not supported");
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            // Define properties we want to retrieve
            const props = ["name", "tel"];
            const opts = { multiple };

            // Request contacts from the native picker
            const contacts = await (navigator as any).contacts.select(props, opts);

            if (contacts && contacts.length > 0) {
                // Map the results to a simpler format
                const formattedContacts: SelectedContact[] = contacts.map((contact: any) => ({
                    name: contact.name?.[0] || "Sin nombre",
                    tel: contact.tel?.[0] || "",
                    email: contact.email?.[0] || "",
                }));

                setLoading(false);
                return formattedContacts;
            }

            setLoading(false);
            return [];
        } catch (err: any) {
            setLoading(false);
            if (err.name === "AbortError") {
                // User cancelled the picker, not really an error to show
                return null;
            }
            setError(err.message || "Error accessing contacts");
            return null;
        }
    }, []);

    return {
        isSupported,
        loading,
        error,
        selectContacts,
    };
}
