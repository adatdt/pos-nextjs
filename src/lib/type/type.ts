export interface MenuItem {
    name: string;
    parentId: string;
    id: number;
    child?: MenuItem[]; // Gunakan MenuItem[] agar bisa berisi data
    slug?: string;
}