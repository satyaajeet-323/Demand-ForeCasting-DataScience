# 🚀 Quick Start Guide - Seafood Forecasting

## Prerequisites
- Python 3.9 or higher
- pip (Python package installer)
- (Optional) Docker and Docker Compose

---

## ⚡ Fastest Way to Run (5 minutes)

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run the Dashboard

**Option 1: Using the helper script (Recommended)**
```bash
python run_dashboard.py
```

**Option 2: Direct Streamlit command**
```bash
# Make sure you're in the project root directory
streamlit run app/dashboard.py
```

The dashboard will automatically:
- Create sample data if no data exists
- Open in your browser at http://localhost:8501

> **Note**: Make sure you run this from the project root directory (`seafood-forecasting`), not from inside the `app` folder.

---

## 📋 Detailed Setup

### Option 1: Local Python Setup

1. **Clone/Navigate to the project**
   ```bash
   cd seafood-forecasting
   ```

2. **Create virtual environment (recommended)**
   ```bash
   python -m venv seafood_env
   
   # Windows
   seafood_env\Scripts\activate
   
   # Linux/Mac
   source seafood_env/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Streamlit Dashboard** (This is the main interface)
   ```bash
   streamlit run app/dashboard.py
   ```
   
   The dashboard will be available at: **http://localhost:8501**

5. **Run FastAPI Backend** (in a separate terminal, optional for API access)
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
   
   API will be available at: **http://localhost:8000**
   API docs at: **http://localhost:8000/docs**

### Option 2: Using Docker

1. **Build the image**
   ```bash
   docker build -t seafood-forecasting .
   ```

2. **Run the container**
   ```bash
   docker run -p 8000:8000 -p 8501:8501 seafood-forecasting
   ```

3. **Access the services**
   - Dashboard: http://localhost:8501
   - API: http://localhost:8000

### Option 3: Docker Compose (Full Stack)

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f web
```

---

## 🎯 Using the Dashboard

Once the Streamlit dashboard is running:

1. **Dashboard Page**: View key metrics and quick forecasts
2. **Forecast Generator**: Generate detailed forecasts for multiple centers and items
3. **Data Analyzer**: Upload CSV files for analysis and next-year forecasting
4. **Analytics**: View historical data trends and insights

---

## 🔍 Troubleshooting

### Port Already in Use
If port 8501 is busy, use a different port:
```bash
streamlit run app/dashboard.py --server.port 8502
```

### Missing Dependencies
```bash
pip install --upgrade -r requirements.txt
```

### Module Not Found Error
Make sure you're in the project root directory and virtual environment is activated.

### Docker Issues
```bash
# Stop all containers
docker stop $(docker ps -aq)

# Rebuild image
docker build --no-cache -t seafood-forecasting .
```

---

## 📚 Next Steps

1. **Add Your Data**: Place CSV files in `data/raw/` directory
2. **Train Models**: Run `python scripts/train_model.py` (optional)
3. **Generate Forecasts**: Use the Streamlit dashboard to generate predictions
4. **API Integration**: Use the FastAPI endpoints at `/docs` for programmatic access

---

## 🆘 Need Help?

- Check API documentation: http://localhost:8000/docs
- View application logs in terminal
- Check `config/config.yaml` for configuration options

