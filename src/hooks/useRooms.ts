import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Room = Tables<'rooms'>;

export const useRooms = (hotelId?: string) => {
  return useQuery({
    queryKey: ['rooms', hotelId],
    queryFn: async () => {
      let query = supabase.from('rooms').select('*');
      
      if (hotelId) {
        query = query.eq('hotel_id', hotelId);
      }
      
      const { data, error } = await query.order('price', { ascending: true });
      
      if (error) throw error;
      return data as Room[];
    },
    enabled: hotelId ? !!hotelId : true,
  });
};

export const useRoom = (id: string) => {
  return useQuery({
    queryKey: ['rooms', 'single', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Room | null;
    },
    enabled: !!id,
  });
};
