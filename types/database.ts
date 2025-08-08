export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'staff' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'staff' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'staff' | 'viewer'
          created_at?: string
        }
      }
      ingredients: {
        Row: {
          id: string
          name: string
          category: string
          description?: string
          abv?: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          description?: string
          abv?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          abv?: number
          created_at?: string
        }
      }
      cocktails: {
        Row: {
          id: string
          name: string
          category: string
          glass_type?: string
          method?: string
          abv_estimate?: number
          instructions?: string[]
          garnish?: string
          is_custom: boolean
          owner_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          glass_type?: string
          method?: string
          abv_estimate?: number
          instructions?: string[]
          garnish?: string
          is_custom?: boolean
          owner_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          glass_type?: string
          method?: string
          abv_estimate?: number
          instructions?: string[]
          garnish?: string
          is_custom?: boolean
          owner_id?: string
          created_at?: string
        }
      }
      cocktail_ingredients: {
        Row: {
          id: string
          cocktail_id: string
          ingredient_id: string
          amount: string
          created_at: string
        }
        Insert: {
          id?: string
          cocktail_id: string
          ingredient_id: string
          amount: string
          created_at?: string
        }
        Update: {
          id?: string
          cocktail_id?: string
          ingredient_id?: string
          amount?: string
          created_at?: string
        }
      }
      signature_cocktails: {
        Row: {
          id: string
          user_id: string
          name: string
          instructions?: string
          glassware?: string
          image_url?: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          instructions?: string
          glassware?: string
          image_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          instructions?: string
          glassware?: string
          image_url?: string
          created_at?: string
        }
      }
      wines: {
        Row: {
          id: string
          name: string
          vintage?: string
          varietal?: string
          price: number
          category: 'red' | 'white' | 'sparkling'
          region?: string
          code?: string
          image_url?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          vintage?: string
          varietal?: string
          price: number
          category: 'red' | 'white' | 'sparkling'
          region?: string
          code?: string
          image_url?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          vintage?: string
          varietal?: string
          price?: number
          category?: 'red' | 'white' | 'sparkling'
          region?: string
          code?: string
          image_url?: string
          created_at?: string
        }
      }
      happy_hour_specials: {
        Row: {
          id: string
          name: string
          description?: string
          price?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          price?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          active?: boolean
          created_at?: string
        }
      }
      items_86: {
        Row: {
          id: string
          name: string
          added_by?: string
          reason?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          added_by?: string
          reason?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          added_by?: string
          reason?: string
          created_at?: string
        }
      }
      checklist_items: {
        Row: {
          id: string
          name: string
          description?: string
          frequency: string
          category?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          frequency?: string
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          frequency?: string
          category?: string
          created_at?: string
        }
      }
      checklist_logs: {
        Row: {
          id: string
          checklist_item_id: string
          user_id: string
          completed_at: string
          notes?: string
        }
        Insert: {
          id?: string
          checklist_item_id: string
          user_id: string
          completed_at?: string
          notes?: string
        }
        Update: {
          id?: string
          checklist_item_id?: string
          user_id?: string
          completed_at?: string
          notes?: string
        }
      }
      liquor_inventory: {
        Row: {
          id: string
          name: string
          category: string
          bottles: number
          ounces: number
          updated_by?: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          bottles?: number
          ounces?: number
          updated_by?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          bottles?: number
          ounces?: number
          updated_by?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          category: string
          name: string
          description?: string
          price: number
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category: string
          name: string
          description?: string
          price: number
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          name?: string
          description?: string
          price?: number
          available?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}