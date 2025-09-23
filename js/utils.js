// utils.js - Utility functions

// Date formatting
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Notification system
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  if (!notification) return;

  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';

  // Trigger show animation
  setTimeout(() => notification.classList.add('show'), 100);

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  }, 3000);
}

// Modal management
class ModalManager {
  static show(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  static hide(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  static setupCloseHandlers() {
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.hide(e.target.id);
      }
    });

    // Close modals with close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          this.hide(modal.id);
        }
      });
    });
  }
}

// CSV Export functionality
function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    showNotification('No data available to export', 'error');
    return;
  }

  const csvContent = data.map(row => 
    Object.values(row).map(field => 
      `"${field || ''}"`
    ).join(',')
  ).join('\n');

  const headers = Object.keys(data[0]).map(key => `"${key}"`).join(',');
  const fullContent = headers + '\n' + csvContent;

  const blob = new Blob([fullContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Data exported successfully', 'success');
  } else {
    showNotification('Export not supported in this browser', 'error');
  }
}

// Search and filter utilities
class FilterManager {
  constructor() {
    this.activeFilters = {
      year: 'all',
      division: 'all',
      search: ''
    };
  }

  updateFilter(filterType, value) {
    this.activeFilters[filterType] = value;
  }

  applyFilters(cadets) {
    return cadets.filter(cadet => {
      const yearMatch = this.activeFilters.year === 'all' || 
                       cadet.year.toString() === this.activeFilters.year;
      
      const divisionMatch = this.activeFilters.division === 'all' || 
                           cadet.division === this.activeFilters.division;
      
      const searchMatch = this.activeFilters.search === '' || 
                         cadet.name.toLowerCase().includes(this.activeFilters.search.toLowerCase()) ||
                         cadet.rank.toLowerCase().includes(this.activeFilters.search.toLowerCase());

      return yearMatch && divisionMatch && searchMatch;
    });
  }

  resetFilters() {
    this.activeFilters = {
      year: 'all',
      division: 'all',
      search: ''
    };
  }

  getFilteredCount(cadets) {
    return this.applyFilters(cadets).length;
  }
}

// URL parameter handling
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Validation utilities
function validateCadetData(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!data.rank) {
    errors.push('Rank is required');
  }
  
  if (!data.year || !['1', '2', '3'].includes(data.year.toString())) {
    errors.push('Valid year is required');
  }
  
  if (!data.division || !['SD', 'SW'].includes(data.division)) {
    errors.push('Valid division is required');
  }
  
  return errors;
}

// Form utilities
function resetForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
  }
}

function populateForm(formId, data) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  Object.keys(data).forEach(key => {
    const input = form.querySelector(`#${key}`) || form.querySelector(`[name="${key}"]`);
    if (input) {
      input.value = data[key];
    }
  });
}

// Local storage utilities
function clearAllNCCData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('ncc_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Confirmation dialogs
function confirmAction(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

// Badge generation
function generateYearBadge(year) {
  const yearSuffix = year === 1 ? 'st' : year === 2 ? 'nd' : 'rd';
  return `<span class="year-badge year-${year}">${year}${yearSuffix} Year</span>`;
}

function generateDivisionBadge(division) {
  return `<span class="division-badge division-${division}">${division}</span>`;
}

// Rank hierarchy for sorting
const rankHierarchy = {
  'Cadet': 1,
  'Lance Corporal': 2,
  'Corporal': 3,
  'Sergeant': 4,
  'Company Havildar Major': 5,
  'Company Quartermaster Sergeant': 6,
  'Junior Under Officer': 7,
  'Senior Under Officer': 8
};

function sortCadetsByRank(cadets) {
  return cadets.sort((a, b) => {
    const rankA = rankHierarchy[a.rank] || 0;
    const rankB = rankHierarchy[b.rank] || 0;
    return rankB - rankA; // Higher rank first
  });
}

// Statistics utilities
function calculatePercentage(part, total) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function formatPercentage(percentage) {
  return `${percentage}%`;
}

// Navigation utilities
function navigateToPage(page, params = {}) {
  let url = page;
  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    url += '?' + queryString;
  }
  window.location.href = url;
}

// Create global instances
const filterManager = new FilterManager();