import { BASE_URL } from '../config/config';

async function uploadReceiptImage(image, token) {
  const formData = new FormData();
  formData.append('image', image);

  const res = await fetch(`${BASE_URL}/ocr`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export { uploadReceiptImage };

