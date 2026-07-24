import { supabase } from '../../../lib/supabase'
import type { Employee, EmployeeFiltersState, CreateEmployeeInput, UpdateEmployeeInput } from '../types'
import type { Tables } from '../../../lib/database.types'

function mapProfileToEmployee(profile: Tables<'profiles'>): Employee {
  return {
    id:          profile.id,
    fullName:    profile.full_name,
    email:       profile.email,
    role:        profile.role,
    department:  profile.department   ?? 'General',
    designation: profile.designation  ?? 'Team Member',
    phone:       profile.phone        ?? undefined,
    avatarUrl:   profile.avatar_url   ?? undefined,
    isActive:    profile.is_active,
    createdAt:   profile.created_at,
  }
}

/**
 * getEmployees — Fetch real employee profiles strictly from Supabase database.
 * No dummy/mock seed data injected.
 */
export async function getEmployees(filters?: EmployeeFiltersState): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin')
      .order('created_at', { ascending: false })

    let list: Employee[] = []

    if (!error && data) {
      list = data.map(mapProfileToEmployee)
    }

    // Apply Client-side filtering
    if (filters) {
      if (filters.search) {
        const query = filters.search.toLowerCase()
        list = list.filter(
          (e) =>
            e.fullName.toLowerCase().includes(query) ||
            e.email.toLowerCase().includes(query) ||
            (e.department && e.department.toLowerCase().includes(query)) ||
            (e.designation && e.designation.toLowerCase().includes(query))
        )
      }

      if (filters.role !== 'all') {
        list = list.filter((e) => e.role === filters.role)
      }

      if (filters.department && filters.department !== 'all') {
        list = list.filter((e) => e.department === filters.department)
      }

      if (filters.status !== 'all') {
        const isActive = filters.status === 'active'
        list = list.filter((e) => e.isActive === isActive)
      }
    }

    return list
  } catch (err) {
    console.error('[employeeService] Failed to fetch employees:', err)
    return []
  }
}

export async function createEmployee(input: CreateEmployeeInput): Promise<{ error?: string }> {
  try {
    // We use a custom Postgres RPC to create the user directly in the database.
    // This bypasses the Supabase Auth "Confirm Email" requirement and ensures
    // the Admin's session is not modified or logged out during creation.
    const { error } = await (supabase.rpc as any)('create_employee', {
      emp_email:       input.email,
      emp_password:    input.password,
      emp_full_name:   input.fullName,
      emp_role:        input.role,
      emp_department:  input.department  ?? 'General',
      emp_designation: input.designation ?? 'Team Member',
      emp_phone:       input.phone       ?? null,
    })

    if (error) {
      console.error('[employeeService] RPC create_employee error:', error)
      return { error: error.message ?? 'Failed to create employee.' }
    }

    return {}
  } catch (err: any) {
    return { error: err.message ?? 'Failed to create employee.' }
  }
}

export async function updateEmployee(id: string, input: UpdateEmployeeInput): Promise<{ error?: string }> {
  try {
    const { error } = await (supabase.from('profiles') as any)
      .update({
        full_name:   input.fullName,
        role:        input.role,
        department:  input.department,
        designation: input.designation,
        phone:       input.phone,
        is_active:   input.isActive,
        updated_at:  new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }
    return {}
  } catch (err: any) {
    return { error: err.message ?? 'Failed to update employee.' }
  }
}

export async function toggleEmployeeStatus(id: string, currentStatus: boolean): Promise<{ error?: string }> {
  return updateEmployee(id, { isActive: !currentStatus })
}
