type ToastOptions = {
  title?: string;
  description?: string;
  variant?: string;
};

export function useToast() {
  function toast(message: string | ToastOptions) {
    if (typeof message === "string") {
      console.log(message);
    } else {
      console.log("TOAST", {
        title: message.title ?? "",
        description: message.description ?? "",
        variant: message.variant ?? "default",
      });
    }
  }

  return { toast };
}
