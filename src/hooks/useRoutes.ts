import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Route = Database['public']['Tables']['routes']['Row'];
type RouteUpdate = Database['public']['Tables']['routes']['Update'];

export function useRoutes(filters?: { search?: string; status?: string; difficulty?: string }) {
  return useQuery({
    queryKey: ['admin-routes', filters],
    queryFn: async () => {
      let query = supabase
        .from('routes')
        .select(`
          *,
          users:creator_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (filters?.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.difficulty && filters.difficulty !== 'all') {
        query = query.eq('difficulty', filters.difficulty);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useApproveRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routeId: string) => {
      const { error } = await supabase
        .from('routes')
        .update({ 
          status: 'aprobada',
          published_at: new Date().toISOString(),
        })
        .eq('id', routeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-routes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    },
  });
}

export function useRejectRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (routeId: string) => {
      const { error } = await supabase
        .from('routes')
        .update({ status: 'rechazada' })
        .eq('id', routeId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-routes'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] });
    },
  });
}
