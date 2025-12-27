import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Hotel = Tables<'hotels'>;

export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as Hotel[];
    },
  });
};

export const useFeaturedHotels = () => {
  return useQuery({
    queryKey: ['hotels', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as Hotel[];
    },
  });
};

export const useHotel = (id: string) => {
  return useQuery({
    queryKey: ['hotels', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Hotel | null;
    },
    enabled: !!id,
  });
};
