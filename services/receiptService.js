import { BASE_URL } from '../config/config';

async function getReceipts(token) {
  const res = await fetch(`${BASE_URL}/receipts`, {
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

async function createReceipt(data, token) {
  const res = await fetch(`${BASE_URL}/receipts`, {
    method: 'POST',
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

async function getReceiptById(id, token) {
  const res = await fetch(`${BASE_URL}/receipts/${id}`, {
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

async function updateReceipt(id, data, token) {
  const res = await fetch(`${BASE_URL}/receipts/${id}`, {
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

async function deleteReceipt(id, token) {
  const res = await fetch(`${BASE_URL}/receipts/${id}`, {
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
    createReceipt, deleteReceipt, getReceiptById, getReceipts, updateReceipt
};

