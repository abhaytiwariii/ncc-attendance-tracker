// data.js - Cadet data and storage management

// Default cadet data with division field added
let defaultCadets = [
  // 1st Year - Girls (SW)
  {
    id: "cadet_001",
    name: "Achal Murma",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_002",
    name: "Chaneshwari Damahe",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_003",
    name: "Disha Mendekar",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_004",
    name: "Busum Talandi",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_005",
    name: "Priya Katare",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_006",
    name: "Ranveer Kaur",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_007",
    name: "Sandhya Thakur",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_008",
    name: "Shreya Talandi",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_009",
    name: "Itakshi Rajpoot",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_010",
    name: "Puja Verma",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_011",
    name: "Tanisha Sonwani",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_012",
    name: "Vibha Rahangdale",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_013",
    name: "Shaheen Khan",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_014",
    name: "Shital Verma",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_015",
    name: "Monali Mahamalla",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },
  {
    id: "cadet_016",
    name: "Pronima Baisare",
    rank: "Cadet",
    year: 1,
    division: "SW",
  },

  // 1st Year - Boys (SD)
  {
    id: "cadet_017",
    name: "Amarpreet Singh",
    rank: "Cadet",
    year: 1,
    division: "SD",
  },
  {
    id: "cadet_018",
    name: "Anand Pal",
    rank: "Cadet",
    year: 1,
    division: "SD",
  },
  {
    id: "cadet_019",
    name: "Lalit Varma",
    rank: "Cadet",
    year: 1,
    division: "SD",
  },
  {
    id: "cadet_020",
    name: "Samrat Yadav",
    rank: "Cadet",
    year: 1,
    division: "SD",
  },
  {
    id: "cadet_021",
    name: "Sohel Saikh",
    rank: "Cadet",
    year: 1,
    division: "SD",
  },
  {
    id: "cadet_022",
    name: "Sohel Borkar",
    rank: "Cadet",
    year: 1,
    division: "SD",
  },
  {
    id: "cadet_023",
    name: "Yash Kewat",
    rank: "Cadet",
    year: 1,
    division: "SD",
  },
  {
    id: "cadet_024",
    name: "Prem Dhole",
    rank: "Cadet",
    year: 1,
    division: "SD",
  },

  // 2nd Year - Girls (SW)
  {
    id: "cadet_025",
    name: "Antara Ganvir",
    rank: "Lance Corporal",
    year: 2,
    division: "SW",
  },
  {
    id: "cadet_026",
    name: "Komal Tiwari",
    rank: "Cadet",
    year: 2,
    division: "SW",
  },
  {
    id: "cadet_027",
    name: "Sneha Shiwanshi",
    rank: "Cadet",
    year: 2,
    division: "SW",
  },
  {
    id: "cadet_028",
    name: "Vidya Tiwari",
    rank: "Cadet",
    year: 2,
    division: "SW",
  },

  // 2nd Year - Boys (SD)
  {
    id: "cadet_029",
    name: "Aakash Shahu",
    rank: "Cadet",
    year: 2,
    division: "SD",
  },
  {
    id: "cadet_030",
    name: "Abhishek Pandey",
    rank: "Cadet",
    year: 2,
    division: "SD",
  },
  {
    id: "cadet_031",
    name: "Prem Datir",
    rank: "Cadet",
    year: 2,
    division: "SD",
  },
  {
    id: "cadet_032",
    name: "Rahul Patel",
    rank: "Cadet",
    year: 2,
    division: "SD",
  },
  {
    id: "cadet_033",
    name: "Sainath Atram",
    rank: "Corporal",
    year: 2,
    division: "SD",
  },

  // 3rd Year - Girls (SW)
  {
    id: "cadet_034",
    name: "Keshari Verma",
    rank: "Junior Under Officer",
    year: 3,
    division: "SW",
  },
  {
    id: "cadet_035",
    name: "Khusi Chute",
    rank: "Corporal",
    year: 3,
    division: "SW",
  },
  {
    id: "cadet_036",
    name: "Mansi Jangde",
    rank: "Corporal",
    year: 3,
    division: "SW",
  },
  {
    id: "cadet_037",
    name: "Najnin Shaikh",
    rank: "Sergeant",
    year: 3,
    division: "SW",
  },
  {
    id: "cadet_038",
    name: "Priyanka Shahu",
    rank: "Company Quartermaster Sergeant",
    year: 3,
    division: "SW",
  },
  {
    id: "cadet_039",
    name: "Samiksha Badole",
    rank: "Sergeant",
    year: 3,
    division: "SW",
  },
  {
    id: "cadet_040",
    name: "Shreya Shahu",
    rank: "Company Havildar Major",
    year: 3,
    division: "SW",
  },

  // 3rd Year - Boys (SD)
  {
    id: "cadet_041",
    name: "Abhay Tiwari",
    rank: "Company Quartermaster Sergeant",
    year: 3,
    division: "SD",
  },
  {
    id: "cadet_042",
    name: "Aman Gautam",
    rank: "Cadet",
    year: 3,
    division: "SD",
  },
  {
    id: "cadet_043",
    name: "Ashish Patle",
    rank: "Senior Under Officer",
    year: 3,
    division: "SD",
  },
  {
    id: "cadet_044",
    name: "Ashwin Mohankar",
    rank: "Sergeant",
    year: 3,
    division: "SD",
  },
  {
    id: "cadet_045",
    name: "Mayank Thape",
    rank: "Cadet",
    year: 3,
    division: "SD",
  },
  {
    id: "cadet_046",
    name: "Om Badwaik",
    rank: "Cadet",
    year: 3,
    division: "SD",
  },
  {
    id: "cadet_047",
    name: "Ratan Singh",
    rank: "Junior Under Officer",
    year: 3,
    division: "SD",
  },
  {
    id: "cadet_048",
    name: "Tameshwar Sarwa",
    rank: "Junior Under Officer",
    year: 3,
    division: "SD",
  },
  {
    id: "cadet_049",
    name: "Vishal Adle",
    rank: "Cadet",
    year: 3,
    division: "SD",
  },
];

