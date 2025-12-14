import toast from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      borderRadius: '12px',
      padding: '16px',
      fontWeight: '600',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      borderRadius: '12px',
      padding: '16px',
      fontWeight: '600',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6366f1',
      color: '#fff',
      borderRadius: '12px',
      padding: '16px',
      fontWeight: '600',
    },
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};