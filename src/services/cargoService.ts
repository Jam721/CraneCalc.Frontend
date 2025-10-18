import type { CargoItem } from '../types/cargo';
import type { ApiResponse, CargoApiParams } from '../types/paginatedResponse';
import { cargoMockData } from '../mocks/cargoData';

const API_BASE_URL = '/api';

export class CargoService {
    static async getCargoPaginated(params: CargoApiParams = {}): Promise<ApiResponse<CargoItem>> {
        try {
            const url = new URL(`${API_BASE_URL}/cargo/paginated`, window.location.origin);

            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value.toString());
                }
            });

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse<CargoItem> = await response.json();
            return data;
        } catch (error) {
            console.warn('API request failed, using mock data:', error);

            return this.getMockCargoData(params);
        }
    }

    private static getMockCargoData(params: CargoApiParams): ApiResponse<CargoItem> {
        let filteredData = cargoMockData;

        if (params.Title) {
            filteredData = filteredData.filter(item =>
                item.title.toLowerCase().includes(params.Title!.toLowerCase())
            );
        }

        if (params.Type) {
            filteredData = filteredData.filter(item =>
                item.type.toLowerCase().includes(params.Type!.toLowerCase())
            );
        }

        if (params.MinWeight !== undefined) {
            filteredData = filteredData.filter(item => item.weight >= params.MinWeight!);
        }

        if (params.MaxWeight !== undefined) {
            filteredData = filteredData.filter(item => item.weight <= params.MaxWeight!);
        }

        const pageNumber = params.PageNumber || 1;
        const pageSize = params.PageSize || 10;
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
            totalCount: filteredData.length,
            pageNumber,
            pageSize,
            items: paginatedData,
        };
    }

    static async getCargoById(id: string): Promise<CargoItem | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/cargo?CargoId=${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CargoItem = await response.json();
            return data;
        } catch (error) {
            console.warn('API request failed, using mock data:', error);

            return cargoMockData.find(item => item.id === id) || null;
        }
    }
}