import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContext = createContext();

const thdKeys = [
    'THD of Voltage V12 1',
    'THD of Voltage V12 2',
    'THD of Voltage V12 3',
    'THD of Current I1',
    'THD of Current I2',
    'THD of Current I3',
];

export function AppProvider({ children }) {
    const [maxTHD, setMaxTHD] = useState(() => {
        const stored = localStorage.getItem('maxTHD');
        return stored ? JSON.parse(stored) : thdKeys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    });

    const [initialValues, setInitialValues] = useState({
        revision: "",
        licence: "",
        mailid: "",
        ip: "",
        name: "",
    });
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        async function fetchInitialValues() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/get-initial-values");
                setInitialValues(response.data);
            } catch (error) {
                console.error("Error fetching initial values:", error);
            }
        }
        fetchInitialValues();
    }, []);

    const updateMaxTHD = (data) => {
        let updated = { ...maxTHD };
        let changed = false;
    
        thdKeys.forEach((key) => {
          const newValue = parseFloat(data[key]) || 0;
          if (newValue > updated[key]) {
            updated[key] = newValue;
            changed = true;
          }
        });
    
        if (changed) {
          setMaxTHD(updated);
          localStorage.setItem('maxTHD', JSON.stringify(updated));
        }
    };

    return (
        <AppContext.Provider value={{ initialValues, isConnected, setIsConnected, maxTHD, updateMaxTHD }}>
            {children}
        </AppContext.Provider>
    );
}
