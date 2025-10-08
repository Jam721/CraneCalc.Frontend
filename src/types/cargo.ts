export interface CargoItem {
    id: string;
    title: string;
    type: string;
    weight: number;
    length: number;
    width: number;
    height: number;
    volume: number;
    concreteGrade: string;
    description: string;
    imageUrl: string;
}

export interface CargoCatalogState {
    cargoItems: CargoItem[];
    searchQuery: string;
    cartQuantity: number;
    cartId: string | null;
    loading: boolean;
    error: string | null;
    totalCount: number;
    currentPage: number;
    pageSize: number;
}