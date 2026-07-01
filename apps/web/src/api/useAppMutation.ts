import { useMutation } from "@tanstack/react-query";
import api from "./axios";

interface MutationProps {
  url: string;
  method?: "post" | "put" | "patch" | "delete";
}

export function useAppMutation<
  TResponse = unknown,
  TVariables = unknown,
>({
  url,
  method = "post",
}: MutationProps) {
  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (payload: TVariables) => {
      const { data } = await api({
        url,
        method,
        data: payload,
      });

      return data;
    },
  });
}