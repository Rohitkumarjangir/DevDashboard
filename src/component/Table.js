import React from 'react'

function Table({ filteredAndSortedDevelopers, requestSort, sortConfig }) {
    return (
        <div className=" rounded-[12px] px-[16px] py-[12px] bg-[#FFF] shadow-PipelineCardsShadow   overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Developer Activity Summary</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Developer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('PR Open')}>
                            PRs Opened {sortConfig.key === 'PR Open' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('PR Merged')}>
                            PRs Merged {sortConfig.key === 'PR Merged' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('Commits')}>
                            Commits {sortConfig.key === 'Commits' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('PR Reviewed')}>
                            PR Reviews {sortConfig.key === 'PR Reviewed' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('PR Comments')}>
                            PR Comments {sortConfig.key === 'PR Comments' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('Incident Alerts')}>
                            Incident Alerts {sortConfig.key === 'Incident Alerts' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('Incidents Resolved')}>
                            Incidents Resolved {sortConfig.key === 'Incidents Resolved' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                        </th>





                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedDevelopers?.map((dev, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{dev.name.split('@')[0]}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{dev.totalActivity.find(act => act.name === "PR Open").value}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{dev.totalActivity.find(act => act.name === "PR Merged").value}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{dev.totalActivity.find(act => act.name === "Commits").value}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{dev.totalActivity.find(act => act.name === "PR Reviewed").value}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{dev.totalActivity.find(act => act.name === "PR Comments").value}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{dev.totalActivity.find(act => act.name === "Incident Alerts").value}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{dev.totalActivity.find(act => act.name === "Incidents Resolved").value}</td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Table