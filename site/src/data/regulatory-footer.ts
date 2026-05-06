/**
 * Regulatory footer paragraph — synced from public live homepage footer (2026-05-04;
 * see LIVE-SITE-EXTRACT.md + FOOTER-REGULATORY-CHECKLIST.md §7).
 * Re-validate with compliance before each material site change or annual review.
 */
export function getRegulatoryFooterText(copyrightYear: number): string {
  return [
    `© ${copyrightYear} Schillings International LLP. SCHILLINGS is a trading name of Schillings International LLP, Schillings Critical Risk Limited, Schillings Communications LLP, Schillings Ireland LLP and Schillings International (USA) LLP.`,
    'Schillings International LLP is a limited liability partnership registered in England and Wales with registration number OC398731. Schillings International LLP is an Alternative Business Structure regulated and authorised by the Solicitors Regulation Authority.',
    'Schillings Critical Risk Limited is a limited company registered in England and Wales with registration number 11308220 and registered office at 12 Arthur Street, London EC4R 9AB.',
    'Schillings Communications LLP is an unregulated limited liability partnership, which is a subsidiary of Schillings International LLP registered in England and Wales with registration number OC445763.',
    'Schillings Ireland LLP is a limited liability partnership registered in the Republic of Ireland, regulated by the Law Society of Ireland under firm number F11151 and authorised by the Legal Services Regulatory Authority to operate as a limited liability partnership under number 1262644. A list of its partners is available at its principal place of business at 9 Pembroke Street Upper, Dublin 2, D02 KR83, Ireland.',
    'Schillings International (USA) LLP is a registered limited liability partnership organised and existing under the laws of the State of Delaware, United States of America, whose principal place of business is at 1101 Brickell Avenue, South Tower, 8th Floor, Miami, FL 33131. Our US based attorneys are registered as foreign legal consultants in the State of Florida.',
    'ATTORNEY ADVERTISING',
  ].join(' ');
}
