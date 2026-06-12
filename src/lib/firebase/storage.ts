export async function uploadProductImage(productId: string, file: File, index: number): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("productId", productId);
  formData.append("index", index.toString());

  const res = await fetch("/api/v1/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to upload image");
  }

  return data.url;
}
