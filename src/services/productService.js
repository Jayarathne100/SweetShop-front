const API_URL = "http://localhost:3001/api/products";

// Read the server response safely
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Get all products
export const getProducts = async () => {
  const response = await fetch(API_URL);
  return handleResponse(response);
};

// Get a single product
export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
};

// Create product with an image
export const createProduct = async (productData, token) => {
  const formData = new FormData();

  formData.append("name", productData.name);
  formData.append("description", productData.description || "");
  formData.append("price", String(productData.price));
  formData.append("category", productData.category);
  formData.append("stock", String(productData.stock ?? 0));

  if (productData.image) {
    formData.append("image", productData.image);
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
};

// Update product, optionally replacing its image
export const updateProduct = async (id, productData, token) => {
  const formData = new FormData();

  Object.entries(productData).forEach(([key, value]) => {
    if (key === "image" || value === undefined || value === null) {
      return;
    }

    formData.append(key, String(value));
  });

  if (productData.image instanceof File) {
    formData.append("image", productData.image);
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
};

// Delete product
export const deleteProduct = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};