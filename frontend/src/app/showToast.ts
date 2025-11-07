import toast from "react-hot-toast";

type ToastType = "success" | "error" | "loading" | "info";

export const useToast = () => {
  const showToast = (message: string, type: ToastType = "info") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "loading":
        toast.loading(message);
        break;
      default:
        toast(message);
    }
  };

  return { showToast };
};
