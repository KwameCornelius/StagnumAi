export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          is_active: boolean
          name: string
          opening_balance: number
          organization_id: string
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id?: string
          is_active?: boolean
          name: string
          opening_balance?: number
          organization_id: string
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          is_active?: boolean
          name?: string
          opening_balance?: number
          organization_id?: string
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      activity_events: {
        Row: {
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json | null
          organization_id: string
          summary: string
          verb: string
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          organization_id: string
          summary: string
          verb: string
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          summary?: string
          verb?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          created_at: string
          current_step: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["approvable_entity"]
          id: string
          notes: string | null
          organization_id: string
          requested_by: string | null
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_step?: number
          entity_id: string
          entity_type: Database["public"]["Enums"]["approvable_entity"]
          id?: string
          notes?: string | null
          organization_id: string
          requested_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_step?: number
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["approvable_entity"]
          id?: string
          notes?: string | null
          organization_id?: string
          requested_by?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      approval_steps: {
        Row: {
          approver_user_id: string | null
          comment: string | null
          created_at: string
          decided_at: string | null
          decision: Database["public"]["Enums"]["approval_decision"]
          id: string
          request_id: string
          step_order: number
        }
        Insert: {
          approver_user_id?: string | null
          comment?: string | null
          created_at?: string
          decided_at?: string | null
          decision?: Database["public"]["Enums"]["approval_decision"]
          id?: string
          request_id: string
          step_order: number
        }
        Update: {
          approver_user_id?: string | null
          comment?: string | null
          created_at?: string
          decided_at?: string | null
          decision?: Database["public"]["Enums"]["approval_decision"]
          id?: string
          request_id?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "approval_steps_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_assignments: {
        Row: {
          asset_id: string
          assigned_at: string
          assigned_to_user_id: string | null
          created_at: string
          id: string
          organization_id: string
          project_id: string
          returned_at: string | null
        }
        Insert: {
          asset_id: string
          assigned_at?: string
          assigned_to_user_id?: string | null
          created_at?: string
          id?: string
          organization_id: string
          project_id: string
          returned_at?: string | null
        }
        Update: {
          asset_id?: string
          assigned_at?: string
          assigned_to_user_id?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          project_id?: string
          returned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_assignments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_assignments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_distribution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "asset_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_maintenance_logs: {
        Row: {
          asset_id: string
          cost: number | null
          created_at: string
          id: string
          next_service_due: string | null
          notes: string | null
          organization_id: string
          performed_at: string
        }
        Insert: {
          asset_id: string
          cost?: number | null
          created_at?: string
          id?: string
          next_service_due?: string | null
          notes?: string | null
          organization_id: string
          performed_at?: string
        }
        Update: {
          asset_id?: string
          cost?: number | null
          created_at?: string
          id?: string
          next_service_due?: string | null
          notes?: string | null
          organization_id?: string
          performed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_maintenance_logs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_maintenance_logs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_distribution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_maintenance_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_maintenance_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      assets: {
        Row: {
          category: Database["public"]["Enums"]["asset_category"]
          code: string
          created_at: string
          current_value: number | null
          id: string
          name: string
          organization_id: string
          purchase_cost: number | null
          purchase_date: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["asset_status"]
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["asset_category"]
          code: string
          created_at?: string
          current_value?: number | null
          id?: string
          name: string
          organization_id: string
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["asset_category"]
          code?: string
          created_at?: string
          current_value?: number | null
          id?: string
          name?: string
          organization_id?: string
          purchase_cost?: number | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      attachments: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          mime_type: string | null
          organization_id: string
          size_bytes: number | null
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          mime_type?: string | null
          organization_id: string
          size_bytes?: number | null
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          mime_type?: string | null
          organization_id?: string
          size_bytes?: number | null
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      audit_log: {
        Row: {
          changed_at: string
          changed_by: string | null
          diff: Json | null
          id: string
          op: string
          row_id: string
          table_name: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          diff?: Json | null
          id?: string
          op: string
          row_id: string
          table_name: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          diff?: Json | null
          id?: string
          op?: string
          row_id?: string
          table_name?: string
        }
        Relationships: []
      }
      boq_items: {
        Row: {
          boq_id: string
          cost_category_id: string | null
          created_at: string
          description: string
          id: string
          line_total: number | null
          position: number
          quantity: number
          rate_item_id: string | null
          unit_id: string | null
          unit_rate: number
        }
        Insert: {
          boq_id: string
          cost_category_id?: string | null
          created_at?: string
          description: string
          id?: string
          line_total?: number | null
          position?: number
          quantity?: number
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
        }
        Update: {
          boq_id?: string
          cost_category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          line_total?: number | null
          position?: number
          quantity?: number
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "boq_items_boq_id_fkey"
            columns: ["boq_id"]
            isOneToOne: false
            referencedRelation: "boqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boq_items_cost_category_id_fkey"
            columns: ["cost_category_id"]
            isOneToOne: false
            referencedRelation: "cost_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boq_items_rate_item_id_fkey"
            columns: ["rate_item_id"]
            isOneToOne: false
            referencedRelation: "rate_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boq_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units_of_measure"
            referencedColumns: ["id"]
          },
        ]
      }
      boqs: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          organization_id: string
          project_id: string
          total: number
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id?: string
          organization_id: string
          project_id: string
          total?: number
          updated_at?: string
          version?: number
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          organization_id?: string
          project_id?: string
          total?: number
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "boqs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "boqs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "boqs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flow_entries: {
        Row: {
          account_id: string
          balance_after: number | null
          created_at: string
          entry_date: string
          id: string
          inflow: number
          organization_id: string
          outflow: number
          source_id: string | null
          source_type: string | null
        }
        Insert: {
          account_id: string
          balance_after?: number | null
          created_at?: string
          entry_date: string
          id?: string
          inflow?: number
          organization_id: string
          outflow?: number
          source_id?: string | null
          source_type?: string | null
        }
        Update: {
          account_id?: string
          balance_after?: number | null
          created_at?: string
          entry_date?: string
          id?: string
          inflow?: number
          organization_id?: string
          outflow?: number
          source_id?: string | null
          source_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_flow_entries_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_flow_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_flow_entries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      clients: {
        Row: {
          billing_address: Json | null
          contact_name: string | null
          country_code: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          contact_name?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          contact_name?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      code_sequences: {
        Row: {
          id: string
          last_value: number
          organization_id: string
          prefix: string
          year: number
        }
        Insert: {
          id?: string
          last_value?: number
          organization_id: string
          prefix: string
          year: number
        }
        Update: {
          id?: string
          last_value?: number
          organization_id?: string
          prefix?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "code_sequences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_sequences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      cost_categories: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          organization_id: string
          parent_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          organization_id: string
          parent_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cost_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cost_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_site_log_entries: {
        Row: {
          created_at: string
          daily_log_id: string
          hours_worked: number
          id: string
          task_description: string | null
          worker_id: string
        }
        Insert: {
          created_at?: string
          daily_log_id: string
          hours_worked?: number
          id?: string
          task_description?: string | null
          worker_id: string
        }
        Update: {
          created_at?: string
          daily_log_id?: string
          hours_worked?: number
          id?: string
          task_description?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_site_log_entries_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "daily_site_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_site_log_entries_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_site_logs: {
        Row: {
          created_at: string
          id: string
          log_date: string
          notes: string | null
          organization_id: string
          project_id: string
          submitted_by: string | null
          updated_at: string
          weather: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          log_date: string
          notes?: string | null
          organization_id: string
          project_id: string
          submitted_by?: string | null
          updated_at?: string
          weather?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          notes?: string | null
          organization_id?: string
          project_id?: string
          submitted_by?: string | null
          updated_at?: string
          weather?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_site_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_site_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "daily_site_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          attachment_url: string | null
          category: string | null
          created_at: string
          id: string
          incurred_at: string
          organization_id: string
          paid_from_account_id: string | null
          project_id: string | null
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          attachment_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          incurred_at?: string
          organization_id: string
          paid_from_account_id?: string | null
          project_id?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          attachment_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          incurred_at?: string
          organization_id?: string
          paid_from_account_id?: string | null
          project_id?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "expenses_paid_from_account_id_fkey"
            columns: ["paid_from_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      goods_receipt_items: {
        Row: {
          condition_notes: string | null
          created_at: string
          grn_id: string
          id: string
          po_item_id: string
          quantity_received: number
        }
        Insert: {
          condition_notes?: string | null
          created_at?: string
          grn_id: string
          id?: string
          po_item_id: string
          quantity_received?: number
        }
        Update: {
          condition_notes?: string | null
          created_at?: string
          grn_id?: string
          id?: string
          po_item_id?: string
          quantity_received?: number
        }
        Relationships: [
          {
            foreignKeyName: "goods_receipt_items_grn_id_fkey"
            columns: ["grn_id"]
            isOneToOne: false
            referencedRelation: "goods_receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_receipt_items_po_item_id_fkey"
            columns: ["po_item_id"]
            isOneToOne: false
            referencedRelation: "purchase_order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      goods_receipts: {
        Row: {
          code: string
          created_at: string
          id: string
          notes: string | null
          organization_id: string
          po_id: string
          received_at: string
          received_by: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          notes?: string | null
          organization_id: string
          po_id: string
          received_at?: string
          received_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string
          po_id?: string
          received_at?: string
          received_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goods_receipts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_receipts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "goods_receipts_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["org_role"]
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          line_total: number | null
          position: number
          quantity: number
          rate_item_id: string | null
          unit_id: string | null
          unit_rate: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          line_total?: number | null
          position?: number
          quantity?: number
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number | null
          position?: number
          quantity?: number
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_rate_item_id_fkey"
            columns: ["rate_item_id"]
            isOneToOne: false
            referencedRelation: "rate_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units_of_measure"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          client_id: string | null
          code: string
          created_at: string
          currency_code: string
          due_date: string | null
          id: string
          issue_date: string
          notes: string | null
          organization_id: string
          pdf_storage_path: string | null
          project_id: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          client_id?: string | null
          code: string
          created_at?: string
          currency_code?: string
          due_date?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          organization_id: string
          pdf_storage_path?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          client_id?: string | null
          code?: string
          created_at?: string
          currency_code?: string
          due_date?: string | null
          id?: string
          issue_date?: string
          notes?: string | null
          organization_id?: string
          pdf_storage_path?: string | null
          project_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      labour_assignments: {
        Row: {
          created_at: string
          daily_rate_override: number | null
          end_date: string | null
          id: string
          organization_id: string
          project_id: string
          start_date: string
          updated_at: string
          worker_id: string
        }
        Insert: {
          created_at?: string
          daily_rate_override?: number | null
          end_date?: string | null
          id?: string
          organization_id: string
          project_id: string
          start_date: string
          updated_at?: string
          worker_id: string
        }
        Update: {
          created_at?: string
          daily_rate_override?: number | null
          end_date?: string | null
          id?: string
          organization_id?: string
          project_id?: string
          start_date?: string
          updated_at?: string
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "labour_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labour_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "labour_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labour_assignments_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      ncrs: {
        Row: {
          closed_at: string | null
          code: string
          created_at: string
          description: string
          id: string
          inspection_id: string | null
          organization_id: string
          project_id: string
          raised_by: string | null
          severity: Database["public"]["Enums"]["ncr_severity"]
          status: Database["public"]["Enums"]["ncr_status"]
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          code: string
          created_at?: string
          description: string
          id?: string
          inspection_id?: string | null
          organization_id: string
          project_id: string
          raised_by?: string | null
          severity?: Database["public"]["Enums"]["ncr_severity"]
          status?: Database["public"]["Enums"]["ncr_status"]
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          code?: string
          created_at?: string
          description?: string
          id?: string
          inspection_id?: string | null
          organization_id?: string
          project_id?: string
          raised_by?: string | null
          severity?: Database["public"]["Enums"]["ncr_severity"]
          status?: Database["public"]["Enums"]["ncr_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ncrs_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "qa_inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncrs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncrs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "ncrs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          organization_id: string
          read_at: string | null
          recipient_user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          organization_id: string
          read_at?: string | null
          recipient_user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          organization_id?: string
          read_at?: string | null
          recipient_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "activity_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "v_recent_activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      opportunities: {
        Row: {
          client_id: string | null
          created_at: string
          expected_decision_date: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string
          owner_user_id: string | null
          probability_pct: number
          source: string | null
          stage: Database["public"]["Enums"]["opportunity_stage"]
          updated_at: string
          value_estimate: number | null
          weighted_value: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          expected_decision_date?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id: string
          owner_user_id?: string | null
          probability_pct?: number
          source?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          updated_at?: string
          value_estimate?: number | null
          weighted_value?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          expected_decision_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
          owner_user_id?: string | null
          probability_pct?: number
          source?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          updated_at?: string
          value_estimate?: number | null
          weighted_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      opportunity_activities: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          occurred_at: string
          opportunity_id: string
          organization_id: string
          summary: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          occurred_at?: string
          opportunity_id: string
          organization_id: string
          summary: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          occurred_at?: string
          opportunity_id?: string
          organization_id?: string
          summary?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_members: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["org_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organizations: {
        Row: {
          country_code: string
          created_at: string
          created_by: string | null
          currency_code: string
          fiscal_year_start_month: number
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          country_code?: string
          created_at?: string
          created_by?: string | null
          currency_code?: string
          fiscal_year_start_month?: number
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          created_at?: string
          created_by?: string | null
          currency_code?: string
          fiscal_year_start_month?: number
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          account_id: string
          amount: number
          created_at: string
          id: string
          invoice_id: string | null
          method: Database["public"]["Enums"]["payment_method"]
          organization_id: string
          paid_at: string
          reference: string | null
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          method?: Database["public"]["Enums"]["payment_method"]
          organization_id: string
          paid_at?: string
          reference?: string | null
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          method?: Database["public"]["Enums"]["payment_method"]
          organization_id?: string
          paid_at?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      procurement_gates: {
        Row: {
          created_at: string
          criteria: Json | null
          gate_name: string
          id: string
          organization_id: string
          project_id: string
          status: Database["public"]["Enums"]["gate_status"]
          unlocked_at: string | null
          unlocked_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria?: Json | null
          gate_name: string
          id?: string
          organization_id: string
          project_id: string
          status?: Database["public"]["Enums"]["gate_status"]
          unlocked_at?: string | null
          unlocked_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria?: Json | null
          gate_name?: string
          id?: string
          organization_id?: string
          project_id?: string
          status?: Database["public"]["Enums"]["gate_status"]
          unlocked_at?: string | null
          unlocked_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procurement_gates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurement_gates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "procurement_gates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          default_organization_id: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          default_organization_id?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          default_organization_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_default_organization_id_fkey"
            columns: ["default_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_default_organization_id_fkey"
            columns: ["default_organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      project_documents: {
        Row: {
          created_at: string
          id: string
          mime_type: string | null
          organization_id: string
          project_id: string
          size_bytes: number | null
          storage_path: string
          title: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mime_type?: string | null
          organization_id: string
          project_id: string
          size_bytes?: number | null
          storage_path: string
          title: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mime_type?: string | null
          organization_id?: string
          project_id?: string
          size_bytes?: number | null
          storage_path?: string
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          name: string
          organization_id: string
          project_id: string
          updated_at: string
          weight: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          name: string
          organization_id: string
          project_id: string
          updated_at?: string
          weight?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          name?: string
          organization_id?: string
          project_id?: string
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_milestones_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_team_members: {
        Row: {
          created_at: string
          id: string
          project_id: string
          role_on_project: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          role_on_project: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          role_on_project?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_end_date: string | null
          client_id: string | null
          code: string
          contract_value: number | null
          country_code: string | null
          created_at: string
          currency_code: string
          description: string | null
          forecast_value: number | null
          health: Database["public"]["Enums"]["project_health"]
          id: string
          name: string
          organization_id: string
          pm_user_id: string | null
          qs_user_id: string | null
          site_address: Json | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_stage"]
          target_end_date: string | null
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          client_id?: string | null
          code: string
          contract_value?: number | null
          country_code?: string | null
          created_at?: string
          currency_code?: string
          description?: string | null
          forecast_value?: number | null
          health?: Database["public"]["Enums"]["project_health"]
          id?: string
          name: string
          organization_id: string
          pm_user_id?: string | null
          qs_user_id?: string | null
          site_address?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_stage"]
          target_end_date?: string | null
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          client_id?: string | null
          code?: string
          contract_value?: number | null
          country_code?: string | null
          created_at?: string
          currency_code?: string
          description?: string | null
          forecast_value?: number | null
          health?: Database["public"]["Enums"]["project_health"]
          id?: string
          name?: string
          organization_id?: string
          pm_user_id?: string | null
          qs_user_id?: string | null
          site_address?: Json | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_stage"]
          target_end_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "projects_pm_user_id_fkey"
            columns: ["pm_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_qs_user_id_fkey"
            columns: ["qs_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          description: string
          id: string
          line_total: number | null
          po_id: string
          quantity: number
          quantity_received: number
          rate_item_id: string | null
          unit_id: string | null
          unit_rate: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          line_total?: number | null
          po_id: string
          quantity?: number
          quantity_received?: number
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          line_total?: number | null
          po_id?: string
          quantity?: number
          quantity_received?: number
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_rate_item_id_fkey"
            columns: ["rate_item_id"]
            isOneToOne: false
            referencedRelation: "rate_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units_of_measure"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          code: string
          created_at: string
          currency_code: string
          delivery_address: Json | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          organization_id: string
          project_id: string | null
          status: Database["public"]["Enums"]["po_status"]
          subtotal: number
          supplier_id: string | null
          tax_amount: number
          total: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          currency_code?: string
          delivery_address?: Json | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["po_status"]
          subtotal?: number
          supplier_id?: string | null
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          currency_code?: string
          delivery_address?: Json | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["po_status"]
          subtotal?: number
          supplier_id?: string | null
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "purchase_orders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_checklists: {
        Row: {
          created_at: string
          id: string
          items: Json
          name: string
          organization_id: string
          trade_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          items?: Json
          name: string
          organization_id: string
          trade_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          name?: string
          organization_id?: string
          trade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_checklists_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_checklists_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "qa_checklists_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_inspection_results: {
        Row: {
          created_at: string
          id: string
          inspection_id: string
          item_label: string
          notes: string | null
          passed: boolean
          photo_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          inspection_id: string
          item_label: string
          notes?: string | null
          passed?: boolean
          photo_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          inspection_id?: string
          item_label?: string
          notes?: string | null
          passed?: boolean
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qa_inspection_results_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "qa_inspections"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_inspections: {
        Row: {
          checklist_id: string | null
          created_at: string
          id: string
          inspected_at: string
          inspector_user_id: string | null
          organization_id: string
          project_id: string
          status: Database["public"]["Enums"]["inspection_status"]
          updated_at: string
        }
        Insert: {
          checklist_id?: string | null
          created_at?: string
          id?: string
          inspected_at?: string
          inspector_user_id?: string | null
          organization_id: string
          project_id: string
          status?: Database["public"]["Enums"]["inspection_status"]
          updated_at?: string
        }
        Update: {
          checklist_id?: string | null
          created_at?: string
          id?: string
          inspected_at?: string
          inspector_user_id?: string | null
          organization_id?: string
          project_id?: string
          status?: Database["public"]["Enums"]["inspection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_inspections_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "qa_checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_inspections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_inspections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "qa_inspections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_items: {
        Row: {
          created_at: string
          description: string
          id: string
          line_total: number | null
          position: number
          quantity: number
          quotation_id: string
          rate_item_id: string | null
          unit_id: string | null
          unit_rate: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          line_total?: number | null
          position?: number
          quantity?: number
          quotation_id: string
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          line_total?: number | null
          position?: number
          quantity?: number
          quotation_id?: string
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_rate_item_id_fkey"
            columns: ["rate_item_id"]
            isOneToOne: false
            referencedRelation: "rate_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotation_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units_of_measure"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          client_id: string | null
          code: string
          created_at: string
          id: string
          notes: string | null
          organization_id: string
          project_id: string | null
          status: Database["public"]["Enums"]["quotation_status"]
          subtotal: number
          tax_amount: number
          tax_rate: number
          total: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          client_id?: string | null
          code: string
          created_at?: string
          id?: string
          notes?: string | null
          organization_id: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["quotation_status"]
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          client_id?: string | null
          code?: string
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["quotation_status"]
          subtotal?: number
          tax_amount?: number
          tax_rate?: number
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "quotations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_item_versions: {
        Row: {
          created_at: string
          created_by: string | null
          effective_from: string
          id: string
          notes: string | null
          rate: number
          rate_item_id: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          effective_from?: string
          id?: string
          notes?: string | null
          rate: number
          rate_item_id: string
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          effective_from?: string
          id?: string
          notes?: string | null
          rate?: number
          rate_item_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "rate_item_versions_rate_item_id_fkey"
            columns: ["rate_item_id"]
            isOneToOne: false
            referencedRelation: "rate_items"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_items: {
        Row: {
          code: string
          cost_category_id: string | null
          created_at: string
          currency_code: string
          current_rate: number
          current_version: number
          description: string
          id: string
          is_active: boolean
          organization_id: string
          trade_id: string | null
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          code: string
          cost_category_id?: string | null
          created_at?: string
          currency_code?: string
          current_rate?: number
          current_version?: number
          description: string
          id?: string
          is_active?: boolean
          organization_id: string
          trade_id?: string | null
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          cost_category_id?: string | null
          created_at?: string
          currency_code?: string
          current_rate?: number
          current_version?: number
          description?: string
          id?: string
          is_active?: boolean
          organization_id?: string
          trade_id?: string | null
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rate_items_cost_category_id_fkey"
            columns: ["cost_category_id"]
            isOneToOne: false
            referencedRelation: "cost_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rate_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rate_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "rate_items_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rate_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units_of_measure"
            referencedColumns: ["id"]
          },
        ]
      }
      rfq_suppliers: {
        Row: {
          created_at: string
          id: string
          quoted_total: number | null
          responded_at: string | null
          rfq_id: string
          supplier_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quoted_total?: number | null
          responded_at?: string | null
          rfq_id: string
          supplier_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quoted_total?: number | null
          responded_at?: string | null
          rfq_id?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfq_suppliers_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfq_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          code: string
          created_at: string
          due_date: string | null
          id: string
          organization_id: string
          project_id: string | null
          status: Database["public"]["Enums"]["rfq_status"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          due_date?: string | null
          id?: string
          organization_id: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["rfq_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          due_date?: string | null
          id?: string
          organization_id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["rfq_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfqs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfqs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "rfqs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      snag_items: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          due_date: string | null
          id: string
          location: string | null
          organization_id: string
          project_id: string
          status: Database["public"]["Enums"]["snag_status"]
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          location?: string | null
          organization_id: string
          project_id: string
          status?: Database["public"]["Enums"]["snag_status"]
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          location?: string | null
          organization_id?: string
          project_id?: string
          status?: Database["public"]["Enums"]["snag_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "snag_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snag_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "snag_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: Json | null
          category: Database["public"]["Enums"]["supplier_category"]
          contact_name: string | null
          country_code: string | null
          created_at: string
          email: string | null
          id: string
          is_preferred: boolean
          is_subcontractor: boolean
          name: string
          organization_id: string
          payment_terms_days: number
          phone: string | null
          rating: number | null
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          category?: Database["public"]["Enums"]["supplier_category"]
          contact_name?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_preferred?: boolean
          is_subcontractor?: boolean
          name: string
          organization_id: string
          payment_terms_days?: number
          phone?: string | null
          rating?: number | null
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          category?: Database["public"]["Enums"]["supplier_category"]
          contact_name?: string | null
          country_code?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_preferred?: boolean
          is_subcontractor?: boolean
          name?: string
          organization_id?: string
          payment_terms_days?: number
          phone?: string | null
          rating?: number | null
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      sustainability_metrics: {
        Row: {
          co2_kg: number | null
          created_at: string
          id: string
          notes: string | null
          organization_id: string
          period_end: string
          period_start: string
          project_id: string
          recycled_pct: number | null
          updated_at: string
          waste_kg: number | null
          water_litres: number | null
        }
        Insert: {
          co2_kg?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          organization_id: string
          period_end: string
          period_start: string
          project_id: string
          recycled_pct?: number | null
          updated_at?: string
          waste_kg?: number | null
          water_litres?: number | null
        }
        Update: {
          co2_kg?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          organization_id?: string
          period_end?: string
          period_start?: string
          project_id?: string
          recycled_pct?: number | null
          updated_at?: string
          waste_kg?: number | null
          water_litres?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sustainability_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sustainability_metrics_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "sustainability_metrics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sustainable_materials: {
        Row: {
          certification: string | null
          created_at: string
          embodied_carbon_kg_per_unit: number | null
          id: string
          organization_id: string
          rate_item_id: string
          recycled_content_pct: number | null
          updated_at: string
        }
        Insert: {
          certification?: string | null
          created_at?: string
          embodied_carbon_kg_per_unit?: number | null
          id?: string
          organization_id: string
          rate_item_id: string
          recycled_content_pct?: number | null
          updated_at?: string
        }
        Update: {
          certification?: string | null
          created_at?: string
          embodied_carbon_kg_per_unit?: number | null
          id?: string
          organization_id?: string
          rate_item_id?: string
          recycled_content_pct?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sustainable_materials_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sustainable_materials_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "sustainable_materials_rate_item_id_fkey"
            columns: ["rate_item_id"]
            isOneToOne: false
            referencedRelation: "rate_items"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      units_of_measure: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_of_measure_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_of_measure_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      variation_items: {
        Row: {
          cost_category_id: string | null
          created_at: string
          description: string
          id: string
          line_total: number | null
          position: number
          quantity: number
          rate_item_id: string | null
          unit_id: string | null
          unit_rate: number
          variation_id: string
        }
        Insert: {
          cost_category_id?: string | null
          created_at?: string
          description: string
          id?: string
          line_total?: number | null
          position?: number
          quantity?: number
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
          variation_id: string
        }
        Update: {
          cost_category_id?: string | null
          created_at?: string
          description?: string
          id?: string
          line_total?: number | null
          position?: number
          quantity?: number
          rate_item_id?: string | null
          unit_id?: string | null
          unit_rate?: number
          variation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variation_items_cost_category_id_fkey"
            columns: ["cost_category_id"]
            isOneToOne: false
            referencedRelation: "cost_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variation_items_rate_item_id_fkey"
            columns: ["rate_item_id"]
            isOneToOne: false
            referencedRelation: "rate_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variation_items_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units_of_measure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variation_items_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "variations"
            referencedColumns: ["id"]
          },
        ]
      }
      variations: {
        Row: {
          code: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          description: string | null
          id: string
          organization_id: string
          project_id: string
          status: Database["public"]["Enums"]["variation_status"]
          submitted_at: string | null
          submitted_by: string | null
          time_change_days: number
          title: string
          updated_at: string
          value_change: number
        }
        Insert: {
          code: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          description?: string | null
          id?: string
          organization_id: string
          project_id: string
          status?: Database["public"]["Enums"]["variation_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          time_change_days?: number
          title: string
          updated_at?: string
          value_change?: number
        }
        Update: {
          code?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          description?: string | null
          id?: string
          organization_id?: string
          project_id?: string
          status?: Database["public"]["Enums"]["variation_status"]
          submitted_at?: string | null
          submitted_by?: string | null
          time_change_days?: number
          title?: string
          updated_at?: string
          value_change?: number
        }
        Relationships: [
          {
            foreignKeyName: "variations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "variations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          created_at: string
          daily_rate: number | null
          full_name: string
          hourly_rate: number | null
          id: string
          id_number_last4: string | null
          is_active: boolean
          organization_id: string
          phone: string | null
          trade_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          daily_rate?: number | null
          full_name: string
          hourly_rate?: number | null
          id?: string
          id_number_last4?: string | null
          is_active?: boolean
          organization_id: string
          phone?: string | null
          trade_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          daily_rate?: number | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          id_number_last4?: string | null
          is_active?: boolean
          organization_id?: string
          phone?: string | null
          trade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "workers_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_asset_distribution: {
        Row: {
          allocation_pct: number | null
          category: Database["public"]["Enums"]["asset_category"] | null
          code: string | null
          current_value: number | null
          id: string | null
          name: string | null
          organization_id: string | null
          status: Database["public"]["Enums"]["asset_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      v_org_kpis: {
        Row: {
          active_assets_count: number | null
          active_contract_value: number | null
          active_forecast_value: number | null
          active_project_count: number | null
          market_rank: number | null
          mom_balance_change_pct: number | null
          org_name: string | null
          organization_id: string | null
          pl_ratio: number | null
          total_balance: number | null
        }
        Relationships: []
      }
      v_performance_forecast_monthly: {
        Row: {
          forecasted_value: number | null
          month: string | null
          organization_id: string | null
          stage: Database["public"]["Enums"]["project_stage"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      v_procurement_gate_status: {
        Row: {
          locked_count: number | null
          organization_id: string | null
          pending_count: number | null
          project_id: string | null
          total_gates: number | null
          unlocked_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "procurement_gates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procurement_gates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "procurement_gates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      v_recent_activity: {
        Row: {
          actor_avatar: string | null
          actor_name: string | null
          actor_user_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string | null
          metadata: Json | null
          organization_id: string | null
          summary: string | null
          verb: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "v_org_kpis"
            referencedColumns: ["organization_id"]
          },
        ]
      }
    }
    Functions: {
      current_org_ids: { Args: never; Returns: string[] }
      emit_activity_event: {
        Args: {
          p_actor_id: string
          p_entity_id: string
          p_entity_type: string
          p_metadata?: Json
          p_org_id: string
          p_summary: string
          p_verb: string
        }
        Returns: undefined
      }
      has_org_role: { Args: { org: string; roles: string[] }; Returns: boolean }
      next_entity_code: {
        Args: { org_id: string; prefix: string }
        Returns: string
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      account_type: "cash" | "bank" | "mobile_money" | "credit_line"
      approvable_entity:
        | "purchase_order"
        | "variation"
        | "invoice"
        | "quotation"
        | "expense"
      approval_decision: "pending" | "approved" | "rejected"
      approval_status: "pending" | "approved" | "rejected" | "cancelled"
      asset_category: "plant" | "vehicle" | "tool" | "it" | "other"
      asset_status: "available" | "in_use" | "maintenance" | "retired" | "lost"
      gate_status: "locked" | "pending" | "unlocked"
      inspection_status: "pass" | "fail" | "conditional"
      invoice_status:
        | "draft"
        | "sent"
        | "partially_paid"
        | "paid"
        | "overdue"
        | "void"
      ncr_severity: "low" | "medium" | "high" | "critical"
      ncr_status: "open" | "in_remediation" | "closed"
      opportunity_stage:
        | "lead"
        | "qualified"
        | "bidding"
        | "submitted"
        | "won"
        | "lost"
        | "cancelled"
      org_role:
        | "owner"
        | "admin"
        | "pm"
        | "qs"
        | "estimator"
        | "procurement"
        | "site_engineer"
        | "finance"
        | "viewer"
      payment_method:
        | "bank_transfer"
        | "cheque"
        | "cash"
        | "card"
        | "mobile_money"
      po_status:
        | "draft"
        | "pending_approval"
        | "approved"
        | "sent"
        | "partially_received"
        | "received"
        | "closed"
        | "cancelled"
      project_health: "green" | "amber" | "red"
      project_stage:
        | "tender"
        | "pre_con"
        | "in_progress"
        | "qa_qc"
        | "handover"
        | "closed"
      quotation_status:
        | "draft"
        | "sent"
        | "accepted"
        | "rejected"
        | "expired"
        | "superseded"
      rfq_status: "open" | "closed" | "awarded" | "cancelled"
      snag_status: "open" | "in_progress" | "resolved" | "verified"
      supplier_category:
        | "materials"
        | "subcontractor"
        | "equipment"
        | "services"
        | "logistics"
      variation_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "withdrawn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["cash", "bank", "mobile_money", "credit_line"],
      approvable_entity: [
        "purchase_order",
        "variation",
        "invoice",
        "quotation",
        "expense",
      ],
      approval_decision: ["pending", "approved", "rejected"],
      approval_status: ["pending", "approved", "rejected", "cancelled"],
      asset_category: ["plant", "vehicle", "tool", "it", "other"],
      asset_status: ["available", "in_use", "maintenance", "retired", "lost"],
      gate_status: ["locked", "pending", "unlocked"],
      inspection_status: ["pass", "fail", "conditional"],
      invoice_status: [
        "draft",
        "sent",
        "partially_paid",
        "paid",
        "overdue",
        "void",
      ],
      ncr_severity: ["low", "medium", "high", "critical"],
      ncr_status: ["open", "in_remediation", "closed"],
      opportunity_stage: [
        "lead",
        "qualified",
        "bidding",
        "submitted",
        "won",
        "lost",
        "cancelled",
      ],
      org_role: [
        "owner",
        "admin",
        "pm",
        "qs",
        "estimator",
        "procurement",
        "site_engineer",
        "finance",
        "viewer",
      ],
      payment_method: [
        "bank_transfer",
        "cheque",
        "cash",
        "card",
        "mobile_money",
      ],
      po_status: [
        "draft",
        "pending_approval",
        "approved",
        "sent",
        "partially_received",
        "received",
        "closed",
        "cancelled",
      ],
      project_health: ["green", "amber", "red"],
      project_stage: [
        "tender",
        "pre_con",
        "in_progress",
        "qa_qc",
        "handover",
        "closed",
      ],
      quotation_status: [
        "draft",
        "sent",
        "accepted",
        "rejected",
        "expired",
        "superseded",
      ],
      rfq_status: ["open", "closed", "awarded", "cancelled"],
      snag_status: ["open", "in_progress", "resolved", "verified"],
      supplier_category: [
        "materials",
        "subcontractor",
        "equipment",
        "services",
        "logistics",
      ],
      variation_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "withdrawn",
      ],
    },
  },
} as const

