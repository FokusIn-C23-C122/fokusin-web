import React, { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import 'chartjs-plugin-datalabels';

import Layout from '../components/Layout';
import styles from './analysis.module.css';

Chart.register(ArcElement);

const MyChart = () => {
    const jsonData = [
        {
            "date": "2023-06-04",
            "time": "12:00:00",
            "description": "Studying for Finals",
            "session_length": "03:00:00",
            "focus_length": "00:30:00",
            "focus_percentage": 17
        }
    ];

    const focusPercentages = jsonData.map((item) => parseInt(item.focus_percentage));
    const distractedPercentages = focusPercentages.map((percentage) => 100 - percentage);

    const chartData = {
        labels: ['Focus Percentage', 'Distracted Percentage'],
        datasets: [
            {
                data: [focusPercentages[0], distractedPercentages[0]],
                backgroundColor: ['#f1e3a8', '#50471a'],
                hoverBackgroundColor: ['#FFF7D6', '#7C6F2D'],
                borderRadius: 10,
                spacing: 10,
                rotation: -90,
            },
        ],
    };

    const chartOptions = {
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
        <div>
            <h2 className={styles.titleOne}>Here is your learning progress report</h2>
            <div className={styles.firstSquare}></div>
            <div className={styles.secondSquare}></div>
            <div className={styles.firstLine}></div>
            <div className={styles.secondLine}></div>
            <h2 className={styles.focused}>Focused</h2>
            <h2 className={styles.distracted}>Distracted</h2>
            <div className={styles.circle}></div>
            <div className={styles.chartContainer}>
                <Doughnut data={chartData} options={chartOptions} ref={chartRef} />
            </div>
            <h1 className={styles.hours}>5</h1>
            <p className={styles.desc}>Hours of Studying</p>
        </div>
    );
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

const Analysis = () => {
    return (
        <ErrorBoundary>
            <Layout />
            <MyChart />
        </ErrorBoundary>
    );
};

export default Analysis;
