import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader } from 'lucide-react'

const STAGE_DEFS = [
  { key: 'parse', label: 'Parsing PDF structure',          weight: 0.10 },
  { key: 'extract', label: 'Extracting economic clauses',  weight: 0.30 },
  { key: 'audit',   label: 'Running 17 forensic checks',   weight: 0.40 },
  { key: 'quantify',label: 'Quantifying dollar impact',    weight: 0.15 },
  { key: 'render',  label: 'Composing the report',         weight: 0.05 },
]

export default function Processing({ file, totalSeconds, onComplete }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const id = setInterval(() => {
      const now = Date.now()
      const e = (now - start) / 1000
      setElapsed(e)
      if (e >= totalSeconds) {
        clearInterval(id)
        onComplete()
      }
    }, 100)
    return () => clearInterval(id)
  }, [totalSeconds, onComplete])

  // Compute per-stage progress against weighted thresholds.
  let cumulative = 0
  const stages = STAGE_DEFS.map((s) => {
    const stageStart = cumulative * totalSeconds
    cumulative += s.weight
    const stageEnd = cumulative * totalSeconds
    let state = 'pending'
    let stageProgress = 0
    if (elapsed >= stageEnd) state = 'done'
    else if (elapsed >= stageStart) {
      state = 'active'
      stageProgress = (elapsed - stageStart) / (stageEnd - stageStart)
    }
    return { ...s, state, stageProgress }
  })

  const overall = Math.min(1, elapsed / totalSeconds)

  return (
    <main className="max-w-3xl mx-auto px-8 pt-20 pb-24">
      <div className="text-center">
        <div className="eyebrow mb-5">Auditing in Progress</div>
        <h2 className="font-display text-4xl text-ink-900 leading-tight">
          Reading <em className="text-maroon-600 not-italic">{file?.name?.replace(/\.pdf$/i, '')}</em>
        </h2>
        <div className="divider-gold mx-auto mt-5 mb-5"/>
        <p className="text-ink-500 text-base font-light">
          A typical NNN retail lease has 80–150 economically relevant clauses.
          We're pulling every one.
        </p>
      </div>

      <div className="mt-12 card p-8">
        <div className="space-y-6">
          {stages.map((s, i) => (
            <StageRow key={s.key} stage={s} index={i}/>
          ))}
        </div>

        <div className="mt-10">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-ink-500">Overall</span>
            <span className="font-mono text-ink-900">
              {Math.round(overall * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-cream-200 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-maroon-600 to-gold-500"
              animate={{ width: `${overall * 100}%` }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs uppercase tracking-wider2 text-ink-400">
        {Math.max(0, Math.ceil(totalSeconds - elapsed))} seconds remaining
      </div>
    </main>
  )
}

function StageRow({ stage, index }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0">
        {stage.state === 'done' ? (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-8 h-8 rounded-full bg-maroon-600 grid place-items-center"
          >
            <Check className="w-4 h-4 text-cream-50" strokeWidth={3}/>
          </motion.div>
        ) : stage.state === 'active' ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent"
          />
        ) : (
          <div className="w-8 h-8 rounded-full border border-cream-200 grid place-items-center">
            <span className="text-xs text-ink-400 font-mono">{String(index + 1).padStart(2,'0')}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm ${stage.state === 'pending' ? 'text-ink-400' : 'text-ink-900'} ${stage.state === 'active' ? 'font-medium' : ''}`}>
          {stage.label}
        </div>
        {stage.state === 'active' && (
          <div className="mt-2 h-0.5 rounded-full bg-cream-200 overflow-hidden">
            <motion.div
              className="h-full bg-gold-500"
              animate={{ width: `${stage.stageProgress * 100}%` }}
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
