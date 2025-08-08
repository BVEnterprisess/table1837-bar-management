import type { Database } from './database'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific types for our application
export type User = {
  id: string
  email: string
  role?: 'admin' | 'staff' | 'viewer'
}

export type Cocktail = Tables<'cocktails'> & {
  ingredients?: (Tables<'cocktail_ingredients'> & {
    ingredient: Tables<'ingredients'>
  })[]
}

export type Ingredient = Tables<'ingredients'>
export type Wine = Tables<'wines'>
export type Item86 = Tables<'items_86'>
export type ChecklistItem = Tables<'checklist_items'>
export type ChecklistLog = Tables<'checklist_logs'>
export type LiquorInventory = Tables<'liquor_inventory'>
export type HappyHourSpecial = Tables<'happy_hour_specials'>
export type SignatureCocktail = Tables<'signature_cocktails'>
export type MenuItem = Tables<'menu_items'>

// UI State types
export type TabType = 'dashboard' | 'staff' | 'admin' | 'wine' | 'inventory' | 'cocktails'

export type VoiceRecognitionState = {
  isListening: boolean
  transcript: string
  isSupported: boolean
}

export type OCRState = {
  isProcessing: boolean
  result?: string
  error?: string
}

// API Response types
export type ApiResponse<T> = {
  data?: T
  error?: string
  message?: string
}

// Performance monitoring types
export type PerformanceMetric = {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, any>
}