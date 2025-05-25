
export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  service?: string;
  notes?: string;
  status: string;
  createdAt: string;
}

const STORAGE_KEY = 'smart_scheduler_appointments';

export const getAppointments = (): Appointment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading appointments:', error);
    return [];
  }
};

export const saveAppointment = (appointment: Appointment): void => {
  try {
    const appointments = getAppointments();
    appointments.push(appointment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch (error) {
    console.error('Error saving appointment:', error);
  }
};

export const deleteAppointment = (id: string): void => {
  try {
    const appointments = getAppointments();
    const filtered = appointments.filter(apt => apt.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting appointment:', error);
  }
};

export const updateAppointment = (id: string, updates: Partial<Appointment>): void => {
  try {
    const appointments = getAppointments();
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
  }
};

// Initialize with some sample data if storage is empty
export const initializeSampleData = (): void => {
  if (getAppointments().length === 0) {
    const sampleAppointments: Appointment[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        date: '2025-01-28',
        time: '10:00',
        service: 'Consultation',
        notes: 'First-time patient consultation',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        date: '2025-01-29',
        time: '14:30',
        service: 'Follow-up',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleAppointments));
  }
};
