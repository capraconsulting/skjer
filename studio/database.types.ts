export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      event_allergies: {
        Row: {
          allergy: string | null;
          allergy_id: number;
          document_id: string | null;
        };
        Insert: {
          allergy?: string | null;
          allergy_id?: number;
          document_id?: string | null;
        };
        Update: {
          allergy?: string | null;
          allergy_id?: number;
          document_id?: string | null;
        };
        Relationships: [];
      };
      event_participant: {
        Row: {
          accepted_terms: boolean | null;
          attending: boolean | null;
          created_at: string | null;
          document_id: string | null;
          email: string | null;
          firm: string | null;
          full_name: string | null;
          participant_id: number;
          telephone: string | null;
        };
        Insert: {
          accepted_terms?: boolean | null;
          attending?: boolean | null;
          created_at?: string | null;
          document_id?: string | null;
          email?: string | null;
          firm?: string | null;
          full_name?: string | null;
          participant_id?: number;
          telephone?: string | null;
        };
        Update: {
          accepted_terms?: boolean | null;
          attending?: boolean | null;
          created_at?: string | null;
          document_id?: string | null;
          email?: string | null;
          firm?: string | null;
          full_name?: string | null;
          participant_id?: number;
          telephone?: string | null;
        };
        Relationships: [];
      };
      participant_options: {
        Row: {
          option_id: number;
          option_name: string | null;
          option_value: boolean | null;
          participant_id: number | null;
        };
        Insert: {
          option_id?: number;
          option_name?: string | null;
          option_value?: boolean | null;
          participant_id?: number | null;
        };
        Update: {
          option_id?: number;
          option_name?: string | null;
          option_value?: boolean | null;
          participant_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "participant_options_participant_id_fkey";
            columns: ["participant_id"];
            isOneToOne: false;
            referencedRelation: "event_participant";
            referencedColumns: ["participant_id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
