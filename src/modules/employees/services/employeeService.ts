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

// Mock seed employees for testing if DB table is minimal
const MOCK_EMPLOYEES: Employee[] = [
  {
    id:          'emp-1',
    fullName:    'Rahul Sharma',
    email:       'rahul@mahadev.com',
    role:        'employee',
    department:  'Operations',
    designation: 'Field Executive',
    phone:       '+91 98765 43210',
    isActive:    true,
    createdAt:   new Date().toISOString(),
  },
  {
    id:          'emp-2',
    fullName:    'Priya Patel',
    email:       'priya@mahadev.com',
    role:        'employee',
    department:  'HR & Admin',
    designation: 'HR Coordinator',
    phone:       '+91 98765 12345',
    isActive:    true,
    createdAt:   new Date().toISOString(),
  },
  {
    id:          'emp-3',
    fullName:    'Amit Kumar',
    email:       'amit@mahadev.com',
    role:        'admin',
    department:  'Management',
    designation: 'Operations Manager',
    phone:       '+91 98765 67890',
    isActive:    true,
    createdAt:   new Date().toISOString(),
  },
  {
    id:          'emp-4',
    fullName:    'Sneha Gupta',
    email:       'sneha@mahadev.com',
    role:        'employee',
    department:  'Finance',
    designation: 'Accountant',
    phone:       '+91 98765 99887',
    isActive:    false,
    createdAt:   new Date().toISOString(),
  },
]

export async function getEmployees(filters?: EmployeeFiltersState): Promise<Employee[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    let list: Employee[] = []

    if (!error && data && data.length > 0) {
      list = data.map(mapProfileToEmployee)
      // Merge mock data for demonstration if less than 3 employees
      if (list.length < 3) {
        const existingEmails = new Set(list.map((e) => e.email))
        const extraMocks = MOCK_EMPLOYEES.filter((m) => !existingEmails.has(m.email))
        list = [...list, ...extraMocks]
      }
    } else {
      list = MOCK_EMPLOYEES
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
    return MOCK_EMPLOYEES
  }
}

export async function createEmployee(input: CreateEmployeeInput): Promise<{ error?: string }> {
  try {
    // Attempt Supabase signUp / profile creation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email:    input.email,
      password: input.password,
      options:  {
        data: {
          full_name: input.fullName,
        },
      },
    })

    if (authError) {
      return { error: authError.message }
    }

    if (authData.user) {
      // Upsert profile row
      const newProfile = {
        id:          authData.user.id,
        full_name:   input.fullName,
        email:       input.email,
        role:        input.role,
        department:  input.department  ?? 'General',
        designation: input.designation ?? 'Team Member',
        phone:       input.phone       ?? null,
        is_active:   true,
      }

      const { error: profileErr } = await (supabase.from('profiles') as any).upsert(newProfile)

      if (profileErr) {
        console.error('[employeeService] Profile upsert error:', profileErr)
      }
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
