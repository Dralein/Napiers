export async function getProducts() {
  const response = await fetch("http://127.0.0.1:8000/products/read/", {
    method: "GET",
  });
  return response.json();
}

export async function createProduct(formData, token) {
  const response = await fetch("http://127.0.0.1:8000/products/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
}

export async function updateProduct(productId, productData, token) {
  const formData = new FormData();
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', productData.price);
  if (productData.image) {
    formData.append('image', productData.image);
  }

  const response = await fetch(`http://127.0.0.1:8000/products/update/${productId}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
}

export async function deleteProduct(productId, token) {
  const response = await fetch(`http://127.0.0.1:8000/products/delete/${productId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`http://127.0.0.1:8000/products/${id}/`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
