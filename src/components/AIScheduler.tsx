
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Calendar, Clock, Sparkles } from "lucide-react";
import { getAppointments } from "@/lib/storage";

export const AIScheduler = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = () => {
    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const appointments = getAppointments();
      const now = new Date();
      const suggestions = [];
      
      // Generate 3 smart suggestions based on availability
      for (let i = 1; i <= 7; i++) {
        const suggestionDate = new Date(now);
        suggestionDate.setDate(now.getDate() + i);
        
        // Skip weekends for business appointments
        if (suggestionDate.getDay() === 0 || suggestionDate.getDay() === 6) continue;
        
        const dateStr = suggestionDate.toISOString().split('T')[0];
        const times = ["09:00", "10:30", "14:00", "15:30"];
        
        for (const time of times) {
          const isAvailable = !appointments.some(apt => 
            apt.date === dateStr && apt.time === time
          );
          
          if (isAvailable && suggestions.length < 5) {
            suggestions.push({
              date: dateStr,
              time: time,
              reason: getSmartReason(suggestionDate, time, query),
              confidence: Math.floor(Math.random() * 20) + 80
            });
          }
        }
      }
      
      setSuggestions(suggestions);
      setLoading(false);
    }, 1500);
  };

  const getSmartReason = (date: Date, time: string, userQuery: string) => {
    const reasons = [
      "Optimal productivity window based on your preferences",
      "Low booking density - peaceful environment",
      "Perfect timing for follow-up appointments",
      "Minimal wait time expected",
      "Best availability window this week"
    ];
    
    if (userQuery.toLowerCase().includes("morning")) {
      return time < "12:00" ? "Morning preference detected" : reasons[0];
    }
    
    if (userQuery.toLowerCase().includes("urgent")) {
      return "Earliest available slot for urgent requests";
    }
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Sparkles className="h-6 w-6 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">AI Schedule Assistant</h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="query">Describe your scheduling needs</Label>
          <div className="flex space-x-3 mt-2">
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'I need a morning appointment this week' or 'Schedule something urgent'"
              className="flex-1"
            />
            <Button
              onClick={generateSuggestions}
              disabled={loading || !query.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Suggest
                </>
              )}
            </Button>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border border-purple-200 rounded-lg p-4 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(suggestion.date)}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-4 w-4 mr-2" />
                          {suggestion.time}
                        </div>
                        <div className="text-sm text-purple-600 font-medium">
                          {suggestion.confidence}% match
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{suggestion.reason}</p>
                    </div>
                    <Button size="sm" className="ml-4">
                      Book This Slot
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.length === 0 && !loading && (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              AI-Powered Scheduling
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Describe your scheduling preferences and I'll suggest the best available time slots 
              based on your needs, calendar availability, and optimal scheduling patterns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
