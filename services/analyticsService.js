import { BASE_URL } from '../config/config';

async function getAnalytics(token) {
  const res = await fetch(`${BASE_URL}/analytics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export { getAnalytics };

