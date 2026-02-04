# 🚢 Vehicle Logistic Predictor

A Next.js-based maritime logistics intelligence platform that provides real-time storm tracking, marine weather analysis, and ML-powered ETA delay predictions for vehicle transport vessels navigating the North Atlantic.

![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Drizzle-blue?logo=postgresql)

## ✨ Features

### 🗺️ Interactive Dashboard

- Real-time map visualization with Leaflet showing vessel positions, storms, and weather conditions
- Dynamic storm tracking from NOAA data sources
- Marine weather heatmaps and alert overlays
- Port-specific weather information for major vehicle ports

### 🌀 Storm Tracking

- **Active Storms**: Real-time hurricane/tropical storm tracking from NOAA
- **Potential Storms**: Formation probability areas and development zones
- **Historical Data**: Storm heatmap visualization using 170+ years of HURDAT2 data (1851-2025)

### ⏱️ Delay Prediction (ML Model)

- XGBoost-based ETA delay prediction model
- Features include:
    - Wave effects (height, direction relative to vessel course)
    - Ocean current impact (velocity and direction)
    - Storm proximity and wind speed
    - Swell energy calculations
- Input: Ship coordinates, destination port, vessel course, active storms, marine weather
- Output: Predicted delay in hours

### 🌊 Marine Weather

- Real-time marine weather data including:
    - Ocean current velocity and direction
    - Wind speed and direction at 10m
    - Wave height, direction, and period
    - Swell wave characteristics
    - Wind wave parameters
- Weather alerts for Atlantic regions

### 📊 Historical Routes

- Browse historical vessel journeys
- Filter by MMSI (vessel identifier)
- Storm exposure analysis for past voyages

### 💬 AI Chat Interface

- Chat with AI about logistics and weather data
- Persistent chat history stored in PostgreSQL
- Context-aware responses using Pinecone vector search

## 🏗️ Tech Stack

| Layer            | Technology                                     |
| ---------------- | ---------------------------------------------- |
| **Frontend**     | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Maps**         | Leaflet, React-Leaflet, Leaflet.heat           |
| **Database**     | PostgreSQL with Drizzle ORM                    |
| **ML Model**     | XGBoost, scikit-learn (Python)                 |
| **Vector DB**    | Pinecone (for AI embeddings)                   |
| **Data Sources** | NOAA, Open-Meteo Marine API                    |
| **Icons**        | Lucide React                                   |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+ (for ML prediction)
- PostgreSQL database
- Pinecone account (for AI chat features)

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/logistic_predictor
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=your_index_name
```

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/vehicle-logistic-predictor.git
    cd vehicle-logistic-predictor
    ```

2. **Install Node.js dependencies**

    ```bash
    npm install
    ```

3. **Install Python dependencies** (for ML model)

    ```bash
    pip install joblib numpy pandas xgboost scikit-learn
    ```

4. **Set up the database**

    ```bash
    npx drizzle-kit push
    ```

5. **Run the development server**

    ```bash
    npm run dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── public/
│   ├── model_pipeline/          # Jupyter notebooks for ML model training
│   │   ├── 01_getStartEndPoints.ipynb
│   │   ├── 05_eta_model.ipynb   # ETA delay model training
│   │   └── 07_deviations_model.ipynb
│   └── *.csv                    # Data files (weather, routes, storms)
│
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── delay-prediction/
│   │   │   ├── storms/
│   │   │   ├── marine-weather/
│   │   │   └── ...
│   │   ├── chat/                # AI chat interface
│   │   ├── historical_routes/   # Historical voyage viewer
│   │   ├── marine_weather/      # Marine weather dashboard
│   │   ├── ports/               # Port weather information
│   │   └── storms/              # Storm tracking page
│   │
│   ├── components/              # React components
│   │   ├── MapDashboard.tsx     # Main dashboard map
│   │   ├── DelayComponent.tsx   # Delay prediction form
│   │   ├── MarkersStorms.tsx    # Storm map markers
│   │   └── ...
│   │
│   ├── providers/               # React context providers
│   │   ├── StormsProvider.tsx
│   │   ├── MarineWeatherProvider.tsx
│   │   └── DelayProvider.tsx
│   │
│   ├── utils/
│   │   ├── predict_delay.py     # Python ML inference script
│   │   ├── best_model.pkl       # Trained XGBoost model
│   │   ├── model_scaler.pkl     # Feature scaler
│   │   └── *.ts                 # TypeScript utilities
│   │
│   └── db/
│       └── schema.tsx           # Drizzle ORM schema
│
└── drizzle/                     # Database migrations
```

## 🔌 API Endpoints

| Endpoint                     | Description                            |
| ---------------------------- | -------------------------------------- |
| `GET /api/storms`            | Active North Atlantic storms from NOAA |
| `GET /api/potential-storms`  | Storm formation probability areas      |
| `GET /api/historical-storms` | Historical storm data for heatmap      |
| `GET /api/delay-prediction`  | ML-based ETA delay prediction          |
| `GET /api/marine-weather`    | Current marine weather grid data       |
| `GET /api/marine-alerts`     | Active marine weather alerts           |
| `GET /api/city-weather`      | Weather for specific port cities       |
| `GET /api/historical-routes` | Historical vessel voyage data          |

## 🧠 ML Model Details

The delay prediction model uses the following features:

- **Storm Features**: `storm_wind`, `distance_to_storm_nm`
- **Wave Effects**: `wind_wave_effect_forward`, `wind_wave_effect_side`, `swell_effect_forward`, `swell_effect_side`
- **Current Effects**: `ocean_current_effect_forward`, `ocean_current_effect_side`
- **Derived Features**: `swell_impact`, `wind_wave_energy`

All directional features are computed relative to the vessel's course heading.

## 🌐 Supported Ports

The system tracks vehicle carrier routes to major RoRo ports including:

**North America**: Halifax, Galveston, Brunswick, Savannah, Charleston, Wilmington, New York (Port Newark), Davisville

**Europe**: Gdansk, Gothenburg, Antwerp, Brugge, Southampton, Le Havre, Santander, Vigo, Emden, Bremerhaven

## 📜 License

See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [NOAA National Hurricane Center](https://www.nhc.noaa.gov/) for storm data
- [Open-Meteo](https://open-meteo.com/) for marine weather API
- [HURDAT2](https://www.nhc.noaa.gov/data/#hurdat) for historical storm database
