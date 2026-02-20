import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import DeckGL from '@deck.gl/react'
import { Map } from 'react-map-gl/maplibre'
import { IconLayer, ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import { TripsLayer } from '@deck.gl/geo-layers'
import 'maplibre-gl/dist/maplibre-gl.css'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const STATUS_COLORS = {
  healthy:  [0, 200, 83],
  stress:   [255, 215, 64],
  degraded: [255, 171, 64],
  failing:  [255, 82, 82],
  offline:  [92, 97, 107],
}

const NODES = [
  // Ports
  { id: 'port_la_lb', name: 'Port of LA / Long Beach', type: 'PORT', coordinates: [-118.26, 33.74], status: 'failing', importance: 0.98, revenue: 500000, description: 'Largest container port complex in Western Hemisphere' },
  { id: 'port_ny_nj', name: 'Port of New York / New Jersey', type: 'PORT', coordinates: [-74.14, 40.67], status: 'healthy', importance: 0.96, revenue: 420000, description: 'Largest port on US East Coast' },
  { id: 'port_houston', name: 'Port of Houston', type: 'PORT', coordinates: [-95.01, 29.73], status: 'stress', importance: 0.94, revenue: 380000, description: 'Largest US port by total tonnage' },
  { id: 'port_savannah', name: 'Port of Savannah', type: 'PORT', coordinates: [-81.09, 32.08], status: 'healthy', importance: 0.92, revenue: 350000, description: 'Fastest-growing US container port' },
  { id: 'port_seattle', name: 'Port of Seattle / Tacoma', type: 'PORT', coordinates: [-122.34, 47.27], status: 'healthy', importance: 0.90, revenue: 300000, description: 'Primary Pacific Northwest gateway' },
  { id: 'port_charleston', name: 'Port of Charleston', type: 'PORT', coordinates: [-79.93, 32.78], status: 'healthy', importance: 0.85, revenue: 180000, description: 'Deep-water port for SE automotive' },
  { id: 'port_virginia', name: 'Port of Virginia (Norfolk)', type: 'PORT', coordinates: [-76.29, 36.85], status: 'healthy', importance: 0.88, revenue: 250000, description: 'Deepest harbor on East Coast' },
  { id: 'port_oakland', name: 'Port of Oakland', type: 'PORT', coordinates: [-122.30, 37.80], status: 'healthy', importance: 0.86, revenue: 220000, description: 'Largest agricultural export port on West Coast' },
  { id: 'port_nola', name: 'Port of New Orleans', type: 'PORT', coordinates: [-90.06, 29.94], status: 'degraded', importance: 0.84, revenue: 200000, description: 'Strategic Mississippi River port' },
  { id: 'port_miami', name: 'PortMiami', type: 'PORT', coordinates: [-80.17, 25.77], status: 'healthy', importance: 0.83, revenue: 190000, description: 'Major gateway for Latin America trade' },
  // Airports
  { id: 'airport_memphis', name: 'Memphis FedEx Hub (MEM)', type: 'AIR', coordinates: [-89.98, 35.04], status: 'healthy', importance: 0.97, revenue: 450000, description: 'FedEx global super hub — largest cargo airport' },
  { id: 'airport_louisville', name: 'Louisville UPS Worldport (SDF)', type: 'AIR', coordinates: [-85.74, 38.17], status: 'healthy', importance: 0.95, revenue: 400000, description: 'UPS global hub — 2M+ packages daily' },
  { id: 'airport_chicago', name: "O'Hare Cargo Terminal (ORD)", type: 'AIR', coordinates: [-87.91, 41.97], status: 'healthy', importance: 0.93, revenue: 370000, description: 'Major Midwest air cargo hub' },
  { id: 'airport_anchorage', name: 'Anchorage Intl Airport (ANC)', type: 'AIR', coordinates: [-150.00, 61.17], status: 'healthy', importance: 0.88, revenue: 280000, description: 'Asia-North America air cargo refueling point' },
  { id: 'airport_miami', name: 'Miami Intl Airport (MIA) Cargo', type: 'AIR', coordinates: [-80.29, 25.79], status: 'healthy', importance: 0.91, revenue: 340000, description: 'Top US airport for international freight' },
  { id: 'airport_lax', name: 'LAX Cargo', type: 'AIR', coordinates: [-118.41, 33.94], status: 'healthy', importance: 0.90, revenue: 320000, description: 'Largest West Coast air cargo facility' },
  { id: 'airport_jfk', name: 'JFK Intl Airport Cargo', type: 'AIR', coordinates: [-73.78, 40.64], status: 'healthy', importance: 0.89, revenue: 300000, description: 'Primary transatlantic air cargo hub' },
  { id: 'airport_dfw', name: 'DFW Intl Airport Cargo', type: 'AIR', coordinates: [-97.04, 32.90], status: 'healthy', importance: 0.87, revenue: 260000, description: 'Central US air cargo hub' },
  // Manufacturing
  { id: 'mfg_tesla', name: 'Tesla Factory - Fremont', type: 'MFG', coordinates: [-121.94, 37.49], status: 'stress', importance: 0.91, revenue: 350000, description: 'Primary vehicle assembly plant' },
  { id: 'mfg_boeing', name: 'Boeing - Everett', type: 'MFG', coordinates: [-122.27, 47.92], status: 'healthy', importance: 0.94, revenue: 400000, description: 'Largest building by volume — 747/767/777/787 assembly' },
  { id: 'mfg_toyota', name: 'Toyota - Georgetown', type: 'MFG', coordinates: [-84.56, 38.21], status: 'healthy', importance: 0.93, revenue: 380000, description: "Toyota's largest plant globally — Camry, RAV4" },
  { id: 'mfg_intel', name: 'Intel Fab - Chandler', type: 'MFG', coordinates: [-111.86, 33.23], status: 'healthy', importance: 0.93, revenue: 370000, description: 'Advanced semiconductor fabrication' },
  { id: 'mfg_tyson', name: 'Tyson Foods - Springdale', type: 'MFG', coordinates: [-94.13, 36.19], status: 'healthy', importance: 0.92, revenue: 360000, description: 'Largest processing complex — poultry, beef' },
  { id: 'mfg_caterpillar', name: 'Caterpillar - Peoria', type: 'MFG', coordinates: [-89.59, 40.69], status: 'healthy', importance: 0.86, revenue: 280000, description: 'Heavy equipment manufacturing' },
  { id: 'mfg_pfizer', name: 'Pfizer - Kalamazoo', type: 'MFG', coordinates: [-85.59, 42.29], status: 'healthy', importance: 0.91, revenue: 340000, description: 'Pharma manufacturing — sterile injectables' },
  { id: 'mfg_pg', name: 'P&G - Cincinnati', type: 'MFG', coordinates: [-84.51, 39.10], status: 'healthy', importance: 0.90, revenue: 320000, description: 'Consumer goods HQ and manufacturing' },
  { id: 'mfg_dow', name: 'Dow Chemical - Midland', type: 'MFG', coordinates: [-84.25, 43.62], status: 'healthy', importance: 0.85, revenue: 260000, description: 'Largest integrated chemical manufacturing' },
  { id: 'mfg_3m', name: '3M - Maplewood', type: 'MFG', coordinates: [-92.99, 44.95], status: 'healthy', importance: 0.84, revenue: 240000, description: 'Industrial, safety, healthcare products' },
  // Distribution Centers
  { id: 'dc_amazon', name: 'Amazon Fulfillment - Ontario, CA', type: 'DC', coordinates: [-117.60, 34.05], status: 'healthy', importance: 0.94, revenue: 400000, description: '1M+ sq ft — key West Coast e-commerce node' },
  { id: 'dc_walmart', name: 'Walmart Distribution - Bentonville', type: 'DC', coordinates: [-94.21, 36.37], status: 'healthy', importance: 0.95, revenue: 420000, description: 'HQ-adjacent master distribution hub' },
  { id: 'dc_ups', name: 'UPS CACH - Hodgkins, IL', type: 'DC', coordinates: [-87.86, 41.77], status: 'healthy', importance: 0.93, revenue: 380000, description: 'Largest automated package sorting facility' },
  { id: 'dc_fedex_indy', name: 'FedEx Ground Hub - Indianapolis', type: 'DC', coordinates: [-86.30, 39.72], status: 'healthy', importance: 0.90, revenue: 340000, description: "FedEx Ground's largest hub" },
  { id: 'dc_target', name: 'Target DC - Dallas/Fort Worth', type: 'DC', coordinates: [-97.14, 32.66], status: 'failing', importance: 0.86, revenue: 260000, description: 'South Central regional distribution' },
  { id: 'dc_sysco', name: 'Sysco Distribution - Houston', type: 'DC', coordinates: [-95.65, 29.84], status: 'stress', importance: 0.91, revenue: 350000, description: 'Largest foodservice distribution' },
  { id: 'dc_kroger', name: 'Kroger Distribution - Cincinnati', type: 'DC', coordinates: [-84.46, 39.16], status: 'healthy', importance: 0.87, revenue: 280000, description: 'Grocery and perishable distribution' },
  { id: 'dc_costco', name: 'Costco Depot - Marysville, WA', type: 'DC', coordinates: [-122.15, 48.06], status: 'healthy', importance: 0.85, revenue: 240000, description: 'Pacific NW distribution depot' },
  // Intermodal / Rail
  { id: 'imt_chicago', name: 'BNSF Logistics Park - Joliet', type: 'IMT', coordinates: [-88.15, 41.52], status: 'healthy', importance: 0.94, revenue: 400000, description: 'Largest intermodal facility in North America' },
  { id: 'imt_la', name: 'ICTF - Los Angeles', type: 'IMT', coordinates: [-118.24, 33.81], status: 'stress', importance: 0.93, revenue: 380000, description: 'Near-dock intermodal container transfer' },
  { id: 'imt_memphis', name: 'Memphis Intermodal (BNSF)', type: 'IMT', coordinates: [-89.94, 35.08], status: 'healthy', importance: 0.87, revenue: 250000, description: 'Mid-South intermodal transfer' },
  { id: 'ry_bailey', name: 'Bailey Yard (UP) - North Platte', type: 'RAIL', coordinates: [-100.77, 41.12], status: 'healthy', importance: 0.92, revenue: 350000, description: 'Largest rail classification yard in the world' },
  { id: 'ry_roseville', name: 'Roseville Yard (UP)', type: 'RAIL', coordinates: [-121.30, 38.73], status: 'healthy', importance: 0.88, revenue: 280000, description: 'Major West Coast classification yard' },
  { id: 'ry_galesburg', name: 'Galesburg Yard (BNSF)', type: 'RAIL', coordinates: [-90.37, 40.95], status: 'healthy', importance: 0.86, revenue: 260000, description: 'Key BNSF Transcon link' },
  // Inland Ports
  { id: 'ip_dallas', name: 'Inland Port Dallas-Fort Worth', type: 'IP', coordinates: [-96.97, 32.72], status: 'healthy', importance: 0.89, revenue: 280000, description: 'Foreign trade zone with customs' },
  { id: 'ip_kc', name: 'Kansas City SmartPort', type: 'IP', coordinates: [-94.58, 39.10], status: 'healthy', importance: 0.87, revenue: 260000, description: 'Junction of 4 Class I railroads' },
  { id: 'ip_greer', name: 'Inland Port Greer (SC)', type: 'IP', coordinates: [-82.23, 34.93], status: 'healthy', importance: 0.85, revenue: 220000, description: 'BMW supply chain hub' },
  // Warehouses
  { id: 'wh_edison', name: 'Edison/Cranbury Corridor - NJ', type: 'WH', coordinates: [-74.37, 40.50], status: 'healthy', importance: 0.90, revenue: 310000, description: 'Major East Coast warehousing' },
  { id: 'wh_elwood', name: 'CenterPoint Intermodal - Elwood, IL', type: 'WH', coordinates: [-88.11, 41.40], status: 'healthy', importance: 0.91, revenue: 320000, description: 'One of largest inland logistics parks' },
  { id: 'wh_alliance', name: 'AllianceTexas Hub - Fort Worth', type: 'WH', coordinates: [-97.32, 32.99], status: 'healthy', importance: 0.89, revenue: 290000, description: '18,000-acre master-planned logistics hub' },
  { id: 'wh_memphis', name: 'Memphis Mega-Warehouse District', type: 'WH', coordinates: [-90.02, 35.10], status: 'healthy', importance: 0.88, revenue: 270000, description: 'Strategic next-day ground delivery' },
  // Transport corridors
  { id: 'route_i10', name: 'I-10 Gulf Coast Corridor', type: 'ROUTE', coordinates: [-91.15, 30.30], status: 'healthy', importance: 0.94, revenue: 500000, description: 'Southern transcontinental route' },
  { id: 'route_i95', name: 'I-95 Northeast Corridor', type: 'ROUTE', coordinates: [-74.80, 40.10], status: 'healthy', importance: 0.96, revenue: 600000, description: 'Most trafficked freight corridor in US' },
  { id: 'route_i35', name: 'I-35 NAFTA Superhighway', type: 'ROUTE', coordinates: [-97.15, 31.50], status: 'stress', importance: 0.93, revenue: 480000, description: '15,000+ trucks daily at Laredo crossing' },
  { id: 'route_i80', name: 'I-80 Transcontinental', type: 'ROUTE', coordinates: [-100.80, 41.20], status: 'healthy', importance: 0.91, revenue: 440000, description: 'Northern transcontinental corridor' },
  { id: 'route_bnsf', name: 'BNSF Transcon Railway', type: 'ROUTE', coordinates: [-106.65, 35.20], status: 'healthy', importance: 0.95, revenue: 550000, description: 'Busiest freight rail line in North America' },
]

const ROUTES = [
  { id: 'bnsf_transcon', name: 'BNSF Transcon (LA → Chicago)', path: [[-118.26,33.74],[-118.24,33.81],[-117.02,34.90],[-115.50,35.20],[-111.50,35.50],[-108.74,35.53],[-105.94,35.69],[-101.83,35.20],[-97.52,35.47],[-95.95,36.15],[-93.60,37.08],[-90.37,40.95],[-88.15,41.52]], color: [0,200,83,180] },
  { id: 'i95_ne', name: 'I-95 NE Corridor', path: [[-81.09,32.08],[-79.93,32.78],[-78.90,33.69],[-77.94,34.23],[-76.29,36.85],[-75.52,38.90],[-74.80,40.10],[-74.37,40.50],[-74.14,40.67]], color: [0,200,83,180] },
  { id: 'gulf', name: 'Gulf Coast Corridor', path: [[-95.01,29.73],[-93.50,30.10],[-91.15,30.30],[-90.06,29.94],[-88.50,30.40],[-87.50,30.60],[-85.50,30.80],[-84.00,31.20],[-82.50,31.60],[-81.09,32.08]], color: [255,171,64,180] },
  { id: 'i35', name: 'I-35 NAFTA (Dallas → KC)', path: [[-97.14,32.66],[-96.97,32.72],[-97.15,33.50],[-97.32,34.50],[-97.52,35.47],[-97.30,36.70],[-96.50,37.70],[-95.50,38.40],[-94.58,39.10]], color: [255,82,82,160] },
  { id: 'i5', name: 'I-5 Pacific Coast', path: [[-122.34,47.27],[-122.27,47.92],[-122.68,45.52],[-122.40,43.20],[-122.00,41.80],[-121.94,37.49],[-122.30,37.80],[-121.00,36.50],[-118.41,33.94],[-118.26,33.74]], color: [0,200,83,160] },
  { id: 'midwest', name: 'Midwest Distribution', path: [[-87.86,41.77],[-87.91,41.97],[-86.50,40.50],[-85.74,38.17],[-86.50,36.80],[-87.50,36.10],[-89.98,35.04]], color: [0,200,83,180] },
  { id: 'i10_west', name: 'I-10 West (LA → Houston)', path: [[-118.26,33.74],[-117.60,34.05],[-115.50,33.00],[-112.07,33.45],[-111.86,33.23],[-109.50,32.30],[-106.65,31.80],[-104.00,30.90],[-101.83,30.50],[-97.14,32.66],[-95.65,29.84],[-95.01,29.73]], color: [0,200,83,160] },
  { id: 'i80_trans', name: 'I-80 Transcontinental', path: [[-122.30,37.80],[-121.30,38.73],[-119.80,39.50],[-117.00,40.80],[-114.00,41.00],[-110.00,41.10],[-105.00,41.15],[-100.77,41.12],[-97.00,41.20],[-93.60,41.60],[-90.37,40.95],[-88.15,41.52]], color: [41,98,255,140] },
]

const TRIPS_DATA = ROUTES.flatMap(route =>
  Array.from({ length: 4 }, (_, i) => ({ ...route, timeOffset: (8000/4)*i }))
)

// Alerts data
const ALERTS = [
  { id: 'a1', severity: 'critical', source: 'NWS', title: 'Port congestion — LA/Long Beach', detail: '8 vessels queued · $500K at risk', nodes: ['Port of LA/LB', 'BNSF LA ICTF'], time: '2m ago' },
  { id: 'a2', severity: 'warning', source: 'NWS', title: 'Winter storm — I-35 TX', detail: '35 trucks in transit · $320K at risk', nodes: ['I-35 Corridor', 'Target Dallas DC'], time: '18m ago' },
  { id: 'a3', severity: 'watch', source: 'EIA', title: 'ERCOT grid stress', detail: '4 facilities affected · $180K at risk', nodes: ['Intel Chandler', 'Target Dallas DC'], time: '1h ago' },
]

const PREDICTIONS = [
  { name: 'Port of LA/LB', h24: 82, h48: 91, h72: 95, revenue: '$500K', factor: 'vessel backlog, berth shortage', severity: 'critical' },
  { name: 'I-35 Corridor TX', h24: 65, h48: 78, h72: 84, revenue: '$320K', factor: 'winter storm, road closures', severity: 'warning' },
  { name: 'ERCOT Grid TX', h24: 45, h48: 58, h72: 67, revenue: '$180K', factor: 'grid demand surge', severity: 'caution' },
  { name: 'Port of New Orleans', h24: 38, h48: 52, h72: 61, revenue: '$200K', factor: 'hurricane season proximity', severity: 'caution' },
  { name: 'Memphis FedEx Hub', h24: 32, h48: 41, h72: 48, revenue: '$95K', factor: 'weather delay risk', severity: 'normal' },
]

const RECOMMENDATIONS = [
  { priority: 'critical', confidence: 92, action: 'Reroute LA/LB-bound freight through Port of Oakland. Activate backup carrier agreements.', nodes: ['Port of LA/LB','Amazon Ontario DC','ICTF LA'], savings: '$420K', shipments: 38, inaction: '$500K' },
  { priority: 'high', confidence: 87, action: 'Pre-position inventory at Dallas DC ahead of I-35 winter storm. Estimated 48h window.', nodes: ['Dallas IP','Target Dallas DC'], savings: '$280K', shipments: 24 },
  { priority: 'medium', confidence: 74, action: 'Switch ERCOT-dependent facilities to backup generators during peak demand window.', nodes: ['Intel Chandler'], savings: '$150K', shipments: 12 },
  { priority: 'low', confidence: 68, action: 'Activate secondary Memphis routing to bypass weather-affected corridors.', nodes: ['Memphis FedEx Hub'], savings: '$80K', shipments: 8 },
]


/* ═══════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════ */
const NAV = [
  { id:'command', label:'Command' },
  { id:'map', label:'Live Map' },
  { id:'network', label:'Network' },
  { id:'risk', label:'Risk' },
  { id:'infra', label:'Infra' },
  { id:'reports', label:'Reports' },
  { id:'handoff', label:'Handoff' },
  { id:'settings', label:'Settings' },
]

const NAV_ICONS = {
  command: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  map: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  network: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><line x1="12" y1="8" x2="5" y2="16"/><line x1="12" y1="8" x2="19" y2="16"/></svg>,
  risk: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  infra: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>,
  reports: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  handoff: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

function fmt(n) {
  if (n >= 1000000) return '$' + (n/1000000).toFixed(1) + 'M'
  if (n >= 1000) return '$' + (n/1000).toFixed(0) + 'K'
  return '$' + n
}


/* ═══════════════════════════════════════════
   LIVE MAP VIEW (real MapLibre + DeckGL)
   ═══════════════════════════════════════════ */
function LiveMapView() {
  const [viewState, setViewState] = useState({ longitude: -95.7, latitude: 38.5, zoom: 4.2, pitch: 0, bearing: 0 })
  const [tripsTime, setTripsTime] = useState(0)
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [showLabels, setShowLabels] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)
  const animRef = useRef(null)

  useEffect(() => {
    const animate = () => {
      setTripsTime(t => (t + 0.4) % 8000)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  const failingNodes = NODES.filter(n => n.status === 'failing' || n.status === 'degraded')
  const stressedNodes = NODES.filter(n => n.status === 'stress')
  const totalRevAtRisk = failingNodes.reduce((s, n) => s + n.revenue, 0)

  // Build icon data URLs
  const getIcon = (node) => {
    const [r,g,b] = STATUS_COLORS[node.status] || STATUS_COLORS.healthy
    const isPort = node.type === 'PORT'
    const size = isPort ? 44 : ['AIR','MFG','IMT','RAIL'].includes(node.type) ? 36 : 30
    const fs = isPort ? 10 : 8
    const isHovered = hovered?.id === node.id
    const isSelected = selected?.id === node.id
    const strokeColor = isSelected ? '41,98,255' : `${r},${g},${b}`
    const strokeW = isSelected ? 2 : 0
    return {
      url: 'data:image/svg+xml;base64,' + btoa(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="rgb(${r},${g},${b})" opacity="${isHovered ? '0.4' : '0.25'}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2-6}" fill="rgb(${r},${g},${b})" opacity="0.9" stroke="rgb(${strokeColor})" stroke-width="${strokeW}"/>
        <text x="${size/2}" y="${size/2+3}" text-anchor="middle" font-size="${fs}" font-weight="600" fill="#fff" font-family="Inter,system-ui">${node.type}</text>
      </svg>`),
      width: size, height: size, anchorY: size/2
    }
  }

  const layers = [
    showRoutes && new TripsLayer({
      id: 'routes',
      data: TRIPS_DATA,
      getPath: d => d.path,
      getTimestamps: d => d.path.map((_,i) => d.timeOffset + i*(2000/(d.path.length-1||1))),
      getColor: d => d.color,
      currentTime: tripsTime,
      trailLength: 300,
      fadeTrail: true,
      widthMinPixels: 2.5,
      capRounded: true,
      jointRounded: true,
    }),
    // Alert rings around failing nodes
    new ScatterplotLayer({
      id: 'alert-rings',
      data: failingNodes,
      getPosition: d => d.coordinates,
      getFillColor: [255, 82, 82, 30],
      getLineColor: [255, 82, 82, 120],
      getRadius: 40000,
      lineWidthMinPixels: 1.5,
      stroked: true,
      filled: true,
      radiusMinPixels: 14,
      radiusMaxPixels: 40,
    }),
    new IconLayer({
      id: 'nodes',
      data: NODES,
      getPosition: d => d.coordinates,
      getIcon,
      getSize: d => d.type === 'PORT' ? 44 : ['AIR','MFG','IMT','RAIL'].includes(d.type) ? 36 : 30,
      sizeScale: 1,
      pickable: true,
      autoHighlight: true,
      highlightColor: [41, 98, 255, 100],
      onHover: info => setHovered(info.object || null),
      onClick: info => { if (info.object) setSelected(prev => prev?.id === info.object.id ? null : info.object) },
      updateTriggers: { getIcon: [hovered?.id, selected?.id] },
    }),
    showLabels && new TextLayer({
      id: 'labels',
      data: NODES.filter(n => n.importance > 0.88 || n.status !== 'healthy'),
      getPosition: d => d.coordinates,
      getText: d => d.name.length > 20 ? d.name.slice(0,18) + '…' : d.name,
      getColor: d => d.status === 'failing' ? [255,82,82,220] : [232,234,237,180],
      getSize: 11,
      getPixelOffset: [0, -20],
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 500,
      outlineWidth: 2,
      outlineColor: [11, 12, 14, 200],
      billboard: false,
      sizeUnits: 'pixels',
    }),
  ].filter(Boolean)

  const selectedColor = selected ? STATUS_COLORS[selected.status] : null

  // Triage queue — at-risk nodes sorted by severity
  const triageNodes = NODES
    .filter(n => n.status === 'failing' || n.status === 'degraded' || n.status === 'stress')
    .sort((a,b) => {
      const w = { failing: 3, degraded: 2, stress: 1 }
      return (w[b.status]||0) - (w[a.status]||0) || b.revenue - a.revenue
    })
    .slice(0, 6)

  return (
    <div className="demo-view-map">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState: vs }) => setViewState(vs)}
        controller={true}
        layers={layers}
        style={{ width: '100%', height: '100%' }}
        onClick={info => { if (!info.object) setSelected(null) }}
        getCursor={({ isHovering }) => isHovering ? 'pointer' : 'grab'}
      >
        <Map reuseMaps mapStyle={MAP_STYLE} />
      </DeckGL>

      {/* Summary banner */}
      <div className="demo-banner">
        <div className="demo-banner-item">
          <span className="demo-banner-label">Supply Chain Network</span>
          <span className="demo-banner-val">{NODES.length} nodes</span>
        </div>
        {failingNodes.length > 0 && (
          <div className="demo-banner-item">
            <span className="demo-dot red" />
            <span className="demo-banner-val red">{failingNodes.length}</span>
            <span className="demo-banner-label">Failing</span>
          </div>
        )}
        {totalRevAtRisk > 0 && (
          <div className="demo-banner-item">
            <span className="demo-banner-val orange">{fmt(totalRevAtRisk)}</span>
            <span className="demo-banner-label">At Risk</span>
          </div>
        )}
        {stressedNodes.length > 0 && (
          <div className="demo-banner-item">
            <span className="demo-dot yellow" />
            <span className="demo-banner-val">{stressedNodes.length}</span>
            <span className="demo-banner-label">Stressed</span>
          </div>
        )}
      </div>

      {/* Triage queue */}
      {triageNodes.length > 0 && (
        <div className="demo-triage">
          <div className="demo-triage-hdr">
            <span className="demo-badge-red">{triageNodes.length}</span>
            <span>Triage Queue</span>
            <span className="demo-triage-rev">{fmt(triageNodes.reduce((s,n) => s + n.revenue, 0))}</span>
          </div>
          {triageNodes.map(n => (
            <div key={n.id} className="demo-triage-row" onClick={() => { setSelected(n); setViewState(v => ({...v, longitude: n.coordinates[0], latitude: n.coordinates[1], zoom: 6, transitionDuration: 500 })) }}>
              <span className={`demo-dot ${n.status === 'failing' ? 'red' : n.status === 'degraded' ? 'orange' : 'yellow'}`} />
              <span className="demo-triage-name">{n.name}</span>
              <span className="demo-triage-amt">{fmt(n.revenue)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Layer toggles */}
      <div className="demo-layers">
        <label className="demo-layer-toggle"><input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} /><span>Labels</span></label>
        <label className="demo-layer-toggle"><input type="checkbox" checked={showRoutes} onChange={e => setShowRoutes(e.target.checked)} /><span>Routes</span></label>
      </div>

      {/* Legend */}
      <div className="demo-legend">
        {Object.entries({ Healthy: 'green', Stress: 'yellow', Degraded: 'orange', Failing: 'red', Offline: 'gray' }).map(([label, color]) => (
          <div key={label} className="demo-legend-item"><span className={`demo-dot ${color}`} />{label}</div>
        ))}
      </div>

      {/* Hover tooltip */}
      {hovered && !selected && (
        <div className="demo-tooltip" style={{ pointerEvents: 'none' }}>
          <div className="demo-tooltip-name">{hovered.name}</div>
          <div className="demo-tooltip-type">{hovered.type}</div>
          <div className="demo-tooltip-row">
            <span>Status</span>
            <span style={{ color: `rgb(${(STATUS_COLORS[hovered.status]||[]).join(',')})` }}>{hovered.status}</span>
          </div>
          {hovered.revenue > 0 && (
            <div className="demo-tooltip-row">
              <span>Revenue Impact</span>
              <span className="orange">{fmt(hovered.revenue)}</span>
            </div>
          )}
          <div className="demo-tooltip-desc">{hovered.description}</div>
        </div>
      )}

      {/* Selected node detail panel */}
      {selected && (
        <div className="demo-node-detail" style={{ borderLeftColor: `rgb(${(selectedColor||[]).join(',')})` }}>
          <div className="demo-detail-header">
            <strong>{selected.name}</strong>
            <button onClick={() => setSelected(null)} className="demo-detail-close">&times;</button>
          </div>
          <div className="demo-detail-type">{selected.type}</div>
          <div className="demo-detail-row">
            <span>Status</span>
            <span className={`demo-status-badge ${selected.status}`}>{selected.status}</span>
          </div>
          <div className="demo-detail-row">
            <span>Importance</span>
            <span className="mono">{selected.importance.toFixed(2)}</span>
          </div>
          {selected.revenue > 0 && (
            <div className="demo-detail-row">
              <span>Revenue Impact</span>
              <span className="mono orange">{fmt(selected.revenue)}</span>
            </div>
          )}
          <div className="demo-detail-desc">{selected.description}</div>
          {(selected.status === 'failing' || selected.status === 'degraded' || selected.status === 'stress') && (
            <button className="demo-detail-btn">View Risk Analysis →</button>
          )}
        </div>
      )}
    </div>
  )
}


/* ═══════════════════════════════════════════
   COMMAND CENTER VIEW
   ═══════════════════════════════════════════ */
function CommandView() {
  const healthPct = ((NODES.filter(n => n.status === 'healthy').length / NODES.length) * 100).toFixed(1)
  const failCount = NODES.filter(n => n.status === 'failing' || n.status === 'degraded').length
  const totalExposure = NODES.filter(n => n.status !== 'healthy' && n.status !== 'offline').reduce((s,n) => s + n.revenue, 0)

  return (
    <div className="demo-view">
      <div className="demo-hdr">
        <div>
          <h2 className="demo-title">Command Center</h2>
          <p className="demo-sub">Supply Chain Operations — Executive Summary</p>
        </div>
        <div className="demo-ds-badges">
          {['NWS','FEMA','EIA','BTS'].map(s => <span key={s} className="demo-ds">{s}</span>)}
        </div>
      </div>

      <div className="demo-kpi-grid">
        <div className="demo-kpi">
          <div className="demo-kpi-label">Network Health</div>
          <div className="demo-kpi-row">
            <svg className="demo-gauge" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1C1F26" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke={healthPct > 80 ? '#00C853' : healthPct > 60 ? '#FFAB40' : '#FF5252'} strokeWidth="3"
                strokeDasharray="97.4" strokeDashoffset={97.4 - (97.4 * healthPct / 100)} strokeLinecap="round" transform="rotate(-90 18 18)" />
            </svg>
            <span className={`demo-kpi-val ${healthPct > 80 ? 'green' : healthPct > 60 ? 'orange' : 'red'}`}>{healthPct}%</span>
          </div>
        </div>
        <div className="demo-kpi">
          <div className="demo-kpi-label">Financial Exposure</div>
          <div className={`demo-kpi-val ${totalExposure > 0 ? 'orange' : 'green'}`}>{fmt(totalExposure)}</div>
        </div>
        <div className="demo-kpi">
          <div className="demo-kpi-label">Active Alerts</div>
          <div className="demo-kpi-val red">{ALERTS.length}</div>
        </div>
        <div className="demo-kpi">
          <div className="demo-kpi-label">Predicted Disruptions 24h</div>
          <div className="demo-kpi-val orange">{PREDICTIONS.filter(p => p.h24 > 40).length}</div>
        </div>
      </div>

      {ALERTS.filter(a => a.severity === 'critical').length > 0 && (
        <div className="demo-critical-strip">
          <span className="demo-critical-icon">⚠</span>
          <span>{ALERTS.filter(a => a.severity === 'critical').length} Critical Alert: {ALERTS.find(a => a.severity === 'critical').title}</span>
          <span className="demo-critical-badge">$500K at risk</span>
        </div>
      )}

      <div className="demo-two-col">
        <div className="demo-card">
          <div className="demo-card-title">Predicted Failures <span className="demo-cnt warning">{PREDICTIONS.length}</span></div>
          {PREDICTIONS.slice(0,3).map((p,i) => (
            <div key={i} className={`demo-pred-card border-${p.severity === 'critical' ? 'red' : p.severity === 'warning' ? 'orange' : 'yellow'}`}>
              <div className="demo-pred-hdr">
                <span className="demo-pred-name">{p.name}</span>
                <span className={`demo-sev-badge ${p.severity}`}>{p.severity === 'critical' ? 'CRITICAL' : p.severity === 'warning' ? 'HIGH' : 'WATCH'}</span>
              </div>
              <div className="demo-risk-bars">
                {[{l:'24h',v:p.h24},{l:'48h',v:p.h48},{l:'72h',v:p.h72}].map(b => (
                  <div key={b.l} className="demo-risk-bar">
                    <span className="demo-risk-lbl">{b.l}</span>
                    <div className="demo-risk-track"><div className={`demo-risk-fill ${b.v > 70 ? 'red' : b.v > 40 ? 'orange' : 'yellow'}`} style={{ width: `${b.v}%` }} /></div>
                    <span className="demo-risk-pct">{b.v}%</span>
                  </div>
                ))}
              </div>
              <div className="demo-pred-meta">
                <span className="demo-pred-rev">{p.revenue}</span>
                <span className="demo-pred-factor">{p.factor}</span>
              </div>
            </div>
          ))}
          <button className="demo-show-more">Show all {PREDICTIONS.length} at-risk nodes</button>
        </div>
        <div className="demo-card">
          <div className="demo-card-title">Top Action Items <span className="demo-cnt blue">{RECOMMENDATIONS.length}</span></div>
          {RECOMMENDATIONS.slice(0,3).map((r,i) => (
            <div key={i} className={`demo-rec-card border-${r.priority === 'critical' ? 'red' : r.priority === 'high' ? 'orange' : 'yellow'}`}>
              <div className="demo-rec-top">
                <span className={`demo-rec-priority ${r.priority}`}>{r.priority}</span>
                <div className="demo-rec-conf">
                  <div className="demo-conf-bar"><div className="demo-conf-fill" style={{ width: `${r.confidence}%` }} /></div>
                  <span className="demo-conf-pct">{r.confidence}%</span>
                </div>
              </div>
              <p className="demo-rec-action">{r.action}</p>
              {r.nodes && <div className="demo-rec-tags">{r.nodes.map(n => <span key={n} className="demo-rec-tag">{n}</span>)}</div>}
              <div className="demo-rec-metrics">
                <span className="demo-rec-savings">{r.savings} saved</span>
                <span className="demo-rec-ships">{r.shipments} shipments</span>
              </div>
              {r.inaction && <div className="demo-rec-inaction">Cost of inaction: {r.inaction}</div>}
              <div className="demo-rec-btns">
                <button className="demo-btn-primary">Execute</button>
                <button className="demo-btn-ghost">Snooze</button>
                <button className="demo-btn-ghost">Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-card">
        <div className="demo-card-title">Activity Timeline</div>
        <div className="demo-tl">
          {[
            { c:'red', t:'2m ago', txt:'Critical alert: Port congestion at LA/LB exceeded threshold' },
            { c:'orange', t:'18m ago', txt:'NWS winter storm warning issued for I-35 TX corridor' },
            { c:'blue', t:'45m ago', txt:'Recommendation executed: Memphis hub reroute completed' },
            { c:'green', t:'1h ago', txt:'Network health restored: Boeing Everett back to healthy' },
            { c:'blue', t:'2h ago', txt:'Prediction confirmed: ERCOT grid demand surge validated' },
          ].map((e,i) => (
            <div key={i} className="demo-tl-item">
              <span className={`demo-dot ${e.c}`} />
              <span className="demo-tl-time">{e.t}</span>
              <span className="demo-tl-text">{e.txt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════
   RISK EXPLORER
   ═══════════════════════════════════════════ */
function RiskView() {
  const riskNodes = NODES.filter(n => n.status !== 'healthy' && n.status !== 'offline')
    .concat(NODES.filter(n => n.status === 'healthy').slice(0, 5))
    .map(n => {
      const pred = PREDICTIONS.find(p => p.name.includes(n.name.split(' - ')[0].split(' (')[0]))
      return { ...n, h24: pred?.h24 || Math.round(n.importance * 20), h48: pred?.h48 || Math.round(n.importance * 25), h72: pred?.h72 || Math.round(n.importance * 30), factor: pred?.factor || 'normal operations' }
    })
    .sort((a,b) => b.h24 - a.h24)

  return (
    <div className="demo-view">
      <div className="demo-hdr">
        <div><h2 className="demo-title">Risk Explorer</h2><p className="demo-sub">Unified risk assessment — predictions + active alerts</p></div>
      </div>
      <div className="demo-risk-filters">
        <div className="demo-tabs"><button className="demo-tab active">All</button><button className="demo-tab">Critical</button><button className="demo-tab">Warning</button></div>
        <div className="demo-tabs"><button className="demo-tab active">All</button><button className="demo-tab">24h</button><button className="demo-tab">48h</button><button className="demo-tab">72h</button></div>
      </div>
      <div className="demo-risk-list">
        {riskNodes.map(n => {
          const dc = n.h24 > 70 ? 'red' : n.h24 > 40 ? 'orange' : n.h24 > 15 ? 'yellow' : 'green'
          return (
            <div key={n.id} className="demo-risk-row">
              <span className={`demo-dot ${dc}`} />
              <span className="demo-risk-name">{n.name}</span>
              <span className="demo-risk-type">{n.type}</span>
              <span className={`demo-risk-prob ${dc}`}>{n.h24}%</span>
              <span className="demo-risk-rev">{fmt(n.revenue)}</span>
              <span className="demo-risk-trend">{n.h72 > n.h24 ? '↑' : n.h72 < n.h24 ? '↓' : '→'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════
   INFRASTRUCTURE TABLE
   ═══════════════════════════════════════════ */
function InfraView() {
  const counts = { failing: 0, stress: 0, degraded: 0, healthy: 0, offline: 0 }
  NODES.forEach(n => { counts[n.status] = (counts[n.status] || 0) + 1 })

  return (
    <div className="demo-view">
      <div className="demo-hdr">
        <div><h2 className="demo-title">Infrastructure</h2><p className="demo-sub">All monitored supply chain nodes</p></div>
        <div className="demo-hdr-btns"><button className="demo-btn-ghost">Export CSV</button><button className="demo-btn-ghost">Export JSON</button></div>
      </div>
      <div className="demo-infra-filters">
        {Object.entries({ failing:'red', stress:'yellow', degraded:'orange', healthy:'green', offline:'gray' }).map(([s,c]) => (
          <button key={s} className={`demo-infra-filter ${s === 'healthy' ? 'active' : ''}`}><span className={`demo-dot ${c}`} />{s}<span className="demo-filter-ct">{counts[s]}</span></button>
        ))}
        <span className="demo-infra-total">{NODES.length} nodes</span>
      </div>
      <div className="demo-table-wrap">
        <table className="demo-table">
          <thead><tr><th>Name</th><th>Status</th><th>Type</th><th>Region</th><th>Importance</th><th>Revenue Impact</th></tr></thead>
          <tbody>
            {NODES.sort((a,b) => {
              const w = { failing: 4, degraded: 3, stress: 2, healthy: 1, offline: 0 }
              return (w[b.status]||0) - (w[a.status]||0) || b.importance - a.importance
            }).slice(0, 20).map(n => (
              <tr key={n.id} className="demo-table-row">
                <td>
                  <div className="demo-infra-cell">
                    <span className={`demo-dot ${n.status === 'failing' ? 'red' : n.status === 'degraded' ? 'orange' : n.status === 'stress' ? 'yellow' : 'green'}`} />
                    <div><div className="demo-infra-name">{n.name}</div><div className="demo-infra-desc">{n.description}</div></div>
                  </div>
                </td>
                <td><span className={`demo-status-badge ${n.status}`}>{n.status}</span></td>
                <td className="mono">{n.type}</td>
                <td className="mono">{n.coordinates[1] > 40 ? 'NE' : n.coordinates[0] < -100 ? 'W' : n.coordinates[1] < 33 ? 'S' : 'SE'}</td>
                <td className="mono">{n.importance.toFixed(2)}</td>
                <td className="mono orange">{fmt(n.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════
   REPORTS VIEW
   ═══════════════════════════════════════════ */
function ReportsView() {
  const totalExposure = NODES.filter(n => n.status !== 'healthy').reduce((s,n) => s + n.revenue, 0)
  return (
    <div className="demo-view">
      <div className="demo-hdr">
        <div><h2 className="demo-title">Reports</h2><p className="demo-sub">Financial impact & operational summary</p></div>
        <div className="demo-hdr-btns"><button className="demo-btn-ghost">Copy Summary</button><button className="demo-btn-ghost">Export CSV</button></div>
      </div>
      <div className="demo-kpi-grid">
        {[
          { label: 'Total Exposure', val: fmt(totalExposure), color: 'red', delta: '+12%', spark: '0,15 10,12 20,14 30,10 40,8 50,6 60,4', sc: '#FF5252' },
          { label: 'Mitigated Savings', val: '$8.3M', color: 'green', delta: '+24%', spark: '0,16 10,14 20,12 30,10 40,6 50,5 60,3', sc: '#00C853' },
          { label: 'Disruption Cost', val: '$2.1M', color: 'orange', delta: '-8%', spark: '0,10 10,8 20,12 30,14 40,11 50,9 60,7', sc: '#FFAB40' },
          { label: 'Recovery Investment', val: '$2.9M', color: 'cyan', delta: '+5%', spark: '0,14 10,12 20,10 30,9 40,8 50,7 60,6', sc: '#00B8D4' },
        ].map(k => (
          <div key={k.label} className="demo-kpi">
            <div className="demo-kpi-label">{k.label}</div>
            <div className={`demo-kpi-val ${k.color}`}>{k.val}</div>
            <div className="demo-sparkline">
              <svg viewBox="0 0 60 20" className="demo-spark-svg"><polyline points={k.spark} fill="none" stroke={k.sc} strokeWidth="1.5" /></svg>
              <span className={`demo-spark-delta ${k.delta.startsWith('-') ? 'green' : k.color === 'green' ? 'green' : 'red'}`}>{k.delta}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="demo-two-col">
        <div className="demo-card">
          <div className="demo-card-title">Executive Summary</div>
          {[
            ['Network Health', `${((NODES.filter(n=>n.status==='healthy').length/NODES.length)*100).toFixed(1)}%`, 'green'],
            ['High-Risk Nodes', `${NODES.filter(n=>n.status==='failing'||n.status==='degraded').length} nodes`, 'red'],
            ['Active Alerts', `${ALERTS.length} (${ALERTS.filter(a=>a.severity==='critical').length} critical)`, 'orange'],
            ['Risk Posture', 'ELEVATED', 'orange'],
          ].map(([l,v,c]) => (
            <div key={l} className="demo-exec-row"><span className="demo-exec-label">{l}</span><span className={c}>{v}</span></div>
          ))}
        </div>
        <div className="demo-card">
          <div className="demo-card-title">Top At-Risk Nodes</div>
          {PREDICTIONS.slice(0,4).map((p,i) => (
            <div key={i} className="demo-atrisk-row">
              <span className={`demo-dot ${p.h24 > 70 ? 'red' : p.h24 > 40 ? 'orange' : 'yellow'}`} />
              <span className="demo-atrisk-name">{p.name}</span>
              <span className="demo-atrisk-pct">{p.h24}%</span>
              <span className="demo-atrisk-rev">{p.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════
   HANDOFF / SETTINGS (simplified)
   ═══════════════════════════════════════════ */
function HandoffView() {
  const [tab, setTab] = useState('alerts')
  return (
    <div className="demo-view">
      <div className="demo-hdr"><div><h2 className="demo-title">Shift Handoff</h2><p className="demo-sub">Outgoing shift report — 8h window</p></div><button className="demo-btn-ghost">Copy Report</button></div>
      <div className="demo-kpi-grid">
        <div className="demo-kpi"><div className="demo-kpi-label">New Alerts</div><div className="demo-kpi-val red">{ALERTS.length}</div></div>
        <div className="demo-kpi"><div className="demo-kpi-label">Resolved</div><div className="demo-kpi-val green">2</div></div>
        <div className="demo-kpi"><div className="demo-kpi-label">Pending</div><div className="demo-kpi-val orange">4</div></div>
        <div className="demo-kpi"><div className="demo-kpi-label">High Risk</div><div className="demo-kpi-val red">{NODES.filter(n => n.status === 'failing').length}</div></div>
      </div>
      <div className="demo-handoff-tabs">
        {['alerts','actions','pending'].map(t => <button key={t} className={`demo-handoff-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </div>
      <div className="demo-card">
        {tab === 'alerts' && ALERTS.map(a => (
          <div key={a.id} className={`demo-alert-card border-${a.severity === 'critical' ? 'red' : a.severity === 'warning' ? 'orange' : 'yellow'}`}>
            <div className="demo-alert-top"><span className={`demo-sev-badge ${a.severity}`}>{a.severity}</span><span className="demo-alert-src">{a.source}</span></div>
            <div className="demo-alert-title">{a.title}</div>
            <div className="demo-alert-detail">{a.time} · {a.detail}</div>
          </div>
        ))}
        {tab === 'actions' && RECOMMENDATIONS.slice(0,2).map((r,i) => (
          <div key={i} className="demo-handoff-action"><span className={`demo-dot ${i === 0 ? 'green' : 'orange'}`} /><div><div className="demo-alert-title">{r.action.slice(0,60)}...</div><div className="demo-rec-metrics"><span className="demo-rec-savings">{r.savings} saved</span></div></div></div>
        ))}
        {tab === 'pending' && PREDICTIONS.filter(p => p.h24 > 40).map((p,i) => (
          <div key={i} className="demo-handoff-action"><span className="demo-dot red" /><div><div className="demo-alert-title">{p.name}</div><div className="demo-alert-detail">{p.h24}% risk (24h) · {p.revenue} exposure</div></div></div>
        ))}
      </div>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="demo-view">
      <div className="demo-hdr"><div><h2 className="demo-title">Settings</h2><p className="demo-sub">Configuration & preferences</p></div></div>
      <div className="demo-settings-grid">
        <div className="demo-card"><div className="demo-card-title">Data Source</div>
          <div className="demo-settings-opts">
            <label className="demo-settings-opt"><input type="radio" name="src" defaultChecked /><div><strong>Demo</strong><span>Simulated data for demonstration</span></div></label>
            <label className="demo-settings-opt"><input type="radio" name="src" /><div><strong>Real</strong><span>Live data from connected systems</span></div></label>
          </div>
        </div>
        <div className="demo-card"><div className="demo-card-title">Risk Thresholds</div>
          {[['High Risk','70%'],['Elevated Risk','40%'],['Revenue Alert','$1M']].map(([l,v]) => (
            <div key={l} className="demo-settings-slider"><span className="demo-slider-label">{l}</span><input type="range" className="demo-range" /><span className="demo-slider-val">{v}</span></div>
          ))}
        </div>
        <div className="demo-card"><div className="demo-card-title">Keyboard Shortcuts</div>
          <div className="demo-shortcuts">
            {[['⌘K','Search'],['1-8','Navigate views'],['N / P','Next / prev node'],['?','All shortcuts']].map(([k,d]) => (
              <div key={k} className="demo-shortcut"><kbd>{k}</kbd><span>{d}</span></div>
            ))}
          </div>
        </div>
        <div className="demo-card"><div className="demo-card-title">About</div>
          <div className="demo-about"><div>Polynode v0.1.0</div><div className="demo-about-sub">Predictive supply chain intelligence platform</div><div className="demo-about-sub">Powered by GAT-LSTM · PCMCI+ causal discovery</div></div>
        </div>
      </div>
    </div>
  )
}

function NetworkView() {
  return (
    <div className="demo-view">
      <div className="demo-hdr"><div><h2 className="demo-title">Network Overview</h2><p className="demo-sub">{NODES.length} nodes · 268 edges · Graph Analysis</p></div></div>
      <div className="demo-net-summary">
        {[['red', NODES.filter(n=>n.status==='failing').length, 'High Risk'],['orange', NODES.filter(n=>n.status==='degraded'||n.status==='stress').length, 'Elevated'],['green', NODES.filter(n=>n.status==='healthy').length, 'Low Risk']].map(([c,v,l]) => (
          <div key={l} className="demo-net-stat"><span className={`demo-dot ${c}`} /><span className={`demo-net-val ${c}`}>{v}</span><span className="demo-net-label">{l}</span></div>
        ))}
      </div>
      <div className="demo-net-graph">
        <svg viewBox="0 0 600 350" className="demo-net-svg">
          {[
            [100,80,300,175],[100,80,80,200],[300,175,480,100],[300,175,250,280],
            [300,175,420,250],[480,100,500,220],[480,100,540,60],[80,200,250,280],
            [250,280,420,250],[420,250,500,220],[180,50,300,175],[180,50,100,80],
            [370,60,480,100],[370,60,300,175],[540,60,550,170],[200,140,300,175],
            [200,140,100,80],[420,250,540,280],
          ].map(([x1,y1,x2,y2],i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2A2E35" strokeWidth="1" />)}
          {[
            [100,80,14,'#FF5252','LA/LB'],[80,200,8,'#00C853','OAK'],
            [300,175,16,'#FFAB40','DAL/FW'],[480,100,10,'#00C853','CHI'],
            [250,280,9,'#00C853','HOU'],[420,250,10,'#00C853','ATL'],
            [500,220,8,'#00C853','SAV'],[540,60,11,'#00C853','NY/NJ'],
            [180,50,7,'#FFD740','SEA'],[370,60,9,'#00C853','MEM'],
            [540,280,7,'#00C853','MIA'],[200,140,7,'#00C853','PHX'],
            [550,170,8,'#00C853','VA'],
          ].map(([cx,cy,r,fill,label],i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill={fill} opacity="0.8" />
              <text x={cx} y={cy+3} textAnchor="middle" fill="white" fontSize={r > 10 ? '8' : '6'} fontWeight="600">{label}</text>
              {fill === '#FF5252' && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF5252" strokeWidth="1.5" opacity="0.4"><animate attributeName="r" from={r} to={r+14} dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/></circle>}
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════
   MAIN DEMO PAGE
   ═══════════════════════════════════════════ */
const VIEWS = { command: CommandView, map: LiveMapView, network: NetworkView, risk: RiskView, infra: InfraView, reports: ReportsView, handoff: HandoffView, settings: SettingsView }

function Demo() {
  const [view, setView] = useState('command')
  const [rightOpen, setRightOpen] = useState(true)
  const ActiveView = VIEWS[view]

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="demo-app">
      {/* Top bar */}
      <header className="demo-topbar">
        <Link to="/" className="demo-back" title="Back to site">←</Link>
        <div className="demo-topbar-logo">
          <div className="demo-logo-icon">P</div>
          <span className="demo-logo-text">Polynode</span>
        </div>
        <span className="demo-badge-live"><span className="demo-badge-dot" />LIVE</span>
        <span className="demo-badge-engine">GAT-LSTM</span>
        <div className="demo-topbar-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <span>Search nodes, alerts...</span>
          <kbd>⌘K</kbd>
        </div>
        <div className="demo-topbar-right">
          <button className="demo-topbar-btn" onClick={() => setRightOpen(v => !v)} title="Toggle panel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span className="demo-bell-count">{ALERTS.length}</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="demo-body">
        {/* Sidebar */}
        <nav className="demo-sidebar">
          {NAV.map(n => (
            <button key={n.id} className={`demo-nav-item ${view === n.id ? 'active' : ''}`} onClick={() => setView(n.id)}>
              {NAV_ICONS[n.id]}
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Main */}
        <ActiveView />

        {/* Right panel */}
        {rightOpen && (
          <aside className="demo-right">
            <div className="demo-rp-section">
              <div className="demo-rp-title">Active Alerts <span className="demo-cnt red">{ALERTS.length}</span></div>
              <div className="demo-tabs"><button className="demo-tab active">All</button><button className="demo-tab">Critical</button><button className="demo-tab">Warning</button></div>
              {ALERTS.map(a => (
                <div key={a.id} className={`demo-alert-card border-${a.severity === 'critical' ? 'red' : a.severity === 'warning' ? 'orange' : 'yellow'}`}>
                  <div className="demo-alert-top"><span className={`demo-sev-badge ${a.severity}`}>{a.severity}</span><span className="demo-alert-src">{a.source}</span></div>
                  <div className="demo-alert-title">{a.title}</div>
                  <div className="demo-alert-detail">{a.detail}</div>
                  {a.nodes && <div className="demo-alert-tags">{a.nodes.map(n => <span key={n} className="demo-alert-tag">{n}</span>)}</div>}
                </div>
              ))}
            </div>
            <div className="demo-rp-section">
              <div className="demo-rp-title">Predicted Disruptions <span className="demo-cnt warning">{PREDICTIONS.length}</span></div>
              {PREDICTIONS.slice(0,3).map((p,i) => (
                <div key={i} className="demo-rp-pred">
                  <div className="demo-rp-pred-top">
                    <span className="demo-rp-pred-name">{p.name}</span>
                    <span className={`demo-sev-badge ${p.severity}`} style={{ fontSize: 8 }}>{p.h24}%</span>
                  </div>
                  <div className="demo-risk-bars compact">
                    {[{l:'24h',v:p.h24},{l:'48h',v:p.h48},{l:'72h',v:p.h72}].map(b => (
                      <div key={b.l} className="demo-risk-bar">
                        <span className="demo-risk-lbl">{b.l}</span>
                        <div className="demo-risk-track"><div className={`demo-risk-fill ${b.v>70?'red':b.v>40?'orange':'yellow'}`} style={{width:`${b.v}%`}} /></div>
                        <span className="demo-risk-pct">{b.v}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="demo-rp-section">
              <div className="demo-rp-title">Recommendations <span className="demo-cnt blue">{RECOMMENDATIONS.length}</span></div>
              {RECOMMENDATIONS.slice(0,2).map((r,i) => (
                <div key={i} className={`demo-rp-rec border-${r.priority==='critical'?'red':r.priority==='high'?'orange':'yellow'}`}>
                  <div className="demo-rec-top"><span className={`demo-rec-priority ${r.priority}`}>{r.priority}</span></div>
                  <p className="demo-rp-rec-text">{r.action.slice(0,60)}...</p>
                  <div className="demo-rec-metrics compact"><span className="demo-rec-savings">{r.savings} saved</span><span className="demo-rec-ships">{r.shipments} ships</span></div>
                </div>
              ))}
            </div>
            <div className="demo-rp-footer">
              <span><kbd>⌘K</kbd> Search</span>
              <span><kbd>1-8</kbd> Nav</span>
              <span><kbd>?</kbd> Help</span>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export default Demo
