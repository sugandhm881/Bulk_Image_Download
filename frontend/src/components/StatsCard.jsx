const accents = {
  cyan: "text-cyan-400 bg-cyan-500/10",
  green: "text-green-400 bg-green-500/10",
  red: "text-red-400 bg-red-500/10",
  yellow: "text-yellow-400 bg-yellow-500/10",
};

function StatsCard({ title, value, icon: Icon, accent = "cyan" }) {
  return (
    <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">

      <div className="flex items-center justify-between mb-3">

        <h3 className="text-slate-400 text-xs sm:text-sm">
          {title}
        </h3>

        {Icon && (
          <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accents[accent] || accents.cyan}`}>
            <Icon className="text-sm" />
          </span>
        )}

      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white break-words">
        {value}
      </h2>

    </div>
  );
}

export default StatsCard;
