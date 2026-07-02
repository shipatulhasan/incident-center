import { useMutation } from "@tanstack/react-query";
import api from "./axios";

interface MutationProps {
  url?: string;
  method?: "post" | "put" | "patch" | "delete";
}
interface MutationVariables<TData> {
  url?: string;
  data?: TData;
}

export function useAppMutation<
  TResponse = unknown,
  TData = unknown,
>({
  url,
  method = "post",
}: MutationProps) {
  return useMutation<
    TResponse,
    Error,
    MutationVariables<TData>
  >({
    mutationFn: async ({ url: dynamicUrl, data }) => {
      const res = await api({
        url: dynamicUrl ?? url,
        method,
        data,
      });

      return res.data;
    },
  });
}