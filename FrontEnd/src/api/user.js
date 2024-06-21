export async function getAllUser (token) {
  const response = await fetch("http://127.0.0.1:8000/users/read/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function deleteUser(token, userId) {
  const response = await fetch(`http://127.0.0.1:8000/users/delete/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();
}

export async function updateUser(userId, userData, token) {
  const response = await fetch(`http://127.0.0.1:8000/users/update/${userId}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  return response.json();
}

export async function createUser(firstname, lastname, email, password) {
  const response = await fetch("http://127.0.0.1:8000/users/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstname, lastname, email, password }),
  });
  return response.json();
}