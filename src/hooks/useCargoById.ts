import { useState, useEffect } from 'react';
import type { CargoItem } from '../types/cargo';
import { CargoService } from '../services/cargoService';

export const useCargoById = (id: string | undefined) => {
    const [cargo, setCargo] = useState<CargoItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchCargo = async () => {
            try {
                setLoading(true);
                setError(null);

                const cargoData = await CargoService.getCargoById(id);

                if (isMounted) {
                    setCargo(cargoData);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch cargo data');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCargo();

        return () => {
            isMounted = false;
        };
    }, [id]);

    return {
        cargo,
        loading,
        error
    };
};