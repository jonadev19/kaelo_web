import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useStores(filters?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: ['admin-stores', filters],
    queryFn: async () => {
      let query = supabase
        .from('stores')
        .select(`
          *,
          users:owner_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useApproveStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storeId: string) => {
      const { error } = await supabase
        .from('stores')
        .update({ 
          status: 'aprobado',
          approved_at: new Date().toISOString(),
        })
        .eq('id', storeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-stores'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    },
  });
}
