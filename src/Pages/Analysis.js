import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import 'chartjs-plugin-datalabels';

import Layout from '../components/Layout';
import styles from './analysis.module.css';

Chart.register(ArcElement);

const MyChart = () => {
    const [totalFocus, setTotalFocus] = useState(0);
    const [totalDistract, setTotalDistract] = useState(0);

    const CHART_FILL = useMemo(
        () => [
            {
                date: "2023-06-04",
                time: "11:00:00",
                description: "Studying for Finals",
                session_length: "03:00:00",
                focus_length: "00:30:00",
                focus_percentage: 17
            },
        ],
        []
    );

    useEffect(() => {
        const totalFocus = CHART_FILL.reduce((acc, row) => {
            const focusParts = row.focus_length.split(':');
            const focusHours = parseInt(focusParts[0]);
            const focusMinutes = parseInt(focusParts[1]);
            const focusSeconds = parseInt(focusParts[2]);
            const focusTimeInSeconds = focusHours * 3600 + focusMinutes * 60 + focusSeconds;
            return acc + focusTimeInSeconds;
        }, 0);

        const totalDistract = CHART_FILL.reduce((acc, row) => {
            const sessionParts = row.session_length.split(':');
            const focusParts = row.focus_length.split(':');
            const sessionHours = parseInt(sessionParts[0]);
            const sessionMinutes = parseInt(sessionParts[1]);
            const sessionSeconds = parseInt(sessionParts[2]);
            const focusHours = parseInt(focusParts[0]);
            const focusMinutes = parseInt(focusParts[1]);
            const focusSeconds = parseInt(focusParts[2]);
            const sessionTimeInSeconds = sessionHours * 3600 + sessionMinutes * 60 + sessionSeconds;
            const focusTimeInSeconds = focusHours * 3600 + focusMinutes * 60 + focusSeconds;
            const distractTimeInSeconds = sessionTimeInSeconds - focusTimeInSeconds;
            return acc + distractTimeInSeconds;
        }, 0);

        const roundedTotalFocus = Math.round((totalFocus / 3600) * 10) / 10;
        const roundedTotalDistract = Math.round((totalDistract / 3600) * 10) / 10;

        setTotalFocus(roundedTotalFocus);
        setTotalDistract(roundedTotalDistract);
    }, [CHART_FILL]);

    const focusPercentages = CHART_FILL.map((item) => parseInt(item.focus_percentage));
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
