import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,
  EmployeeStats,
  EmployeeFiltersBar,
  EmployeeTable,
  EmployeeModal,
  type Employee,
  type EmployeeFiltersState,
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
} from '../modules/employees'
import { Spinner } from '../components/ui/Spinner'

/**
 * EmployeesPage — Central Employee Management Hub.
 * Features: Staff statistics, live search & filtering, data table, add/edit profile modal, role assignments.
 */
export default function EmployeesPage() {
  const queryClient = useQueryClient()

  // Filter state
  const [filters, setFilters] = useState<EmployeeFiltersState>({
    search:     '',
    role:       'all',
    department: 'all',
    status:     'all',
  })

  // Modal State
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null)

  // Data Query
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees', filters],
    queryFn:  () => getEmployees(filters),
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CreateEmployeeInput) => createEmployee(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEmployeeInput }) => updateEmployee(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => toggleEmployeeStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  function handleOpenCreateModal() {
    setEmployeeToEdit(null)
    setIsModalOpen(true)
  }

  function handleOpenEditModal(employee: Employee) {
    setEmployeeToEdit(employee)
    setIsModalOpen(true)
  }

  async function handleCreateSubmit(data: CreateEmployeeInput) {
    const res = await createMutation.mutateAsync(data)
    if (res.error) {
      throw new Error(res.error)
    }
  }

  async function handleUpdateSubmit(id: string, data: UpdateEmployeeInput) {
    const res = await updateMutation.mutateAsync({ id, data })
    if (res.error) {
      throw new Error(res.error)
    }
  }

  function handleToggleStatus(employee: Employee) {
    void toggleStatusMutation.mutateAsync({ id: employee.id, status: employee.isActive })
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
          Employees Directory
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
          Manage employee profiles, role assignments, departments, and active statuses.
        </p>
      </div>

      {/* Employee Quick Stats */}
      <EmployeeStats employees={employees} />

      {/* Filters & Add Action Bar */}
      <EmployeeFiltersBar
        filters={filters}
        onChange={setFilters}
        onAddClick={handleOpenCreateModal}
      />

      {/* Data Table */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '240px' }}>
          <Spinner size="lg" color="#818cf8" />
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onEdit={handleOpenEditModal}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmitCreate={handleCreateSubmit}
          onSubmitUpdate={handleUpdateSubmit}
          employeeToEdit={employeeToEdit}
        />
      )}
    </div>
  )
}
