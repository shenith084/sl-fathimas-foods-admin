import { adminDb } from "../firebase/admin";

export interface AdminCategory {
  id: string; // the slug
  name: string;
  emoji: string;
  color?: string;
  sort_order?: number;
  created_at: string | null;
  updated_at: string | null;
}

export async function getCategories(): Promise<AdminCategory[]> {
  const snapshot = await adminDb.collection("categories").orderBy("sort_order", "asc").get();
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at?.toDate?.()?.toISOString() || null,
    updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || null,
  })) as AdminCategory[];
}

export async function getCategoryById(id: string): Promise<AdminCategory | null> {
  const doc = await adminDb.collection("categories").doc(id).get();
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at?.toDate?.()?.toISOString() || null,
    updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || null,
  } as AdminCategory;
}

export async function createCategory(data: Partial<AdminCategory>): Promise<AdminCategory> {
  if (!data.id) throw new Error("Category ID (slug) is required");
  
  const ref = adminDb.collection("categories").doc(data.id);
  const doc = await ref.get();
  
  if (doc.exists) {
    throw new Error("Category with this slug already exists");
  }

  const newCat = {
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
  };

  await ref.set(newCat);
  return getCategoryById(data.id) as Promise<AdminCategory>;
}

export async function updateCategory(id: string, data: Partial<AdminCategory>): Promise<AdminCategory> {
  const ref = adminDb.collection("categories").doc(id);
  const doc = await ref.get();
  
  if (!doc.exists) {
    throw new Error("Category not found");
  }

  const updates = {
    ...data,
    updated_at: new Date(),
  };
  delete updates.id; // Don't allow changing ID

  await ref.update(updates);
  return getCategoryById(id) as Promise<AdminCategory>;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await adminDb.collection("categories").doc(id).delete();
  return true;
}
