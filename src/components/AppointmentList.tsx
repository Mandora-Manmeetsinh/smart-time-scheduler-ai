
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageSquare, Phone, Trash2 } from "lucide-react";
import { getAppointments, deleteAppointment } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export const AppointmentList = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    setAppointments(getAppointments());
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    loadAppointments();
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been removed from your schedule."
    });
  };

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(`${apt.date}T${apt.time}`);
    const now = new Date();

    if (filter === "upcoming") return aptDate >= now;
    if (filter === "past") return aptDate < now;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Appointments</h2>
          <div className="flex space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "upcoming" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === "past" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("past")}
            >
              Past
            </Button>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-500">
              {filter === "upcoming" 
                ? "You don't have any upcoming appointments."
                : filter === "past"
                ? "No past appointments to display."
                : "No appointments scheduled yet."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const isPast = new Date(`${appointment.date}T${appointment.time}`) < new Date();
              
              return (
                <div
                  key={appointment.id}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                    isPast ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.name}
                        </h3>
                        <Badge variant={isPast ? "secondary" : "default"}>
                          {appointment.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {appointment.time}
                        </div>
                        {appointment.email && (
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {appointment.email}
                          </div>
                        )}
                        {appointment.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {appointment.phone}
                          </div>
                        )}
                      </div>
                      
                      {appointment.service && (
                        <div className="mt-2">
                          <Badge variant="outline">{appointment.service}</Badge>
                        </div>
                      )}
                      
                      {appointment.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
