import React, { useRef, useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import 'chartjs-plugin-datalabels';

import Layout from '../components/Layout';
import styles from './analysis.module.css';
import { API_URL } from '../constants/Api';

Chart.register(ArcElement);

const MyChart = () => {
    const [totalFocus, setTotalFocus] = useState(0);
    const [totalDistract, setTotalDistract] = useState(0);
    const [chartFill, setChartFill] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/analysis/`);
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    const latestData = data[data.length - 1];
                    setChartFill([latestData]);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const totalFocus = chartFill.reduce((acc, row) => {
            const focusParts = row.focus_length;
            const focusTimeInSeconds = focusParts;
            return acc + focusTimeInSeconds;
        }, 0);

        const totalDistract = chartFill.reduce((acc, row) => {
            const sessionParts = row.session_length;
            const focusParts = row.focus_length;
            const distractTimeInSeconds = sessionParts - focusParts;
            return acc + distractTimeInSeconds;
        }, 0);

        const roundedTotalFocus = Math.round((totalFocus / 3600) * 10) / 10;
        const roundedTotalDistract = Math.round((totalDistract / 3600) * 10) / 10;

        setTotalFocus(roundedTotalFocus);
        setTotalDistract(roundedTotalDistract);
    }, [chartFill]);

    const focusPercentages = chartFill.map((item) => parseInt(item.focus_percentage));
    const distractedPercentages = focusPercentages.map((percentage) => 100 - percentage);

    const chartData = {
        labels: ['Focused', 'Distracted'],
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
            <div className={styles.firstSquare}>
                <div className={styles.firstLine}></div>
                <h2 className={styles.distracted}>Distracted</h2>
                <p className={styles.totalHours}>{totalDistract}</p>
                <p className={styles.distractHours}> hours</p>
            </div>
            <div className={styles.secondSquare}>
                <div className={styles.secondLine}></div>
                <h2 className={styles.focused}>Focused</h2>
                <p className={styles.totalHours}>{totalFocus}</p>
                <p className={styles.focusHours}> hours</p>
            </div>
            <div className={styles.circle}></div>
            <div className={styles.chartContainer}>
                <Doughnut data={chartData} options={chartOptions} ref={chartRef} />
            </div>
            <h1 className={styles.hours}>{totalFocus + totalDistract}</h1>
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
