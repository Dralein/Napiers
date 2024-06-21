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

export async function logUser(email, password) {
  const response = await fetch("http://127.0.0.1:8000/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function getUserProfile(token) {
  const response = await fetch("http://127.0.0.1:8000/user/profile/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
