export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allergy: {
        Row: {
          allergy_id: number
          name: string
        }
        Insert: {
          allergy_id?: number
          name: string
        }
        Update: {
          allergy_id?: number
          name?: string
        }
        Relationships: []
      }
      event: {
        Row: {
          document_id: string
          event_id: number
        }
        Insert: {
          document_id: string
          event_id?: number
        }
        Update: {
          document_id?: string
          event_id?: number
        }
        Relationships: []
      }
      event_allergy: {
        Row: {
          allergy_id: number
          event_id: number
          event_participant_allergy_id: number
        }
        Insert: {
          allergy_id: number
          event_id: number
          event_participant_allergy_id: number
        }
        Update: {
          allergy_id?: number
          event_id?: number
          event_participant_allergy_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_allergy_allergy_id_fkey"
            columns: ["allergy_id"]
            isOneToOne: false
            referencedRelation: "allergy"
            referencedColumns: ["allergy_id"]
          },
          {
            foreignKeyName: "event_allergy_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "event_allergy_event_participant_allergy_id_fkey"
            columns: ["event_participant_allergy_id"]
            isOneToOne: false
            referencedRelation: "event_participant_allergy"
            referencedColumns: ["event_participant_allergy_id"]
          },
        ]
      }
      event_participant: {
        Row: {
          attending: boolean | null
          created_at: string | null
          email: string | null
          event_id: number
          event_participant_id: number
          firm: string | null
          full_name: string | null
          telephone: string | null
        }
        Insert: {
          attending?: boolean | null
          created_at?: string | null
          email?: string | null
          event_id: number
          event_participant_id?: number
          firm?: string | null
          full_name?: string | null
          telephone?: string | null
        }
        Update: {
          attending?: boolean | null
          created_at?: string | null
          email?: string | null
          event_id?: number
          event_participant_id?: number
          firm?: string | null
          full_name?: string | null
          telephone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participant_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["event_id"]
          },
        ]
      }
      event_participant_allergy: {
        Row: {
          event_participant_allergy_id: number
        }
        Insert: {
          event_participant_allergy_id?: number
        }
        Update: {
          event_participant_allergy_id?: number
        }
        Relationships: []
      }
      event_participant_options: {
        Row: {
          event_participant_id: number
          event_participant_option_id: number
          option_name: string | null
          option_value: boolean | null
        }
        Insert: {
          event_participant_id: number
          event_participant_option_id: number
          option_name?: string | null
          option_value?: boolean | null
        }
        Update: {
          event_participant_id?: number
          event_participant_option_id?: number
          option_name?: string | null
          option_value?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participant_options_event_participant_id_fkey"
            columns: ["event_participant_id"]
            isOneToOne: false
            referencedRelation: "event_participant"
            referencedColumns: ["event_participant_id"]
          },
        ]
      }
    }
    Views: {
      event_allergy_summary: {
        Row: {
          allergy_details: Json | null
          document_id: string | null
          total_participant_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
