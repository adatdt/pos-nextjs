export interface MenuItem {
    name: string;
    parentId: string;
    id: number;
     parentName?: string;
    child?: MenuItem[]; // Gunakan MenuItem[] agar bisa berisi data
    slug?: string;
    number?: number;
}