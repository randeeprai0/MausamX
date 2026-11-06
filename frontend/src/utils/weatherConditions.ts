export interface WeatherConditionInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  themeType: 'clear-day' | 'clear-night' | 'cloudy-day' | 'cloudy-night' | 'rain' | 'thunderstorm' | 'snow' | 'fog';
  gradientDark: string;
  gradientLight: string;
  accentColor: string;
}

export function getWeatherCondition(code: number, isDay: number | boolean = 1): WeatherConditionInfo {
  const day = typeof isDay === 'boolean' ? isDay : isDay === 1;

  switch (code) {
    case 0:
      return {
        code,
        label: 'Clear Sky',
        description: day ? 'Sunny and clear skies with brilliant sunshine' : 'Clear, crisp skies with starry night',
        iconName: day ? 'Sun' : 'Moon',
        themeType: day ? 'clear-day' : 'clear-night',
        gradientDark: day 
          ? 'from-amber-500/20 via-sky-600/30 to-slate-950' 
          : 'from-indigo-950/60 via-slate-900/80 to-slate-950',
        gradientLight: day 
          ? 'from-amber-200 via-sky-200 to-blue-50' 
          : 'from-indigo-100 via-slate-200 to-sky-100',
        accentColor: day ? '#f59e0b' : '#818cf8',
      };

    case 1:
      return {
        code,
        label: 'Mainly Clear',
        description: day ? 'Predominantly sunny with isolated light clouds' : 'Mostly clear night with faint cloud wisps',
        iconName: day ? 'SunDim' : 'MoonStar',
        themeType: day ? 'clear-day' : 'clear-night',
        gradientDark: day 
          ? 'from-amber-500/15 via-sky-700/25 to-slate-950' 
          : 'from-blue-950/50 via-slate-900/80 to-slate-950',
        gradientLight: day 
          ? 'from-amber-100 via-sky-100 to-slate-50' 
          : 'from-indigo-50 via-slate-100 to-sky-100',
        accentColor: day ? '#fbbf24' : '#a5b4fc',
      };

    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Sun filtering through scattered cloud layers',
        iconName: day ? 'CloudSun' : 'CloudMoon',
        themeType: day ? 'cloudy-day' : 'cloudy-night',
        gradientDark: day 
          ? 'from-cyan-800/25 via-slate-800/40 to-slate-950' 
          : 'from-slate-900/70 via-slate-950/90 to-black',
        gradientLight: day 
          ? 'from-cyan-100 via-slate-100 to-blue-100' 
          : 'from-slate-200 via-blue-100 to-slate-100',
        accentColor: '#38bdf8',
      };

    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Dense, continuous cloud cover across the horizon',
        iconName: 'Cloud',
        themeType: day ? 'cloudy-day' : 'cloudy-night',
        gradientDark: 'from-slate-700/30 via-slate-800/50 to-slate-950',
        gradientLight: 'from-slate-300 via-gray-200 to-slate-100',
        accentColor: '#94a3b8',
      };

    case 45:
    case 48:
      return {
        code,
        label: code === 45 ? 'Fog' : 'Depositing Rime Fog',
        description: 'Thick fog reducing atmospheric visibility',
        iconName: 'CloudFog',
        themeType: 'fog',
        gradientDark: 'from-teal-900/30 via-slate-800/60 to-slate-950',
        gradientLight: 'from-teal-100 via-slate-200 to-gray-100',
        accentColor: '#2dd4bf',
      };

    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        description: 'Gentle, fine droplets drifting continuously',
        iconName: 'CloudDrizzle',
        themeType: 'rain',
        gradientDark: 'from-blue-900/40 via-slate-900/70 to-slate-950',
        gradientLight: 'from-sky-200 via-blue-100 to-slate-100',
        accentColor: '#38bdf8',
      };

    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Supercooled drizzle creating icy surfaces',
        iconName: 'CloudHail',
        themeType: 'snow',
        gradientDark: 'from-cyan-900/40 via-slate-900/80 to-slate-950',
        gradientLight: 'from-cyan-100 via-sky-100 to-slate-200',
        accentColor: '#67e8f9',
      };

    case 61:
    case 63:
    case 65:
      return {
        code,
        label: code === 61 ? 'Slight Rain' : code === 63 ? 'Moderate Rain' : 'Heavy Rain',
        description: code === 65 ? 'Intense downpour with significant rainfall' : 'Steady rainfall soaking the surroundings',
        iconName: 'CloudRain',
        themeType: 'rain',
        gradientDark: 'from-blue-950/70 via-slate-900/90 to-slate-950',
        gradientLight: 'from-blue-200 via-sky-100 to-slate-200',
        accentColor: '#0284c7',
      };

    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Cold rain rapidly freezing upon contact with surfaces',
        iconName: 'CloudSnow',
        themeType: 'snow',
        gradientDark: 'from-cyan-950/60 via-slate-900/80 to-slate-950',
        gradientLight: 'from-cyan-200 via-blue-100 to-slate-100',
        accentColor: '#22d3ee',
      };

    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 71 ? 'Light Snow' : code === 73 ? 'Moderate Snow' : 'Heavy Snowfall',
        description: code === 75 ? 'Heavy snow accumulation with reduced visibility' : 'Soft snowflakes drifting through the air',
        iconName: 'Snowflake',
        themeType: 'snow',
        gradientDark: 'from-slate-700/40 via-sky-950/50 to-slate-950',
        gradientLight: 'from-sky-100 via-white to-slate-100',
        accentColor: '#e0f2fe',
      };

    case 77:
      return {
        code,
        label: 'Snow Grains',
        description: 'Small, opaque white ice grains falling gently',
        iconName: 'Snowflake',
        themeType: 'snow',
        gradientDark: 'from-slate-700/40 via-slate-900/60 to-slate-950',
        gradientLight: 'from-slate-200 via-sky-50 to-white',
        accentColor: '#bae6fd',
      };

    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 80 ? 'Slight Showers' : code === 81 ? 'Moderate Showers' : 'Violent Rain Showers',
        description: 'Intermittent, sudden bursts of rainfall',
        iconName: 'CloudRainWind',
        themeType: 'rain',
        gradientDark: 'from-indigo-950/60 via-blue-900/50 to-slate-950',
        gradientLight: 'from-indigo-100 via-sky-100 to-slate-100',
        accentColor: '#38bdf8',
      };

    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Frequent passing snow flurries',
        iconName: 'CloudSnow',
        themeType: 'snow',
        gradientDark: 'from-cyan-950/50 via-slate-900/70 to-slate-950',
        gradientLight: 'from-cyan-100 via-slate-100 to-white',
        accentColor: '#7dd3fc',
      };

    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Electrified storm clouds with thunder and lightning',
        iconName: 'CloudLightning',
        themeType: 'thunderstorm',
        gradientDark: 'from-purple-950/60 via-slate-950/90 to-black',
        gradientLight: 'from-purple-200 via-slate-200 to-blue-200',
        accentColor: '#c084fc',
      };

    case 96:
    case 99:
      return {
        code,
        label: code === 96 ? 'Thunderstorm with Hail' : 'Severe Thunderstorm with Heavy Hail',
        description: 'Severe convective storm producing damaging hail and lightning',
        iconName: 'Zap',
        themeType: 'thunderstorm',
        gradientDark: 'from-rose-950/40 via-purple-950/70 to-black',
        gradientLight: 'from-rose-200 via-purple-100 to-slate-200',
        accentColor: '#f43f5e',
      };

    default:
      return {
        code,
        label: 'Clear',
        description: 'Fair atmospheric conditions',
        iconName: day ? 'Sun' : 'Moon',
        themeType: day ? 'clear-day' : 'clear-night',
        gradientDark: 'from-sky-900/30 via-slate-900/60 to-slate-950',
        gradientLight: 'from-sky-100 via-slate-100 to-blue-50',
        accentColor: '#38bdf8',
      };
  }
}