// Data management functions
class DataManager {
  constructor() {
    this.CADETS_KEY = "ncc_cadets_data";
    this.ATTENDANCE_PREFIX = "ncc_attendance_";
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
      console.error("Error saving cadets:", error);
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
      division: cadetData.division,
    };
    cadets.push(newCadet);
    return this.saveCadets(cadets) ? newCadet : null;
  }

  // Update cadet
  updateCadet(cadetId, updatedData) {
    const cadets = this.getCadets();
    const index = cadets.findIndex((c) => c.id === cadetId);
    if (index === -1) return false;

    cadets[index] = {
      ...cadets[index],
      name: updatedData.name,
      rank: updatedData.rank,
      year: parseInt(updatedData.year),
      division: updatedData.division,
    };

    return this.saveCadets(cadets);
  }

  // Delete cadet
  deleteCadet(cadetId) {
    const cadets = this.getCadets();
    const filteredCadets = cadets.filter((c) => c.id !== cadetId);
    return this.saveCadets(filteredCadets);
  }

  // Get cadet by ID
  getCadetById(id) {
    const cadets = this.getCadets();
    return cadets.find((c) => c.id === id);
  }

  // Generate unique cadet ID
  generateCadetId() {
    return (
      "cadet_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5)
    );
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
      console.error("Error saving attendance data:", error);
      return false;
    }
  }

  getAttendanceData(date) {
    try {
      const key = this.getAttendanceKey(date);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error retrieving attendance data:", error);
      return null;
    }
  }

  // Get all attendance history
  getAttendanceHistory() {
    const history = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.ATTENDANCE_PREFIX)) {
        const date = key.replace(this.ATTENDANCE_PREFIX, "");
        const data = this.getAttendanceData(date);
        if (data) {
          history.push({
            date: date,
            presentCount: data.filter((r) => r.status === "present").length,
            absentCount: data.filter((r) => r.status === "absent").length,
            totalCount: data.length,
            data: data,
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

    history.forEach((day) => {
      const record = day.data.find((r) => r.cadetId === cadetId);
      if (record) {
        if (record.status === "present") present++;
        total++;
      }
    });

    return {
      presentDays: present,
      totalDays: total,
      absentDays: total - present,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }

  // Get all cadets with their attendance stats
  getCadetsWithAttendanceStats() {
    const cadets = this.getCadets();
    return cadets.map((cadet) => ({
      ...cadet,
      attendanceStats: this.getCadetAttendanceStats(cadet.id),
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
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
}

// Create global instance
const dataManager = new DataManager();
