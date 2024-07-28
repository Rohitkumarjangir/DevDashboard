import React from 'react'
import { ResponsiveContainer } from 'recharts'

function ChartCard({chart , label}) {
  return (
    <div className=" rounded-[12px] px-[16px] py-[12px] bg-[#FFF] shadow-PipelineCardsShadow   ">
    <h2 className="text-xl font-semibold mb-4">{label}</h2>
    <ResponsiveContainer width="100%" height={300}>
      {chart}
    </ResponsiveContainer>
</div>
  )
}

export default ChartCard