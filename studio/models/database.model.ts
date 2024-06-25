export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      event: {
        Row: {
          document_id: string;
          event_id: number;
        };
        Insert: {
          document_id: string;
          event_id?: number;
        };
        Update: {
          document_id?: string;
          event_id?: number;
        };
        Relationships: [];
      };
      event_food_preference: {
        Row: {
          event_food_preference_id: number;
          event_id: number;
          text: string;
        };
        Insert: {
          event_food_preference_id?: number;
          event_id: number;
          text: string;
        };
        Update: {
          event_food_preference_id?: number;
          event_id?: number;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_food_preference_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "event";
            referencedColumns: ["event_id"];
          },
        ];
      };
      event_participant: {
        Row: {
          attending: boolean;
          attending_digital: boolean | null;
          created_at: string | null;
          email: string;
          event_id: number;
          event_participant_id: number;
          firm: string | null;
          full_name: string;
          telephone: string | null;
        };
        Insert: {
          attending?: boolean;
          attending_digital?: boolean | null;
          created_at?: string | null;
          email: string;
          event_id: number;
          event_participant_id?: number;
          firm?: string | null;
          full_name: string;
          telephone?: string | null;
        };
        Update: {
          attending?: boolean;
          attending_digital?: boolean | null;
          created_at?: string | null;
          email?: string;
          event_id?: number;
          event_participant_id?: number;
          firm?: string | null;
          full_name?: string;
          telephone?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_participant_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "event";
            referencedColumns: ["event_id"];
          },
        ];
      };
      event_participant_option: {
        Row: {
          event_participant_id: number;
          option: string;
          value: string | null;
        };
        Insert: {
          event_participant_id: number;
          option: string;
          value?: string | null;
        };
        Update: {
          event_participant_id?: number;
          option?: string;
          value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_participant_option_event_participant_id_fkey";
            columns: ["event_participant_id"];
            isOneToOne: false;
            referencedRelation: "event_participant";
            referencedColumns: ["event_participant_id"];
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
