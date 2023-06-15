import React, { useRef, useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import 'chartjs-plugin-datalabels';

import Layout from '../components/Layout';
import styles from './analysis.module.css';
import { API_URL } from '../constants/Api';
import { getCookie } from '../constants/cookies';

Chart.register(ArcElement);

const MyChart = () => {
    const [totalFocus, setTotalFocus] = useState(0);
    const [totalDistract, setTotalDistract] = useState(0);
    const [totalSession, setTotalSession] = useState(0);
    const [chartFill, setChartFill] = useState([]);

    const formatDuration = (durationInSeconds) => {
        const hours = Math.round(durationInSeconds / 3600);
        const minutes = Math.round((durationInSeconds % 3600) / 60);
        const seconds = Math.round(durationInSeconds);

        let timeText = '';
        if (hours > 0) {
            timeText = `${hours} Hour${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            timeText = `${minutes} Minute${minutes > 1 ? 's' : ''}`;
        } else if (seconds > 0) {
            timeText = `${(seconds / 60).toFixed(1)} Minute`;
        }
        else {
            timeText = `${seconds} Second${seconds !== 1 ? 's' : ''}`;
        }

        return timeText;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/analysis/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': getCookie("access"),
                    },
                });
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
        const totalSession = chartFill.reduce((acc, row) => {
            const sessionTimeInSeconds = row.session_length;
            return acc + sessionTimeInSeconds;
        }, 0);

        const totalFocus = chartFill.reduce((acc, row) => {
            const focusTimeInSeconds = row.focus_length;
            return acc + focusTimeInSeconds;
        }, 0);

        const totalDistract = chartFill.reduce((acc, row) => {
            const sessionTimeInSeconds = row.session_length;
            const focusTimeInSeconds = row.focus_length;
            const distractTimeInSeconds = sessionTimeInSeconds - focusTimeInSeconds;
            return acc + distractTimeInSeconds;
        }, 0);

        const roundedTotalSession = Math.round(totalSession);
        const roundedTotalFocus = Math.round(totalFocus);
        const roundedTotalDistract = Math.round(totalDistract);

        setTotalSession(roundedTotalSession);
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
        <div className={styles.container}>
            <h2 className={styles.titleOne}>Here is your learning progress report</h2>
            <div className={styles.firstSquare}>
                <div className={styles.firstLine}></div>
                <h2 className={styles.distracted}>Distracted</h2>
                <p className={styles.distractHours}>{formatDuration(totalDistract)}</p>
            </div>
            <div className={styles.secondSquare}>
                <div className={styles.secondLine}></div>
                <h2 className={styles.focused}>Focused</h2>
                <p className={styles.focusHours}>{formatDuration(totalFocus)}</p>
            </div>
            <div className={styles.chartContainer}>
            <div className={styles.circle}></div>
                <Doughnut data={chartData} options={chartOptions} ref={chartRef} />
            </div>
            <p className={styles.desc}>{`${formatDuration(totalSession)} of Studying`}</p>
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
