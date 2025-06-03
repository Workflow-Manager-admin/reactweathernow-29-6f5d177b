import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  // State for city input, weather data, error, and loading indicator
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Colors from provided palette
  const COLORS = {
    primary: '#09ec41',   // bright green
    secondary: '#f5f5f5', // light background
    accent: '#ff9800',    // orange
    text: '#202022'
  };

  // Styling for minimal, centered, clean layout
  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: COLORS.secondary,
      color: COLORS.text,
      display: 'flex',
      flexDirection: 'column',
    },
    container: {
      margin: '0 auto',
      marginTop: '96px',
      minHeight: '60vh',
      maxWidth: 420,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 24,
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.08)',
      position: 'relative',
      gap: 16
    },
    title: {
      textAlign: 'center',
      fontWeight: 700,
      fontSize: '2.15rem',
      letterSpacing: '-1px',
      marginBottom: 12,
      color: COLORS.primary
    },
    form: {
      display: 'flex',
      flexDirection: 'row',
      gap: 8,
      width: '100%',
      marginBottom: 12,
      justifyContent: 'center'
    },
    input: {
      flex: 1,
      padding: '10px 14px',
      fontSize: '1rem',
      border: `1.5px solid ${COLORS.primary}`,
      borderRadius: 6,
      outline: 'none',
      background: COLORS.secondary,
      color: COLORS.text,
      transition: 'border-color 0.18s'
    },
    button: {
      padding: '10px 18px',
      background: COLORS.accent,
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.5px',
      transition: 'background 0.2s'
    },
    card: {
      marginTop: 12,
      padding: '20px 18px',
      background: COLORS.secondary,
      borderRadius: 12,
      boxShadow: '0 1px 7px 0 rgba(0,0,0,0.06)',
      minWidth: 260,
      textAlign: 'center',
      color: COLORS.text
    },
    error: {
      color: '#d33',
      background: '#fff6f6',
      border: '1px solid #eeaaaa',
      borderRadius: 6,
      padding: '9px 13px',
      fontSize: '1rem',
      margin: '8px 0',
    },
    label: {
      fontWeight: 500,
      color: COLORS.primary,
      fontSize: '0.98rem',
      marginBottom: 2
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handles the weather fetch from OpenWeatherMap.
   * Uses metric units and checks for valid city input.
   * Updates loading, error, and weather state.
   */
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!city.trim()) {
      setError('Please enter a city name.');
      setWeather(null);
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    const apiKey = 'YOUR_API_KEY_HERE'; // <-- Insert OpenWeatherMap API key here
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const url = `${baseUrl}?q=${encodeURIComponent(city.trim())}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          setError('City not found.');
        } else {
          setError('Failed to fetch weather data.');
        }
        setWeather(null);
      } else {
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          description: data.weather[0].description,
          cityName: data.name,
          country: data.sys.country,
          icon: data.weather[0].icon
        });
      }
    } catch (err) {
      setError('Network error: could not fetch weather.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <main>
        <form style={styles.container} onSubmit={handleSearch} aria-label="Weather Search Form">
          <div style={styles.title}>ReactWeatherNow</div>
          <div style={{ width: '100%', marginBottom: 4, color: COLORS.text, textAlign: 'center', fontSize: '1rem', letterSpacing: '-0.01em' }}>
            <span style={{ color: COLORS.accent, fontWeight: 500 }}>Simple weather lookup.</span>
          </div>
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Enter city"
              aria-label="City name"
              style={styles.input}
              value={city}
              onChange={e => setCity(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              aria-label="Get weather"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && <div style={styles.error}>{error}</div>}
          {weather && (
            <section style={styles.card} aria-live="polite">
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                {weather.cityName}, {weather.country}
              </div>
              <div style={{ marginBottom: 12 }}>
                <img
                  alt={weather.description}
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  style={{ width: 55, height: 55, verticalAlign: 'middle' }}
                />
              </div>
              <div>
                <span style={styles.label}>Temperature:</span> {weather.temp}°C
              </div>
              <div>
                <span style={styles.label}>Humidity:</span> {weather.humidity}%
              </div>
              <div>
                <span style={styles.label}>Description:</span> {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
              </div>
            </section>
          )}
        </form>
      </main>
      <footer style={{
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 12,
        color: '#bbb',
        fontSize: '0.98rem'
      }}>
        Made with <span style={{ color: COLORS.primary }}>React</span> | Weather data from <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.accent, textDecoration: 'underline' }}>OpenWeatherMap</a>
      </footer>
    </div>
  );
}

export default App;
