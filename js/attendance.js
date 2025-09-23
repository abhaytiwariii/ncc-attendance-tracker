// attendance.js - Attendance management functionality

class AttendanceManager {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Bulk action buttons
    const markAllPresentBtn = document.getElementById('markAllPresent');
    const markAllAbsentBtn = document.getElementById('markAllAbsent');
    const saveBtn = document.getElementById('saveAttendance');
    const clearBtn = document.getElementById('clearAll');

    if (markAllPresentBtn) {
      markAllPresentBtn.addEventListener('click', () => this.markAllPresent());
    }

    if (markAllAbsentBtn) {
      markAllAbsentBtn.addEventListener('click', () => this.markAllAbsent());
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveAttendance());
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearAllAttendance());
    }

    // Filter handlers
    const yearFilter = document.getElementById('yearFilter');
    const divisionFilter = document.getElementById('divisionFilter');

    if (yearFilter) {
      yearFilter.addEventListener('change', (e) => {
        filterManager.updateFilter('year', e.target.value);
        this.applyFilters();
      });
    }

    if (divisionFilter) {
      divisionFilter.addEventListener('change', (e) => {
        filterManager.updateFilter('division', e.target.value);
        this.applyFilters();
      });
    }

    // Search functionality
    const searchBtn = document.getElementById('searchCadets');
    const closeSearchBtn = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.toggleSearch());
    }

    if (closeSearchBtn) {
      closeSearchBtn.addEventListener('click', () => this.toggleSearch());
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterManager.updateFilter('search', e.target.value);
        this.filterCadets();
      });
    }

    // Date change handler
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
      dateInput.addEventListener('change', (e) => {
        this.loadAttendanceForDate(e.target.value);
      });
    }
  }

  loadAttendanceForDate(date) {
    const tableBody = document.getElementById('attendanceTableBody');
    if (!tableBody) return;

    // Clear existing content
    tableBody.innerHTML = '';

    // Get existing attendance data
    const existingData = dataManager.getAttendanceData(date);

    // Get cadets and apply filters
    const allCadets = dataManager.getCadets();
    const filteredCadets = filterManager.applyFilters(allCadets);

    // Update cadet count
    this.updateCadetCount(filteredCadets.length);

    // Generate table rows for each filtered cadet
    filteredCadets.forEach(cadet => {
      const row = document.createElement('tr');
      row.setAttribute('data-cadet-id', cadet.id);

      // Find existing attendance record
      const existingRecord = existingData 
        ? existingData.find(record => record.cadetId === cadet.id)
        : null;

      const isPresent = existingRecord 
        ? existingRecord.status === 'present' 
        : true;
      const reason = existingRecord ? existingRecord.reason || '' : '';

      row.innerHTML = `
        <td>
          <div class="cadet-info">
            <div class="cadet-name">${cadet.name}</div>
          </div>
        </td>
        <td>${generateYearBadge(cadet.year)}</td>
        <td>${generateDivisionBadge(cadet.division)}</td>
        <td>
          <span class="cadet-rank">${cadet.rank}</span>
        </td>
        <td>
          <div class="attendance-controls">
            <div class="radio-group">
              <label class="radio-option present">
                <input type="radio" name="attendance_${cadet.id}" value="present" ${isPresent ? 'checked' : ''}>
                <i class="fas fa-check"></i> Present
              </label>
              <label class="radio-option absent">
                <input type="radio" name="attendance_${cadet.id}" value="absent" ${!isPresent ? 'checked' : ''}>
                <i class="fas fa-times"></i> Absent
              </label>
            </div>
          </div>
        </td>
        <td>
          <input type="text" class="reason-input" placeholder="Enter reason if absent..." 
                 value="${reason}" ${isPresent ? 'style="display: none;"' : ''}>
        </td>
        <td>
          ${cadetManager.generateActionButtons(cadet.id)}
        </td>
      `;

      tableBody.appendChild(row);

      // Add event listeners for radio buttons
      const radioButtons = row.querySelectorAll('input[type="radio"]');
      const reasonInput = row.querySelector('.reason-input');

      radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
          if (radio.value === 'absent') {
            reasonInput.style.display = 'block';
            reasonInput.focus();
          } else {
            reasonInput.style.display = 'none';
            reasonInput.value = '';
          }
          this.updateAttendanceSummary();
        });
      });
    });

    // Show/hide view attendance button based on existing data
    const viewButton = document.getElementById('viewAttendance');
    if (viewButton) {
      viewButton.style.display = existingData ? 'inline-flex' : 'none';
    }

    // Update summary preview
    this.updateAttendanceSummary();
  }

  updateCadetCount(count) {
    const cadetCountElement = document.getElementById('cadetCount');
    if (cadetCountElement) {
      cadetCountElement.textContent = count;
    }
  }

  updateAttendanceSummary() {
    const presentCount = document.querySelectorAll(
      'input[type="radio"][value="present"]:checked'
    ).length;
    const absentCount = document.querySelectorAll(
      'input[type="radio"][value="absent"]:checked'
    ).length;
    const visibleRows = document.querySelectorAll(
      '#attendanceTableBody tr:not([style*="display: none"])'
    ).length;

    const summarySection = document.getElementById('attendanceSummary');
    const presentElement = document.getElementById('previewPresent');
    const absentElement = document.getElementById('previewAbsent');
    const totalElement = document.getElementById('previewTotal');

    if (presentElement) presentElement.textContent = presentCount;
    if (absentElement) absentElement.textContent = absentCount;
    if (totalElement) totalElement.textContent = visibleRows;

    // Show summary if any selections made
    if (summarySection && (presentCount > 0 || absentCount > 0)) {
      summarySection.style.display = 'block';
    }
  }

  markAllPresent() {
    const visibleRows = document.querySelectorAll(
      '#attendanceTableBody tr:not([style*="display: none"])'
    );
    let count = 0;

    visibleRows.forEach(row => {
      const presentRadio = row.querySelector('input[type="radio"][value="present"]');
      const reasonInput = row.querySelector('.reason-input');

      if (presentRadio) {
        presentRadio.checked = true;
        count++;
      }
      if (reasonInput) {
        reasonInput.style.display = 'none';
        reasonInput.value = '';
      }
    });

    showNotification(`${count} visible cadets marked as present`, 'success');
    this.updateAttendanceSummary();
  }

  markAllAbsent() {
    const visibleRows = document.querySelectorAll(
      '#attendanceTableBody tr:not([style*="display: none"])'
    );
    let count = 0;

    visibleRows.forEach(row => {
      const absentRadio = row.querySelector('input[type="radio"][value="absent"]');
      const reasonInput = row.querySelector('.reason-input');

      if (absentRadio) {
        absentRadio.checked = true;
        count++;
      }
      if (reasonInput) {
        reasonInput.style.display = 'block';
      }
    });

    showNotification(
      `${count} visible cadets marked as absent. Please enter reasons.`,
      'info'
    );
    this.updateAttendanceSummary();
  }

  saveAttendance() {
    const selectedDate = document.getElementById('attendanceDate').value;

    if (!selectedDate) {
      showNotification('Please select a date', 'error');
      return;
    }

    const attendanceData = [];
    const rows = document.querySelectorAll('#attendanceTableBody tr');
    let hasErrors = false;

    rows.forEach(row => {
      const cadetId = row.getAttribute('data-cadet-id');
      const cadet = dataManager.getCadetById(cadetId);

      if (!cadet) return;

      const selectedRadio = row.querySelector('input[type="radio"]:checked');
      const reasonInput = row.querySelector('.reason-input');

      if (!selectedRadio) {
        showNotification(
          `Please select attendance status for ${cadet.name}`,
          'error'
        );
        hasErrors = true;
        return;
      }

      const status = selectedRadio.value;
      const reason = reasonInput.value.trim();

      // Validate that absent cadets have a reason
      if (status === 'absent' && !reason) {
        showNotification(
          `Please enter a reason for ${cadet.name}'s absence`,
          'error'
        );
        reasonInput.focus();
        hasErrors = true;
        return;
      }

      attendanceData.push({
        cadetId: cadetId,
        cadetName: cadet.name,
        cadetRank: cadet.rank,
        cadetYear: cadet.year,
        cadetDivision: cadet.division,
        status: status,
        reason: status === 'absent' ? reason : null,
        timestamp: new Date().toISOString()
      });
    });

    if (hasErrors) return;

    // Save to localStorage
    if (dataManager.saveAttendanceData(selectedDate, attendanceData)) {
      showNotification(
        `Attendance saved successfully for ${formatDate(selectedDate)}`,
        'success'
      );

      // Show view attendance button
      const viewButton = document.getElementById('viewAttendance');
      if (viewButton) {
        viewButton.style.display = 'inline-flex';
      }
    } else {
      showNotification('Error saving attendance data', 'error');
    }
  }

  clearAllAttendance() {
    confirmAction('Are you sure you want to clear all attendance selections?', () => {
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      const reasonInputs = document.querySelectorAll('.reason-input');

      radioButtons.forEach(radio => {
        radio.checked = false;
      });

      reasonInputs.forEach(input => {
        input.style.display = 'none';
        input.value = '';
      });

      const summarySection = document.getElementById('attendanceSummary');
      if (summarySection) {
        summarySection.style.display = 'none';
      }

      showNotification('All attendance selections cleared', 'info');
    });
  }

  toggleSearch() {
    const searchSection = document.getElementById('searchSection');
    const searchInput = document.getElementById('searchInput');

    if (searchSection.style.display === 'none') {
      searchSection.style.display = 'block';
      searchInput.focus();
    } else {
      searchSection.style.display = 'none';
      searchInput.value = '';
      filterManager.updateFilter('search', '');
      this.filterCadets();
    }
  }

  filterCadets() {
    const rows = document.querySelectorAll('#attendanceTableBody tr');
    const searchTerm = filterManager.activeFilters.search.toLowerCase();

    rows.forEach(row => {
      const cadetName = row.querySelector('.cadet-name').textContent.toLowerCase();
      const cadetRank = row.querySelector('.cadet-rank').textContent.toLowerCase();

      if (cadetName.includes(searchTerm) || cadetRank.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });

    this.updateAttendanceSummary();
  }

  applyFilters() {
    // Re-load attendance for current date with new filters
    const currentDate = document.getElementById('attendanceDate')?.value || 
                       new Date().toISOString().split('T')[0];
    this.loadAttendanceForDate(currentDate);
  }

  // Export current date attendance
  exportCurrentAttendance() {
    const selectedDate = document.getElementById('attendanceDate').value;
    if (!selectedDate) {
      showNotification('Please select a date first', 'error');
      return;
    }

    const attendanceData = dataManager.getAttendanceData(selectedDate);
    if (!attendanceData || attendanceData.length === 0) {
      showNotification('No attendance data for selected date', 'error');
      return;
    }

    const exportData = attendanceData.map(record => ({
      'Name': record.cadetName,
      'Rank': record.cadetRank,
      'Year': `${record.cadetYear}${record.cadetYear === 1 ? 'st' : record.cadetYear === 2 ? 'nd' : 'rd'} Year`,
      'Division': record.cadetDivision === 'SD' ? 'Senior Division' : 'Senior Wing',
      'Status': record.status.charAt(0).toUpperCase() + record.status.slice(1),
      'Reason': record.reason || '',
      'Date': selectedDate
    }));

    const filename = `NCC_Attendance_${selectedDate}.csv`;
    exportToCSV(exportData, filename);
  }
}

// Create global instance
const attendanceManager = new AttendanceManager();

// Global functions for backward compatibility
function loadAttendanceForDate(date) {
  attendanceManager.loadAttendanceForDate(date);
}

function markAllPresent() {
  attendanceManager.markAllPresent();
}

function markAllAbsent() {
  attendanceManager.markAllAbsent();
}

function saveAttendance() {
  attendanceManager.saveAttendance();
}

function clearAllAttendance() {
  attendanceManager.clearAllAttendance();
}

function toggleSearch() {
  attendanceManager.toggleSearch();
}

function filterCadets() {
  attendanceManager.filterCadets();
}

function applyFilters() {
  attendanceManager.applyFilters();
}