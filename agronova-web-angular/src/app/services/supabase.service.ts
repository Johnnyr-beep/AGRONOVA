import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://wvhzagtuasgpfbyhxylc.supabase.co';
    const supabaseKey = 'sb_publishable_7TwdWe15QTju_Bpqa1-9Bg_wyufuFHt';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Guardar un registro de operación (Báscula, Beneficio, etc.)
  async logOperation(module: string, action: string, data: any) {
    try {
      const { error } = await this.supabase
        .from('operaciones_nube')
        .insert([
          { 
            modulo: module, 
            accion: action, 
            datos: data, 
            fecha_servidor: new Date().toISOString() 
          }
        ]);
      
      if (error) throw error;
      console.log(`Log AGRONOVA enviado a la nube: ${module} - ${action}`);
    } catch (error) {
      console.error('Error al sincronizar con la nube:', error);
    }
  }

  // Subir captura de pantalla o imagen
  async uploadCapture(path: string, file: File) {
    try {
      const { data, error } = await this.supabase.storage
        .from('capturas_industriales')
        .upload(path, file);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al subir captura a la nube:', error);
      return null;
    }
  }
}
