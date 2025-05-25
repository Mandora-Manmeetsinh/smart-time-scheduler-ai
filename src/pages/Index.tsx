
import { useState } from "react";
import { CalendarView } from "@/components/CalendarView";
import { BookingForm } from "@/components/BookingForm";
import { AppointmentList } from "@/components/AppointmentList";
import { AIScheduler } from "@/components/AIScheduler";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, MessageSquare } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<"calendar" | "list" | "ai">("calendar");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Smart Scheduler</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={currentView === "calendar" ? "default" : "outline"}
                onClick={() => setCurrentView("calendar")}
                className="flex items-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              
              <Button
                variant={currentView === "list" ? "default" : "outline"}
                onClick={() => setCurrentView("list")}
                className="flex items-center"
              >
                <Clock className="h-4 w-4 mr-2" />
                Appointments
              </Button>
              
              <Button
                variant={currentView === "ai" ? "default" : "outline"}
                onClick={() => setCurrentView("ai")}
                className="flex items-center"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Suggest
              </Button>
              
              <Button
                onClick={() => setShowBookingForm(true)}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {currentView === "calendar" && (
            <CalendarView 
              onDateSelect={(date) => {
                setSelectedDate(date);
                setShowBookingForm(true);
              }}
            />
          )}
          
          {currentView === "list" && <AppointmentList />}
          
          {currentView === "ai" && <AIScheduler />}
        </div>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          selectedDate={selectedDate}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedDate("");
          }}
          onSuccess={() => {
            setShowBookingForm(false);
            setSelectedDate("");
            setCurrentView("list");
          }}
        />
      )}
    </div>
  );
};

export default Index;
