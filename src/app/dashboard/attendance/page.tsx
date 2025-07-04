"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCalendar, FiClock, FiCheck, FiX, FiAlertCircle, FiCheckCircle, FiCamera } from "react-icons/fi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  percentage: number;
  recentAttendance: Array<{
    _id: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'half-day';
    batchInfo: {
      name: string;
    };
  }>;
  lastUpdated: string;
  debug?: {
    calculatedStats: {
      present: number;
      absent: number;
      late: number;
      halfDay: number;
      total: number;
      effectiveAttendance: number;
      percentage: number;
    };
    storedStats: {
      present: number;
      absent: number;
      late: number;
      halfDay: number;
      percentage: number;
    };
  };
}

interface TodayAttendance {
  _id: string;
  userId: string;
  batchId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  checkIn?: {
    time: string;
    photo: { url: string };
  };
  checkOut?: {
    time: string;
    photo: { url: string };
  };
  batchInfo: {
    name: string;
    startDate: string;
    endDate: string;
    classTiming: {
      startTime: string;
      endTime: string;
      lateThreshold: number;
    };
  };
}

interface AttendanceRecord {
  _id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  subject: string;
  notes?: string;
}

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export default function AttendancePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance | null>(null);
  const [todayAttendanceLoading, setTodayAttendanceLoading] = useState(false);
  const [todayAttendanceError, setTodayAttendanceError] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  
  // Sample attendance records for demonstration
  const sampleAttendanceRecords: AttendanceRecord[] = [
    {
      _id: '1',
      date: '2023-10-15',
      status: 'present',
      subject: 'Database Management',
    },
    {
      _id: '2',
      date: '2023-10-16',
      status: 'present',
      subject: 'Web Development',
    },
    {
      _id: '3',
      date: '2023-10-17',
      status: 'absent',
      subject: 'Data Structures',
      notes: 'Medical leave'
    },
    {
      _id: '4',
      date: '2023-10-18',
      status: 'late',
      subject: 'Computer Networks',
      notes: 'Late by 15 minutes'
    },
    {
      _id: '5',
      date: '2023-10-19',
      status: 'present',
      subject: 'Operating Systems',
    },
    {
      _id: '6',
      date: '2023-10-20',
      status: 'present',
      subject: 'Software Engineering',
    },
    {
      _id: '7',
      date: '2023-10-21',
      status: 'absent',
      subject: 'Artificial Intelligence',
      notes: 'Family emergency'
    },
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get tokens from localStorage
        const storedTokens = localStorage.getItem('tokens');
        if (!storedTokens) {
          throw new Error("Authentication tokens not found");
        }
        
        const { accessToken } = JSON.parse(storedTokens);
        
        // Fetch attendance stats from the new API
        const statsResponse = await fetch(`${API_BASE_URL}/attendance/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        });

        const statsData = await statsResponse.json();

        if (!statsResponse.ok) {
          // Check if the error is related to token authentication
          if (statsData.message?.toLowerCase().includes('token') || 
              statsData.message?.toLowerCase().includes('auth') ||
              statsData.message === "Not authorized, token failed" ||
              statsResponse.status === 401 || 
              statsResponse.status === 403) {
            
            // Clear localStorage and redirect to login
            localStorage.removeItem('user');
            localStorage.removeItem('tokens');
            router.push('/login');
            return;
          }
          
          throw new Error(statsData.message || "Failed to fetch attendance stats");
        }

        // Store attendance stats data
        console.log('Attendance stats response:', statsData.data);
        setAttendanceStats(statsData.data);
        
        // Fetch user profile for display purposes
        const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUserProfile(profileData.data.user);
        }
        
        // Use recent attendance from the API response
        if (statsData.data.recentAttendance) {
          setAttendanceRecords(statsData.data.recentAttendance.map((record: any) => ({
            _id: record._id,
            date: record.date,
            status: record.status,
            subject: record.batchInfo.name,
            notes: undefined
          })));
        }
        
      } catch (error) {
        console.error("Data fetch error:", error);
        
        // Check if the error message indicates authentication issues
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch data";
        
        if (errorMessage.toLowerCase().includes('token') || 
            errorMessage.toLowerCase().includes('auth') || 
            errorMessage === "Not authorized, token failed") {
          
          // Clear localStorage and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('tokens');
          router.push('/login');
          return;
        }
        
        setError(errorMessage);
        
        // Check if we have user data in localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUserProfile(parsedUser);
            // Use sample attendance records as fallback
            setAttendanceRecords(sampleAttendanceRecords);
          } catch (e) {
            console.error("Error parsing stored user data:", e);
            // Redirect to login if no valid user data is found
            router.push('/login');
          }
        } else {
          // Redirect to login if no user data is found
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Fetch today's attendance
  const fetchTodayAttendance = async () => {
    setTodayAttendanceLoading(true);
    setTodayAttendanceError(null);
    
    try {
      // Get tokens from localStorage
      const storedTokens = localStorage.getItem('tokens');
      if (!storedTokens) {
        throw new Error("Authentication tokens not found");
      }
      
      const { accessToken } = JSON.parse(storedTokens);
      
      // Fetch today's attendance with authorization header
      const response = await fetch(`${API_BASE_URL}/attendance/me/today`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if the error is related to token authentication
        if (data.message?.toLowerCase().includes('token') || 
            data.message?.toLowerCase().includes('auth') ||
            data.message === "Not authorized, token failed" ||
            response.status === 401 || 
            response.status === 403) {
          
          // Clear localStorage and redirect to login
          localStorage.removeItem('user');
          localStorage.removeItem('tokens');
          router.push('/login');
          return;
        }
        
        throw new Error(data.message || "Failed to fetch today's attendance");
      }

      setTodayAttendance(data.data);
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
      setTodayAttendanceError(error instanceof Error ? error.message : "Failed to fetch today's attendance");
    } finally {
      setTodayAttendanceLoading(false);
    }
  };

  // Fetch today's attendance when component mounts
  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  // Function to recalculate attendance stats
  const recalculateStats = async () => {
    try {
      // Get tokens from localStorage
      const storedTokens = localStorage.getItem('tokens');
      if (!storedTokens) {
        throw new Error("Authentication tokens not found");
      }
      
      const { accessToken } = JSON.parse(storedTokens);
      
      // Call the recalculate endpoint
      const response = await fetch(`${API_BASE_URL}/attendance/stats?recalculate=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      console.log('Recalculate stats response:', data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to recalculate stats");
      }

      // Refresh the attendance stats after recalculation
      const statsResponse = await fetch(`${API_BASE_URL}/attendance/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const statsData = await statsResponse.json();
      console.log('Updated attendance stats:', statsData.data);
      setAttendanceStats(statsData.data);

      // alert('Attendance stats recalculated successfully!');
    } catch (error) {
      console.error("Error recalculating stats:", error);
      alert('Failed to recalculate stats: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time
  const formatTime = (timeString: string) => {
    if (!timeString || timeString === 'Invalid Date' || timeString === 'null' || timeString === 'undefined') {
      return 'Not available';
    }
    
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      return 'Not available';
    }
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format full date
  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge based on attendance status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheck className="mr-1 h-3 w-3" />
            Present
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiX className="mr-1 h-3 w-3" />
            Absent
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiClock className="mr-1 h-3 w-3" />
            Late
          </span>
        );
      case 'half-day':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <FiClock className="mr-1 h-3 w-3" />
            Half Day
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <FiAlertCircle className="mr-1 h-3 w-3" />
            Unknown
          </span>
        );
    }
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  // If there's an error and no profile, show error message
  if (error && !userProfile) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <p className="mt-2 text-sm">
              <button 
                onClick={() => router.push('/login')}
                className="text-red-700 underline hover:text-red-600"
              >
                Return to login
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Record</h1>
          <p className="text-gray-500 mt-1">Track your attendance and performance</p>
        </div>
      </div>
      
      {/* Attendance Stats */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Attendance Overview</h2>
            {attendanceStats?.lastUpdated && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {formatTime(attendanceStats.lastUpdated)}
              </p>
            )}
          </div>
          <button
            onClick={recalculateStats}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Recalculate Attendance
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm font-medium text-gray-500">Present</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{attendanceStats?.present || 0}</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <p className="text-sm font-medium text-gray-500">Absent</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{attendanceStats?.absent || 0}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
            <p className="text-sm font-medium text-gray-500">Late</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">{attendanceStats?.late || 0}</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <p className="text-sm font-medium text-gray-500">Half Day</p>
            <p className="text-2xl font-bold text-orange-700 mt-1">{attendanceStats?.halfDay || 0}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <p className="text-sm font-medium text-gray-500">Percentage</p>
            <div className="flex items-center mt-1">
              <p className="text-2xl font-bold text-green-700">{attendanceStats?.percentage || 0}%</p>
              <div className="ml-auto">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-green-200">
                  <div className="text-sm font-bold text-green-700">{attendanceStats?.percentage || 0}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's Attendance */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Today's Attendance</h2>
        
        {todayAttendanceLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading today's attendance...</span>
          </div>
        ) : todayAttendanceError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiX className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{todayAttendanceError}</p>
            </div>
          </div>
        ) : todayAttendance ? (
          <div className="space-y-6">
            {/* Date and Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-lg font-semibold text-gray-900">{formatFullDate(todayAttendance.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    todayAttendance.status === 'present' ? 'bg-green-100 text-green-800' :
                    todayAttendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                    todayAttendance.status === 'half-day' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {todayAttendance.status === 'half-day' ? 'Half Day' : 
                     todayAttendance.status.charAt(0).toUpperCase() + todayAttendance.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Batch Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Batch Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Batch Name</p>
                  <p className="font-medium text-gray-900">{todayAttendance.batchInfo.name}</p>
                </div>
                {todayAttendance.batchInfo.classTiming && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Class Time</p>
                      <p className="font-medium text-gray-900">
                        {todayAttendance.batchInfo.classTiming.startTime} - {todayAttendance.batchInfo.classTiming.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Late Threshold</p>
                      <p className="font-medium text-gray-900">{todayAttendance.batchInfo.classTiming.lateThreshold} minutes</p>
                    </div>
                  </div>
                )}
                {!todayAttendance.batchInfo.classTiming && (
                  <div className="text-sm text-gray-500">
                    Class timing information not available
                  </div>
                )}
              </div>
            </div>

            {/* Check-in and Check-out Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Check-in Details */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FiCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Check-in Details
                </h3>
                {todayAttendance.checkIn ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Check-in Time</p>
                      <p className="font-medium text-gray-900">{formatTime(todayAttendance.checkIn.time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Check-in Photo</p>
                      {todayAttendance.checkIn.photo && todayAttendance.checkIn.photo.url ? (
                        <img 
                          src={todayAttendance.checkIn.photo.url} 
                          alt="Check-in photo"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-lg border border-gray-200">
                          <div className="text-center">
                            <FiCamera className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">No photo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FiClock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Not checked in today</p>
                  </div>
                )}
              </div>

              {/* Check-out Details */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FiClock className="h-5 w-5 text-blue-600 mr-2" />
                  Check-out Details
                </h3>
                {todayAttendance.checkOut ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Check-out Time</p>
                      <p className="font-medium text-gray-900">{formatTime(todayAttendance.checkOut.time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Check-out Photo</p>
                      {todayAttendance.checkOut.photo && todayAttendance.checkOut.photo.url ? (
                        <img 
                          src={todayAttendance.checkOut.photo.url} 
                          alt="Check-out photo"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded-lg border border-gray-200">
                          <div className="text-center">
                            <FiCamera className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">No photo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <FiClock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Not checked out today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">No attendance data available for today.</p>
          </div>
        )}
      </div>
      
      {/* Attendance Records */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Attendance</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {attendanceRecords.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiCalendar className="h-4 w-4 text-gray-400 mr-2" />
                      {formatDate(record.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {attendanceRecords.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500">No attendance records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
