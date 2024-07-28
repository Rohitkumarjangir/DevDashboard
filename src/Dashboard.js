import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, AreaChart, CartesianGrid, Radar, Area } from 'recharts';
import Kpi from './component/Kpi';
import ChartCard from './component/ChartCard';
import Table from './component/Table';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {


    const [data, setData] = useState({});

    const fetchData = async () => {
        try {
            const response = await fetch('https://66a5e6db23b29e17a1a139ee.mockapi.io/devdynamics/api/v1/getanalyticsdata');
            const data = await response.json();
            setData(data[0]);
            console.log(data[0]);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [developers, setDevelopers] = useState([]);

    useEffect(() => {
        if (data) {
            setDevelopers(data?.data?.AuthorWorklog?.rows);
        }
    }, [data]);


    // State for filters, sorting, and search
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [activityFilter, setActivityFilter] = useState('All');

    // Function to prepare data for charts
    const prepareChartData = (key, filteredDevelopers) => {
        return filteredDevelopers?.map(dev => ({
            name: dev.name.split('@')[0],
            value: parseInt(dev.totalActivity.find(act => act.name === key).value)
        }));
    };

    // Filtered and sorted developers
    const filteredAndSortedDevelopers = useMemo(() => {
        let filtered = developers?.filter(dev =>
            dev.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (activityFilter === 'All' || dev.totalActivity.some(act => act.name === activityFilter && parseInt(act.value) > 0))
        );

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = parseInt(a.totalActivity.find(act => act.name === sortConfig.key).value);
                const bValue = parseInt(b.totalActivity.find(act => act.name === sortConfig.key).value);
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [developers, searchTerm, sortConfig, activityFilter]);

    // KPIs calculation
    const kpis = useMemo(() => ({
        totalPRsOpened: filteredAndSortedDevelopers?.reduce((sum, dev) => sum + parseInt(dev.totalActivity.find(act => act.name === "PR Open").value), 0),
        totalPRsMerged: filteredAndSortedDevelopers?.reduce((sum, dev) => sum + parseInt(dev.totalActivity.find(act => act.name === "PR Merged").value), 0),
        totalCommits: filteredAndSortedDevelopers?.reduce((sum, dev) => sum + parseInt(dev.totalActivity.find(act => act.name === "Commits").value), 0),
        totalPRReviewed: filteredAndSortedDevelopers?.reduce((sum, dev) => sum + parseInt(dev.totalActivity.find(act => act.name === "PR Reviewed").value), 0),
        totalPRComments: filteredAndSortedDevelopers?.reduce((sum, dev) => sum + parseInt(dev.totalActivity.find(act => act.name === "PR Comments").value), 0),
        totalIncidentAlerts: filteredAndSortedDevelopers?.reduce((sum, dev) => sum + parseInt(dev.totalActivity.find(act => act.name === "Incident Alerts").value), 0),
        totalIncidentsResolved: filteredAndSortedDevelopers?.reduce((sum, dev) => sum + parseInt(dev.totalActivity.find(act => act.name === "Incidents Resolved").value), 0),

    }), [filteredAndSortedDevelopers]);

    // Sorting function
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' });
        return formatter.format(date);
    };

    // New function to prepare data for the heatmap
    const prepareHeatmapData = (filteredDevelopers) => {
        const heatmapData = [];
        filteredDevelopers?.forEach(dev => {
            dev.dayWiseActivity?.forEach(day => {
                const prOpen = parseInt(day.items.children.find(item => item.label === "PR Open").count);
                const prMerged = parseInt(day.items.children.find(item => item.label === "PR Merged").count);
                const commits = parseInt(day.items.children.find(item => item.label === "Commits").count);
                const prReviewed = parseInt(day.items.children.find(item => item.label === "PR Reviewed").count);
                const prComments = parseInt(day.items.children.find(item => item.label === "PR Comments").count);
                const incidentAlerts = parseInt(day.items.children.find(item => item.label === "Incident Alerts").count);
                const incidentsResolved = parseInt(day.items.children.find(item => item.label === "Incidents Resolved").count);

                heatmapData.push({
                    developer: dev.name.split('@')[0],
                    date: formatDate(day.date),
                    activity: prOpen + prMerged + commits + prReviewed + prComments + incidentAlerts + incidentsResolved
                });
            });
        });
        return heatmapData;
    };









    const processData = (data) => {
        const developers = [...new Set(data?.map(item => item.developer))];
        const dates = [...new Set(data?.map(item => item.date))];

        const lineChartData = dates?.map(date => {
            let obj = { date };
            data?.forEach(item => {
                if (item.date === date) {
                    obj[item.developer] = item.activity;
                }
            });
            return obj;
        });

        const barChartData = developers?.map(dev => {
            let totalActivity = 0;
            data?.forEach(item => {
                if (item.developer === dev) {
                    totalActivity += item.activity;
                }
            });
            return { developer: dev, activity: totalActivity };
        });

        return { lineChartData, barChartData };
    };

    const { lineChartData, barChartData } = processData(prepareHeatmapData(filteredAndSortedDevelopers));

    // New function to prepare data for the time series chart
    const prepareTimeSeriesData = (filteredDevelopers) => {
        const timeSeriesData = {};
        filteredDevelopers?.forEach(dev => {
            dev.dayWiseActivity?.forEach(day => {
                if (!timeSeriesData[formatDate(day.date)]) {
                    timeSeriesData[formatDate(formatDate(day.date))] = { date: formatDate(day.date), prOpen: 0, prMerged: 0, commits: 0, prReviewed: 0, prComments: 0, incidentAlerts: 0, incidentsResolved: 0 };
                }
                // data?.data?.AuthorWorklog?.activityMeta?.forEach((dev, index) => {
                //   timeSeriesData[formatDate(day.date)][dev?.label] = parseInt(day.items.children.find(item => item.label === dev.label).count);
                // });

                timeSeriesData[formatDate(day.date)].prOpen += parseInt(day.items.children.find(item => item.label === "PR Open").count);
                timeSeriesData[formatDate(day.date)].prMerged += parseInt(day.items.children.find(item => item.label === "PR Merged").count);
                timeSeriesData[formatDate(day.date)].commits += parseInt(day.items.children.find(item => item.label === "Commits").count);
                timeSeriesData[formatDate(day.date)].prReviewed += parseInt(day.items.children.find(item => item.label === "PR Reviewed").count);
                timeSeriesData[formatDate(day.date)].prComments += parseInt(day.items.children.find(item => item.label === "PR Comments").count);
                timeSeriesData[formatDate(day.date)].incidentAlerts += parseInt(day.items.children.find(item => item.label === "Incident Alerts").count);
                timeSeriesData[formatDate(day.date)].incidentsResolved += parseInt(day.items.children.find(item => item.label === "Incidents Resolved").count);
            });
        });
        return Object.values(timeSeriesData).sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Developer Activity Dashboard</h1>

            {data?.data?.AuthorWorklog && (
                <>
                    {/* Filters and Search */}
                    <div className="mb-6 flex flex-wrap space-x-4">
                        <input
                            type="text"
                            placeholder="Search developers..."
                            className="px-4 py-2 border  rounded-[12px]  bg-[#FFF] shadow-PipelineCardsShadow"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* KPIs */}
                    <Kpi kpis={kpis} />

                    {/* Charts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 mb-6">
                        {/* PRs Opened Bar Chart */}
                        <ChartCard
                            chart={
                                <BarChart data={prepareChartData("PR Open", filteredAndSortedDevelopers)}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            }
                            label={'PRs Opened by Developer'}
                        />

                        {/* PRs Merged Pie Chart */}
                        <ChartCard
                            chart={
                                <PieChart>
                                    <Pie
                                        data={prepareChartData("PR Merged", filteredAndSortedDevelopers)}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {prepareChartData("PR Merged", filteredAndSortedDevelopers)?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            }
                            label={'PRs Merged by Developer'}
                        />

                        {/* Commits Line Chart */}
                        <ChartCard
                            chart={
                                <LineChart data={prepareChartData("Commits", filteredAndSortedDevelopers)}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                                </LineChart>
                            }
                            label={'Commits Trend'}
                        />

                        {/* PR Reviews Bar Chart */}
                        <ChartCard
                            chart={
                                <BarChart data={prepareChartData("PR Reviewed", filteredAndSortedDevelopers)}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#82ca9d" />
                                </BarChart>
                            }
                            label={'PR Reviews by Developer'}
                        />

                        {/* New Time Series Chart */}
                        <ChartCard
                            chart={
                                <LineChart
                                    data={prepareTimeSeriesData(filteredAndSortedDevelopers)}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="prOpen" stroke="#EF6B6B" name="PRs Open" />
                                    <Line type="monotone" dataKey="prMerged" stroke="#61CDBB" name="PRs Merged" />
                                    <Line type="monotone" dataKey="commit" stroke="#FAC76E" name="Commit" />
                                    <Line type="monotone" dataKey="prReviewed" stroke="#C2528B" name="PR Reviewed" />
                                    <Line type="monotone" dataKey="prComments" stroke="#0396A6" name="PR Comments" />
                                    <Line type="monotone" dataKey="incidentAlerts" stroke="#5F50A9" name="Incident Alerts" />
                                    <Line type="monotone" dataKey="incidentsResolved" stroke="#8F3519" name="Incidents Resolved" />
                                </LineChart>
                            }
                            label={'Activity Trends Over Time'}
                        />

                        {/* Total activity bar Chart */}
                        <ChartCard
                            chart={
                                <BarChart width={600} height={300} data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="developer" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="activity" fill="#8884d8" />
                                </BarChart>
                            }
                            label={'Total activity bar chart'}
                        />

                        {/* Developer Activity trends over time */}
                        <ChartCard
                            chart={
                                <AreaChart width={600} height={300} data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {lineChartData?.[0] &&
                                        Object?.keys(lineChartData?.[0])
                                            ?.filter((key) => key !== 'date')
                                            ?.map((key, index) => (
                                                <Area
                                                    key={key}
                                                    type="monotone"
                                                    dataKey={key}
                                                    stackId="1"
                                                    stroke={['#8884d8', '#82ca9d', '#ffc658', '#d0ed57'][index]}
                                                    fill={['#8884d8', '#82ca9d', '#ffc658', '#d0ed57'][index]}
                                                />
                                            ))}
                                </AreaChart>
                            }
                            label={'Developer Activity trends over time'}
                        />
                    </div>

                    {/* Developer Activity Table */}
                    <Table filteredAndSortedDevelopers={filteredAndSortedDevelopers} requestSort={requestSort} sortConfig={sortConfig} />
                </>
            )}
        </div>

    );
};

export default Dashboard;