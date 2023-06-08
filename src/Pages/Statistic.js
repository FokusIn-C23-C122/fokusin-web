import React, { useRef, useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import Layout from '../components/Layout';
import styles from './statistic.module.css';

Chart.register(...registerables);

const Statistic = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');

    const CHART_FILL = useMemo(
        () => [
            {
                date: "2023-04-28",
                time: "12:00:00",
                description: "Studying for Finals",
                session_length: "03:00:00",
                focus_length: "02:45:00",
                focus_percentage: 92,
            },
            {
                date: "2023-05-20",
                time: "12:30:00",
                description: "Studying for Finals",
                session_length: "03:00:00",
                focus_length: "01:10:00",
                focus_percentage: 39,
            },
            {
                date: "2023-05-31",
                time: "14:00:00",
                description: "Studying for Finals",
                session_length: "03:00:00",
                focus_length: "02:30:00",
                focus_percentage: 83,
            },
            {
                date: "2023-05-30",
                time: "22:00:00",
                description: "Studying for Finals",
                session_length: "03:00:00",
                focus_length: "00:55:00",
                focus_percentage: 30,
            },
            {
                date: "2023-06-04",
                time: "11:00:00",
                description: "Studying for Finals",
                session_length: "03:00:00",
                focus_length: "00:30:00",
                focus_percentage: 17,
            },
        ],
        []
    );

    const [filteredRows, setFilteredRows] = useState(CHART_FILL);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);

        if (filter === 'All') {
            setFilteredRows(CHART_FILL);
        } else if (filter === 'LastDay') {
            const lastDay = new Date();
            lastDay.setDate(lastDay.getDate() - 1);
            const filtered = CHART_FILL.filter((row) => {
                const rowDate = new Date(row.date);
                return rowDate.toDateString() === lastDay.toDateString();
            });
            setFilteredRows(filtered);
        } else if (filter === 'LastWeek') {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            const filtered = CHART_FILL.filter((row) => {
                const rowDate = new Date(row.date);
                return rowDate >= lastWeek;
            });
            setFilteredRows(filtered);
        } else if (filter === 'LastMonth') {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            const filtered = CHART_FILL.filter((row) => {
                const rowDate = new Date(row.date);
                return rowDate >= lastMonth;
            });
            setFilteredRows(filtered);
        }
    };

    const focusPercentages = filteredRows?.map(item => parseInt(item.focus_percentage));

    const chartData = {
        labels: filteredRows.map((item) => {
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
    };

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
                    <Line data={chartData} options={chartOptions} ref={chartRef} />
                </div>
            </div>
        </>
    );
};

export default Statistic;
