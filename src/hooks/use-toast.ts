import { toast } from 'sonner';

export function useToast() {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      const message = props.title || props.description || '';
      
      if (props.variant === 'destructive') {
        toast.error(message, {
          description: props.title ? props.description : undefined,
        });
      } else {
        toast.success(message, {
          description: props.title ? props.description : undefined,
        });
      }
    },
  };
}