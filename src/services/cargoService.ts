import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import type { CargoItem } from '../types/cargo';
import type { ApiResponse, CargoApiParams } from '../types/paginatedResponse';
import { cargoMockData } from '../mocks/cargoData';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log('Initializing Firebase with config:', firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Функция для нормализации данных (поддержка обоих форматов)
function normalizeCargoData(data: any, id: string): CargoItem {
    // Поддержка как camelCase, так и PascalCase полей
    return {
        id: id,
        concreteGrade: data.concreteGrade || data.ConcreteGrade || '',
        description: data.description || data.Description || '',
        height: data.height || data.Height || 0,
        imageUrl: data.imageUrl || data.ImageUrl || '',
        length: data.length || data.Length || 0,
        title: data.title || data.Title || '',
        type: data.type || data.Type || '',
        volume: data.volume || data.Volume || 0,
        weight: data.weight || data.Weight || 0,
        width: data.width || data.Width || 0
    };
}

// Функция для проверки, не удален ли элемент
function isCargoDeleted(data: any): boolean {
    return data.isDeleted || data.IsDeleted || false;
}

export class CargoService {
    static async getCargoPaginated(params: CargoApiParams = {}): Promise<ApiResponse<CargoItem>> {
        try {
            console.log('Fetching from Firestore with params:', params);

            const pageNumber = params.PageNumber || 1;
            const pageSize = params.PageSize || 10;
            const offset = (pageNumber - 1) * pageSize;

            // Получаем все документы из коллекции cargo
            const querySnapshot = await getDocs(collection(db, 'cargo'));

            console.log('Firestore snapshot size:', querySnapshot.size);

            const cargos: CargoItem[] = [];
            querySnapshot.forEach((doc) => {
                const cargoData = doc.data();
                console.log(`Processing cargo ${doc.id}:`, cargoData);

                // Пропускаем удаленные элементы
                if (isCargoDeleted(cargoData)) {
                    console.log(`Skipping deleted cargo: ${doc.id}`);
                    return;
                }

                const normalizedCargo = normalizeCargoData(cargoData, doc.id);
                cargos.push(normalizedCargo);
            });

            console.log('Processed cargos:', cargos.length);

            // Применяем фильтры
            let filteredCargos = cargos;

            if (params.Title) {
                filteredCargos = filteredCargos.filter(item =>
                    item.title.toLowerCase().includes(params.Title!.toLowerCase())
                );
            }

            if (params.Type) {
                filteredCargos = filteredCargos.filter(item =>
                    item.type.toLowerCase().includes(params.Type!.toLowerCase())
                );
            }

            if (params.MinWeight !== undefined) {
                filteredCargos = filteredCargos.filter(item => item.weight >= params.MinWeight!);
            }

            if (params.MaxWeight !== undefined) {
                filteredCargos = filteredCargos.filter(item => item.weight <= params.MaxWeight!);
            }

            // Применяем пагинацию
            const startIndex = offset;
            const endIndex = startIndex + pageSize;
            const paginatedData = filteredCargos.slice(startIndex, endIndex);

            console.log('Final paginated data:', paginatedData.length, 'items');

            return {
                totalCount: filteredCargos.length,
                pageNumber,
                pageSize,
                items: paginatedData,
            };
        } catch (error) {
            console.error('Firestore request failed:', error);
            console.warn('Using mock data instead');
            return this.getMockCargoData(params);
        }
    }

    static async getCargoById(id: string): Promise<CargoItem | null> {
        try {
            console.log('Fetching cargo from Firestore by ID:', id);

            const docRef = doc(db, 'cargo', id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                console.log('Cargo not found in Firestore');
                return null;
            }

            const cargoData = docSnap.data();
            console.log('Found cargo data:', cargoData);

            // Пропускаем удаленные элементы
            if (isCargoDeleted(cargoData)) {
                return null;
            }

            return normalizeCargoData(cargoData, docSnap.id);
        } catch (error) {
            console.error('Firestore request failed:', error);
            console.warn('Using mock data instead');
            return cargoMockData.find(item => item.id === id) || null;
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
}