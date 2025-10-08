export interface ApiResponse<T> {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    items: T[];
}

export interface CargoApiParams {
    Title?: string;
    Type?: string;
    MinWeight?: number;
    MaxWeight?: number;
    PageNumber?: number;
    PageSize?: number;
}