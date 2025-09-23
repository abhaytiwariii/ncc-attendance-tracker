// cadet-manager.js - Cadet management functionality

class CadetManager {
  constructor() {
    this.currentEditingId = null;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Add cadet modal handlers
    const addBtn = document.getElementById('addCadetBtn');
    const addModal = document.getElementById('addCadetModal');
    const addForm = document.getElementById('addCadetForm');
    const cancelAddBtn = document.getElementById('cancelAddCadet');

    if (addBtn) {
      addBtn.addEventListener('click', () => this.showAddCadetModal());
    }

    if (addForm) {
      addForm.addEventListener('submit', (e) => this.handleAddCadet(e));
    }

    if (cancelAddBtn) {
      cancelAddBtn.addEventListener('click', () => this.hideAddCadetModal());
    }

    // Edit cadet modal handlers
    const editForm = document.getElementById('editCadetForm');
    const cancelEditBtn = document.getElementById('cancelEditCadet');

    if (editForm) {
      editForm.addEventListener('submit', (e) => this.handleEditCadet(e));
    }

    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => this.hideEditCadetModal());
    }
  }

  showAddCadetModal() {
    resetForm('addCadetForm');
    ModalManager.show('addCadetModal');
  }

  hideAddCadetModal() {
    ModalManager.hide('addCadetModal');
    resetForm('addCadetForm');
  }

  showEditCadetModal(cadetId) {
    const cadet = dataManager.getCadetById(cadetId);
    if (!cadet) {
      showNotification('Cadet not found', 'error');
      return;
    }

    this.currentEditingId = cadetId;
    
    // Populate form
    document.getElementById('editCadetId').value = cadet.id;
    document.getElementById('editCadetName').value = cadet.name;
    document.getElementById('editCadetRank').value = cadet.rank;
    document.getElementById('editCadetYear').value = cadet.year;
    document.getElementById('editCadetDivision').value = cadet.division;

    ModalManager.show('editCadetModal');
  }

  hideEditCadetModal() {
    ModalManager.hide('editCadetModal');
    this.currentEditingId = null;
  }

  showCadetInfo(cadetId) {
    const cadet = dataManager.getCadetById(cadetId);
    if (!cadet) {
      showNotification('Cadet not found', 'error');
      return;
    }

    const stats = dataManager.getCadetAttendanceStats(cadetId);

    // Populate info modal
    document.getElementById('infoName').textContent = cadet.name;
    document.getElementById('infoRank').textContent = cadet.rank;
    document.getElementById('infoYear').textContent = `${cadet.year}${cadet.year === 1 ? 'st' : cadet.year === 2 ? 'nd' : 'rd'} Year`;
    document.getElementById('infoDivision').textContent = cadet.division === 'SD' ? 'Senior Division (SD)' : 'Senior Wing (SW)';
    
    document.getElementById('infoAttendancePercentage').textContent = `${stats.percentage}%`;
    document.getElementById('infoPresentDays').textContent = stats.presentDays;
    document.getElementById('infoAbsentDays').textContent = stats.absentDays;
    document.getElementById('infoTotalDays').textContent = stats.totalDays;

    ModalManager.show('cadetInfoModal');
  }

  handleAddCadet(e) {
    e.preventDefault();
    
    const formData = {
      name: document.getElementById('cadetName').value.trim(),
      rank: document.getElementById('cadetRank').value,
      year: document.getElementById('cadetYear').value,
      division: document.getElementById('cadetDivision').value
    };

    // Validate data
    const errors = validateCadetData(formData);
    if (errors.length > 0) {
      showNotification(errors[0], 'error');
      return;
    }

    // Check for duplicate names
    const existingCadets = dataManager.getCadets();
    const duplicateName = existingCadets.find(c => 
      c.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (duplicateName) {
      showNotification('A cadet with this name already exists', 'error');
      return;
    }

    // Add cadet
    const newCadet = dataManager.addCadet(formData);
    if (newCadet) {
      showNotification(`${formData.name} added successfully`, 'success');
      this.hideAddCadetModal();
      
      // Refresh the attendance table if we're on the main page
      if (typeof loadAttendanceForDate === 'function') {
        const currentDate = document.getElementById('attendanceDate')?.value || 
                           new Date().toISOString().split('T')[0];
        loadAttendanceForDate(currentDate);
      }
    } else {
      showNotification('Error adding cadet', 'error');
    }
  }

  handleEditCadet(e) {
    e.preventDefault();
    
    const cadetId = document.getElementById('editCadetId').value;
    const formData = {
      name: document.getElementById('editCadetName').value.trim(),
      rank: document.getElementById('editCadetRank').value,
      year: document.getElementById('editCadetYear').value,
      division: document.getElementById('editCadetDivision').value
    };

    // Validate data
    const errors = validateCadetData(formData);
    if (errors.length > 0) {
      showNotification(errors[0], 'error');
      return;
    }

    // Check for duplicate names (excluding current cadet)
    const existingCadets = dataManager.getCadets();
    const duplicateName = existingCadets.find(c => 
      c.id !== cadetId && c.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (duplicateName) {
      showNotification('A cadet with this name already exists', 'error');
      return;
    }

    // Update cadet
    const success = dataManager.updateCadet(cadetId, formData);
    if (success) {
      showNotification(`${formData.name} updated successfully`, 'success');
      this.hideEditCadetModal();
      
      // Refresh the attendance table if we're on the main page
      if (typeof loadAttendanceForDate === 'function') {
        const currentDate = document.getElementById('attendanceDate')?.value || 
                           new Date().toISOString().split('T')[0];
        loadAttendanceForDate(currentDate);
      }
    } else {
      showNotification('Error updating cadet', 'error');
    }
  }

  deleteCadet(cadetId) {
    const cadet = dataManager.getCadetById(cadetId);
    if (!cadet) {
      showNotification('Cadet not found', 'error');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${cadet.name}? This will also remove all their attendance records and cannot be undone.`;
    
    confirmAction(confirmMessage, () => {
      const success = dataManager.deleteCadet(cadetId);
      if (success) {
        showNotification(`${cadet.name} deleted successfully`, 'success');
        
        // Refresh the attendance table if we're on the main page
        if (typeof loadAttendanceForDate === 'function') {
          const currentDate = document.getElementById('attendanceDate')?.value || 
                             new Date().toISOString().split('T')[0];
          loadAttendanceForDate(currentDate);
        }
      } else {
        showNotification('Error deleting cadet', 'error');
      }
    });
  }

  // Generate action buttons for cadet rows
  generateActionButtons(cadetId) {
    return `
      <div class="cadet-actions">
        <div class="dropdown">
          <button type="button" class="btn btn-sm btn-secondary dropdown-toggle" onclick="this.nextElementSibling.classList.toggle('show')">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="dropdown-menu">
            <button type="button" class="dropdown-item" onclick="cadetManager.showCadetInfo('${cadetId}')">
              <i class="fas fa-eye"></i> View Info
            </button>
            <button type="button" class="dropdown-item" onclick="cadetManager.showEditCadetModal('${cadetId}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button type="button" class="dropdown-item delete-item" onclick="cadetManager.deleteCadet('${cadetId}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Export all cadets data
  exportCadetsData() {
    const cadets = dataManager.getCadetsWithAttendanceStats();
    const exportData = cadets.map(cadet => ({
      'Name': cadet.name,
      'Rank': cadet.rank,
      'Year': `${cadet.year}${cadet.year === 1 ? 'st' : cadet.year === 2 ? 'nd' : 'rd'} Year`,
      'Division': cadet.division === 'SD' ? 'Senior Division' : 'Senior Wing',
      'Attendance Percentage': `${cadet.attendanceStats.percentage}%`,
      'Days Present': cadet.attendanceStats.presentDays,
      'Days Absent': cadet.attendanceStats.absentDays,
      'Total Days': cadet.attendanceStats.totalDays
    }));

    const filename = `NCC_Cadets_Report_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(exportData, filename);
  }

  // Import cadets from CSV (future feature)
  importCadetsFromCSV(file) {
    // Implementation for importing cadets from CSV file
    // This would be useful for bulk operations
    showNotification('CSV import feature coming soon', 'info');
  }

  // Get cadets statistics
  getCadetsStatistics() {
    const cadets = dataManager.getCadets();
    const stats = {
      total: cadets.length,
      byYear: {},
      byDivision: {},
      byRank: {}
    };

    cadets.forEach(cadet => {
      // By year
      stats.byYear[cadet.year] = (stats.byYear[cadet.year] || 0) + 1;
      
      // By division
      stats.byDivision[cadet.division] = (stats.byDivision[cadet.division] || 0) + 1;
      
      // By rank
      stats.byRank[cadet.rank] = (stats.byRank[cadet.rank] || 0) + 1;
    });

    return stats;
  }
}

// Create global instance
const cadetManager = new CadetManager();

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
    });
  }
});