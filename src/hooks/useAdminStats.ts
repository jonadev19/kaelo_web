import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
