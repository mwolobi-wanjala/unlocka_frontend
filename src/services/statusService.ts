// services/statusService.ts - Status API Service
import { MOCK_STATUSES_DATA } from './localMockData';
import { Status, UserStatus } from '../types/status';

const API_URL = 'http://localhost:8000/api/v1/status';
const USE_MOCK = true;

export const getStatuses = async (userId: number): Promise<{
  myStatuses: Status[];
  friendsStatuses: UserStatus[];
}> => {
  if (USE_MOCK) return MOCK_STATUSES_DATA;
  
  try {
    const response = await fetch(`${API_URL}?user_id=${userId}`);
    return await response.json();
  } catch {
    return MOCK_STATUSES_DATA;
  }
};

export const viewStatus = async (statusId: string, userId: number, userName: string): Promise<void> => {
  if (USE_MOCK) return;
  try {
    const fd = new FormData();
    fd.append('status_id', statusId);
    fd.append('user_id', userId.toString());
    fd.append('user_name', userName);
    await fetch(`${API_URL}/view`, { method: 'POST', body: fd });
  } catch {}
};

export const reactToStatus = async (statusId: string, userId: number, userName: string, emoji: string): Promise<void> => {
  if (USE_MOCK) return;
  try {
    const fd = new FormData();
    fd.append('status_id', statusId);
    fd.append('user_id', userId.toString());
    fd.append('user_name', userName);
    fd.append('emoji', emoji);
    await fetch(`${API_URL}/react`, { method: 'POST', body: fd });
  } catch {}
};

export const createStatus = async (userId: number, statusData: any): Promise<any> => {
  return { success: true, status: { id: `status_${Date.now()}`, ...statusData } };
};

export const deleteStatus = async (statusId: string): Promise<boolean> => {
  return true;
};
