export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          xp: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          xp?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          xp?: number;
          created_at?: string;
        };
      };
      vocabulary: {
        Row: {
          id: number;
          german: string;
          english: string;
          example: string | null;
          difficulty: number;
        };
        Insert: {
          id?: number;
          german: string;
          english: string;
          example?: string | null;
          difficulty?: number;
        };
        Update: {
          id?: number;
          german?: string;
          english?: string;
          example?: string | null;
          difficulty?: number;
        };
      };
      user_progress: {
        Row: {
          id: number;
          user_id: string;
          vocabulary_id: number;
          streak: number;
          last_reviewed: string;
          next_review: string;
          total_reviews: number;
          difficulty: number;
        };
        Insert: {
          id?: number;
          user_id: string;
          vocabulary_id: number;
          streak?: number;
          last_reviewed?: string;
          next_review?: string;
          total_reviews?: number;
          difficulty?: number;
        };
        Update: {
          id?: number;
          user_id?: string;
          vocabulary_id?: number;
          streak?: number;
          last_reviewed?: string;
          next_review?: string;
          total_reviews?: number;
          difficulty?: number;
        };
      };
    };
  };
}
