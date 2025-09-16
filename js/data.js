// data.js - Cadet data and storage management

// Default cadet data with division field added
let defaultCadets = [
  // 2nd Year Cadets - Girls first
  {
    id: "cadet_001",
    name: "Antara Ganvir",
    rank: "Lance Corporal",
    year: 2,
    division: "SW"
  },
  {
    id: "cadet_002",
    name: "Komal Tiwari",
    rank: "Cadet",
    year: 2,
    division: "SW"
  },
  {
    id: "cadet_003",
    name: "Sneha Shiwanshi",
    rank: "Cadet",
    year: 2,
    division: "SW"
  },
  {
    id: "cadet_004",
    name: "Vidya Tiwari",
    rank: "Cadet",
    year: 2,
    division: "SW"
  },
  // 2nd Year Boys
  {
    id: "cadet_005",
    name: "Aakash Shahu",
    rank: "Cadet",
    year: 2,
    division: "SD"
  },
  {
    id: "cadet_006",
    name: "Abhishek Pandey",
    rank: "Cadet",
    year: 2,
    division: "SD"
  },
  {
    id: "cadet_007",
    name: "Prem Datir",
    rank: "Cadet",
    year: 2,
    division: "SD"
  },
  {
    id: "cadet_008",
    name: "Rahul Patle",
    rank: "Cadet",
    year: 2,
    division: "SD"
  },
  {
    id: "cadet_009",
    name: "Sainath Atram",
    rank: "Lance Corporal",
    year: 2,
    division: "SD"
  },
  // 3rd Year Cadets - Girls first
  {
    id: "cadet_010",
    name: "Keshari Verma",
    rank: "Junior Under Officer",
    year: 3,
    division: "SW"
  },
  {
    id: "cadet_011",
    name: "Khusi Chute",
    rank: "Corporal",
    year: 3,
    division: "SW"
  },
  {
    id: "cadet_012",
    name: "Mansi Jangde",
    rank: "Corporal",
    year: 3,
    division: "SW"
  },
  {
    id: "cadet_013",
    name: "Najnin Shaikh",
    rank: "Sergeant",
    year: 3,
    division: "SW"
  },
  {
    id: "cadet_014",
    name: "Priyanka Shahu",
    rank: "Company Quartermaster Sergeant",
    year: 3,
    division: "SW"
  },
  {
    id: "cadet_015",
    name: "Samiksha Badole",
    rank: "Sergeant",
    year: 3,
    division: "SW"
  },
  {
    id: "cadet_016",
    name: "Shreya Shahu",
    rank: "Company Havildar Major",
    year: 3,
    division: "SW"
  },
  // 3rd Year Boys
  {
    id: "cadet_017",
    name: "Abhay Tiwari",
    rank: "Company Quartermaster Sergeant",
    year: 3,
    division: "SD"
  },
  {
    id: "cadet_018",
    name: "Aman Gautam",
    rank: "Cadet",
    year: 3,
    division: "SD"
  },
  {
    id: "cadet_019",
    name: "Ashish Patle",
    rank: "Senior Under Officer",
    year: 3,
    division: "SD"
  },
  {
    id: "cadet_020",
    name: "Ashwin Mohankar",
    rank: "Sergeant",
    year: 3,
    division: "SD"
  },
  {
    id: "cadet_021",
    name: "Mayank Thape",
    rank: "Cadet",
    year: 3,
    division: "SD"
  },
  {
    id: "cadet_022",
    name: "Om Badwaik",
    rank: "Cadet",
    year: 3,
    division: "SD"
  },
  {
    id: "cadet_023",
    name: "Ratan Singh",
    rank: "Junior Under Officer",
    year: 3,
    division: "SD"
  },
  {
    id: "cadet_024",
    name: "Tameshwar Sarwa",
    rank: "Junior Under Officer",
    year: 3,
    division: "SD"
  },
  {
    id: "cadet_025",
    name: "Vishal Adle",
    rank: "Cadet",
    year: 3,
    division: "SD"
  }
];

