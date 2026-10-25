
const API_URL = "http://localhost:3001/api/admin";

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status}).`
    );
  }

  return data;
};

export const getDashboardStats = async (token) => {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const response = await fetch(`${API_URL}/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  return handleResponse(response);
};

export default 
  getDashboardStats