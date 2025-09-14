import { toast as sonnerToast } from 'sonner';

export function useToast() {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      const message = props.title || props.description || '';

      if (props.variant === 'destructive') {
        sonnerToast.error(message, {
          description: props.title ? props.description : undefined,
        });
      } else {
        sonnerToast.success(message, {
          description: props.title ? props.description : undefined,
        });
      }
    },
  };
}

// Export toast function directly for convenience
export const toast = (props: {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => {
  const message = props.title || props.description || '';

  if (props.variant === 'destructive') {
    sonnerToast.error(message, {
      description: props.title ? props.description : undefined,
    });
  } else {
    sonnerToast.success(message, {
      description: props.title ? props.description : undefined,
    });
  }
};