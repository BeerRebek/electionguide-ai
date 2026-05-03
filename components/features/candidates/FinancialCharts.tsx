"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";

interface FinancialChartsProps {
  assets: number;   // in rupees
  liabilities: number;
}

function fmt(val: number): string {
  if (val >= 1_00_00_000) return `₹${(val / 1_00_00_000).toFixed(1)} Cr`;
  if (val >= 1_00_000)    return `₹${(val / 1_00_000).toFixed(1)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-container-highest border border-outline-variant rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="font-semibold text-on-surface">{payload[0].name}</p>
        <p className="text-primary font-bold">{fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export function FinancialCharts({ assets, liabilities }: FinancialChartsProps) {
  const netWorth = assets - liabilities;
  const barData = [
    { name: "Assets", value: assets },
    { name: "Liabilities", value: liabilities },
    { name: "Net Worth", value: Math.max(netWorth, 0) },
  ];
  const pieData = assets > 0 ? [
    { name: "Assets", value: assets },
    { name: "Liabilities", value: liabilities > 0 ? liabilities : 0 },
  ] : [];

  const COLORS = ["#22c55e", "#ef4444"];

  const liabilityRatio = assets > 0 ? Math.round((liabilities / assets) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">bar_chart</span>
          Financial Breakdown
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barSize={44} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--md-sys-color-on-surface-variant)" }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#22c55e" : index === 1 ? "#ef4444" : "#3b82f6"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart + stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {assets > 0 && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">donut_large</span>
              Asset vs Liability Ratio
            </h4>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`pie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Key metrics */}
        <div className="space-y-3">
          {[
            { label: "Total Assets", value: fmt(assets), color: "text-tertiary", bg: "bg-tertiary-container/20", icon: "account_balance_wallet" },
            { label: "Total Liabilities", value: fmt(liabilities), color: "text-error", bg: "bg-error-container/20", icon: "credit_card" },
            { label: "Net Worth", value: fmt(Math.max(netWorth, 0)), color: "text-primary", bg: "bg-primary-container/20", icon: "trending_up" },
            { label: "Liability Ratio", value: `${liabilityRatio}%`, color: liabilityRatio > 50 ? "text-error" : "text-tertiary", bg: liabilityRatio > 50 ? "bg-error-container/20" : "bg-tertiary-container/20", icon: "percent" },
          ].map((m) => (
            <div key={m.label} className={`flex items-center justify-between p-4 rounded-xl border border-outline-variant ${m.bg}`}>
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[18px] ${m.color}`}>{m.icon}</span>
                <span className="text-sm text-on-surface-variant">{m.label}</span>
              </div>
              <span className={`text-sm font-bold ${m.color}`}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-on-surface-variant text-center">
        Source: ECI affidavit declaration · Figures in Indian Rupees
      </p>
    </div>
  );
}
