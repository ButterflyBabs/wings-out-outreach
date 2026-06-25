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
      companies: {
        Row: {
          id: string;
          company_name: string;
          website_url: string | null;
          category: string | null;
          subcategory: string | null;
          headquarters_location: string | null;
          country: string | null;
          company_size_estimate: string | null;
          brand_summary: string | null;
          accessibility_relevance: number | null;
          service_dog_relevance: number | null;
          products_summary: string | null;
          active_status: boolean;
          priority_level: string | null;
          source_url: string | null;
          date_discovered: string | null;
          date_last_verified: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          company_name: string;
          website_url?: string | null;
          category?: string | null;
          subcategory?: string | null;
          headquarters_location?: string | null;
          country?: string | null;
          company_size_estimate?: string | null;
          brand_summary?: string | null;
          accessibility_relevance?: number | null;
          service_dog_relevance?: number | null;
          products_summary?: string | null;
          active_status?: boolean;
          priority_level?: string | null;
          source_url?: string | null;
          date_discovered?: string | null;
          date_last_verified?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          company_name?: string;
          website_url?: string | null;
          category?: string | null;
          subcategory?: string | null;
          headquarters_location?: string | null;
          country?: string | null;
          company_size_estimate?: string | null;
          brand_summary?: string | null;
          accessibility_relevance?: number | null;
          service_dog_relevance?: number | null;
          products_summary?: string | null;
          active_status?: boolean;
          priority_level?: string | null;
          source_url?: string | null;
          date_discovered?: string | null;
          date_last_verified?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      contacts: {
        Row: {
          id: string;
          company_id: string;
          first_name: string | null;
          last_name: string | null;
          title: string | null;
          department: string | null;
          email: string | null;
          phone: string | null;
          linkedin_url: string | null;
          contact_form_url: string | null;
          preferred_contact_method: string | null;
          verified_status: boolean;
          verification_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          first_name?: string | null;
          last_name?: string | null;
          title?: string | null;
          department?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          contact_form_url?: string | null;
          preferred_contact_method?: string | null;
          verified_status?: boolean;
          verification_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          title?: string | null;
          department?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          contact_form_url?: string | null;
          preferred_contact_method?: string | null;
          verified_status?: boolean;
          verification_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      opportunities: {
        Row: {
          id: string;
          company_id: string;
          program_id: string | null;
          opportunity_title: string | null;
          opportunity_stage: string;
          fit_score: number | null;
          revenue_score: number | null;
          accessibility_score: number | null;
          service_dog_score: number | null;
          brand_alignment_score: number | null;
          response_probability_score: number | null;
          relationship_value_score: number | null;
          overall_priority_score: number | null;
          personalized_pitch_angle: string | null;
          proposed_content_concept: string | null;
          requested_compensation: string | null;
          minimum_acceptable_compensation: string | null;
          next_action: string | null;
          next_action_date: string | null;
          assigned_to: string | null;
          loss_reason: string | null;
          won_date: string | null;
          lost_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          program_id?: string | null;
          opportunity_title?: string | null;
          opportunity_stage?: string;
          fit_score?: number | null;
          revenue_score?: number | null;
          accessibility_score?: number | null;
          service_dog_score?: number | null;
          brand_alignment_score?: number | null;
          response_probability_score?: number | null;
          relationship_value_score?: number | null;
          overall_priority_score?: number | null;
          personalized_pitch_angle?: string | null;
          proposed_content_concept?: string | null;
          requested_compensation?: string | null;
          minimum_acceptable_compensation?: string | null;
          next_action?: string | null;
          next_action_date?: string | null;
          assigned_to?: string | null;
          loss_reason?: string | null;
          won_date?: string | null;
          lost_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string;
          program_id?: string | null;
          opportunity_title?: string | null;
          opportunity_stage?: string;
          fit_score?: number | null;
          revenue_score?: number | null;
          accessibility_score?: number | null;
          service_dog_score?: number | null;
          brand_alignment_score?: number | null;
          response_probability_score?: number | null;
          relationship_value_score?: number | null;
          overall_priority_score?: number | null;
          personalized_pitch_angle?: string | null;
          proposed_content_concept?: string | null;
          requested_compensation?: string | null;
          minimum_acceptable_compensation?: string | null;
          next_action?: string | null;
          next_action_date?: string | null;
          assigned_to?: string | null;
          loss_reason?: string | null;
          won_date?: string | null;
          lost_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          company_id: string | null;
          opportunity_id: string | null;
          task_type: string | null;
          task_title: string;
          task_description: string | null;
          priority: string;
          due_date: string | null;
          recurrence_rule: string | null;
          status: string;
          assigned_to: string | null;
          automated: boolean;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          company_id?: string | null;
          opportunity_id?: string | null;
          task_type?: string | null;
          task_title: string;
          task_description?: string | null;
          priority?: string;
          due_date?: string | null;
          recurrence_rule?: string | null;
          status?: string;
          assigned_to?: string | null;
          automated?: boolean;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          opportunity_id?: string | null;
          task_type?: string | null;
          task_title?: string;
          task_description?: string | null;
          priority?: string;
          due_date?: string | null;
          recurrence_rule?: string | null;
          status?: string;
          assigned_to?: string | null;
          automated?: boolean;
          completed_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
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
  };
}