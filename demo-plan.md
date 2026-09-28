# LeaseIQ — YC Demo Execution Plan

**Goal:** Submit a 90-second product video to YC showing the LeaseIQ pipeline finding real dollar errors in a real NNN retail lease.

**Total time budget:** 45 minutes of work + ~10 minutes of recording/upload.

**Definition of done:**
1. Two leases audited end-to-end through Stages 1 → 2 → 3.
2. One rendered audit PDF chosen as the "hero" deliverable (highest dollar impact, high confidence).
3. One 90-second MP4 recorded, uploaded as Unlisted to YouTube.
4. URL pasted into the YC application's product video field.

---

## Pre-flight checklist (5 min)

Before opening Claude.ai, get these in one place. If any are missing, stop and fix before running any prompts.

- [ ] **Two NNN retail lease PDFs** dropped into `/Users/ibi/Documents/LeaseIQ/`. Name them `lease-01-<property>.pdf` and `lease-02-<property>.pdf` so outputs stay organized.
- [ ] **The three prompt blocks** (Stage 1 / 2 / 3) saved as separate text files for fast paste. Suggested filenames:
  - `prompts/stage-1-extraction.txt`
  - `prompts/stage-2-audit.txt`
  - `prompts/stage-3-render.txt`
- [ ] **Output folder** ready: `/Users/ibi/Documents/LeaseIQ/runs/lease-01/` and `.../lease-02/`. Each will hold `stage-1.json`, `stage-2.json`, `stage-3.md`, `audit.pdf`.
- [ ] **Claude.ai** open in a browser, signed in, on a model that handles PDFs natively (Sonnet 4.7 or Opus 4.7).
- [ ] **Markdown-to-PDF tool** of choice picked: md2pdf.netlify.app is the lowest-friction, or browser print-to-PDF from a rendered preview. Pandoc if installed.
- [ ] **Screen recorder** ready (QuickTime on Mac → File → New Screen Recording, or Loom). Test that audio capture works.
- [ ] **Optional but useful:** any tenant billing statements, CAM reconciliations, or tax pass-through invoices for either property. These materially improve Stage 2 audit quality. If you don't have them, the pipeline still works on the lease alone — the audit just leans more on lease-text checks (CHECK 1, 7, 9, 12, 13, 14, 15, 16) than on billing-vs-lease checks (CHECK 2–6, 10, 11).

---

## Run lease 1 through the pipeline (10 min)

Do all three stages in **separate Claude.ai conversations** — no shared context. Each stage gets a clean window so the model isn't tempted to pull from earlier reasoning.

### Stage 1 — Extraction (≈3 min)
1. New conversation.
2. Paste the Stage 1 prompt.
3. Upload `lease-01-<property>.pdf` directly to the same message. (Claude.ai accepts PDFs natively — do **not** convert to text first.)
4. Send. Wait for full JSON response.
5. Copy the entire JSON output. Save to `runs/lease-01/stage-1.json`.

**Quality gate before proceeding:**
- [ ] `metadata.extraction_confidence` ≥ 75. If lower, re-run Stage 1 — the extraction is too noisy to feed Stage 2.
- [ ] `cam_inclusions`, `cam_exclusions`, and `tax_exclusions` are populated (not null/empty). These are the single biggest sources of audit findings; if they're empty, the audit will under-report.
- [ ] `pro_rata_share_calculated` is present and matches `pro_rata_share_stated` within 0.5% (or the discrepancy is flagged in `conflicts`).

If a gate fails, re-run Stage 1 once. If it fails again, switch leases — this one isn't going to produce a clean demo.

### Stage 2 — Audit (≈3 min)
1. New conversation.
2. Paste the Stage 2 prompt.
3. Paste the Stage 1 JSON below it. Include any billing statements / CAM reconciliations as additional uploads in the same message.
4. Send. Save the JSON output to `runs/lease-01/stage-2.json`.

**Quality gate before proceeding:**
- [ ] `audit_summary.errors_found_count` ≥ 1. (Zero on a real NNN retail lease almost always means Stage 1 was incomplete — go back.)
- [ ] At least one error has `confidence` ≥ 80. Without a high-confidence error, the demo doesn't have a money shot.
- [ ] `audit_summary.total_dollar_impact_annual` is a real number, not 0 or null.

### Stage 3 — Render (≈2 min)
1. New conversation.
2. Paste the Stage 3 prompt, then the Stage 2 JSON below it.
3. Save the markdown output to `runs/lease-01/stage-3.md`.
4. Render to PDF (md2pdf.netlify.app is fastest: paste markdown, download PDF). Save as `runs/lease-01/audit.pdf`.

### Spot-check (≈2 min)
For every error with `dollar_impact_annual > $5,000`:
- [ ] Open the lease PDF and find the cited section. Confirm the verbatim `evidence` quote actually exists.
- [ ] Re-do the math by hand (escalation, pro-rata, CAM cap %). Confirm the dollar figure.
- [ ] If either check fails, mark that error as suspect — note it in `runs/lease-01/spot-check-notes.md`. Do **not** use this lease as the hero unless the top-impact errors all pass.

