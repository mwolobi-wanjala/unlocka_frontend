// utils/flowHelpers.ts - Manage Loading → Toast sequence

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

interface LoadingState {
  visible: boolean;
  message: string;
}

/**
 * Show loading spinner, then show toast after completion
 */
export const showLoadingThenToast = (
  loadingState: LoadingState,
  toastState: ToastState,
  setLoading: (state: LoadingState) => void,
  setToast: (state: ToastState) => void,
  loadingMessage: string,
  toastMessage: string,
  toastType: ToastType = 'success',
  delay: number = 300
) => {
  // Show loading first
  setLoading({ visible: true, message: loadingMessage });

  // After delay, hide loading and show toast
  setTimeout(() => {
    setLoading({ visible: false, message: '' });
    
    // Small delay then show toast
    setTimeout(() => {
      setToast({
        visible: true,
        message: toastMessage,
        type: toastType,
      });
    }, 200);
  }, delay);
};

/**
 * Quick toast without loading (for instant feedback)
 */
export const quickToast = (
  setToast: (state: ToastState) => void,
  message: string,
  type: ToastType = 'info'
) => {
  setToast({
    visible: true,
    message,
    type,
  });
};
