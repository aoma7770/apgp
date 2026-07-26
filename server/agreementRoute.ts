import type { Express, Request, Response } from "express";

export function registerAgreementRoute(app: Express) {
  // Serve a printable/downloadable referral agreement HTML page
  app.get("/api/agreements/:providerId/:leadId", (req: Request, res: Response) => {
    const { leadId } = req.params;
    const { ref, signatory, org, date, lead } = req.query as Record<string, string>;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>APGP Referral Agreement — ${ref || `Lead ${leadId}`}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; color: #1a1a1a; background: #fff; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 2px solid #0A2342; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 28pt; font-weight: bold; color: #0A2342; letter-spacing: 4px; }
    .logo-sub { font-size: 9pt; color: #B08D57; letter-spacing: 2px; margin-top: 4px; }
    .doc-title { font-size: 16pt; font-weight: bold; color: #0A2342; margin-top: 16px; }
    .doc-meta { font-size: 9pt; color: #666; margin-top: 6px; }
    .lead-ref { background: #f0f8ff; border: 1px solid #0A2342; border-radius: 6px; padding: 12px 16px; margin: 20px 0; }
    .lead-ref strong { color: #0A2342; }
    h2 { font-size: 12pt; color: #0A2342; margin: 24px 0 8px; border-left: 3px solid #B08D57; padding-left: 10px; }
    p { line-height: 1.7; margin-bottom: 10px; font-size: 10.5pt; }
    .parties-table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    .parties-table td { padding: 6px 10px; border: 1px solid #ddd; font-size: 10pt; }
    .parties-table td:first-child { background: #f5f5f5; font-weight: bold; width: 35%; color: #0A2342; }
    .signature-block { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px; }
    .sig-row { display: flex; gap: 40px; margin-top: 16px; }
    .sig-col { flex: 1; }
    .sig-line { border-bottom: 1px solid #333; height: 40px; margin-bottom: 6px; }
    .sig-label { font-size: 9pt; color: #666; }
    .sig-value { font-size: 10pt; font-weight: bold; color: #0A2342; margin-top: 4px; }
    .signed-badge { background: #0A2342; color: white; padding: 4px 12px; border-radius: 4px; font-size: 9pt; display: inline-block; margin-top: 8px; }
    .footer { margin-top: 40px; text-align: center; font-size: 8.5pt; color: #999; border-top: 1px solid #eee; padding-top: 16px; }
    @media print {
      body { padding: 20px; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">APGP</div>
    <div class="logo-sub">ACCOMMODATION PROVIDER GROWTH PROGRAM</div>
    <div class="doc-title">Referral &amp; Joint Venture Agreement</div>
    <div class="doc-meta">MOU — APGP · Version No: 01 · Version Date: 06/01/2026 · Executed Electronically</div>
  </div>

  <div class="lead-ref">
    <strong>Lead Reference:</strong> ${ref || `LEAD-${leadId}`}<br/>
    <strong>Enquiry Details:</strong> ${decodeURIComponent(lead || 'N/A')}<br/>
    <strong>Date Signed:</strong> ${decodeURIComponent(date || new Date().toLocaleDateString('en-AU'))}
  </div>

  <h2>1. Parties</h2>
  <table class="parties-table">
    <tr><td>Ausnew Support Services Pty Ltd</td><td>ABN: 31 620 493 941 ("Ausnew")</td></tr>
    <tr><td>Accommodation Provider</td><td>${decodeURIComponent(org || 'N/A')}</td></tr>
    <tr><td>Authorised Signatory</td><td>${decodeURIComponent(signatory || 'N/A')}</td></tr>
    <tr><td>Date of Execution</td><td>${decodeURIComponent(date || 'N/A')}</td></tr>
  </table>

  <h2>2. Partnership Model</h2>
  <p>The Provider has elected to participate in the APGP under the partnership model confirmed at the time of signing. The rights and obligations applicable to each partnership model are governed by the APGP Terms of Service (MOU).</p>

  <h2>3. Fees and Commercial Terms</h2>
  <p>All fees payable under this Agreement are payable by the Accommodation Provider only and are not charged to Participants, their families, or their NDIS plans. Fees are set out in the Quote issued by Ausnew prior to execution.</p>

  <h2>4. Incorporation of APGP Terms of Service (MOU)</h2>
  <p>This Agreement incorporates by reference the Accommodation Provider Growth Program – Terms of Service (MOU), available at: <strong>https://www.apgpaccommodation.com.au/terms</strong></p>
  <p>The Provider acknowledges that it has read and understands the APGP Terms of Service (MOU), and agrees to be bound by its terms.</p>

  <h2>5. Term and Termination</h2>
  <p>This Agreement commences on the date of execution and continues until terminated by either party on thirty (30) days' written notice, subject to accrued rights and obligations.</p>

  <h2>6. Governing Law</h2>
  <p>This Agreement is governed by the laws of New South Wales, and the parties submit to the non-exclusive jurisdiction of the courts of that State.</p>

  <div class="signature-block">
    <h2>7. Execution</h2>
    <p>This Agreement has been executed electronically. Electronic execution is valid and binding in accordance with the Electronic Transactions Act 1999 (Cth).</p>
    <div class="sig-row">
      <div class="sig-col">
        <div class="sig-line"></div>
        <div class="sig-label">For Ausnew Support Services Pty Ltd</div>
        <div class="sig-value">Ausnew Support Services</div>
        <div class="sig-label">ABN: 31 620 493 941</div>
      </div>
      <div class="sig-col">
        <div class="sig-line"></div>
        <div class="sig-label">For the Accommodation Provider</div>
        <div class="sig-value">${decodeURIComponent(signatory || 'N/A')}</div>
        <div class="sig-label">${decodeURIComponent(org || 'N/A')}</div>
        <div class="signed-badge">✓ Electronically Signed ${decodeURIComponent(date || '')}</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>Accommodation Provider Growth Program · support@apgpaccommodation.com.au · (02) 9669 9302</p>
    <p>Lead Reference: ${ref || `LEAD-${leadId}`} · Generated: ${new Date().toLocaleString('en-AU')}</p>
    <button class="print-btn" onclick="window.print()" style="margin-top:12px; padding:8px 20px; background:#0A2342; color:white; border:none; border-radius:4px; cursor:pointer; font-size:10pt;">Print / Save as PDF</button>
  </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", `inline; filename="APGP_Agreement_${ref || leadId}.html"`);
    res.send(html);
  });
}
