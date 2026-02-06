import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { IconLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
import { useState, useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const INITIAL_VIEW_STATE = {
  longitude: -87.75,
  latitude: 41.80,
  zoom: 10.2,
  pitch: 50,
  bearing: -20
};

// Simplified logistics nodes for demo
const DEMO_NODES = [
  {
    id: 'hq',
    name: 'Conagra Brands HQ',
    type: 'headquarters',
    coordinates: [-87.6359, 41.8886],
    status: 'Operational',
    color: [106, 115, 72],
    label: 'HQ'
  },
  {
    id: 'port',
    name: 'Port of Chicago',
    type: 'port',
    coordinates: [-87.5380, 41.7290],
    status: 'Backlog Detected',
    color: [89, 50, 72],
    label: 'PORT'
  },
  {
    id: 'ohare',
    name: "O'Hare Cargo Terminal",
    type: 'airport',
    coordinates: [-87.9073, 41.9742],
    status: 'Operational',
    color: [106, 115, 72],
    label: 'AIR'
  },
  {
    id: 'dc',
    name: 'Cold Storage DC',
    type: 'warehouse',
    coordinates: [-87.8020, 41.7650],
    status: 'Near Capacity (91%)',
    color: [200, 160, 60],
    label: 'DC'
  },
  {
    id: 'joliet',
    name: 'Joliet 3PL Storage',
    type: 'warehouse',
    coordinates: [-88.0817, 41.5250],
    status: 'Available (58%)',
    color: [106, 115, 72],
    label: '3PL'
  },
  {
    id: 'jewel',
    name: 'Jewel-Osco Lincoln Park',
    type: 'retail',
    coordinates: [-87.6534, 41.9210],
    status: 'Demand Surge',
    color: [89, 50, 72],
    label: 'R'
  },
  {
    id: 'costco',
    name: 'Costco Lincoln Park',
    type: 'retail',
    coordinates: [-87.6620, 41.9195],
    status: 'Operational',
    color: [106, 115, 72],
    label: 'R'
  },
  {
    id: 'walmart',
    name: 'Walmart Cicero',
    type: 'retail',
    coordinates: [-87.7570, 41.8450],
    status: 'Low Stock',
    color: [89, 50, 72],
    label: 'R'
  },
  {
    id: 'target',
    name: 'Target South Loop',
    type: 'retail',
    coordinates: [-87.6270, 41.8568],
    status: 'Operational',
    color: [106, 115, 72],
    label: 'R'
  },
  {
    id: 'meijer',
    name: 'Meijer Melrose Park',
    type: 'retail',
    coordinates: [-87.8650, 41.9010],
    status: 'Operational',
    color: [106, 115, 72],
    label: 'R'
  },
  {
    id: 'aldi',
    name: 'ALDI Pilsen',
    type: 'retail',
    coordinates: [-87.6580, 41.8530],
    status: 'Operational',
    color: [106, 115, 72],
    label: 'R'
  }
];

// Hardcoded route paths (simulating road routes with waypoints)
const DEMO_ROUTES = [
  {
    id: 'ship-lane',
    name: 'Great Lakes Shipping Lane',
    type: 'ship',
    path: [
      [-86.5, 42.5], [-86.8, 42.35], [-87.0, 42.2],
      [-87.2, 42.05], [-87.35, 41.9], [-87.45, 41.8],
      [-87.5380, 41.7290]
    ],
    color: [89, 50, 72, 200]
  },
  {
    id: 'port-to-dc',
    name: 'Port to Cold Storage DC',
    type: 'truck',
    path: [
      [-87.5380, 41.7290], [-87.5600, 41.7350], [-87.5900, 41.7400],
      [-87.6200, 41.7350], [-87.6500, 41.7300], [-87.6800, 41.7350],
      [-87.7100, 41.7400], [-87.7400, 41.7500], [-87.7700, 41.7550],
      [-87.8020, 41.7650]
    ],
    color: [160, 160, 160, 220]
  },
  {
    id: 'ohare-to-dc',
    name: "O'Hare to Cold Storage DC",
    type: 'truck',
    path: [
      [-87.9073, 41.9742], [-87.9100, 41.9500], [-87.9050, 41.9200],
      [-87.8950, 41.8900], [-87.8800, 41.8600], [-87.8600, 41.8300],
      [-87.8400, 41.8000], [-87.8200, 41.7800], [-87.8020, 41.7650]
    ],
    color: [89, 50, 72, 200]
  },
  {
    id: 'dc-to-joliet',
    name: 'DC to Joliet 3PL',
    type: 'truck',
    path: [
      [-87.8020, 41.7650], [-87.8200, 41.7500], [-87.8500, 41.7300],
      [-87.8800, 41.7000], [-87.9100, 41.6700], [-87.9500, 41.6400],
      [-87.9900, 41.6000], [-88.0300, 41.5700], [-88.0600, 41.5450],
      [-88.0817, 41.5250]
    ],
    color: [106, 115, 72, 180]
  },
  {
    id: 'dc-to-jewel',
    name: 'DC to Jewel-Osco',
    type: 'delivery',
    path: [
      [-87.8020, 41.7650], [-87.7800, 41.7800], [-87.7500, 41.8000],
      [-87.7200, 41.8200], [-87.7000, 41.8500], [-87.6800, 41.8700],
      [-87.6650, 41.8900], [-87.6534, 41.9210]
    ],
    color: [106, 115, 72, 200]
  },
  {
    id: 'dc-to-costco',
    name: 'DC to Costco',
    type: 'delivery',
    path: [
      [-87.8020, 41.7650], [-87.7800, 41.7850], [-87.7500, 41.8050],
      [-87.7200, 41.8300], [-87.7000, 41.8550], [-87.6800, 41.8800],
      [-87.6700, 41.9000], [-87.6620, 41.9195]
    ],
    color: [106, 115, 72, 200]
  },
  {
    id: 'dc-to-walmart',
    name: 'DC to Walmart Cicero',
    type: 'delivery',
    path: [
      [-87.8020, 41.7650], [-87.7950, 41.7800], [-87.7850, 41.7950],
      [-87.7750, 41.8100], [-87.7700, 41.8250], [-87.7600, 41.8350],
      [-87.7570, 41.8450]
    ],
    color: [106, 115, 72, 200]
  },
  {
    id: 'dc-to-target',
    name: 'DC to Target South Loop',
    type: 'delivery',
    path: [
      [-87.8020, 41.7650], [-87.7700, 41.7750], [-87.7400, 41.7850],
      [-87.7100, 41.8000], [-87.6800, 41.8150], [-87.6550, 41.8300],
      [-87.6370, 41.8450], [-87.6270, 41.8568]
    ],
    color: [106, 115, 72, 200]
  },
  {
    id: 'dc-to-meijer',
    name: 'DC to Meijer Melrose',
    type: 'delivery',
    path: [
      [-87.8020, 41.7650], [-87.8100, 41.7850], [-87.8200, 41.8050],
      [-87.8300, 41.8250], [-87.8400, 41.8450], [-87.8500, 41.8650],
      [-87.8550, 41.8850], [-87.8650, 41.9010]
    ],
    color: [106, 115, 72, 200]
  },
  {
    id: 'dc-to-aldi',
    name: 'DC to ALDI Pilsen',
    type: 'delivery',
    path: [
      [-87.8020, 41.7650], [-87.7800, 41.7750], [-87.7500, 41.7900],
      [-87.7200, 41.8050], [-87.6950, 41.8200], [-87.6750, 41.8350],
      [-87.6650, 41.8450], [-87.6580, 41.8530]
    ],
    color: [106, 115, 72, 200]
  }
];

// Traffic incidents
const DEMO_INCIDENTS = [
  {
    id: 'i94',
    coordinates: [-87.5860, 41.7500],
    severity: 'high',
    label: '!'
  },
  {
    id: 'i55',
    coordinates: [-88.0400, 41.5500],
    severity: 'medium',
    label: '!'
  }
];

// Pre-compute icon objects once at module level so they're stable across renders
const NODE_ICONS = Object.fromEntries(DEMO_NODES.map(d => {
  const [r, g, b] = d.color;
  const size = d.type === 'retail' ? 36 : 48;
  const fontSize = d.type === 'retail' ? 11 : 13;
  return [d.id, {
    url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-${d.id}">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 3}" fill="rgb(${r},${g},${b})" stroke="#fff" stroke-width="1.5" filter="url(#glow-${d.id})" opacity="0.95"/>
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 8}" fill="rgba(7,7,13,0.75)"/>
        <text x="${size/2}" y="${size/2 + 4}" text-anchor="middle" font-size="${fontSize}" font-weight="700" fill="#fff" font-family="system-ui">${d.label}</text>
      </svg>
    `),
    width: size,
    height: size,
    anchorY: size / 2
  }];
}));

const INCIDENT_ICONS = Object.fromEntries(DEMO_INCIDENTS.map(d => {
  const color = d.severity === 'high' ? '#ef4444' : '#f59e0b';
  return [d.id, {
    url: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="13" fill="${color}" stroke="#fff" stroke-width="2" opacity="0.9"/>
        <text x="16" y="21" text-anchor="middle" font-size="16" font-weight="bold" fill="#fff">!</text>
      </svg>
    `),
    width: 32,
    height: 32,
    anchorY: 16
  }];
}));

