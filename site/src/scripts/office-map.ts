import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const mounted = new WeakSet<HTMLElement>();

function parseView(el: HTMLElement): { lat: number; lng: number; zoom: number } | null {
  const lat = Number.parseFloat(el.dataset.lat ?? '');
  const lng = Number.parseFloat(el.dataset.lng ?? '');
  const zoom = Number.parseInt(el.dataset.zoom ?? '16', 10);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(zoom)) return null;
  return { lat, lng, zoom };
}

function mount(el: HTMLElement): void {
  if (mounted.has(el)) return;
  const view = parseView(el);
  if (!view) return;
  mounted.add(el);

  const iconUrl = el.dataset.markerIcon?.trim() || '/brand/office-map-marker.svg';

  const map = L.map(el, {
    center: [view.lat, view.lng],
    zoom: view.zoom,
    scrollWheelZoom: false,
    attributionControl: true,
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 19,
  }).addTo(map);

  const icon = L.icon({
    iconUrl,
    iconSize: [48, 62],
    iconAnchor: [24, 62],
    popupAnchor: [0, -56],
    className: 'schillings-map-marker',
  });

  L.marker([view.lat, view.lng], { icon, title: el.getAttribute('aria-label') ?? undefined }).addTo(
    map,
  );

  const ro = new ResizeObserver(() => {
    map.invalidateSize();
  });
  ro.observe(el);

  requestAnimationFrame(() => {
    map.invalidateSize();
  });
}

/** Mount maps under `root` when they scroll near the viewport (tiles load lazily). */
export function initOfficeMaps(root: ParentNode = document): void {
  const pending = [...root.querySelectorAll<HTMLElement>('[data-office-map]')].filter(
    (el) => !mounted.has(el),
  );
  if (!pending.length) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        obs.unobserve(el);
        mount(el);
      }
    },
    { rootMargin: '80px', threshold: 0.05 },
  );

  for (const el of pending) io.observe(el);
}
