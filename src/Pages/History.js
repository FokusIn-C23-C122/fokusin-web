import React, { useState, useEffect } from 'react';
import { Card, Typography } from "@material-tailwind/react";
import { Icon } from '@iconify/react';

import Layout from '../components/Layout';
import styles from './history.module.css'
import { API_URL } from '../constants/Api';

const TABLE_HEAD = ["Date", "Time", "Description", "Total Sessions", "Total Focus"];

const History = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [totalFocus, setTotalFocus] = useState(0);
    const [totalDistract, setTotalDistract] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [noDataMessage, setNoDataMessage] = useState('');

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/analysis/`);
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
            const focusParts = row.focus_length.split(':');
            const focusHours = parseInt(focusParts[0]);
            const focusMinutes = parseInt(focusParts[1]);
            const focusSeconds = parseInt(focusParts[2]);
            const focusTimeInSeconds = focusHours * 3600 + focusMinutes * 60 + focusSeconds;
            return acc + focusTimeInSeconds;
        }, 0);

        const totalDistract = filteredTableData.reduce((acc, row) => {
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
    }, [filteredTableData]);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        let filtered = [];

        if (filter === 'All') {
            filtered = tableData;
        } else if (filter === 'LastDay') {
            const lastDay = new Date();
            lastDay.setDate(lastDay.getDate() - 1);
            filtered = tableData.filter((row) => {
                const rowDate = new Date(row.date);
                return rowDate.toDateString() === lastDay.toDateString();
            });
        } else if (filter === 'LastWeek') {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            filtered = tableData.filter((row) => {
                const rowDate = new Date(row.date);
                return rowDate >= lastWeek;
            });
        } else if (filter === 'LastMonth') {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            filtered = tableData.filter((row) => {
                const rowDate = new Date(row.date);
                return rowDate >= lastMonth;
            });
        }

        setFilteredTableData(filtered);
        setNoDataMessage(filtered.length === 0 ? 'No data available.' : '');
    };

    const formatTime = (timeString) => {
        const timeParts = timeString.split(':');

        const date = new Date();
        date.setUTCHours(timeParts[0]);
        date.setUTCMinutes(timeParts[1]);
        date.setUTCSeconds(timeParts[2]);

        const options = {
            timeZone: "Asia/Bangkok",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        };

        return date.toLocaleString("en-US", options);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        };

        return date.toLocaleDateString("en-US", options);
    };

    return (
        <>
            <Layout />
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
                        <p>{noDataMessage}</p>
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
                                {filteredTableData.map(({ date, time, description, session_length, focus_length }) => (
                                    <tr key={date} className="even:bg-gray-50/50">
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
                                                {session_length}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Typography variant="small" className="font-normal">
                                                {focus_length}
                                            </Typography>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>
            </div>
        </>
    );
};

export default History;