// Pre-compute expanded trips data (stable reference)
const TRIPS_DATA = DEMO_ROUTES.flatMap(route =>
  Array.from({ length: 6 }, (_, i) => ({
    ...route,
    timeOffset: (5000 / 6) * i
  }))
);

function DemoMap() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [tripsTime, setTripsTime] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const animationRef = useRef(null);
  const bearingRef = useRef(INITIAL_VIEW_STATE.bearing);

  const loopLength = 5000;
  const tripsPerRoute = 6;

  // Animation loop for TripsLayer + slow camera rotation
  useEffect(() => {
    const animationSpeed = 0.5;
    const rotationSpeed = 0.008;

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
    // Animated route trails
    new TripsLayer({
      id: 'demo-routes',
      data: TRIPS_DATA,
      getPath: d => d.path,
      getTimestamps: d => d.path.map((_, i) =>
        d.timeOffset + i * (loopLength / tripsPerRoute / (d.path.length - 1 || 1))
      ),
      getColor: d => d.color,
      currentTime: tripsTime,
      trailLength: 180,
      fadeTrail: true,
      widthMinPixels: 3,
      capRounded: true,
      jointRounded: true
    }),

    // Traffic incident markers
    new IconLayer({
      id: 'demo-incidents',
      data: DEMO_INCIDENTS,
      getPosition: d => d.coordinates,
      getIcon: d => INCIDENT_ICONS[d.id],
      getSize: 32,
      sizeScale: 1
    }),

    // Logistics node markers
    new IconLayer({
      id: 'demo-nodes',
      data: DEMO_NODES,
      getPosition: d => d.coordinates,
      getIcon: d => NODE_ICONS[d.id],
      getSize: d => d.type === 'retail' ? 36 : 48,
      sizeScale: 1,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 255, 100],
      onClick: info => {
        if (info.object) {
          setSelectedNode(prev => prev?.id === info.object.id ? null : info.object);
        }
      }
    })
  ];

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

      {/* Click-to-expand node info panel */}
      {selectedNode && (
        <div
          className="demo-map-node-info"
          style={{ borderLeftColor: `rgb(${selectedNode.color.join(',')})` }}
        >
          <div className="demo-map-node-info-header">
            <strong style={{ color: `rgb(${selectedNode.color.join(',')})` }}>
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
            {selectedNode.type.toUpperCase()}
          </span>
          <span className="demo-map-node-info-status">
            {selectedNode.status}
          </span>
        </div>
      )}

      {/* Overlay: Live indicator */}
      <div className="demo-map-live-badge">
        <span className="demo-map-live-dot" />
        LIVE DEMO
      </div>

      {/* Overlay: Legend */}
      <div className="demo-map-legend">
        <div className="demo-map-legend-title">Supply Chain Network</div>
        <div className="demo-map-legend-item">
          <span className="demo-map-legend-color" style={{ background: '#6A7348' }} />
          <span>Operational</span>
        </div>
        <div className="demo-map-legend-item">
          <span className="demo-map-legend-color" style={{ background: '#593248' }} />
          <span>Alert / Disruption</span>
        </div>
        <div className="demo-map-legend-item">
          <span className="demo-map-legend-color" style={{ background: '#C8A03C' }} />
          <span>Near Capacity</span>
        </div>
        <div className="demo-map-legend-item">
          <span className="demo-map-legend-line" />
          <span>Animated Routes</span>
        </div>
      </div>

      {/* Overlay: Stats */}
      <div className="demo-map-stats">
        <div className="demo-map-stat">
          <span className="demo-map-stat-value">11</span>
          <span className="demo-map-stat-label">Active Nodes</span>
        </div>
        <div className="demo-map-stat">
          <span className="demo-map-stat-value">10</span>
          <span className="demo-map-stat-label">Routes Tracked</span>
        </div>
        <div className="demo-map-stat">
          <span className="demo-map-stat-value">2</span>
          <span className="demo-map-stat-label">Incidents</span>
        </div>
      </div>

      {/* Gradient overlays for blending into page */}
      <div className="demo-map-fade-bottom" />
    </div>
  );
}

export default DemoMap;
