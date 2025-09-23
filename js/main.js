// main.js - Application initialization and main functionality

class NCCAttendanceApp {
  constructor() {
    this.initializeApp();
    this.setupGlobalEventListeners();
    this.loadInitialData();
  }

  initializeApp() {
    // Initialize data manager with default cadets
    dataManager.initializeCadets();
    
    // Setup modal handlers
    ModalManager.setupCloseHandlers();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
      dateInput.value = today;
    }

    // console.log('NCC Attendance System initialized');
  }

  loadInitialData() {
    // Load attendance for today's date
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('attendanceDate');
    
    if (dateInput && attendanceManager) {
      attendanceManager.loadAttendanceForDate(dateInput.value || today);
    }
  }

  setupGlobalEventListeners() {
    // Navigation buttons
    const viewDashboardBtn = document.getElementById('viewDashboard');
    const viewAttendanceBtn = document.getElementById('viewAttendance');
    
    if (viewDashboardBtn) {
      viewDashboardBtn.addEventListener('click', () => {
        navigateToPage('dashboard.html');
      });
    }

    if (viewAttendanceBtn) {
      viewAttendanceBtn.addEventListener('click', () => {
        const selectedDate = document.getElementById('attendanceDate')?.value;
        if (selectedDate) {
          navigateToPage('view.html', { date: selectedDate });
        }
      });
    }

    // Handle URL parameters for editing
    this.handleURLParameters();

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  handleURLParameters() {
    const dateParam = getURLParameter('date');
    if (dateParam) {
      const dateInput = document.getElementById('attendanceDate');
      if (dateInput) {
        dateInput.value = dateParam;
        attendanceManager.loadAttendanceForDate(dateParam);
      }
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+S or Cmd+S to save attendance
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (typeof saveAttendance === 'function') {
          saveAttendance();
        }
      }

      // Ctrl+A or Cmd+A to mark all present (when not in input)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        if (typeof markAllPresent === 'function') {
          markAllPresent();
        }
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        const visibleModals = document.querySelectorAll('.modal[style*="display: flex"]');
        visibleModals.forEach(modal => {
          ModalManager.hide(modal.id);
        });
        
        // Close search
        const searchSection = document.getElementById('searchSection');
        if (searchSection && searchSection.style.display === 'block') {
          toggleSearch();
        }
      }

      // Ctrl+F or Cmd+F to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchBtn = document.getElementById('searchCadets');
        if (searchBtn) {
          searchBtn.click();
        }
      }
    });
  }

  // Export functionality
  exportAttendanceReport() {
    const selectedDate = document.getElementById('attendanceDate')?.value;
    if (!selectedDate) {
      showNotification('Please select a date first', 'error');
      return;
    }

    attendanceManager.exportCurrentAttendance();
  }

  exportCadetsReport() {
    cadetManager.exportCadetsData();
  }

  // Data management
  resetAllData() {
    confirmAction(
      'Are you sure you want to reset all data? This will delete all cadets and attendance records and cannot be undone.',
      () => {
        dataManager.resetAllData();
        
        // Reinitialize with default cadets
        dataManager.initializeCadets();
        
        // Reload current page
        window.location.reload();
        
        showNotification('All data has been reset', 'success');
      }
    );
  }

  // Statistics
  getOverallStatistics() {
    const cadetsStats = cadetManager.getCadetsStatistics();
    const attendanceHistory = dataManager.getAttendanceHistory();
    
    return {
      cadets: cadetsStats,
      attendance: {
        totalDays: attendanceHistory.length,
        totalRecords: attendanceHistory.reduce((sum, day) => sum + day.totalCount, 0),
        totalPresent: attendanceHistory.reduce((sum, day) => sum + day.presentCount, 0),
        totalAbsent: attendanceHistory.reduce((sum, day) => sum + day.absentCount, 0)
      }
    };
  }

  // Debug functions
  debugInfo() {
    console.log('=== NCC Attendance System Debug Info ===');
    console.log('Cadets:', dataManager.getCadets().length);
    console.log('Attendance History:', dataManager.getAttendanceHistory().length);
    console.log('Statistics:', this.getOverallStatistics());
    console.log('Active Filters:', filterManager.activeFilters);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Create global app instance
  window.nccApp = new NCCAttendanceApp();
  
  // console.log('NCC Attendance System loaded successfully');
});

// Global utility functions for external access
window.NCCAttendance = {
  // Data functions
  getCadets: () => dataManager.getCadets(),
  addCadet: (data) => dataManager.addCadet(data),
  updateCadet: (id, data) => dataManager.updateCadet(id, data),
  deleteCadet: (id) => dataManager.deleteCadet(id),
  
  // Attendance functions
  loadAttendance: (date) => attendanceManager.loadAttendanceForDate(date),
  saveAttendance: () => attendanceManager.saveAttendance(),
  getAttendanceHistory: () => dataManager.getAttendanceHistory(),
  
  // Export functions
  exportCadets: () => cadetManager.exportCadetsData(),
  exportAttendance: () => attendanceManager.exportCurrentAttendance(),
  
  // Utility functions
  showNotification: showNotification,
  resetData: () => window.nccApp.resetAllData(),
  getStats: () => window.nccApp.getOverallStatistics(),
  
  // Debug
  debug: () => window.nccApp.debugInfo()
};

// Service Worker registration (for future offline functionality)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Service worker registration would go here
    // navigator.serviceWorker.register('/sw.js');
  });
}