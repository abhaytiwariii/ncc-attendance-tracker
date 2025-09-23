// dashboard.js - Dashboard analytics functionality

class DashboardManager {
  constructor() {
    this.allCadetsWithStats = [];
    this.currentFilters = {
      year: 'all',
      division: 'all',
      sort: 'percentage'
    };
  }

  loadDashboardData() {
    const history = dataManager.getAttendanceHistory();
    
    if (history.length === 0) {
      this.showEmptyDashboard();
      return;
    }

    // Get cadets with their attendance statistics
    this.allCadetsWithStats = dataManager.getCadetsWithAttendanceStats();

    // Calculate and display overview statistics
    this.loadOverviewStats(history);
    
    // Load detailed sections
    this.loadYearStats(history);
    this.loadDivisionStats(history);
    this.loadTopPerformers();
    this.loadAttendanceAlerts();
    this.loadRecentRecords(history.slice(0, 10));
    this.loadCadetPerformanceList();

    showNotification('Dashboard data loaded successfully', 'success');
  }

  loadOverviewStats(history) {
    const totalDays = history.length;
    const totalCadets = dataManager.getCadets().length;
    
    const totalPossibleAttendance = history.reduce((sum, day) => sum + day.totalCount, 0);
    const totalActualAttendance = history.reduce((sum, day) => sum + day.presentCount, 0);
    const avgAttendance = totalPossibleAttendance > 0 
      ? Math.round((totalActualAttendance / totalPossibleAttendance) * 100) 
      : 0;
    
    const perfectDays = history.filter(day => 
      day.presentCount === day.totalCount && day.totalCount > 0
    ).length;

    // Update overview cards
    document.getElementById('totalDays').textContent = totalDays;
    document.getElementById('avgAttendance').textContent = `${avgAttendance}%`;
    document.getElementById('perfectDays').textContent = perfectDays;
    document.getElementById('totalCadets').textContent = totalCadets;
  }

