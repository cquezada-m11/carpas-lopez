export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      configuracion_global: {
        Row: {
          comunas_cobertura: string[];
          destino_leads: string | null;
          email: string | null;
          horarios: string | null;
          id: number;
          instagram: string | null;
          logo_alt_path: string | null;
          logo_path: string | null;
          nombre_empresa: string;
          otras_redes: Json;
          telefono: string | null;
          updated_at: string;
          whatsapp: string | null;
        };
        Insert: {
          comunas_cobertura?: string[];
          destino_leads?: string | null;
          email?: string | null;
          horarios?: string | null;
          id?: number;
          instagram?: string | null;
          logo_alt_path?: string | null;
          logo_path?: string | null;
          nombre_empresa?: string;
          otras_redes?: Json;
          telefono?: string | null;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Update: {
          comunas_cobertura?: string[];
          destino_leads?: string | null;
          email?: string | null;
          horarios?: string | null;
          id?: number;
          instagram?: string | null;
          logo_alt_path?: string | null;
          logo_path?: string | null;
          nombre_empresa?: string;
          otras_redes?: Json;
          telefono?: string | null;
          updated_at?: string;
          whatsapp?: string | null;
        };
        Relationships: [];
      };
      cotizaciones: {
        Row: {
          created_at: string;
          email: string | null;
          estado: string;
          fecha_evento: string | null;
          id: string;
          mensaje: string | null;
          nombre: string;
          numero_personas: number | null;
          origen: string | null;
          segmento: Database["public"]["Enums"]["segmento"] | null;
          telefono: string | null;
          tipo_evento: string | null;
          ubicacion: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          estado?: string;
          fecha_evento?: string | null;
          id?: string;
          mensaje?: string | null;
          nombre: string;
          numero_personas?: number | null;
          origen?: string | null;
          segmento?: Database["public"]["Enums"]["segmento"] | null;
          telefono?: string | null;
          tipo_evento?: string | null;
          ubicacion?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          estado?: string;
          fecha_evento?: string | null;
          id?: string;
          mensaje?: string | null;
          nombre?: string;
          numero_personas?: number | null;
          origen?: string | null;
          segmento?: Database["public"]["Enums"]["segmento"] | null;
          telefono?: string | null;
          tipo_evento?: string | null;
          ubicacion?: string | null;
        };
        Relationships: [];
      };
      home: {
        Row: {
          diferenciadores: Json;
          hero_bajada: string;
          hero_cta_primario: Json;
          hero_cta_secundario: Json | null;
          hero_media_path: string | null;
          hero_titulo: string;
          id: number;
          pasos_proceso: Json;
          proyectos_destacados: string[];
          stats: Json;
          updated_at: string;
        };
        Insert: {
          diferenciadores?: Json;
          hero_bajada?: string;
          hero_cta_primario?: Json;
          hero_cta_secundario?: Json | null;
          hero_media_path?: string | null;
          hero_titulo?: string;
          id?: number;
          pasos_proceso?: Json;
          proyectos_destacados?: string[];
          stats?: Json;
          updated_at?: string;
        };
        Update: {
          diferenciadores?: Json;
          hero_bajada?: string;
          hero_cta_primario?: Json;
          hero_cta_secundario?: Json | null;
          hero_media_path?: string | null;
          hero_titulo?: string;
          id?: number;
          pasos_proceso?: Json;
          proyectos_destacados?: string[];
          stats?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      proyectos: {
        Row: {
          capacidad_personas: number | null;
          cliente: string | null;
          created_at: string;
          descripcion: string | null;
          destacado: boolean;
          dimensiones_m2: number | null;
          estado: Database["public"]["Enums"]["estado_contenido"];
          fecha: string | null;
          galeria: Json;
          id: string;
          imagen_portada_path: string | null;
          segmento: Database["public"]["Enums"]["segmento"];
          slug: string;
          tipo_anclaje: string | null;
          tipo_carpa: string | null;
          tipo_evento: string | null;
          titulo: string;
          ubicacion: string | null;
          updated_at: string;
        };
        Insert: {
          capacidad_personas?: number | null;
          cliente?: string | null;
          created_at?: string;
          descripcion?: string | null;
          destacado?: boolean;
          dimensiones_m2?: number | null;
          estado?: Database["public"]["Enums"]["estado_contenido"];
          fecha?: string | null;
          galeria?: Json;
          id?: string;
          imagen_portada_path?: string | null;
          segmento: Database["public"]["Enums"]["segmento"];
          slug: string;
          tipo_anclaje?: string | null;
          tipo_carpa?: string | null;
          tipo_evento?: string | null;
          titulo: string;
          ubicacion?: string | null;
          updated_at?: string;
        };
        Update: {
          capacidad_personas?: number | null;
          cliente?: string | null;
          created_at?: string;
          descripcion?: string | null;
          destacado?: boolean;
          dimensiones_m2?: number | null;
          estado?: Database["public"]["Enums"]["estado_contenido"];
          fecha?: string | null;
          galeria?: Json;
          id?: string;
          imagen_portada_path?: string | null;
          segmento?: Database["public"]["Enums"]["segmento"];
          slug?: string;
          tipo_anclaje?: string | null;
          tipo_carpa?: string | null;
          tipo_evento?: string | null;
          titulo?: string;
          ubicacion?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      servicios: {
        Row: {
          created_at: string;
          descripcion: string;
          estado: Database["public"]["Enums"]["estado_contenido"];
          id: string;
          imagen_path: string | null;
          orden: number;
          segmento_asociado: Database["public"]["Enums"]["segmento"] | null;
          titulo: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          descripcion: string;
          estado?: Database["public"]["Enums"]["estado_contenido"];
          id?: string;
          imagen_path?: string | null;
          orden?: number;
          segmento_asociado?: Database["public"]["Enums"]["segmento"] | null;
          titulo: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          descripcion?: string;
          estado?: Database["public"]["Enums"]["estado_contenido"];
          id?: string;
          imagen_path?: string | null;
          orden?: number;
          segmento_asociado?: Database["public"]["Enums"]["segmento"] | null;
          titulo?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonios: {
        Row: {
          autor: string;
          cargo: string | null;
          created_at: string;
          empresa: string | null;
          estado: Database["public"]["Enums"]["estado_contenido"];
          id: string;
          orden: number;
          segmento: Database["public"]["Enums"]["segmento"] | null;
          texto: string;
          updated_at: string;
        };
        Insert: {
          autor: string;
          cargo?: string | null;
          created_at?: string;
          empresa?: string | null;
          estado?: Database["public"]["Enums"]["estado_contenido"];
          id?: string;
          orden?: number;
          segmento?: Database["public"]["Enums"]["segmento"] | null;
          texto: string;
          updated_at?: string;
        };
        Update: {
          autor?: string;
          cargo?: string | null;
          created_at?: string;
          empresa?: string | null;
          estado?: Database["public"]["Enums"]["estado_contenido"];
          id?: string;
          orden?: number;
          segmento?: Database["public"]["Enums"]["segmento"] | null;
          texto?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tipos_carpa: {
        Row: {
          capacidad_referencial: string | null;
          created_at: string;
          descripcion: string | null;
          dimensiones_disponibles: string | null;
          estado: Database["public"]["Enums"]["estado_contenido"];
          id: string;
          imagen_path: string | null;
          material_lona: string | null;
          nombre: string;
          orden: number;
          slug: string;
          updated_at: string;
          usos_recomendados: string[];
        };
        Insert: {
          capacidad_referencial?: string | null;
          created_at?: string;
          descripcion?: string | null;
          dimensiones_disponibles?: string | null;
          estado?: Database["public"]["Enums"]["estado_contenido"];
          id?: string;
          imagen_path?: string | null;
          material_lona?: string | null;
          nombre: string;
          orden?: number;
          slug: string;
          updated_at?: string;
          usos_recomendados?: string[];
        };
        Update: {
          capacidad_referencial?: string | null;
          created_at?: string;
          descripcion?: string | null;
          dimensiones_disponibles?: string | null;
          estado?: Database["public"]["Enums"]["estado_contenido"];
          id?: string;
          imagen_path?: string | null;
          material_lona?: string | null;
          nombre?: string;
          orden?: number;
          slug?: string;
          updated_at?: string;
          usos_recomendados?: string[];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      estado_contenido: "borrador" | "publicado" | "archivado";
      segmento: "social" | "corporativo" | "publico" | "industrial";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      estado_contenido: ["borrador", "publicado", "archivado"],
      segmento: ["social", "corporativo", "publico", "industrial"],
    },
  },
} as const;
