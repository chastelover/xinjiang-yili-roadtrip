(() => {
  'use strict';

  const snapshot = window.tripWeatherSnapshot;
  const places = snapshot?.places || [];
  const days = [
    {n: 1, date: '2026-10-01', label: '武威', primary: 'wuwei', secondary: [{id: 'hanzhong', label: '汉中出发'}]},
    {n: 2, date: '2026-10-02', label: '七彩丹霞', primary: 'danxia', secondary: [{id: 'jiayuguan', label: '嘉峪关'}]},
    {n: 3, date: '2026-10-03', label: '额济纳', primary: 'ejin', secondary: []},
    {n: 4, date: '2026-10-04', label: '居延海', primary: 'juyanhai', secondary: [{id: 'ejin', label: '额济纳'}]},
    {n: 5, date: '2026-10-05', label: '银川', primary: 'yinchuan', secondary: []},
    {n: 6, date: '2026-10-06', label: '沙坡头', primary: 'shapotou', secondary: [{id: 'zhongwei', label: '中卫'}]},
    {n: 7, date: '2026-10-07', label: '汉中', primary: 'hanzhong', secondary: [{id: 'zhongwei', label: '中卫出发'}]},
  ];
  const weekdays = ['周四', '周五', '周六', '周日', '周一', '周二', '周三'];
  const clothing = '全程按内层、保暖中层、防风外套分层穿。居延海清晨带帽子、围巾；丹霞和沙坡头白天带防晒用品。从汉中出发备雨具。';
  const codeText = {
    0: '晴', 1: '晴间多云', 2: '多云', 3: '阴', 45: '有雾', 48: '有雾',
    51: '毛毛雨', 53: '毛毛雨', 55: '毛毛雨', 56: '冻雨', 57: '冻雨',
    61: '小雨', 63: '中雨', 65: '大雨', 66: '冻雨', 67: '冻雨',
    71: '小雪', 73: '中雪', 75: '大雪', 77: '雪',
    80: '阵雨', 81: '阵雨', 82: '强阵雨', 85: '阵雪', 86: '阵雪',
    95: '雷雨', 96: '雷雨', 97: '雷雨', 99: '雷雨',
  };
  const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
  forecastUrl.search = new URLSearchParams({
    latitude: places.map(place => place.latitude).join(','),
    longitude: places.map(place => place.longitude).join(','),
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'Asia/Shanghai',
    forecast_days: '16',
  }).toString();

  let forecast = snapshot;
  function dateLabel(iso) {
    const date = new Date(iso);
    if (!Number.isFinite(date.getTime())) return '预报时间待更新';
    return new Intl.DateTimeFormat('zh-CN', {timeZone: 'Asia/Shanghai', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false}).format(date);
  }
  function entry(placeId, date) {
    const value = forecast?.days?.[placeId]?.[date];
    if (!value || !Number.isFinite(value.min) || !Number.isFinite(value.max)) return null;
    return value;
  }
  function range(value) {
    return `${Math.round(value.min)}—${Math.round(value.max)}℃`;
  }
  function condition(value) {
    return codeText[value.code] || '天气待更新';
  }
  function summary(value) {
    return value ? `${range(value)} · ${condition(value)}` : '预报待更新';
  }
  function render() {
    const grid = document.getElementById('weather-grid');
    if (!grid) return;
    grid.replaceChildren(...days.map((day, index) => {
      const article = document.createElement('article');
      article.className = 'weather-card';
      article.dataset.weatherDay = String(day.n);
      const top = document.createElement('div');
      top.className = 'weather-card-top';
      const date = document.createElement('span');
      date.textContent = `10.${String(day.n).padStart(2, '0')} ${weekdays[index]}`;
      const place = document.createElement('strong');
      place.textContent = day.label;
      top.append(date, place);
      const main = document.createElement('div');
      main.className = 'weather-card-main';
      const value = entry(day.primary, day.date);
      const temp = document.createElement('b');
      temp.textContent = value ? range(value) : '—';
      const sky = document.createElement('span');
      sky.textContent = value ? condition(value) : '预报待更新';
      main.append(temp, sky);
      article.append(top, main);
      if (day.secondary.length) {
        const route = document.createElement('p');
        route.className = 'weather-card-route';
        route.textContent = day.secondary.map(x => `${x.label} ${summary(entry(x.id, day.date))}`).join('；');
        article.append(route);
      }
      return article;
    }));
    const updated = document.getElementById('weather-updated');
    if (updated) updated.textContent = `预报更新：${dateLabel(forecast?.retrievedAt)}`;
  }
  async function refresh() {
    const button = document.getElementById('refresh-weather');
    if (button) button.disabled = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(forecastUrl, {cache: 'no-store', signal: controller.signal});
      if (!response.ok) throw new Error(`Weather HTTP ${response.status}`);
      const payload = await response.json();
      if (!Array.isArray(payload) || payload.length !== places.length) throw new Error('Weather location count');
      const next = {retrievedAt: new Date().toISOString(), days: {}};
      for (let i = 0; i < places.length; i++) {
        const daily = payload[i].daily;
        if (payload[i].timezone !== 'Asia/Shanghai' || !Array.isArray(daily?.time)) throw new Error('Weather timezone or dates');
        next.days[places[i].id] = {...forecast?.days?.[places[i].id], ...Object.fromEntries(daily.time.map((date, j) => [date, {
          min: daily.temperature_2m_min[j], max: daily.temperature_2m_max[j],
          code: daily.weather_code[j], rain: daily.precipitation_probability_max[j],
          wind: daily.wind_speed_10m_max[j],
        }]))};
      }
      if (!days.some(day => next.days[day.primary]?.[day.date])) throw new Error('Trip dates outside forecast window');
      forecast = next;
      render();
    } catch (_) {
      // Keep the dated forecast snapshot visible when offline or out of forecast range.
    } finally {
      clearTimeout(timeout);
      if (button) button.disabled = false;
    }
  }
  window.tripWeatherMarkdown = () => {
    let result = `## 七日天气与穿衣\n\n预报更新：${dateLabel(forecast?.retrievedAt)}（北京时间）\n\n${clothing}\n\n`;
    for (const day of days) {
      const primary = summary(entry(day.primary, day.date));
      const other = day.secondary.map(x => `${x.label} ${summary(entry(x.id, day.date))}`).join('；');
      result += `- 10月${day.n}日 ${day.label}：${primary}${other ? `；${other}` : ''}\n`;
    }
    return result + '\n数据：Open-Meteo 天气预报，打开网页时更新。\n\n';
  };
  const reminder = document.getElementById('weather-clothing');
  if (reminder) reminder.textContent = clothing;
  document.getElementById('refresh-weather')?.addEventListener('click', refresh);
  render();
  refresh();
})();