  loadCadetPerformanceList() {
    const container = document.getElementById('cadetPerformanceList');
    if (!container) return;

    let filteredCadets = [...this.allCadetsWithStats];

    // Apply filters
    if (this.currentFilters.year !== 'all') {
      filteredCadets = filteredCadets.filter(cadet => 
        cadet.year.toString() === this.currentFilters.year
      );
    }

    if (this.currentFilters.division !== 'all') {
      filteredCadets = filteredCadets.filter(cadet => 
        cadet.division === this.currentFilters.division
      );
    }

    // Apply sorting
    switch (this.currentFilters.sort) {
      case 'percentage':
        filteredCadets.sort((a, b) => b.attendanceStats.percentage - a.attendanceStats.percentage);
        break;
      case 'name':
        filteredCadets.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rank':
        filteredCadets.sort((a, b) => (rankHierarchy[b.rank] || 0) - (rankHierarchy[a.rank] || 0));
        break;
    }

    if (filteredCadets.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No cadets match the current filters</p></div>';
      return;
    }

    const performanceHTML = filteredCadets.map(cadet => {
      const stats = cadet.attendanceStats;
      const performanceClass = stats.percentage >= 90 ? 'excellent' :
                             stats.percentage >= 75 ? 'good' :
                             stats.percentage >= 60 ? 'average' : 'poor';

      return `
        <div class="cadet-performance-item ${performanceClass}">
          <div class="performance-header">
            <div class="cadet-basic-info">
              <div class="cadet-name">${cadet.name}</div>
              <div class="cadet-details">
                ${generateYearBadge(cadet.year)}
                ${generateDivisionBadge(cadet.division)}
                <span class="rank-badge">${cadet.rank}</span>
              </div>
            </div>
            <div class="performance-score ${performanceClass}">
              ${stats.percentage}%
            </div>
          </div>
          <div class="performance-details">
            <div class="performance-bar">
              <div class="performance-fill ${performanceClass}" style="width: ${stats.percentage}%"></div>
            </div>
            <div class="performance-stats">
              <span class="stat-item">
                <i class="fas fa-check text-success"></i> Present: ${stats.presentDays}
              </span>
              <span class="stat-item">
                <i class="fas fa-times text-danger"></i> Absent: ${stats.absentDays}
              </span>
              <span class="stat-item">
                <i class="fas fa-calendar text-info"></i> Total: ${stats.totalDays}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = performanceHTML;
  }

  filterCadetPerformance() {
    this.currentFilters.year = document.getElementById('performanceYearFilter').value;
    this.currentFilters.division = document.getElementById('performanceDivisionFilter').value;
    this.currentFilters.sort = document.getElementById('performanceSortFilter').value;
    
    this.loadCadetPerformanceList();
  }

  loadYearStats(history) {
    const yearStats = {};

    [1, 2, 3].forEach(year => {
      const yearCadets = dataManager.getCadets().filter(c => c.year === year);
      let totalPresent = 0;
      let totalPossible = 0;

      history.forEach(day => {
        const yearAttendance = day.data.filter(record => {
          const cadet = dataManager.getCadetById(record.cadetId);
          return cadet && cadet.year === year;
        });

        totalPresent += yearAttendance.filter(r => r.status === 'present').length;
        totalPossible += yearCadets.length;
      });

      yearStats[year] = {
        count: yearCadets.length,
        percentage: totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0,
        totalPresent,
        totalPossible
      };
    });

    const yearStatsHTML = Object.entries(yearStats)
      .map(([year, stats]) => `
        <div class="stat-item">
          <div class="stat-header">
            ${generateYearBadge(parseInt(year))}
            <span class="stat-percentage ${this.getPerformanceClass(stats.percentage)}">${stats.percentage}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${this.getPerformanceClass(stats.percentage)}" style="width: ${stats.percentage}%"></div>
          </div>
          <div class="stat-detail">${stats.count} cadets</div>
        </div>
      `).join('');

    document.getElementById('yearStats').innerHTML = yearStatsHTML;
  }

  loadDivisionStats(history) {
    const divisionStats = {};

    ['SD', 'SW'].forEach(division => {
      const divisionCadets = dataManager.getCadets().filter(c => c.division === division);
      let totalPresent = 0;
      let totalPossible = 0;

      history.forEach(day => {
        const divisionAttendance = day.data.filter(record => {
          const cadet = dataManager.getCadetById(record.cadetId);
          return cadet && cadet.division === division;
        });

        totalPresent += divisionAttendance.filter(r => r.status === 'present').length;
        totalPossible += divisionCadets.length;
      });

      divisionStats[division] = {
        count: divisionCadets.length,
        percentage: totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0,
        totalPresent,
        totalPossible
      };
    });

    const divisionStatsHTML = Object.entries(divisionStats)
      .map(([division, stats]) => `
        <div class="stat-item">
          <div class="stat-header">
            ${generateDivisionBadge(division)}
            <span class="stat-percentage ${this.getPerformanceClass(stats.percentage)}">${stats.percentage}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${this.getPerformanceClass(stats.percentage)}" style="width: ${stats.percentage}%"></div>
          </div>
          <div class="stat-detail">${stats.count} cadets</div>
        </div>
      `).join('');

    document.getElementById('divisionStats').innerHTML = divisionStatsHTML;
  }

  loadTopPerformers() {
    const topPerformers = this.allCadetsWithStats
      .filter(cadet => cadet.attendanceStats.totalDays > 0)
      .sort((a, b) => {
        // First sort by percentage, then by total days attended
        if (b.attendanceStats.percentage === a.attendanceStats.percentage) {
          return b.attendanceStats.totalDays - a.attendanceStats.totalDays;
        }
        return b.attendanceStats.percentage - a.attendanceStats.percentage;
      })
      .slice(0, 10);

    const topPerformersHTML = topPerformers
      .map((cadet, index) => {
        const stats = cadet.attendanceStats;
        const medalClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
        
        return `
          <div class="performer-item ${medalClass}">
            <div class="performer-rank">
              ${index < 3 ? 
                `<i class="fas fa-medal ${medalClass}"></i>` : 
                `<span class="rank-number">${index + 1}</span>`
              }
            </div>
            <div class="performer-info">
              <div class="performer-name">${cadet.name}</div>
              <div class="performer-details">
                ${generateYearBadge(cadet.year)}
                ${generateDivisionBadge(cadet.division)}
              </div>
              <div class="performer-stats">
                ${stats.presentDays}/${stats.totalDays} days
              </div>
            </div>
            <div class="performer-score ${this.getPerformanceClass(stats.percentage)}">
              ${stats.percentage}%
            </div>
          </div>
        `;
      }).join('');

    document.getElementById('topPerformers').innerHTML = topPerformersHTML || 
      '<div class="empty-state"><p>No attendance data available</p></div>';
  }

  loadAttendanceAlerts() {
    const lowAttendanceCadets = this.allCadetsWithStats
      .filter(cadet => cadet.attendanceStats.totalDays > 0 && cadet.attendanceStats.percentage < 75)
      .sort((a, b) => a.attendanceStats.percentage - b.attendanceStats.percentage);

    const alertsHTML = lowAttendanceCadets.length > 0 
      ? lowAttendanceCadets.slice(0, 5).map(cadet => {
          const stats = cadet.attendanceStats;
          const alertLevel = stats.percentage < 50 ? 'critical' : stats.percentage < 65 ? 'warning' : 'attention';
          
          return `
            <div class="alert-item ${alertLevel}">
              <div class="alert-icon">
                <i class="fas fa-${alertLevel === 'critical' ? 'exclamation-circle' : 
                  alertLevel === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
              </div>
              <div class="alert-content">
                <div class="alert-name">${cadet.name}</div>
                <div class="alert-details">
                  ${generateYearBadge(cadet.year)} ${generateDivisionBadge(cadet.division)}
                </div>
                <div class="alert-stats">
                  ${stats.percentage}% attendance (${stats.absentDays} days absent)
                </div>
              </div>
            </div>
          `;
        }).join('')
      : '<div class="no-alerts"><i class="fas fa-check-circle"></i><p>No attendance concerns!</p></div>';

    document.getElementById('attendanceAlerts').innerHTML = alertsHTML;
  }

  loadRecentRecords(recentHistory) {
    const recordsHTML = recentHistory.length > 0
      ? recentHistory.map(record => {
          const attendancePercentage = Math.round((record.presentCount / record.totalCount) * 100);
          const performanceClass = this.getPerformanceClass(attendancePercentage);
          
          return `
            <div class="timeline-item ${performanceClass}">
              <div class="timeline-date">${formatDate(record.date)}</div>
              <div class="timeline-stats">
                <span class="present-stat">
                  <i class="fas fa-check"></i> ${record.presentCount} Present
                </span>
                <span class="absent-stat">
                  <i class="fas fa-times"></i> ${record.absentCount} Absent
                </span>
                <span class="total-stat">
                  <i class="fas fa-users"></i> ${record.totalCount} Total
                </span>
              </div>
              <div class="timeline-percentage ${performanceClass}">
                ${attendancePercentage}% Attendance
              </div>
            </div>
          `;
        }).join('')
      : '<div class="empty-state"><p>No recent attendance records</p></div>';

    document.getElementById('recordsTimeline').innerHTML = recordsHTML;
  }

  getPerformanceClass(percentage) {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 60) return 'average';
    return 'poor';
  }

  showEmptyDashboard() {
    document.getElementById('totalDays').textContent = '0';
    document.getElementById('avgAttendance').textContent = '0%';
    document.getElementById('perfectDays').textContent = '0';
    document.getElementById('totalCadets').textContent = dataManager.getCadets().length;

    const emptyMessage = '<div class="empty-dashboard">No attendance data available. Start by recording some attendance!</div>';
    
    ['yearStats', 'divisionStats', 'topPerformers', 'attendanceAlerts', 'recordsTimeline', 'cadetPerformanceList']
      .forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) element.innerHTML = emptyMessage;
      });
  }

  exportCadetsPerformanceReport() {
    const cadetsWithStats = dataManager.getCadetsWithAttendanceStats();
    
    if (cadetsWithStats.length === 0) {
      showNotification('No cadet data available to export', 'error');
      return;
    }

    const exportData = cadetsWithStats.map(cadet => ({
      'Name': cadet.name,
      'Rank': cadet.rank,
      'Year': `${cadet.year}${cadet.year === 1 ? 'st' : cadet.year === 2 ? 'nd' : 'rd'} Year`,
      'Division': cadet.division === 'SD' ? 'Senior Division' : 'Senior Wing',
      'Attendance Percentage': `${cadet.attendanceStats.percentage}%`,
      'Days Present': cadet.attendanceStats.presentDays,
      'Days Absent': cadet.attendanceStats.absentDays,
      'Total Days': cadet.attendanceStats.totalDays,
      'Performance Rating': this.getPerformanceRating(cadet.attendanceStats.percentage)
    }));

    const filename = `NCC_Cadet_Performance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(exportData, filename);
  }

  exportAttendanceReport() {
    const history = dataManager.getAttendanceHistory();
    
    if (history.length === 0) {
      showNotification('No attendance data available to export', 'error');
      return;
    }

    const exportData = history.map(day => ({
      'Date': day.date,
      'Day of Week': new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
      'Total Cadets': day.totalCount,
      'Present': day.presentCount,
      'Absent': day.absentCount,
      'Attendance Percentage': `${Math.round((day.presentCount / day.totalCount) * 100)}%`
    }));

    const filename = `NCC_Attendance_Summary_Report_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(exportData, filename);
  }

  getPerformanceRating(percentage) {
    if (percentage >= 95) return 'Outstanding';
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Very Good';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Satisfactory';
    if (percentage >= 50) return 'Needs Improvement';
    return 'Poor';
  }

  resetDashboardData() {
    confirmAction(
      'Are you sure you want to clear all NCC attendance data? This action cannot be undone.',
      () => {
        dataManager.resetAllData();
        
        // Reinitialize with default cadets
        dataManager.initializeCadets();
        
        // Reload dashboard to show empty state
        this.loadDashboardData();

        showNotification('All NCC attendance data has been cleared', 'success');
      }
    );
  }

  // Advanced analytics methods
  getAttendanceTrends() {
    const history = dataManager.getAttendanceHistory();
    return history.map(day => ({
      date: day.date,
      percentage: Math.round((day.presentCount / day.totalCount) * 100)
    }));
  }

  getCadetRankDistribution() {
    const cadets = dataManager.getCadets();
    const distribution = {};
    
    cadets.forEach(cadet => {
      distribution[cadet.rank] = (distribution[cadet.rank] || 0) + 1;
    });
    
    return distribution;
  }

  getMonthlyAttendanceStats() {
    const history = dataManager.getAttendanceHistory();
    const monthlyStats = {};
    
    history.forEach(day => {
      const month = new Date(day.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyStats[month]) {
        monthlyStats[month] = {
          totalDays: 0,
          totalPresent: 0,
          totalPossible: 0
        };
      }
      
      monthlyStats[month].totalDays++;
      monthlyStats[month].totalPresent += day.presentCount;
      monthlyStats[month].totalPossible += day.totalCount;
    });
    
    return Object.entries(monthlyStats).map(([month, stats]) => ({
      month,
      averageAttendance: Math.round((stats.totalPresent / stats.totalPossible) * 100),
      totalDays: stats.totalDays
    }));
  }
}

// Create global instance
const dashboardManager = new DashboardManager();