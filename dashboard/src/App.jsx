import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header.jsx'
import Intake from './components/Intake.jsx'
import Processing from './components/Processing.jsx'
import Results from './components/Results.jsx'
import { findAuditForFile } from './data/audits.js'
import { estimateProcessingSeconds } from './lib/format.js'

const STAGES = { INTAKE: 'intake', PROCESSING: 'processing', RESULTS: 'results' }

export default function App() {
  const [stage, setStage] = useState(STAGES.INTAKE)
  const [file, setFile] = useState(null)
  const [audit, setAudit] = useState(null)
  const [estimate, setEstimate] = useState(0)

  const handleBegin = useCallback((f) => {
    setFile(f)
    setEstimate(estimateProcessingSeconds(f))
    setAudit(findAuditForFile(f.name))
    setStage(STAGES.PROCESSING)
  }, [])

  const handleProcessingComplete = useCallback(() => {
    setStage(STAGES.RESULTS)
  }, [])

  const handleReset = useCallback(() => {
    setStage(STAGES.INTAKE)
    setFile(null)
    setAudit(null)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header onReset={handleReset}/>

      <AnimatePresence mode="wait">
        {stage === STAGES.INTAKE && (
          <motion.div
            key="intake"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex-1"
          >
            <Intake onBegin={handleBegin}/>
          </motion.div>
        )}

        {stage === STAGES.PROCESSING && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex-1"
          >
            <Processing
              file={file}
              totalSeconds={estimate}
              onComplete={handleProcessingComplete}
            />
          </motion.div>
        )}

        {stage === STAGES.RESULTS && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex-1"
          >
            <Results audit={audit} file={file} onReset={handleReset}/>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-cream-200/70 py-6 text-center text-xs text-ink-400">
        LeaseIQ · A forensic NNN lease audit
      </footer>
    </div>
  )
}
