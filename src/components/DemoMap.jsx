import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { IconLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import { useState, useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// Continental US view
const INITIAL_VIEW_STATE = {
  longitude: -97.5,
  latitude: 39.0,
  zoom: 3.8,
  pitch: 35,
  bearing: 0
};

// Status colors matching polynode_comp design tokens
const STATUS_COLORS = {
  healthy:  [0, 200, 83],   // #00C853
  stress:   [255, 215, 64],  // #FFD740
  failing:  [255, 82, 82],   // #FF5252
  warning:  [255, 171, 64],  // #FFAB40
  offline:  [92, 97, 107],   // #5C616B
};

// Real supply chain nodes from polynode_comp/app/src/lib/realData.ts
const DEMO_NODES = [
  // Major US Ports
  { id: 'port_la_lb', name: 'Port of LA / Long Beach', type: 'distribution_center', coordinates: [-118.26, 33.74], status: 'failing', label: 'PORT' },
  { id: 'port_ny_nj', name: 'Port of New York / New Jersey', type: 'distribution_center', coordinates: [-74.14, 40.67], status: 'healthy', label: 'PORT' },
  { id: 'port_houston', name: 'Port of Houston', type: 'distribution_center', coordinates: [-95.01, 29.73], status: 'stress', label: 'PORT' },
  { id: 'port_savannah', name: 'Port of Savannah', type: 'distribution_center', coordinates: [-81.09, 32.08], status: 'healthy', label: 'PORT' },
  { id: 'port_seattle', name: 'Port of Seattle / Tacoma', type: 'distribution_center', coordinates: [-122.34, 47.27], status: 'healthy', label: 'PORT' },
  { id: 'port_charleston', name: 'Port of Charleston', type: 'distribution_center', coordinates: [-79.93, 32.78], status: 'healthy', label: 'PORT' },
  { id: 'port_nola', name: 'Port of New Orleans', type: 'distribution_center', coordinates: [-90.06, 29.94], status: 'warning', label: 'PORT' },

  // Cargo Airports
  { id: 'airport_memphis', name: 'Memphis FedEx Hub', type: 'distribution_center', coordinates: [-89.98, 35.04], status: 'healthy', label: 'AIR' },
  { id: 'airport_louisville', name: 'Louisville UPS Worldport', type: 'distribution_center', coordinates: [-85.74, 38.17], status: 'healthy', label: 'AIR' },
  { id: 'airport_chicago', name: "O'Hare Cargo Terminal", type: 'distribution_center', coordinates: [-87.91, 41.97], status: 'healthy', label: 'AIR' },

  // Manufacturing
  { id: 'mfg_tesla', name: 'Tesla Factory - Fremont', type: 'processing_plant', coordinates: [-121.94, 37.49], status: 'stress', label: 'MFG' },
  { id: 'mfg_boeing', name: 'Boeing - Everett', type: 'processing_plant', coordinates: [-122.27, 47.92], status: 'healthy', label: 'MFG' },
  { id: 'mfg_toyota', name: 'Toyota - Georgetown', type: 'processing_plant', coordinates: [-84.56, 38.21], status: 'healthy', label: 'MFG' },
  { id: 'mfg_intel', name: 'Intel Fab - Chandler', type: 'processing_plant', coordinates: [-111.86, 33.23], status: 'healthy', label: 'MFG' },
  { id: 'mfg_tyson', name: 'Tyson Foods - Springdale', type: 'processing_plant', coordinates: [-94.13, 36.19], status: 'healthy', label: 'MFG' },

  // Distribution Centers
  { id: 'dc_amazon', name: 'Amazon Fulfillment - Ontario, CA', type: 'distribution_center', coordinates: [-117.60, 34.05], status: 'healthy', label: 'DC' },
  { id: 'dc_walmart', name: 'Walmart Distribution - Bentonville', type: 'distribution_center', coordinates: [-94.21, 36.37], status: 'healthy', label: 'DC' },
  { id: 'dc_ups', name: 'UPS CACH - Hodgkins, IL', type: 'distribution_center', coordinates: [-87.86, 41.77], status: 'healthy', label: 'DC' },
  { id: 'dc_target', name: 'Target DC - Dallas/Fort Worth', type: 'distribution_center', coordinates: [-97.14, 32.66], status: 'failing', label: 'DC' },
  { id: 'dc_sysco', name: 'Sysco Distribution - Houston', type: 'distribution_center', coordinates: [-95.65, 29.84], status: 'stress', label: 'DC' },

  // Intermodal & Rail
  { id: 'imt_chicago', name: 'BNSF Logistics Park - Joliet', type: 'intermodal_terminal', coordinates: [-88.15, 41.52], status: 'healthy', label: 'IMT' },
  { id: 'imt_la', name: 'ICTF - Los Angeles', type: 'intermodal_terminal', coordinates: [-118.24, 33.81], status: 'stress', label: 'IMT' },
  { id: 'ry_bailey', name: 'Bailey Yard (UP) - North Platte', type: 'rail_yard', coordinates: [-100.77, 41.12], status: 'healthy', label: 'RAIL' },

  // Inland Ports & Corridors
  { id: 'ip_dallas', name: 'Inland Port Dallas-Fort Worth', type: 'inland_port', coordinates: [-96.97, 32.72], status: 'healthy', label: 'IP' },
  { id: 'ip_kc', name: 'Kansas City SmartPort', type: 'inland_port', coordinates: [-94.58, 39.10], status: 'healthy', label: 'IP' },

  // Warehouses
  { id: 'wh_edison', name: 'Edison/Cranbury Corridor - NJ', type: 'warehouse', coordinates: [-74.37, 40.50], status: 'healthy', label: 'WH' },
  { id: 'wh_elwood', name: 'CenterPoint Intermodal - Elwood, IL', type: 'warehouse', coordinates: [-88.11, 41.40], status: 'healthy', label: 'WH' },
];

// Color accessor
function getNodeColor(node) {
  return STATUS_COLORS[node.status] || STATUS_COLORS.healthy;
}

// Animated freight routes across the US (matching real corridors)
const DEMO_ROUTES = [
  // BNSF Transcon: Port LA → ICTF → Barstow → Gallup → Amarillo → OKC → Galesburg → Chicago
  {
    id: 'bnsf_transcon',
    name: 'BNSF Transcon (LA → Chicago)',
    path: [
      [-118.26, 33.74], [-118.24, 33.81], [-117.02, 34.90],
      [-115.50, 35.20], [-111.50, 35.50], [-108.74, 35.53],
      [-105.94, 35.69], [-101.83, 35.20], [-97.52, 35.47],
      [-95.95, 36.15], [-93.60, 37.08], [-90.37, 40.95],
      [-88.15, 41.52]
    ],
    color: [0, 200, 83, 180]
  },
  // I-95 Northeast Corridor: Savannah → Charleston → Norfolk → NJ → NY
  {
    id: 'i95_ne',
    name: 'I-95 NE Corridor (Savannah → NY/NJ)',
    path: [
      [-81.09, 32.08], [-79.93, 32.78], [-78.90, 33.69],
      [-77.94, 34.23], [-76.29, 36.85], [-75.52, 38.90],
      [-74.80, 40.10], [-74.37, 40.50], [-74.14, 40.67]
    ],
    color: [0, 200, 83, 180]
  },
  // Gulf Coast: Port Houston → New Orleans → I-10 → Port of Savannah (via I-16)
  {
    id: 'gulf_corridor',
    name: 'Gulf Coast Corridor',
    path: [
      [-95.01, 29.73], [-93.50, 30.10], [-91.15, 30.30],
      [-90.06, 29.94], [-88.50, 30.40], [-87.50, 30.60],
      [-85.50, 30.80], [-84.00, 31.20], [-82.50, 31.60],
      [-81.09, 32.08]
    ],
    color: [255, 171, 64, 180]
  },
  // I-35 NAFTA: Dallas → OKC → Kansas City
  {
    id: 'i35_nafta',
    name: 'I-35 NAFTA (Dallas → KC)',
    path: [
      [-97.14, 32.66], [-96.97, 32.72], [-97.15, 33.50],
      [-97.32, 34.50], [-97.52, 35.47], [-97.30, 36.70],
      [-96.50, 37.70], [-95.50, 38.40], [-94.58, 39.10]
    ],
    color: [255, 82, 82, 160]
  },
  // Pacific Northwest: Seattle → Portland → Bay Area
  {
    id: 'pnw_i5',
    name: 'I-5 Pacific Coast',
    path: [
      [-122.34, 47.27], [-122.27, 47.92], [-122.68, 45.52],
      [-122.40, 43.20], [-122.00, 41.80], [-121.94, 37.49],
      [-122.30, 37.80], [-121.00, 36.50], [-118.41, 33.94],
      [-118.26, 33.74]
    ],
    color: [0, 200, 83, 160]
  },
  // Midwest Hub: Chicago → Louisville → Memphis
  {
    id: 'midwest_hub',
    name: 'Midwest Distribution',
    path: [
      [-87.86, 41.77], [-87.91, 41.97], [-86.50, 40.50],
      [-85.74, 38.17], [-86.50, 36.80], [-87.50, 36.10],
      [-89.98, 35.04]
    ],
    color: [0, 200, 83, 180]
  },
];

// Pre-compute icon objects
const NODE_ICONS = Object.fromEntries(DEMO_NODES.map(d => {
  const [r, g, b] = getNodeColor(d);
  const isLarge = ['distribution_center', 'intermodal_terminal'].includes(d.type) && d.label === 'PORT';
  const isMedium = ['processing_plant', 'intermodal_terminal', 'rail_yard'].includes(d.type) || d.label === 'AIR';
  const size = isLarge ? 44 : isMedium ? 36 : 30;
  const fontSize = isLarge ? 10 : 8;
  return [d.id, {
    url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="rgb(${r},${g},${b})" opacity="0.25"/>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 6}" fill="rgb(${r},${g},${b})" opacity="0.9"/>
        <text x="${size/2}" y="${size/2 + 3}" text-anchor="middle" font-size="${fontSize}" font-weight="600" fill="#fff" font-family="Inter,system-ui">${d.label}</text>
      </svg>
    `),
    width: size,
    height: size,
    anchorY: size / 2
  }];
}));

// Pre-compute trips data
const TRIPS_DATA = DEMO_ROUTES.flatMap(route =>
  Array.from({ length: 4 }, (_, i) => ({
    ...route,
    timeOffset: (8000 / 4) * i
  }))
);

function DemoMap() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [tripsTime, setTripsTime] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const animationRef = useRef(null);
  const bearingRef = useRef(INITIAL_VIEW_STATE.bearing);

  const loopLength = 8000;

  useEffect(() => {
    const animationSpeed = 0.4;
    const rotationSpeed = 0.005;

    const animate = () => {
      setTripsTime(prev => (prev + animationSpeed) % loopLength);
      bearingRef.current = (bearingRef.current + rotationSpeed) % 360;
      setViewState(prev => ({
        ...prev,
        bearing: bearingRef.current
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleViewStateChange = ({ viewState: newViewState, interactionState }) => {
    if (interactionState?.isDragging || interactionState?.isZooming) {
      bearingRef.current = newViewState.bearing;
    }
    setViewState(newViewState);
  };

  const layers = [
    new TripsLayer({
      id: 'demo-routes',
      data: TRIPS_DATA,
      getPath: d => d.path,
      getTimestamps: d => d.path.map((_, i) =>
        d.timeOffset + i * (loopLength / 4 / (d.path.length - 1 || 1))
      ),
      getColor: d => d.color,
      currentTime: tripsTime,
      trailLength: 300,
      fadeTrail: true,
      widthMinPixels: 2.5,
      capRounded: true,
      jointRounded: true
    }),

    new IconLayer({
      id: 'demo-nodes',
      data: DEMO_NODES,
      getPosition: d => d.coordinates,
      getIcon: d => NODE_ICONS[d.id],
      getSize: d => {
        const isLarge = d.label === 'PORT';
        const isMedium = ['AIR', 'MFG', 'IMT', 'RAIL'].includes(d.label);
        return isLarge ? 44 : isMedium ? 36 : 30;
      },
      sizeScale: 1,
      pickable: true,
      autoHighlight: true,
      highlightColor: [41, 98, 255, 100],
      onClick: info => {
        if (info.object) {
          setSelectedNode(prev => prev?.id === info.object.id ? null : info.object);
        }
      }
    })
  ];

  const selectedColor = selectedNode ? getNodeColor(selectedNode) : [0, 200, 83];

  return (
    <div className="demo-map-container">
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={true}
        layers={layers}
        style={{ width: '100%', height: '100%' }}
        onClick={info => {
          if (!info.object) setSelectedNode(null);
        }}
      >
        <Map reuseMaps mapStyle={MAP_STYLE} />
      </DeckGL>

      {selectedNode && (
        <div
          className="demo-map-node-info"
          style={{ borderLeftColor: `rgb(${selectedColor.join(',')})` }}
        >
          <div className="demo-map-node-info-header">
            <strong style={{ color: `rgb(${selectedColor.join(',')})` }}>
              {selectedNode.name}
            </strong>
            <button
              className="demo-map-node-info-close"
              onClick={() => setSelectedNode(null)}
            >
              &times;
            </button>
          </div>
          <span className="demo-map-node-info-type">
            {selectedNode.type.replace(/_/g, ' ').toUpperCase()}
          </span>
          <span className="demo-map-node-info-status">
            Status: <span style={{ color: `rgb(${selectedColor.join(',')})` }}>{selectedNode.status}</span>
          </span>
        </div>
      )}

      <div className="demo-map-live-badge">
        <span className="demo-map-live-dot" />
        LIVE DEMO
      </div>

      <div className="demo-map-legend">
        <div className="demo-map-legend-title">Node Status</div>
        <div className="demo-map-legend-item">
          <span className="demo-map-legend-color" style={{ background: '#00C853' }} />
          <span>Healthy</span>
        </div>
        <div className="demo-map-legend-item">
          <span className="demo-map-legend-color" style={{ background: '#FFD740' }} />
          <span>Stress</span>
        </div>
        <div className="demo-map-legend-item">
          <span className="demo-map-legend-color" style={{ background: '#FF5252' }} />
          <span>Failing</span>
        </div>
        <div className="demo-map-legend-item">
          <span className="demo-map-legend-color" style={{ background: '#FFAB40' }} />
          <span>Warning</span>
        </div>
        <div className="demo-map-legend-item">
          <span className="demo-map-legend-line" />
          <span>Freight Routes</span>
        </div>
      </div>

      <div className="demo-map-stats">
        <div className="demo-map-stat">
          <span className="demo-map-stat-value">68</span>
          <span className="demo-map-stat-label">Active Nodes</span>
        </div>
        <div className="demo-map-stat">
          <span className="demo-map-stat-value">268</span>
          <span className="demo-map-stat-label">Edges Tracked</span>
        </div>
        <div className="demo-map-stat">
          <span className="demo-map-stat-value" style={{ color: '#FF5252' }}>3</span>
          <span className="demo-map-stat-label">Active Alerts</span>
        </div>
      </div>

      <div className="demo-map-fade-bottom" />
    </div>
  );
}

export default DemoMap;
