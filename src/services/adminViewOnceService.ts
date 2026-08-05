// services/adminViewOnceService.ts - Admin View Once Access
const API_URL = 'http://localhost:8000/api/v1/admin/view-once';

/**
 * Admin list all view once content
 */
export const adminListViewOnce = async (adminEmail: string, status?: string): Promise<any> => {
  try {
    let url = `${API_URL}/list?admin_email=${encodeURIComponent(adminEmail)}`;
    if (status) url += `&status=${status}`;
    
    const response = await fetch(url);
    return await response.json();
  } catch {
    return { success: false, view_once: [] };
  }
};

/**
 * Admin view specific content (LOGGED)
 */
export const adminViewContent = async (
  adminEmail: string,
  viewOnceId: string,
  reason: string = 'Content moderation'
): Promise<any> => {
  try {
    const url = `${API_URL}/view/${viewOnceId}?admin_email=${encodeURIComponent(adminEmail)}&reason=${encodeURIComponent(reason)}`;
    const response = await fetch(url);
    return await response.json();
  } catch {
    return { success: false };
  }
};

/**
 * Admin remove view once content
 */
export const adminRemoveViewOnce = async (
  adminEmail: string,
  viewOnceId: string,
  reason: string
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('view_once_id', viewOnceId);
    formData.append('admin_email', adminEmail);
    formData.append('reason', reason);
    
    const response = await fetch(`${API_URL}/remove`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get admin audit log
 */
export const getAdminAuditLog = async (adminEmail: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/audit-log?admin_email=${encodeURIComponent(adminEmail)}`);
    return await response.json();
  } catch {
    return { audit_logs: [] };
  }
};
