import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import * as dataService from '../../services/dataService';

export default function BurnoutWarning({ alert }) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = async () => {
    try {
      await dataService.acknowledgeBurnoutAlert(alert.id);
      setDismissed(true);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  if (dismissed) return null;

  const severityColors = {
    high: 'bg-red-50 border-red-300',
    medium: 'bg-orange-50 border-orange-300',
    low: 'bg-yellow-50 border-yellow-300',
  };

  const severityIcons = {
    high: <AlertTriangle className="text-red-600" size={24} />,
    medium: <AlertTriangle className="text-orange-600" size={24} />,
    low: <AlertTriangle className="text-yellow-600" size={24} />,
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg ${severityColors[alert.severity || 'medium']} mb-6 flex justify-between items-start`}>
      <div className="flex gap-4">
        {severityIcons[alert.severity || 'medium']}
        <div>
          <h3 className="font-bold text-gray-800 mb-2">
            {alert.severity === 'high'
              ? '🚨 High Burnout Risk Detected'
              : alert.severity === 'medium'
              ? '⚠️ Moderate Burnout Risk'
              : '💭 Burnout Alert'}
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            We've noticed a concerning trend in your activity. Consider taking breaks and prioritizing self-care.
          </p>
          {alert.metrics && (
            <ul className="text-xs text-gray-600 space-y-1">
              <li>📊 Task Completion: {Math.round(alert.metrics.completionRate || 0)}%</li>
              <li>📚 Study Hours: {Math.round((alert.metrics.totalStudyHours || 0) * 10) / 10}h</li>
              <li>😊 Avg Mood: {Math.round((alert.metrics.avgMood || 0) * 10) / 10}/5</li>
            </ul>
          )}
        </div>
      </div>
      <button
        onClick={handleDismiss}
        className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition"
      >
        <X size={20} className="text-gray-600" />
      </button>
    </div>
  );
}
