import { BASE_URL } from '../config/config';

async function getCategories(token) {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

async function createCategory(data, token) {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: data.name,
      description: data.description || '',
      user_id: data.user_id,
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'ไม่สามารถสร้างหมวดหมู่ได้');
  }
  return res.json();
}

async function getCategoryById(id, token) {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

async function updateCategory(id, data, token) {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

async function deleteCategory(id, token) {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export {
    createCategory, deleteCategory, getCategories, getCategoryById,
    updateCategory
};

