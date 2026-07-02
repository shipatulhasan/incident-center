import {
  useQuery,
  type QueryKey,
} from "@tanstack/react-query";

import api from "./axios";

interface QueryProps {
  queryKey: QueryKey;
  url: string;
  enabled?:boolean
}

export function useAppQuery<T>({
  queryKey,
  url,
}: QueryProps) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get<T>(url);

      return data;
    },
  });
}