// Data management functions
class DataManager {
  constructor() {
    this.CADETS_KEY = 'ncc_cadets_data';
    this.ATTENDANCE_PREFIX = 'ncc_attendance_';
  }

  // Initialize cadets data
  initializeCadets() {
    const stored = localStorage.getItem(this.CADETS_KEY);
    if (!stored) {
      this.saveCadets(defaultCadets);
      return defaultCadets;
    }
    return JSON.parse(stored);
  }

  // Get all cadets
  getCadets() {
    const stored = localStorage.getItem(this.CADETS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Save cadets data
  saveCadets(cadets) {
    try {
      localStorage.setItem(this.CADETS_KEY, JSON.stringify(cadets));
      return true;
    } catch (error) {
      console.error('Error saving cadets:', error);
      return false;
    }
  }

  // Add new cadet
  addCadet(cadetData) {
    const cadets = this.getCadets();
    const newCadet = {
      id: this.generateCadetId(),
      name: cadetData.name,
      rank: cadetData.rank,
      year: parseInt(cadetData.year),
      division: cadetData.division
    };
    cadets.push(newCadet);
    return this.saveCadets(cadets) ? newCadet : null;
  }

  // Update cadet
  updateCadet(cadetId, updatedData) {
    const cadets = this.getCadets();
    const index = cadets.findIndex(c => c.id === cadetId);
    if (index === -1) return false;

    cadets[index] = {
      ...cadets[index],
      name: updatedData.name,
      rank: updatedData.rank,
      year: parseInt(updatedData.year),
      division: updatedData.division
    };

    return this.saveCadets(cadets);
  }

  // Delete cadet
  deleteCadet(cadetId) {
    const cadets = this.getCadets();
    const filteredCadets = cadets.filter(c => c.id !== cadetId);
    return this.saveCadets(filteredCadets);
  }

  // Get cadet by ID
  getCadetById(id) {
    const cadets = this.getCadets();
    return cadets.find(c => c.id === id);
  }

  // Generate unique cadet ID
  generateCadetId() {
    return 'cadet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }

  // Attendance data functions
  getAttendanceKey(date) {
    return `${this.ATTENDANCE_PREFIX}${date}`;
  }

  saveAttendanceData(date, attendanceData) {
    try {
      const key = this.getAttendanceKey(date);
      localStorage.setItem(key, JSON.stringify(attendanceData));
      return true;
    } catch (error) {
      console.error('Error saving attendance data:', error);
      return false;
    }
  }

  getAttendanceData(date) {
    try {
      const key = this.getAttendanceKey(date);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error retrieving attendance data:', error);
      return null;
    }
  }

  // Get all attendance history
  getAttendanceHistory() {
    const history = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.ATTENDANCE_PREFIX)) {
        const date = key.replace(this.ATTENDANCE_PREFIX, '');
        const data = this.getAttendanceData(date);
        if (data) {
          history.push({
            date: date,
            presentCount: data.filter(r => r.status === 'present').length,
            absentCount: data.filter(r => r.status === 'absent').length,
            totalCount: data.length,
            data: data
          });
        }
      }
    }
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Calculate cadet attendance percentage
  getCadetAttendanceStats(cadetId) {
    const history = this.getAttendanceHistory();
    let present = 0;
    let total = 0;

    history.forEach(day => {
      const record = day.data.find(r => r.cadetId === cadetId);
      if (record) {
        if (record.status === 'present') present++;
        total++;
      }
    });

    return {
      presentDays: present,
      totalDays: total,
      absentDays: total - present,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0
    };
  }

  // Get all cadets with their attendance stats
  getCadetsWithAttendanceStats() {
    const cadets = this.getCadets();
    return cadets.map(cadet => ({
      ...cadet,
      attendanceStats: this.getCadetAttendanceStats(cadet.id)
    }));
  }

  // Reset all data
  resetAllData() {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.ATTENDANCE_PREFIX) || key === this.CADETS_KEY) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

// Create global instance
const dataManager = new DataManager();