export default function ExportPanel({ onExportPNG, onOrderPrint, exporting, exportError }) {
  return (
    <div className="p-4 border-t border-border space-y-2 shrink-0">
      {exportError && (
        <p className="text-xs text-red-400 mb-1">{exportError}</p>
      )}
      <button
        onClick={onExportPNG}
        disabled={exporting}
        className="w-full bg-accent text-surface py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {exporting ? (
          <>
            <span className="w-3 h-3 border border-surface/30 border-t-surface rounded-full animate-spin" />
            Exporting…
          </>
        ) : (
          'Download Free PNG'
        )}
      </button>
      <button
        onClick={onOrderPrint}
        className="w-full border border-border text-accent/70 py-2.5 rounded-lg text-sm hover:border-accent/40 transition-colors"
      >
        Order Print — from $29
      </button>
    </div>
  )
}
