// Dashboard JavaScript with enhanced UI
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
});

function initializeDashboard() {
    loadDashboardData();
    loadSampleCharts();
    startRealTimeUpdates();
}

function setupEventListeners() {
    document.getElementById('quick-forecast-form').addEventListener('submit', function(e) {
        e.preventDefault();
        generateQuickForecast();
    });
}

async function loadDashboardData() {
    try {
        await loadCentersAndItems();
        await updateMetrics();
    } catch (error) {
        showNotification('Error loading dashboard data', 'error');
    }
}

async function loadCentersAndItems() {
    try {
        const [centersResponse, itemsResponse] = await Promise.all([
            fetch('/centers'),
            fetch('/items')
        ]);
        
        const centersData = await centersResponse.json();
        const itemsData = await itemsResponse.json();
        
        // Update metrics
        document.getElementById('total-centers').textContent = centersData.count;
        document.getElementById('total-products').textContent = itemsData.count;
        
        // Populate dropdowns
        populateDropdown('center-select', centersData.centers);
        populateDropdown('item-select', itemsData.items);
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function populateDropdown(elementId, items) {
    const select = document.getElementById(elementId);
    select.innerHTML = '<option value="">Select...</option>';
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
    });
}

async function generateQuickForecast() {
    const center = document.getElementById('center-select').value;
    const item = document.getElementById('item-select').value;
    
    if (!center || !item) {
        showNotification('Please select both center and product', 'warning');
        return;
    }
    
    try {
        showLoading('Generating forecast...');
        const response = await fetch(`/forecast?center=${encodeURIComponent(center)}&item=${encodeURIComponent(item)}&days=30&model=xgboost`);
        const data = await response.json();
        
        if (data.forecasts) {
            showNotification(`Forecast generated for ${center} - ${item}`, 'success');
            updateForecastChart(data);
        }
    } catch (error) {
        showNotification('Error generating forecast', 'error');
    } finally {
        hideLoading();
    }
}

function loadSampleCharts() {
    // Demand Trends Chart
    const demandTrendsData = [{
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        y: [1200, 1800, 1500, 2200, 1900, 2400, 2600, 2300, 2100, 2500, 2800, 3000],
        type: 'scatter',
        name: '2024 Actual',
        line: { color: '#667eea', width: 3 },
        marker: { size: 6 }
    }, {
        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        y: [1100, 1700, 1600, 2100, 2000, 2300, 2500, 2400, 2200, 2600, 2900, 3200],
        type: 'scatter',
        name: '2024 Forecast',
        line: { color: '#f5576c', width: 3, dash: 'dash' },
        marker: { size: 6 }
    }];
    
    const demandTrendsLayout = {
        title: { text: 'Monthly Demand Trends 2024', font: { color: 'white' } },
        xaxis: { title: { text: 'Month', font: { color: 'white' } }, gridcolor: 'rgba(255,255,255,0.1)' },
        yaxis: { title: { text: 'Demand (kg)', font: { color: 'white' } }, gridcolor: 'rgba(255,255,255,0.1)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: 'white' },
        legend: { font: { color: 'white' } },
        height: 300
    };
    
    Plotly.newPlot('demand-trends-chart', demandTrendsData, demandTrendsLayout);
    
    // Product Distribution Chart
    const topProductsData = [{
        values: [35, 25, 15, 10, 8, 7],
        labels: ['CHILAPI', 'MIX FISH', 'PRAWN HEAD', 'MUNDI', 'BOMBIL', 'Others'],
        type: 'pie',
        marker: {
            colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b']
        },
        textinfo: 'label+percent',
        insidetextorientation: 'radial'
    }];
    
    const topProductsLayout = {
        title: { text: 'Product Distribution', font: { color: 'white' } },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: 'white' },
        height: 300,
        showlegend: false
    };
    
    Plotly.newPlot('top-products-chart', topProductsData, topProductsLayout);
}

function updateForecastChart(forecastData) {
    // Update the chart with new forecast data
    const center = Object.keys(forecastData.forecasts)[0];
    const item = Object.keys(forecastData.forecasts[center])[0];
    const forecasts = forecastData.forecasts[center][item];
    
    const dates = forecasts.map(f => f.date.split('-')[2]); // Get days
    const values = forecasts.map(f => f.forecast);
    
    const updateData = [{
        x: dates,
        y: values,
        type: 'scatter',
        name: `${center} - ${item}`,
        line: { color: '#43e97b', width: 3 }
    }];
    
    Plotly.react('demand-trends-chart', updateData, demandTrendsLayout);
}

function startRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateLiveMetrics();
    }, 5000);
}

function updateLiveMetrics() {
    // Simulate metric updates
    const centersElement = document.getElementById('total-centers');
    const currentValue = parseInt(centersElement.textContent);
    if (!isNaN(currentValue)) {
        centersElement.textContent = currentValue;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} glass-card position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            <div>${message}</div>
            <button type="button" class="btn-close btn-close-white ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function showLoading(message = 'Loading...') {
    // Implement loading indicator
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
    loading.style.cssText = 'background: rgba(0,0,0,0.5); z-index: 9999;';
    loading.innerHTML = `
        <div class="glass-card p-4 text-center">
            <div class="spinner-border text-primary mb-3"></div>
            <div class="text-white">${message}</div>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) loading.remove();
}

function exportReport() {
    showNotification('Export feature coming soon!', 'info');
}

// Initialize when page loads
window.addEventListener('load', initializeDashboard);