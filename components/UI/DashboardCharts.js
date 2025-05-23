import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import styles from './DashboardCharts.module.css';

const COLORS = ['#2196f3', '#4caf50', '#ff9800'];

const DashboardCharts = ({ inventoryData, valueDistribution }) => {
  // Custom styles for charts in dark mode
  const darkThemeProps = {
    style: {
      color: '#ffffff'
    }
  };

  const tooltipStyle = {
    backgroundColor: '#2a2a2a',
    border: 'none',
    borderRadius: '4px',
    color: '#ffffff',
    boxShadow: '0 3px 8px rgba(0,0,0,0.3)'
  };

  const CustomTooltip = ({ active, payload, label, formatter }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div style={tooltipStyle}>
          <p style={{ margin: '0 0 5px', fontWeight: 'bold', padding: '8px 10px' }}>{`${label || data.name}`}</p>
          <p style={{ margin: 0, padding: '0 10px 8px' }}>
            {formatter ? formatter(data.value) : `${data.value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartsGrid}>
      {/* Value Distribution Chart */}
      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Value Distribution</h2>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={valueDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {valueDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip formatter={(value) => `₹${value.toLocaleString()}`} />} />
              <Legend {...darkThemeProps} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Count Chart */}
      <div className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Inventory by Category</h2>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={inventoryData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
              <XAxis dataKey="name" tick={darkThemeProps} stroke="#8c8c8c" />
              <YAxis tick={darkThemeProps} stroke="#8c8c8c" />
              <Tooltip content={<CustomTooltip />} />
              <Legend {...darkThemeProps} />
              <Bar dataKey="count" fill="#8884d8" name="Count" />
              <Bar dataKey="value" fill="#82ca9d" name="Value (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts; 