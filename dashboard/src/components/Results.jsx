import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Quote, ChevronRight, Building2, Calendar, ArrowDownToLine, RotateCcw, AlertCircle, FileCheck, ShieldAlert, FileText } from 'lucide-react'
import { formatUSD, formatUSDCompact, categoryColor } from '../lib/format.js'

export default function Results({ audit, file, onReset }) {
  const [activeFilter, setActiveFilter] = useState('ALL')

  const errors = audit?.errors ?? []
  const summary = audit?.audit_summary ?? {}
  const property = audit?.property ?? {}

  const filteredErrors = useMemo(() => {
    const sorted = [...errors].sort(
      (a, b) => (b.dollar_impact_annual || 0) - (a.dollar_impact_annual || 0)
    )
    if (activeFilter === 'ALL') return sorted
    return sorted.filter((e) => e.category === activeFilter)
  }, [errors, activeFilter])

  const categories = useMemo(() => {
    const counts = {}
    for (const e of errors) counts[e.category] = (counts[e.category] || 0) + 1
    return counts
  }, [errors])

  const evidenceSplit = useMemo(() => {
    let confirmed = 0
    let structural = 0
    let confirmedDollars = 0
    let structuralDollars = 0
    for (const e of errors) {
      if (e.evidence_type === 'reconciliation') {
        confirmed += 1
        confirmedDollars += e.dollar_impact_annual || 0
      } else {
        structural += 1
        structuralDollars += e.dollar_impact_annual || 0
      }
    }
    return { confirmed, structural, confirmedDollars, structuralDollars }
  }, [errors])

  const supportingDocs = audit?.supporting_documents ?? []

  // Pending state — when the lease hasn't been read yet
  if (audit?.status === 'pending_lease_access') {
    return <PendingState audit={audit} onReset={onReset}/>
  }

  return (
    <main className="max-w-6xl mx-auto px-8 pt-12 pb-24">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <div className="eyebrow mb-5">Audit Complete</div>
        <h1 className="font-display text-7xl md:text-8xl text-ink-900 leading-none tracking-tight">
          {formatUSD(summary.total_dollar_impact_annual)}
        </h1>
        <div className="mt-3 text-sm uppercase tracking-wider2 text-ink-500">
          in annual impact
        </div>

        {evidenceSplit.confirmed > 0 && evidenceSplit.structural > 0 && (
          <div className="mt-6 inline-flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon-50 border border-maroon-100 text-maroon-700">
              <FileCheck className="w-3.5 h-3.5"/>
              {formatUSD(evidenceSplit.confirmedDollars)} confirmed via reconciliation
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 border border-cream-200 text-ink-700">
              <ShieldAlert className="w-3.5 h-3.5"/>
              {formatUSD(evidenceSplit.structuralDollars)} structural exposure
            </span>
          </div>
        )}

        <div className="divider-gold mx-auto mt-7 mb-7"/>
        <p className="font-display text-2xl text-ink-700 italic font-light leading-snug">
          “{summary.executive_summary}”
        </p>
      </section>

      {/* Property line */}
      <section className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-ink-500">
        <span className="inline-flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gold-600"/>
          <span className="text-ink-900">{property.tenant_name}</span>
          <span className="text-ink-400">·</span>
          <span>{property.premises_address}</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gold-600"/>
          Lease commenced {property.lease_commencement_date}
        </span>
      </section>

      {/* Supporting documents */}
      {supportingDocs.length > 0 && (
        <section className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] uppercase tracking-wider2 text-ink-500 mr-1">
            Sources reviewed
          </span>
          {supportingDocs.map((doc) => (
            <span
              key={doc.name}
              className="inline-flex items-center gap-1.5 text-xs text-ink-700 px-3 py-1 rounded-full bg-white border border-cream-200"
            >
              <FileText className="w-3.5 h-3.5 text-gold-600"/>
              {doc.name}
            </span>
          ))}
        </section>
      )}

      {/* KPI strip */}
      <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi
          label="Lease-to-date impact"
          value={formatUSD(summary.total_dollar_impact_lease_to_date)}
          accent="maroon"
        />
        <Kpi
          label="Findings"
          value={summary.errors_found_count ?? '—'}
          sub={`${summary.high_confidence_errors_count ?? 0} high confidence`}
        />
        <Kpi
          label="Audit confidence"
          value={`${summary.audit_confidence_overall ?? '—'}%`}
        />
        <Kpi
          label="Confirmed via billing"
          value={evidenceSplit.confirmed}
          sub={`${evidenceSplit.structural} structural`}
        />
      </section>

      {/* Filters */}
      <section className="mt-14 flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-3xl text-ink-900">Findings</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip
            label={`All (${errors.length})`}
            active={activeFilter === 'ALL'}
            onClick={() => setActiveFilter('ALL')}
          />
          {Object.entries(categories).map(([cat, n]) => (
            <FilterChip
              key={cat}
              label={`${cat.replace('_', ' ')} (${n})`}
              active={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
            />
          ))}
        </div>
      </section>

      {/* Errors */}
      <section className="mt-6 space-y-5">
        {filteredErrors.map((e, i) => (
          <ErrorCard key={e.error_id} error={e} index={i}/>
        ))}
      </section>

      {/* Footer actions */}
      <section className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-cream-200 pt-10">
        <button onClick={onReset} className="btn-ghost">
          <RotateCcw className="w-4 h-4"/>
          Audit another lease
        </button>
        <button onClick={() => window.print()} className="btn-primary">
          <ArrowDownToLine className="w-4 h-4"/>
          Export PDF report
        </button>
      </section>

      <p className="mt-12 text-center text-xs text-ink-400 italic">
        Audit performed by LeaseIQ. If we did not identify at least $10,000 in errors, you owe us nothing.
      </p>
    </main>
  )
}

