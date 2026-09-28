// FICTIONAL SAMPLE AUDIT. Every name, address, figure and quote below is
// invented to show the Stage-2 output shape. None of it is taken from a
// real lease. Real audits are kept out of source control.

export const sampleAudit = {
  property: {
    tenant_name: 'Sample Tenant Co.',
    landlord_name: 'Example Landlord, LLC',
    premises_address: '100 Example Avenue, Suite 1, Anytown, USA',
    premises_sqft: 1200,
    project_sqft_stated: 12000,
    project_sqft_actual: 12240,
    pro_rata_share_stated_naive: '10.00%',
    pro_rata_share_actual_rent_roll: '9.80%',
    lease_commencement_date: 'January 2026',
    initial_term_years: 10,
    renewal_options: 'Two 5-year options (Section 2.4)',
    initial_base_rent_psf: 40.0,
    initial_base_rent_annual: 48000,
    nnn_escrow_monthly: 1000.0,
    nnn_escrow_annual: 12000,
  },
  supporting_documents: [
    { name: 'Example Plaza 2026 CAM Reconciliation Statement', issued: '2027-03-15', type: 'reconciliation' },
    { name: 'Example Plaza 2026 Operating Expense Detail', issued: '2027-03-10', type: 'gl_detail' },
  ],
  audit_summary: {
    total_dollar_impact_annual: 2310,
    total_dollar_impact_lease_to_date: 17150,
    errors_found_count: 3,
    high_confidence_errors_count: 2,
    audit_confidence_overall: 84,
    executive_summary:
      'A fictional walkthrough of what LeaseIQ returns. The reconciliation bills a leasing commission the lease explicitly excludes, charges a management fee above the lease cap, and uses a pro-rata denominator the lease never discloses. Two findings are direct billing errors with the lease text quoted; the third is a structural exposure to raise at the next renewal.',
  },
  errors: [
    {
      error_id: 'SMP-001',
      category: 'CAM',
      error_type: 'Leasing commission billed through CAM (excluded by Section 3.9)',
      description:
        'Line CAM-12 of the reconciliation charges $5,000 for a leasing commission on a neighbouring unit. Section 3.9 lists leasing commissions among the costs excluded from Common Expenses, so the tenant share should be zero.',
      lease_section: 'Lease §3.9 · Recon line CAM-12',
      dollar_impact_annual: 490,
      dollar_impact_lease_to_date: 490,
      confidence: 98,
      evidence: '"Common Expenses shall not include … leasing commissions or reserves." (Section 3.9, sample text)',
      evidence_type: 'reconciliation',
      recommended_action: 'Request removal of the $5,000 line from CAM and a refund of the $490 tenant share.',
    },
    {
      error_id: 'SMP-002',
      category: 'Management fee',
      error_type: 'Management fee above the 4% cap',
      description:
        'The reconciliation applies a 6% management fee to controllable CAM. Section 3.7 caps it at 4% of Common Expenses, excluding taxes and insurance.',
      lease_section: 'Lease §3.7 · Recon line MGMT-01',
      dollar_impact_annual: 720,
      dollar_impact_lease_to_date: 7200,
      confidence: 93,
      evidence: '"The management fee shall not exceed four percent (4%) of Common Expenses, excluding Taxes and Insurance." (Section 3.7, sample text)',
      evidence_type: 'reconciliation',
      recommended_action: 'Recalculate the fee at 4% and request a credit for the difference in every reconciled year.',
    },
    {
      error_id: 'SMP-003',
      category: 'Pro-rata share',
      error_type: 'Pro-rata denominator never disclosed',
      description:
        'The lease defines the tenant share against project area excluding common areas but never states that number. Against the rent roll the share could range from 9.8% to 10.9%, and the tenant has no way to verify which one is being billed.',
      lease_section: 'Lease §1.2(k)',
      dollar_impact_annual: 1100,
      dollar_impact_lease_to_date: 9460,
      confidence: 72,
      evidence: '"Tenant’s Share shall mean the ratio between the rentable area of the Premises and the rentable area of the Project (excluding any Common Areas)." (Section 1.2(k), sample text)',
      evidence_type: 'lease_text',
      recommended_action: 'Ask the landlord to state the denominator in writing and fix it in an amendment at renewal.',
    },
  ],
  human_review_items: [
    {
      item: 'Roof repair classified as CAM rather than capital',
      reason: 'Whether a large roof patch is a repair or a capital item decides if it can be passed through in one year. Worth disputing if the landlord will amortize it.',
    },
  ],
  missing_data:
    'To turn the structural finding into a confirmed overcharge, request the written pro-rata denominator and the vendor invoices behind the largest CAM lines.',
}
