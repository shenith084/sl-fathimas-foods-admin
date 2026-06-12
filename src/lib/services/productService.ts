import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  weight: string;
  shelfLife: string;
  ingredients: string;
  description: string;
  emoji: string;
  badge: string | null;
  rating: number;
  reviews: number;
  customizable: boolean;
  stock_count: number;
  availability: "in_stock" | "out_of_stock" | "pre_order";
  images?: string[];
  deleted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export async function getProducts(includeDeleted = false): Promise<AdminProduct[]> {
  const query = adminDb.collection("products").orderBy("created_at", "desc");
  const snapshot = await query.get();
  
  let products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    created_at: doc.data().created_at?.toDate?.()?.toISOString() || null,
    updated_at: doc.data().updated_at?.toDate?.()?.toISOString() || null,
  })) as AdminProduct[];

  if (!includeDeleted) {
    products = products.filter(p => p.deleted_at === null || p.deleted_at === undefined);
  }

  return products;
}

export async function getProductById(id: string): Promise<AdminProduct | null> {
  const doc = await adminDb.collection("products").doc(id).get();
  if (!doc.exists) return null;
  return {
    id: doc.id,
    ...doc.data(),
    created_at: doc.data()?.created_at?.toDate?.()?.toISOString() || null,
    updated_at: doc.data()?.updated_at?.toDate?.()?.toISOString() || null,
  } as AdminProduct;
}

export async function getProductBySlug(slug: string): Promise<AdminProduct | null> {
  const query = await adminDb.collection("products").where("slug", "==", slug).limit(1).get();
  if (query.empty) return null;
  
  const doc = query.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
    created_at: doc.data()?.created_at?.toDate?.()?.toISOString() || null,
    updated_at: doc.data()?.updated_at?.toDate?.()?.toISOString() || null,
  } as AdminProduct;
}

export async function createProduct(data: Omit<AdminProduct, "id" | "created_at" | "updated_at">): Promise<string> {
  const ref = await adminDb.collection("products").add({
    ...data,
    deleted_at: null,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<AdminProduct>): Promise<void> {
  const { id: _id, created_at: _ca, ...rest } = data as AdminProduct;
  await adminDb.collection("products").doc(id).update({
    ...rest,
    updated_at: FieldValue.serverTimestamp(),
  });
}

export async function softDeleteProduct(id: string): Promise<void> {
  await adminDb.collection("products").doc(id).update({
    deleted_at: new Date().toISOString(),
    updated_at: FieldValue.serverTimestamp(),
  });
}

export async function updateProductStock(id: string, stock_count: number): Promise<void> {
  await adminDb.collection("products").doc(id).update({
    stock_count,
    availability: stock_count > 0 ? "in_stock" : "out_of_stock",
    updated_at: FieldValue.serverTimestamp(),
  });
}
