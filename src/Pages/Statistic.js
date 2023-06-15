import React, { useRef, useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import Layout from '../components/Layout';
import styles from './statistic.module.css';
import { API_URL } from '../constants/Api';

Chart.register(...registerables);

const Statistic = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [chartData, setChartData] = useState([]);
    const [filteredChartData, setFilteredChartData] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState('');

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/analysis/`);
                const data = await response.json();
                setChartData(data);
                setFilteredChartData(data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchChartData();
    }, []);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        let filtered = [];

        if (filter === 'All') {
            filtered = chartData;
        } else if (filter === 'LastDay') {
            const lastDay = new Date();
            lastDay.setDate(lastDay.getDate() - 1);
            filtered = chartData.filter((row) => {
                const rowDate = new Date(row.date);
                return rowDate.toDateString() === lastDay.toDateString();
            });
        } else if (filter === 'LastWeek') {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            filtered = chartData.filter((row) => {
                const rowDate = new Date(row.date);
                return rowDate >= lastWeek;
            });
        } else if (filter === 'LastMonth') {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            filtered = chartData.filter((row) => {
                const rowDate = new Date(row.date);
                return rowDate >= lastMonth;
            });
        }

        setFilteredChartData(filtered);
        setNoDataMessage(filtered.length === 0 ? 'No data available.' : '');
    };

    const focusPercentages = filteredChartData.map((item) => parseInt(item.focus_percentage));

    const chartOptions = {
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const data = context.dataset.data[context.dataIndex];
                        return `${data}%`;
                    },
                },
            },
        },
    };

    const chartRef = useRef(null);

    return (
        <>
            <Layout />
            <div>
                <h2 className={styles.titleOne}>Here is your learning progress report</h2>
                <div className={`${styles.filter} flex justify-end p-4`}>
                    <select
                        className="px-2 py-1 border border-brown-300 rounded-md"
                        value={selectedFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="LastDay">Last Day</option>
                        <option value="LastWeek">Last Week</option>
                        <option value="LastMonth">Last Month</option>
                    </select>
                </div>
                <div className={styles.chartContainer}>
                    {filteredChartData.length === 0 ? (
                        <p>{noDataMessage}</p>
                    ) : (
                        <Line data={{
                            labels: filteredChartData.map((item) => {
                                const date = new Date(item.date);
                                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                                return date.toLocaleDateString('en-US', options);
                            }),
                            datasets: [
                                {
                                    label: 'Focus',
                                    data: focusPercentages,
                                    backgroundColor: 'rgba(245, 222, 214, 1)',
                                    borderColor: 'rgba(83, 67, 62, 1)',
                                    borderWidth: 2,
                                },
                            ],
                        }}
                            options={chartOptions}
                            ref={chartRef}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Statistic;
