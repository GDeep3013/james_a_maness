import React, { useState, useEffect, useRef } from 'react'
import { workOrderService } from '../../../services/workOrderService'
import { ServiceItem, WorkOrder } from '../../../types/workOrderTypes'
import { MaintenanceRecord } from '../../../types/MMRReportTypes'

type ServiceTask = MaintenanceRecord

interface MMRTaskListProps {
  handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void
  handleInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  vehicleId?: string | number
  date?: string
  onTasksChange?: (tasks: ServiceTask[]) => void
  initialTasks?: ServiceTask[]
}

export default function MMRTaskList({ handleInputFocus, handleInputBlur, vehicleId, date, onTasksChange, initialTasks }: MMRTaskListProps) {
  const [tasks, setTasks] = useState<ServiceTask[]>(initialTasks || [])
  const [loading, setLoading] = useState(false)
  const onTasksChangeRef = useRef(onTasksChange)
  const prevVehicleDateRef = useRef<string>('')

  useEffect(() => {
    onTasksChangeRef.current = onTasksChange
  }, [onTasksChange])

  const prevInitialTasksRef = useRef<ServiceTask[]>([])

  useEffect(() => {
    if (!vehicleId || !date) {
      if (initialTasks) {
        const tasksChanged = JSON.stringify(prevInitialTasksRef.current) !== JSON.stringify(initialTasks)
        if (tasksChanged) {
          setTasks(initialTasks)
          prevInitialTasksRef.current = initialTasks
          if (onTasksChangeRef.current) {
            onTasksChangeRef.current(initialTasks)
          }
        }
      }
    }
  }, [initialTasks, vehicleId, date])

  useEffect(() => {
    const fetchWorkOrders = async () => {
      const currentKey = `${vehicleId}-${date}`
      
      if (!vehicleId || !date) {
        if (!initialTasks || initialTasks.length === 0) {
          setTasks([])
          if (onTasksChangeRef.current) {
            onTasksChangeRef.current([])
          }
        }
        prevVehicleDateRef.current = currentKey
        return
      }

      if (prevVehicleDateRef.current === currentKey) {
        return
      }

      prevVehicleDateRef.current = currentKey

      setLoading(true)
      try {
        const response = await workOrderService.getAll({ page: 1 , vehicle_id: Number(vehicleId) , issue_date: date })
        const workOrders = response.data?.work_orders?.data as WorkOrder[] || []


        const extractedTasks: ServiceTask[] = []

        workOrders.forEach((workOrder: WorkOrder) => {
          let serviceItems = workOrder.service_items

          if (typeof serviceItems === 'string') {
            try {
              serviceItems = JSON.parse(serviceItems)
            } catch {
              serviceItems = []
            }
          }

          if (Array.isArray(serviceItems)) {
            serviceItems.forEach((item: ServiceItem) => {
              if (item.type === 'Service Tasks' || item.type === 'service_tasks' || !item.type) {
                const taskDate = workOrder.issue_date 
                    ? new Date(workOrder.issue_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
                    : ''

                const description = item.name || '';
                const work_order_id = workOrder.id || 0;
                const task_id = item.id || 0;

                if (description && work_order_id && task_id) {
                  extractedTasks.push({
                    date: taskDate,
                    description: description,
                    work_order_id: work_order_id,
                    task_id: task_id
                  })
                }
              }
            })
          }
        })

        setTasks(extractedTasks)
        if (onTasksChangeRef.current) {
          onTasksChangeRef.current(extractedTasks)
        }
      } catch {
        setTasks([])
        if (onTasksChangeRef.current) {
          onTasksChangeRef.current([])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWorkOrders()
  }, [vehicleId, date])


  return (
    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000" }} cellPadding="5" cellSpacing="0">
      <thead>
        <tr>
          <th style={{ border: "1px solid #000", padding: "8px", fontSize: "12px", fontWeight: "bold", textAlign: "left", width: "25%" }}>
            Date of Maintenance
          </th>
          <th style={{ border: "1px solid #000", padding: "8px", fontSize: "12px", fontWeight: "bold", textAlign: "left", width: "75%" }}>
            Specific Description of Maintenance Performed
          </th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={2} style={{ border: "1px solid #000", padding: "20px", textAlign: "center", fontSize: "12px" }}>
              Loading service tasks...
            </td>
          </tr>
        ) : tasks.length === 0 && vehicleId && date ? (
          <tr>
            <td colSpan={2} style={{ border: "1px solid #000", padding: "20px", textAlign: "center", fontSize: "12px" }}>
              No service tasks found for this vehicle and month
            </td>
          </tr>
        ) : (
          tasks.map((task, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #000", padding: "0", verticalAlign: "top" }}>
                <input
                  type="text"
                  value={task?.date || ''}
                  readOnly
                  style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'left', outline: 'none', backgroundColor: '#f1f4ff' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  autoComplete="off"
                />
              </td>
              <td style={{ border: "1px solid #000", padding: "0", verticalAlign: "top" }}>
                <input
                  type="text"
                  value={task?.description || ''}
                  readOnly
                  style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'left', outline: 'none', backgroundColor: '#f1f4ff' }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  autoComplete="off"
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

