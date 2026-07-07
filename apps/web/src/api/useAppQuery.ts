import {
  useQuery,
  type QueryKey,
} from "@tanstack/react-query";
import api from "./axios";




interface QueryProps {
  queryKey: QueryKey;
  url: string;
  enabled?: boolean;
  refetchInterval?: number | false;
}


export function useAppQuery<T>({
  queryKey,
  url,
  enabled = true,
  refetchInterval,
}: QueryProps) {

  return useQuery<T, Error>({
    queryKey,

    queryFn: async () => {
      const { data } = await api.get<T>(url);

      return data;
    },

    enabled,

    refetchInterval,
  });

}