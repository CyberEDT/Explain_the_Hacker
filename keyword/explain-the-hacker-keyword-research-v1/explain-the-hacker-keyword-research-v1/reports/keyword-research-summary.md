# Explain The Hacker keyword research summary (v1)

Research date: 2026-10-24. Status: **partial, qualitative**. No volume, difficulty, CPC, trend or ranking data was obtained, and none is stated. Source IDs resolve in the table at the end.

## 1. Read first

- Fetching the ETH home page returned only its head meta tags [H01]: title, description, robots (index, follow) and Open Graph. Body text and features were not visible, so the product scope here comes from that metadata (attack chains, ATT&CK-mapped threat analysis, IOC, red team, SOC training) and your CyberEDT notes.
- This is the top finding. If the page is client-rendered, search engines may see little text. Confirm in Search Console URL Inspection.
- Web search only; Keyword Planner, Trends and SEO tools were not accessible.

## 2. Core keywords (best fit)

- attack chain visualization (P0, score 79.0) [H04] [H05]
- cyber kill chain explained (P0, score 79.0) [H04] [H03]
- how hackers think (P1, score 79.0) [H14] [H08]
- think like a hacker (P1, score 79.0) [H14] [H08]
- mitre attack techniques explained (P1, score 79.0) [H02] [H07]
- tactics techniques procedures explained (P1, score 79.0) [H02] [H19]
- attack chain simulator (P0, score 78.0) [H05] [H13]
- cyber attack simulation tool (P0, score 78.0) [H05] [H13] [H09]

Scores are provisional and give no credit for unverified demand. 'Attack chain simulator' and similar wordings were not seen as queries; they are researcher-derived from related tools.

## 3. Competitive picture

- Funded training platforms dominate SOC and blue team terms: Hack The Box (which absorbed LetsDefend) [H08][H13], CyberDefenders [H12], Infosec Skills [H14]. I would not target those head terms.
- ATT&CK learning is largely paid or video-based: a Coursera module [H02] and Antisyphon classes, one listed at USD 575 [H06][H07].
- Open-source chain visualizers exist but are developer-oriented [H04][H05].
- MITRE itself is the authoritative result for groups and techniques [H18].

## 4. Gaps

- Home page content not retrievable as text (observed)
- Beginner narrative attack-chain learning (hypothesis)
- ATT&CK learning is largely paid or video-based (observed_with_limited_sample)
- Platform landscape is well funded (observed)

The beginner narrative gap is a hypothesis from snippets, not a confirmed finding.

## 5. Recommended pages

1. ETH landing page with crawlable text [co_001]
2. Kill chain and attack path explained [co_002]
3. ATT&CK techniques for beginners [co_003]
4. Attacker mindset guide [co_004]
5. Campaign walkthrough series from your campaign dataset [co_005]
6. Hold: ETH vs SOC platforms comparison until features are confirmed [co_006]

Keep content defensive and non-operational.

## 6. Next steps

- Open ETH in a browser or share its feature list so keywords match actual features.
- Check indexing and rendering in Search Console URL Inspection.
- Keyword Planner and Trends for P0/P1 terms; real India SERPs.
- Verify competitor free tiers and pricing on official pages.
- Check that campaign walkthroughs cite verified sources.

No ranking, traffic or revenue outcome is implied.

## Source table

| ID | Title | URL |
|---|---|---|
| H01 | Explain The Hacker (own site; only head meta tags returned to fetch) | https://explainthehacker.cyberedt.com/ |
| H02 | Coursera / Packt: MITRE ATT&CK Framework foundations | https://www.coursera.org/de-DE/learn/packt-mitre-att-ck-framework-foundations-for-cyber-defense-onrdn |
| H03 | NICCS / Cybrary: practical threat modeling course | https://niccs.cisa.gov/education-training/catalog/cybrary/practical-threat-modeling |
| H04 | GitHub: AttackFlow kill chain editor and visualizer | https://github.com/Pr0cella/AttackFlow |
| H05 | GitHub: cyber range simulator (ATT&CK-mapped attack simulation) | https://github.com/aidhas23/cyber-range-simulator |
| H06 | Antisyphon: attack emulation tools course | https://www.antisyphontraining.com/on-demand-courses/attack-emulation-tools-atomic-red-team-caldera-and-more-w-carrie-roberts/ |
| H07 | Antisyphon: MITRE ATT&CK framework and tools class | https://www.antisyphontraining.com/?p=8449 |
| H08 | Hack The Box: LetsDefend joins HTB | https://www.hackthebox.com/blog/welcome-letsdefend?hsLang=en |
| H09 | ShieldRiser C-SOC attack scenario platform (listing) | https://globalcybersecuritynetwork.com/company/shieldriser/ |
| H10 | Security Blue Team / SourceForge listing (CyberDefenders text) | https://sourceforge.net/software/product/Security-Blue-Team/ |
| H11 | LetsDefend help: what is LetsDefend | https://help.letsdefend.io/en/articles/8742685-what-is-letsdefend |
| H12 | CyberDefenders labs | https://cyberdefenders.org/labs |
| H13 | Hack The Box Threat Range | https://www.hackthebox.com/business/threat-range-demo?hsLang=en |
| H14 | Infosec Skills cyber range labs | https://www.infosecinstitute.com/range |
| H15 | Metana: best SOC analyst training platform (pricing claims unverified) | https://metana.io/blog/what-is-the-best-soc-analyst-training-platform/ |
| H16 | EthicalHacking.ai LetsDefend review | https://ethicalhacking.ai/tools/letsdefend |
| H17 | Fraunhofer SIT cyber range blue team training | https://cyberrange.sit.fraunhofer.de/blue-team-basic-en.php |
| H18 | MITRE ATT&CK Groups | https://attack.mitre.org/groups |
| H19 | KELA: APT profiling with MITRE framework | https://kelacyber.com/blog/effective-threat-hunting-with-apt-profiling-leveraging-mitre-framework |
| H20 | ATT&CK Navigator analysis guide (skill listing; shows Navigator URL) | https://www.claudemarket.ai/skills/mukul975/analyzing-apt-group-with-mitre-navigator |