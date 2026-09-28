// LeaseIQ — audit registry
//
// Each entry maps a lease file's "fingerprint" (a list of substrings that
// should appear in the dropped filename) to a Stage-2 audit JSON.
// The dashboard matches the dropped File.name against these.
//
// This public repo ships one fictional sample (drop any file with "sample"
// in its name). Real audits are built from real leases, quoted verbatim, and
// are kept out of source control.

import { sampleAudit } from './audit-sample.js'

export const AUDIT_REGISTRY = [
  {
    fingerprints: ['sample'],
    audit: sampleAudit,
  },
]

export function findAuditForFile(filename) {
  if (!filename) return null
  const needle = filename.toLowerCase()
  for (const entry of AUDIT_REGISTRY) {
    if (entry.fingerprints.some((fp) => needle.includes(fp.toLowerCase()))) {
      return entry.audit
    }
  }
  return null
}
