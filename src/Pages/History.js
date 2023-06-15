import React, { useState, useEffect } from 'react';
import { Card, Typography } from "@material-tailwind/react";
import { Icon } from '@iconify/react';
import moment from 'moment-timezone';

import Layout from '../components/Layout';
import styles from './history.module.css';
import { API_URL } from '../constants/Api';
import { getCookie } from '../constants/cookies';

const TABLE_HEAD = ["Date", "Time", "Description", "Total Sessions", "Total Focus"];

const History = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [totalFocus, setTotalFocus] = useState(0);
    const [totalDistract, setTotalDistract] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState('');

    const formatDuration = (durationInSeconds) => {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds;

        let timeText = '';
        if (hours > 0) {
            timeText = `${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            timeText = `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (seconds > 0) {
            timeText = `${(seconds / 60).toFixed(1)} minute`;
        }
        else {
            timeText = `${seconds} second${seconds !== 1 ? 's' : ''}`;
        }

        return timeText;
    };

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/analysis/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': getCookie("access"),
                    },
                });
                const data = await response.json();
                setTableData(data);
                setFilteredTableData(data);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchChartData();
    }, []);

    useEffect(() => {
        const totalFocus = filteredTableData.reduce((acc, row) => {
            const focusTimeInSeconds = row.focus_length;
            return acc + focusTimeInSeconds;
        }, 0);

        const totalDistract = filteredTableData.reduce((acc, row) => {
            const sessionTimeInSeconds = row.session_length;
            const focusTimeInSeconds = row.focus_length;
            const distractTimeInSeconds = sessionTimeInSeconds - focusTimeInSeconds;
            return acc + distractTimeInSeconds;
        }, 0);

        const roundedTotalFocus = Math.round((totalFocus / 3600) * 10) / 10;
        const roundedTotalDistract = Math.round((totalDistract / 3600) * 10) / 10;

        setTotalFocus(roundedTotalFocus);
        setTotalDistract(roundedTotalDistract);
    }, [filteredTableData]);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        let filtered = [];

        if (filter === 'All') {
            filtered = tableData;
        } else if (filter === 'LastDay') {
            const lastDay = moment().subtract(1, 'day').startOf('day');
            filtered = tableData.filter((row) => {
                const rowDate = moment(row.date);
                return rowDate.isSame(lastDay, 'day');
            });
        } else if (filter === 'LastWeek') {
            const lastWeek = moment().subtract(1, 'week').startOf('day');
            filtered = tableData.filter((row) => {
                const rowDate = moment(row.date);
                return rowDate.isSameOrAfter(lastWeek);
            });
        } else if (filter === 'LastMonth') {
            const lastMonth = moment().subtract(1, 'month').startOf('day');
            filtered = tableData.filter((row) => {
                const rowDate = moment(row.date);
                return rowDate.isSameOrAfter(lastMonth);
            });
        }

        setFilteredTableData(filtered);
        setNoDataMessage(filtered.length === 0 ? 'No data available.' : '');
    };

    const formatTime = (timeString) => {
        const time = moment.tz(timeString, 'HH:mm:ss', 'UTC').tz('Asia/Bangkok');
        return time.format('LT');
    };

    const formatDate = (dateString) => {
        const date = moment.tz(dateString, 'Asia/Bangkok');
        return date.format('dddd, MMMM Do YYYY');
    };


    return (
        <>
            <Layout />
            <div className={styles.container}>
                <div className={styles.tableContainer}>
                    <div className={styles.totalHours}>
                        <div className={styles.focusContainer}>
                            <div className={`${styles.focus} flex justify-center items-center`}>
                                <Icon className={`${styles.focusIcon} flex items-center justify-center h-screen`} icon="mdi:head-idea-outline" color="white" width="36" height="36" />
                            </div>
                            <div>
                                <h2 className={styles.totalFocus}>{totalFocus} Hours</h2>
                                <p className={styles.focused}>Total Hours Focused</p>
                            </div>
                        </div>
                        <div className={styles.distractContainer}>
                            <div className={`${styles.distract} flex justify-center items-center`}>
                                <Icon className={styles.distractIcon} icon="raphael:no" color="white" width="36" height="36" />
                            </div>
                            <div>
                                <h2 className={styles.totalDistract}>{totalDistract} Hours</h2>
                                <p className={styles.distracted}>Total Hours Distracted</p>
                            </div>
                        </div>
                    </div>
                    <Card className={`${styles.table} overflow-scroll h-full w-full`}>
                        <div className="flex justify-end p-4">
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

                        {filteredTableData.length === 0 ? (
                            <p className={styles.noData}>{noDataMessage}</p>
                        ) : (
                            <table className="w-full min-w-max table-auto text-center">
                                <thead className={styles.thead}>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head}>{head}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className={styles.tbody}>
                                    {filteredTableData.map(({ date, time, description, session_length, focus_length, id }) => (
                                        <tr key={`${date}-${id}`} className='even:bg-brown-50/50'>
                                            <td className="p-4">
                                                <Typography variant="small" className="font-normal">
                                                    {formatDate(date)}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" className="font-normal">
                                                    {formatTime(time)}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" className="font-normal">
                                                    {description}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" className="font-normal">
                                                    {formatDuration(session_length)}
                                                </Typography>
                                            </td>
                                            <td className="p-4">
                                                <Typography variant="small" className="font-normal">
                                                    {formatDuration(focus_length)}
                                                </Typography>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
};

export default History;
