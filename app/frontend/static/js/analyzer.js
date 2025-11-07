// Data Analyzer JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalyzer();
});

function initializeAnalyzer() {
    setupFileUpload();
    setupEventListeners();
}

function setupFileUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileInfo = document.getElementById('file-info');

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('dragover');
    }

    function unhighlight() {
        dropZone.classList.remove('dragover');
    }

    // Handle file drop
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle file selection
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                displayFileInfo(file);
                previewFile(file);
            } else {
                showNotification('Please upload a CSV file', 'error');
            }
        }
    }

    function displayFileInfo(file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        fileInfo.innerHTML = `
            <div class="alert alert-success glass-card">
                <i class="fas fa-check-circle me-2"></i>
                <strong>${file.name}</strong> (${fileSize} MB)
                <br><small>Ready for analysis</small>
            </div>
        `;
    }
}

function setupEventListeners() {
    document.getElementById('upload-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        await analyzeData();
    });
}

async function analyzeData() {
    const fileInput = document.getElementById('file-input');
    const forecastMonths = document.getElementById('forecast-months').value;
    
    if (!fileInput.files.length) {
        showNotification('Please select a CSV file first', 'warning');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('forecast_months', forecastMonths);

    try {
        showLoading('Analyzing data and generating forecast...');
        
        const response = await fetch('/upload-forecast', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.error) {
            showNotification(result.error, 'error');
        } else {
            displayAnalysisResults(result);
            showNotification('Analysis completed successfully!', 'success');
        }
    } catch (error) {
        showNotification('Error analyzing data: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

function displayAnalysisResults(results) {
    const resultsContainer = document.getElementById('analysis-results');
    
    resultsContainer.innerHTML = `
        <div class="analysis-result">
            <div class="row text-center mb-4">
                <div class="col-md-6">
                    <div class="metric-card success">
                        <div class="metric-number">${results.estimated_demand}</div>
                        <div class="metric-label">Estimated Demand</div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="metric-card primary">
                        <div class="metric-number">${results.recommended_inventory}</div>
                        <div class="metric-label">Recommended Inventory</div>
                    </div>
                </div>
            </div>
            
            <div class="glass-card mb-3">
                <h6 class="text-white mb-3"><i class="fas fa-chart-line me-2"></i>Forecast Summary</h6>
                <div class="row">
                    <div class="col-md-4">
                        <div class="text-white-50">Forecast Period</div>
                        <div class="text-white fw-bold">${results.total_months} Months</div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-white-50">Peak Season</div>
                        <div class="text-white fw-bold">${results.peak_season}</div>
                    </div>
                    <div class="col-md-4">
                        <div class="text-white-50">Growth Trend</div>
                        <div class="text-success fw-bold">${results.growth_trend}</div>
                    </div>
                </div>
            </div>
            
            <div class="alert alert-info glass-card">
                <i class="fas fa-lightbulb me-2"></i>
                <strong>AI Insights:</strong> ${results.message}
            </div>
        </div>
    `;
}

function previewFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n').slice(0, 6); // Show first 5 lines
        const previewContainer = document.getElementById('data-preview');
        
        previewContainer.innerHTML = `
            <div class="table-responsive">
                <table class="table table-dark table-striped">
                    <thead>
                        <tr>
                            ${lines[0].split(',').map(col => `<th>${col}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${lines.slice(1).map(line => 
                            `<tr>${line.split(',').map(cell => `<td>${cell}</td>`).join('')}</tr>`
                        ).join('')}
                    </tbody>
                </table>
            </div>
            <div class="text-center mt-3">
                <small class="text-white-50">Showing first ${lines.length - 1} rows of your data</small>
            </div>
        `;
    };
    reader.readAsText(file);
}

// Reuse notification functions from dashboard.js
function showNotification(message, type = 'info') {
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

function showLoading(message = 'Processing...') {
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