function PendingState({ audit, onReset }) {
  return (
    <main className="max-w-2xl mx-auto px-8 pt-24 pb-24 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-maroon-50 grid place-items-center text-maroon-600 mb-6">
        <AlertCircle className="w-6 h-6"/>
      </div>
      <h1 className="font-display text-4xl text-ink-900">Awaiting lease access</h1>
      <div className="divider-gold mx-auto mt-5 mb-6"/>
      <p className="text-ink-500 leading-relaxed">
        {audit.audit_summary.executive_summary}
      </p>
      <p className="mt-6 text-sm text-ink-400">{audit.missing_data}</p>
      <button onClick={onReset} className="btn-ghost mt-10">
        <RotateCcw className="w-4 h-4"/>
        Start over
      </button>
    </main>
  )
}

function Kpi({ label, value, sub, accent }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-wider2 text-ink-500">{label}</div>
      <div className={`mt-1 font-display text-3xl ${accent === 'maroon' ? 'text-maroon-600' : 'text-ink-900'}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-ink-500 mt-1">{sub}</div>}
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        text-xs uppercase tracking-wider2 px-3 py-1.5 rounded-full border transition-colors
        ${active
          ? 'bg-maroon-600 border-maroon-600 text-cream-50'
          : 'bg-white border-cream-200 text-ink-700 hover:border-maroon-100 hover:text-maroon-600'}
      `}
    >
      {label}
    </button>
  )
}

function ErrorCard({ error, index }) {
  const colors = categoryColor(error.category)
  const isConfirmed = error.evidence_type === 'reconciliation'

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: 'easeOut' }}
      className={`card-elev p-7 ${isConfirmed ? 'border-l-4 border-l-maroon-600' : ''}`}
    >
      <header className="flex items-start gap-5 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider2 px-2.5 py-1 rounded-full border ${colors.tag}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}/>
              {error.category.replace('_', ' ')}
            </span>
            {isConfirmed ? (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider2 px-2.5 py-1 rounded-full bg-maroon-600 text-cream-50">
                <FileCheck className="w-3 h-3"/>
                Confirmed overcharge
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider2 px-2.5 py-1 rounded-full bg-cream-100 text-ink-700 border border-cream-200">
                <ShieldAlert className="w-3 h-3"/>
                Structural exposure
              </span>
            )}
            <span className="text-xs text-ink-400 font-mono">{error.error_id}</span>
            <span className="text-xs text-ink-400">·</span>
            <span className="text-xs text-ink-400">{error.lease_section}</span>
          </div>
          <h3 className="font-display text-2xl text-ink-900 leading-snug">
            {error.error_type}
          </h3>
          <p className="mt-2 text-ink-700 leading-relaxed">
            {error.description}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="font-display text-4xl text-maroon-600 leading-none">
            {formatUSDCompact(error.dollar_impact_annual)}
          </div>
          <div className="text-[10px] uppercase tracking-wider2 text-ink-500 mt-1">/ year</div>
          {error.dollar_impact_lease_to_date > 0 && (
            <div className="mt-3 text-xs text-ink-500">
              {formatUSD(error.dollar_impact_lease_to_date)} lease-to-date
            </div>
          )}
        </div>
      </header>

      {error.evidence && (
        <div className="mt-6 flex gap-4">
          <Quote className="w-4 h-4 text-gold-600 flex-shrink-0 mt-1"/>
          <blockquote className="quote-evidence flex-1">
            {error.evidence}
          </blockquote>
        </div>
      )}

      <footer className="mt-6 pt-5 border-t border-cream-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs text-ink-500">
          <span>Confidence</span>
          <ConfidenceBar value={error.confidence}/>
          <span className="font-mono text-ink-900">{error.confidence}%</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-maroon-600 font-medium">
          <ChevronRight className="w-4 h-4"/>
          {error.recommended_action}
        </div>
      </footer>
    </motion.article>
  )
}

function ConfidenceBar({ value }) {
  const tone =
    value >= 90 ? 'bg-maroon-600' :
    value >= 70 ? 'bg-gold-500' : 'bg-ink-400'
  return (
    <div className="w-24 h-1 rounded-full bg-cream-200 overflow-hidden">
      <div className={`h-full ${tone}`} style={{ width: `${value}%` }}/>
    </div>
  )
}
