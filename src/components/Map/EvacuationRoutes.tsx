import React from 'react';
import { EvacuationRoute } from '../../types/dashboard';

interface EvacuationRoutesProps {
  routes: EvacuationRoute[];
}

export const EvacuationRoutes: React.FC<EvacuationRoutesProps> = ({ routes }) => {
  const getRouteColor = (status: EvacuationRoute['status']) => {
    switch (status) {
      case 'clear': return '#10B981';
      case 'congested': return '#F59E0B';
      case 'blocked': return '#EF4444';
    }
  };

  const getPathString = (path: { x: number; y: number }[]) => {
    return path.reduce((acc, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');
  };

  return (
    <g>
      {routes.map((route, index) => (
        <g key={route.id}>
          <path
            d={getPathString(route.path)}
            stroke={getRouteColor(route.status)}
            strokeWidth="4"
            fill="none"
            strokeDasharray="8,4"
            className="opacity-70"
          />
          {/* Arrow markers */}
          {route.path.slice(1).map((point, pointIndex) => {
            const prevPoint = route.path[pointIndex];
            const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
            return (
              <polygon
                key={pointIndex}
                points={`${point.x},${point.y} ${point.x - 8 * Math.cos(angle - Math.PI/6)},${point.y - 8 * Math.sin(angle - Math.PI/6)} ${point.x - 8 * Math.cos(angle + Math.PI/6)},${point.y - 8 * Math.sin(angle + Math.PI/6)}`}
                fill={getRouteColor(route.status)}
                className="opacity-80"
              />
            );
          })}
          {/* Route label */}
          <text
            x={route.path[Math.floor(route.path.length / 2)].x}
            y={route.path[Math.floor(route.path.length / 2)].y - 10}
            textAnchor="middle"
            className="text-xs fill-white font-medium"
          >
            {route.name}
          </text>
        </g>
      ))}
    </g>
  );
};