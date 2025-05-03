const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Fetches all hospitals from the backend
 * @returns Promise containing the list of hospitals
 */
export const getHospitals = async () => {
  const response = await fetch(`${API_BASE_URL}/hospitals`);
  if (!response.ok) {
    throw new Error('Failed to fetch hospitals');
  }
  return response.json();
};