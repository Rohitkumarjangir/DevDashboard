import React from 'react'

function Kpi({kpis}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-7 gap-4 mb-6">
    <div className=" rounded-[12px] px-[16px] py-[12px] bg-[#FFF] shadow-PipelineCardsShadow h-[120px]  ">
        <h2 className="text-sm font-semibold">Total PRs Opened</h2>
        <p className="text-3xl mt-2 font-bold text-[#EF6B6B] ">{kpis.totalPRsOpened}</p>
    </div>
    <div className=" rounded-[12px] px-[16px] py-[12px] bg-[#FFF] shadow-PipelineCardsShadow h-[120px]  ">
        <h2 className="text-sm font-semibold">Total PRs Merged</h2>
        <p className="text-3xl mt-2 font-bold text-[#61CDBB]">{kpis.totalPRsMerged}</p>
    </div>
    <div className=" rounded-[12px] px-[16px] py-[12px] bg-[#FFF] shadow-PipelineCardsShadow h-[120px]  ">
        <h2 className="text-sm font-semibold">Total Commits</h2>
        <p className="text-3xl mt-2 font-bold text-[#FAC76E]">{kpis.totalCommits}</p>
    </div>
    <div className=" rounded-[12px] px-[16px] py-[12px] bg-[#FFF] shadow-PipelineCardsShadow h-[120px]  ">
        <h2 className="text-sm font-semibold">Total PRs Reviewed</h2>
        <p className="text-3xl mt-2 font-bold text-[#C2528B]">{kpis.totalPRReviewed}</p>
    </div>

    <div className=" rounded-[12px] px-[16px] py-[12px] bg-[#FFF] shadow-PipelineCardsShadow h-[120px]  ">
        <h2 className="text-sm font-semibold">Total PR Comments</h2>
        <p className="text-3xl mt-2 font-bold text-[#0396A6]">{kpis.totalPRComments}</p>
    </div>

    <div className=" rounded-[12px] px-[16px] py-[12px] bg-[#FFF] shadow-PipelineCardsShadow h-[120px]  ">
        <h2 className="text-sm font-semibold">Total Incident Alerts</h2>
        <p className="text-3xl mt-2 font-bold text-[#5F50A9]">{kpis.totalIncidentAlerts}</p>
    </div>
    <div className=" rounded-[12px] px-[16px] py-[12px] bg-[#FFF] shadow-PipelineCardsShadow h-[120px]  ">
        <h2 className="text-sm font-semibold">Total Incidents Resolved</h2>
        <p className="text-3xl mt-2 font-bold text-[#8F3519]">{kpis.totalIncidentsResolved}</p>
    </div>

</div>
  )
}

export default Kpi