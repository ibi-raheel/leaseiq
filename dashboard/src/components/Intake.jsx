import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Sparkles, Clock, ArrowRight } from 'lucide-react'
import { estimateProcessingSeconds } from '../lib/format.js'

export default function Intake({ onBegin }) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = useCallback((files) => {
    const f = files?.[0]
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.pdf')) return
    setFile(f)
  }, [])

  const onDrop = (e) => {
    e.preventDefault(); setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const seconds = file ? estimateProcessingSeconds(file) : null

  return (
    <main className="max-w-5xl mx-auto px-8 pt-16 pb-24">
      <div className="text-center max-w-3xl mx-auto">
        <div className="eyebrow mb-5">A Forensic Audit · For NNN Retail Leases</div>
        <h1 className="font-display text-5xl md:text-6xl text-ink-900 leading-[1.05]">
          Find the dollars your <em className="text-maroon-600 not-italic">lease</em> says you shouldn't be paying.
        </h1>
        <div className="divider-gold mx-auto mt-6 mb-6"/>
        <p className="text-ink-500 text-lg leading-relaxed max-w-2xl mx-auto font-light">
          Drop an executed lease. We extract every economically relevant clause,
          run seventeen forensic checks against industry practice, and produce a
          report you can hand to a broker, a landlord, or your CFO.
        </p>
      </div>

      <motion.div
        layout
        className="mt-14"
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative rounded-xl2 border-2 border-dashed
            ${isDragging ? 'border-maroon-600 bg-maroon-50/40' : 'border-cream-200 bg-white/60'}
            transition-all duration-200 cursor-pointer
            shadow-card hover:shadow-card-hover
            min-h-[260px] flex items-center justify-center px-8 py-12
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-center"
              >
                <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-gold-100 to-gold-50 grid place-items-center text-maroon-600 shadow-inset-soft mb-5">
                  <Upload className="w-6 h-6"/>
                </div>
                <div className="font-display text-2xl text-ink-900 mb-1">
                  Drop your lease here
                </div>
                <div className="text-ink-500 text-sm">
                  PDF only · Executed copy preferred · Up to 200 pages
                </div>
                <div className="mt-6 inline-flex items-center gap-2 text-xs text-ink-400">
                  <Sparkles className="w-3.5 h-3.5 text-gold-500"/>
                  Your file stays on your machine
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="staged"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="w-full max-w-xl"
              >
                <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-cream-200 shadow-inset-soft">
                  <div className="w-12 h-12 rounded-lg bg-maroon-50 grid place-items-center text-maroon-600 flex-shrink-0">
                    <FileText className="w-5 h-5"/>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-ink-900 truncate" title={file.name}>
                      {file.name}
                    </div>
                    <div className="text-sm text-ink-500 mt-0.5">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB · PDF
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-ink-500">
                    <Clock className="w-4 h-4 text-gold-600"/>
                    Estimated audit time:
                    <span className="text-ink-900 font-medium">~{seconds} seconds</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null) }}
                    className="text-ink-400 hover:text-maroon-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-8 flex items-center justify-center"
            >
              <button
                onClick={() => onBegin(file)}
                className="btn-primary text-base px-8 py-3.5"
              >
                Begin audit
                <ArrowRight className="w-4 h-4"/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Tile
          n="01"
          title="Extract"
          body="Every economically relevant clause — base rent, CAM, taxes, insurance, exclusives, co-tenancy — pulled into structured form."
        />
        <Tile
          n="02"
          title="Audit"
          body="Seventeen forensic checks: capital improvements in CAM, management fee caps, gross-up, pro-rata math, kickout rights, and more."
        />
        <Tile
          n="03"
          title="Quantify"
          body="Every error gets a dollar impact, a verbatim lease quote as evidence, and a recommended remedy."
        />
      </div>
    </main>
  )
}

function Tile({ n, title, body }) {
  return (
    <div className="card p-6">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-gold-600 text-2xl">{n}</span>
        <span className="font-display text-ink-900 text-xl">{title}</span>
      </div>
      <div className="mt-3 text-sm text-ink-500 leading-relaxed">
        {body}
      </div>
    </div>
  )
}
