import { afterAll, beforeAll, describe, expect, it } from "vitest";
import express from "express";
import { readFileSync } from "node:fs";
import type { Server } from "node:http";
import { registerAgreementRoute } from "./agreementRoute";

describe("Silara Marketing Referral Agreement v06", () => {
  let server: Server;
  let baseUrl = "";

  beforeAll(async () => {
    const app = express();
    registerAgreementRoute(app);
    await new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", () => {
        const address = server.address();
        const port = typeof address === "object" && address ? address.port : 0;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  });

  it("renders the approved v06 agreement with the fixed successful-referral fee and no legacy branding", async () => {
    const response = await fetch(`${baseUrl}/api/agreements/1/99?ref=M12-123456&org=Example%20Provider&signatory=Jordan%20Lee&date=13%20August%202026`);
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("Silara Marketing Referral Agreement v06");
    expect(html).toContain("$3,000.00");
    expect(html).toContain("$3,300.00");
    expect(html).toContain("fourteen (14) days");
    expect(html).toContain("five (5) business days");
    expect(html).toContain("ten per cent (10%)");
    expect(html).toContain("remains effective indefinitely");
    expect(html).not.toContain("Ausnew Support Services");
    expect(html).not.toContain("Joint Venture Agreement");
    expect(html).not.toContain("Quote issued by Ausnew");
  });

  it("keeps exact fees in the referral agreement while Terms of Service aligns on principles and document priority", () => {
    const terms = readFileSync("client/src/pages/Terms.tsx", "utf8");
    const modal = readFileSync("client/src/components/ReferralAgreementModal.tsx", "utf8");

    expect(modal).toContain("Version No: 06");
    expect(modal).toContain("$3,000.00");
    expect(modal).toContain("$3,300.00");
    expect(modal).toContain("signatureDataUrl.length > 0");
    expect(modal).toContain("form.authorisedCheckbox");
    expect(modal).toContain("form.termsCheckbox");
    expect(terms).toContain("signed Referral Agreement prevails");
    expect(terms).toContain("These Terms do not publish or vary that amount");
    expect(terms).toContain("within seven (7) days");
    expect(terms).not.toContain("Vacancy Protection Retainer");
    expect(terms).not.toContain("2% of annual NDIS funding allocation");
    expect(terms).not.toContain("$150 per week");
    expect(terms).not.toContain("$50 + GST");
  });
});