---

## Run lease 2 through the pipeline (10 min)

Repeat the exact same flow with `lease-02-<property>.pdf`. Outputs go to `runs/lease-02/`.

The reason for running both: pick the stronger one as the hero for the video. The other is a backup if anything goes wrong on the day-of.

---

## Pick the hero & finalize the PDF (5 min)

Compare the two audits on three criteria, in this order:
1. **Highest `total_dollar_impact_annual` from errors that passed spot-check.** This is the headline number on screen.
2. **Most varied error categories** (CAM + TAX + TENANT_PROTECTION beats three CAM errors). Variety signals the pipeline catches a real spread, not one trick.
3. **Cleanest single top error** — short, quotable description, clear evidence, ≥90 confidence. This is what you zoom in on at the 60-second mark.

Pick the winner. Open `audit.pdf` and confirm:
- [ ] Top dollar number is bold, large, immediately visible.
- [ ] Each error block fits the format the Stage 3 prompt specifies (header, category, section, confidence, evidence quote, recommended action).
- [ ] No obvious render artifacts (markdown asterisks left exposed, broken tables, missing line breaks).

If the rendered PDF looks rough, re-render with a different tool — Pandoc usually produces cleaner output than md2pdf for long documents.

---

## Record the 90-second video (10 min)

**Beat sheet (don't go over 90 seconds):**

| Time | Action | Voiceover (paraphrase, don't read) |
|------|--------|------------------------------------|
| 0:00–0:15 | Show Claude.ai. Drag the lease PDF onto the message. | "This is the LeaseIQ pipeline. I'm uploading a real NNN retail lease from a property in [city]." |
| 0:15–0:35 | Cut to the Stage 2 JSON output, scroll briefly through the errors array. | "The agent extracts every clause, runs 17 audit checks, and produces a structured report." |
| 0:35–0:60 | Cut to the rendered audit PDF, top of page. Hold on the dollar total. | "Found $[X] in errors annually. Total lease-to-date impact $[Y]." |
| 0:60–0:80 | Zoom into the top error block — show the verbatim evidence quote. | "Highest impact: [error type]. Here's the lease language being violated." |
| 0:80–0:90 | Cut to a closing card or back to the PDF total. | "End-to-end in [N] seconds. We charge $4,500 per audit and guarantee $10K found or it's free." |

**Recording tips:**
- Do one clean take rather than chopping clips together — YC reviewers value a real product demo over a polished edit.
- Speak at conversational pace; 90 seconds is roughly 200–230 words.
- Mute Slack/iMessage/calendar notifications before recording.
- Record at 1920×1080 minimum.

**If the first take goes long:** cut the 0:60–0:80 zoom rather than rushing the headline number at 0:35.

---

## Upload & submit (5 min)

- [ ] Export recording as MP4 (QuickTime: File → Export As → 1080p).
- [ ] Upload to YouTube as **Unlisted** (not Private — YC reviewers need to open it without a Google login prompt).
- [ ] Copy the YouTube URL.
- [ ] Paste into the YC application's product-video field. Save the application.
- [ ] Sanity-check the link in an incognito window before final submit — confirms the unlisted setting actually works.

---

## Failure modes & quick fixes

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Stage 1 returns prose, not JSON | Model ignored "Output ONLY the JSON" rule | New conversation, re-paste prompt with "Return ONLY a JSON object — no prose, no markdown fences." prepended. |
| Stage 1 JSON is truncated | Lease is very long, hit output limit | Ask Claude to continue with "Continue the JSON from where you stopped." Concatenate manually before feeding to Stage 2. |
| Stage 2 reports 0 errors | Stage 1 missed CAM/tax exclusions | Re-run Stage 1, explicitly add: "Pay special attention to Section [CAM section number] exclusions — quote each excluded category verbatim." |
| Stage 2 reports 10+ errors at 95% confidence | Model is overcounting to please you | Re-run Stage 2 with: "Be extra conservative. Only include errors where the verbatim lease text and a clear math check both support the finding." Expect 2–5 real errors. |
| Spot-check fails on hero error | Hallucinated dollar figure or fabricated evidence quote | **Do not use this lease.** Switch to the backup. Hallucinated numbers will sink the demo if anyone re-runs the audit. |
| Rendered PDF looks ugly | md2pdf has weak table support | Re-render with Pandoc: `pandoc stage-3.md -o audit.pdf --pdf-engine=xelatex` |

---

## What this plan deliberately skips

To keep the 45-minute budget realistic, we are **not** doing any of the following before the YC submission:
- Wrapping the three stages in a Python script (per the production roadmap, that's week 1 post-submission).
- Building an eval set or measuring precision/recall.
- Specialty NNN clause types (medical office, restaurant, gym).
- A broker-facing UI, billing parser, public-records integration, or Stripe.

If any of those start feeling necessary to make the demo work, that's a sign the demo scope has crept. Cut features, not the deadline.
