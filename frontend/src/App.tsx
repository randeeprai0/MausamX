import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SettingsProvider } from './context/SettingsContext';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { ErrorState } from './components/common/ErrorState';
import { WeatherScene } from './components/scenes/WeatherScene';
import { CurrentWeather } from './components/weather/CurrentWeather';
import { WeatherAlerts } from './components/weather/WeatherAlerts';
import { HourlyForecast } from './components/weather/HourlyForecast';
import { WeeklyForecast } from './components/weather/WeeklyForecast';
import { WeatherDetails } from './components/weather/WeatherDetails';
import { SunriseSunset } from './components/weather/SunriseSunset';
import { AirQualityCard } from './components/air-quality/AirQualityCard';
import { AirQualityDetails } from './components/air-quality/AirQualityDetails';
import { InteractiveCharts } from './components/charts/InteractiveCharts';
import { WeatherInsights } from './components/insights/WeatherInsights';
import { ClothingRecommendations } from './components/insights/ClothingRecommendations';
import { RegionalWeatherNews } from './components/news/RegionalWeatherNews';
import { OutdoorActivity } from './components/insights/OutdoorActivity';
import { FavoritesModal } from './components/modals/FavoritesModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { getWeatherCondition } from './utils/weatherConditions';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const DashboardContent: React.FC = () => {
  const { isLoading, isError, error, refetchWeather, forecast, location } = useWeather();
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Determine themeType & day/night for the scene
  const themeType = forecast?.current
    ? getWeatherCondition(forecast.current.weather_code, forecast.current.is_day).themeType
    : 'clear-day';

  const isDay = forecast?.current ? Boolean(forecast.current.is_day) : true;

  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* Absolute full-screen illustrated scene background adapting to city & weather */}
      <WeatherScene themeType={themeType} location={location} isDay={isDay} />

      {/* Offline Status Alert Banner */}
      <OfflineBanner />

      {/* Sticky transparent header */}
      <Header
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Hero zone — full viewport height */}
      <main className="relative z-10 flex flex-col justify-between min-h-[85vh] md:min-h-screen">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center pt-16">
            <LoadingSkeleton />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center pt-16 px-4">
            <ErrorState
              title="Telemetry Synchronization Failure"
              message={error?.message || 'Unable to retrieve meteorological feeds. Please verify internet connectivity.'}
              onRetry={refetchWeather}
            />
          </div>
        ) : (
          <>
            {/* Centered hero weather display matching reference design */}
            <div className="flex-1 flex items-center justify-center pt-6 md:pt-12 pb-4 px-4">
              <CurrentWeather />
            </div>

            {/* Hourly forecast docked at bottom of hero */}
            <div className="px-2 sm:px-4">
              <HourlyForecast />
            </div>
          </>
        )}
      </main>

      {/* Scrollable details section below the fold in frosted glass */}
      {!isLoading && !isError && (
        <section className="relative z-10 space-y-6 px-3 sm:px-6 py-8 max-w-7xl mx-auto w-full bg-slate-950/80 backdrop-blur-3xl rounded-3xl border border-white/10 my-8 shadow-2xl">
          {/* Severe Weather Alerts */}
          <WeatherAlerts />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              <WeatherDetails />
              <InteractiveCharts />
              <WeatherInsights />
              <ClothingRecommendations />
              <RegionalWeatherNews />
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <WeeklyForecast />
              <SunriseSunset />
              <AirQualityCard />
              <AirQualityDetails />
              <OutdoorActivity />
            </div>
          </div>
        </section>
      )}

      {/* Site Footer */}
      <Footer />

      {/* Modals */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <WeatherProvider>
          <DashboardContent />
        </WeatherProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
