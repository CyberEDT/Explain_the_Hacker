# ETH — Phase 2 Intelligence Accuracy Validation

This artifact defines the golden regression dataset and accuracy rules for the ETH analysis pipeline.

## Purpose

Define, for every representative input scenario:

- What the engine MAY detect.
- What evidence classification each finding must carry.
- Which MITRE mappings are valid.
- Which conclusions are prohibited.
- What must be true in all three analysis modes (LOW / MEDIUM / HIGH).

These rules are stricter than the current engine behavior in places. That is intentional: this dataset is the accuracy target, not a description of current behavior.

## Scope of this dataset

This dataset validates the **client-side deterministic ETH pipeline** as implemeted in this repo:

- `src/services/analysisAPI.js`
  - log extraction / indicator detection
  - `MISCONFIG_DB` pattern matching
  - `CORRELATION_RULES`
  - `buildCyberKillChainV4`
  - `techniqueV4` / MITRE shaping
  - `calculateRisk` / `calculateExposureRisk` / `calculateConfidence` / `calculateAccuracyAssessment`
  - IOC / mitigation / narrative builders
  - final result assembly
- `src/tools/ExplainTheHacker/useExplainHacker.js` — `normalizeResult`
- Presentation helpers that render evidence class / confidence / tactic labels

It does not validate the remote API. It does not validate UI cosmetics unrelated to accuracy.

## Core accuracy invariants

These apply to every scenario below.

### I-1. Never fabricate attack activity
The engine must never assert that an attack occurred unless there is direct evidence for it in the supplied inputs.

For this repo:
- Direct evidence exists only when a supplied log snippet produces an extracted indicator that the engine classifies as observed/verified.
- Exposure, misconfig pattern matches, and correlation rules are **not** direct evidence of an attack. They are evidence of exposure or weakness.

### I-2. Never mark a stage OBSERVED without direct evidence
A kill-chain stage must be `OBSERVED` only when there is direct log evidence for that stage.

In the current engine:
- `OBSERVED` should require an extracted behavioral indicator or other direct log evidence tied to that stage.
- Exposure alone must never raise a stage to `OBSERVED`.

### I-3. Distinguish exposure, exploitation, and confirmed compromise
- **Exposure:** service/port reachable, misconfig pattern matched. This is factual about the submitted data.
- **Exploitation:** evidence that a vulnerability was actually leveraged. In this engine, that requires log evidence such as command execution patterns, exploitation-pattern indicators, or explicit successful-auth + post-auth activity.
- **Confirmed compromise:** evidence of attacker success sufficient to conclude the target was compromised. That is a higher bar than exploitation and must not be inferred from exposure alone.

### I-4. Validate every MITRE mapping against behavior and evidence
A MITRE technique must be mapped only when:
- the technique actually describes the observed or strongly inferred behavior, **and**
- the evidence tier matches the claim.

Mapping merely because a technique description vaguely resembles the scenario is prohibited.

### I-5. Do not map techniques merely because descriptions appear related
Two scenarios can share keywords without sharing technique applicability. The engine must not map a technique simply because its description mentions a related word.

### I-6. Do not treat missing telemetry as proof of absence
Absence of a log indicator must not be presented as proof that an activity did not occur. It may support a weaker classification, but not a definitive negative claim.

### I-7. Separate deterministic findings from AI-generated interpretation
In this repo, the mock pipeline is deterministic. The dataset still requires that any interpretive language be labelled as inference or hypothesis, not as observed fact.

### I-8. Preserve evidence provenance
Every finding must trace back to one of:
- submitted port
- submitted misconfig text
- extracted log indicator / IOC
- deterministic correlation rule triggered by the above

No finding may appear without an explicit provenance path.

### I-9. Do not inflate confidence or intelligence quality
Confidence, risk, and accuracy numbers must reflect evidence richness, not just input richness. High scores must not be produced when the only inputs are ports and misconfig strings.

### I-10. Preserve existing LOW / MEDIUM / HIGH functionality
The accuracy rules must apply in all three modes. Mode changes presentation and visible detail, not the underlying evidence logic. LOW mode may hide detail, but must not fabricate stronger conclusions than the underlying result supports.

---

## Scenario dataset

Each scenario has:
- `id`
- `summary`
- `input` — the minimal reproducible input the engine should accept
- `expectedFindigs` — findings the engine is allowed to produce
- `expectedEvidence` — evidence classification each finding must carry
- `validMiter` — MITRE mappings that are acceptable
- `prohibited` — conclusions the engine must NOT produce
- `modeNotes` — any LOW/MEDIUM/HIGH-specific presentation rule

### S-01 Normal activity

**Summary:** No exposure, no misconfig, no suspicious telemetry.

**Input:**
- `openPorts: []`
- `misconfigurations: []`
- `logSnippet: ''`
- `intelligenceLevel: 'LOW'`

**Expected findings:**
- No exposure findings.
- No misconfiguration findings.
- No behavioral indicators.

**Expected evidence:**
- All categories empty.

**Valid MITRE:**
- None required.

**Prohibited:**
- Any claim of attack activity.
- Any kill-chain stage marked OBSERVED.
- Any risk/confidence inflation implying an attack profile.

**Mode notes:**
- LOW/MEDIUM/HIGH must all produce a no-evidence / no-exposure result.
- No technique mapping should be presented as observed.

---

### S-02 Port exposure without exploitation

**Summary:** One or more known ports exposed, no logs, no misconfig strings.

**Input:**
- `openPorts: [443]`
- `misconfigurations: []`
- `logSnippet: ''`
- `intelligenceLevel: 'LOW'`

**Expected findings:**
- Exposure finding: the submitted port is reachable.
- Service intelligence for the known port, including its static risk/exploitability metadata.

**Expected evidence:**
- Exposure finding: VERIFIED against submitted input.
- Any service-risk commentary: INFERRED / explanatory, not observed exploitation.

**Valid MITRE:**
- Only exposure-relevant recon-style mappings, clearly labelled inferred/hypothetical.
- No Initial Access / Execution / Persistence / C2 / Impact technique may be marked observed.

**Prohibited:**
- Any claim of exploitation, credential use, delivery, C2, or impact.
- Any stage marked OBSERVED.
- Any language implying the service itself is compromised.

**Mode notes:**
- HIGH mode may show richer exposure analysis, but must not convert exposure into an attack chain observation.

---

### S-03 Brute-force attempts without successful authentication

**Summary:** Log contains repeated authentication failures, but no successful login.

**Input:**
- `openPorts: [22]`
- `misconfigurations: []`
- `logSnippet: 'Failed password for root from 203.0.113.10 port 22 ssh2'`
- `intelligenceLevel: 'HIGH'`

**Expected findings:**
- Exposure finding for port 22.
- Behavioral indicator: repeated authentication failures.
- IP extracted from logs.

**Expected evidence:**
- Authentication-failure indicator: OBSERVED / verified against log text.
- Exposure: verified against submitted port.
- IP: extracted, not verified malicious.

**Valid MITRE:**
- Credential-access brute force mapping may be inferred from the behavioral indicator, with evidence tier matching the log extraction.
- Only if the indicator genuinely supports a brute-force pattern.

**Prohibited:**
- Any claim of successful authentication.
- Any claim of account compromise.
- Any claim of lateral movement, C2, or impact.
- Any stage marked OBSERVED beyond the authentication-failure evidence and direct log extractions.

**Mode notes:**
- The result must clearly show attempts only, not success.

---

### S-04 Brute-force attempts followed by suspicious successful authentication

**Summary:** Log contains both authentication failures and a subsequent successful authentication from the same or related source.

**Input:**
- `openPorts: [3389]`
- `misconfigurations: []`
- `logSnippet: 'Failed password for admin from 198.51.100.5 port 3389\nConnection accepted from 198.51.100.5'`
- `intelligenceLevel: 'HIGH'`

**Expected findings:**
- Exposure finding for port 3389.
- Behavioral indicator: authentication failures.
- Behavioral indicator: successful authentication event.

**Expected evidence:**
- Failures: OBSERVED from log.
- Success event: OBSERVED from log if the extractor supports it; otherwise INFERRED only if directly supported by extracted log content.
- IP: extracted, not verified malicious.

**Valid MITRE:**
- Initial access via external remote services may be INFERRED from the combination of exposed remote-access service and observed successful authentication.
- Credential-access brute force mappings must remain evidence-gated.

**Prohibited:**
- Claiming the success is malicious without additional evidence. A successful login is not by itself proof of compromise.
- Claiming privilege escalation or persistence without evidence.
- Marking exploitation or impact OBSERVED.

**Mode notes:**
- This is the canonical "suspicious but not proven" scenario. The report must preserve the distinction.

---

### S-05 Privilege escalation with direct evidence

**Summary:** Log contains direct privilege-escalation evidence.

**Input:**
- `openPorts: []`
- `misconfigurations: []`
- `logSnippet: 'user started process with elevated privileges'`
- `intelligenceLevel: 'HIGH'`

**Expected findings:**
- Behavioral indicator: privilege-escalation pattern.

**Expected evidence:**
- Privilege-escalation indicator: OBSERVED from log, if extraction supports it.

**Valid MITRE:**
- Privilege-escalation technique mapping allowed where the log evidence directly supports it.

**Prohibited:**
- Claiming initial access method without evidence.
- Claiming persistence, C2, or impact without evidence.
- Expanding the finding into a full attack chain beyond what the log supports.

**Mode notes:**
- Direct evidence lets this stage be stronger, but other stages remain unsupported unless also evidenced.

---

### S-06 Privilege escalation indicators without sufficient evidence

**Summary:** Log contains ambiguous or weak privilege-escalation-related text, but not conclusive evidence.

**Input:**
- `openPorts: []`
- `misconfigurations: []`
- `logSnippet: 'privilege escalation check completed'`
- `intelligenceLevel: 'HIGH'`

**Expected findings:**
- Possibly an extracted indicator only if the extractor treats the text as relevant.

**Expected evidence:**
- Any extraction must be classified low/insufficient confidence, not as confirmed privilege escalation.

**Valid MITRE:**
- None should be marked observed.
- Any mapping must be hypothetical/insufficient-evidence and clearly labelled as such.

**Prohibited:**
- Treating ambiguous text as confirmed privilege escalation.
- Mapping privilege-escalation techniques as observed.

**Mode notes:**
- HIGH mode must not over-interpret weak text.

---

### S-07 Confirmed persistence

**Summary:** Log contains direct persistence-mechanism evidence.

**Input:**
- `openPorts: []`
- `misconfigurations: []`
- `logSnippet: 'persistence mechanism installed'`
- `intelligenceLevel: 'HIGH'`

**Expected findings:**
- Behavioral indicator: persistence installation.

**Expected evidence:**
- Persistence indicator: OBSERVED from log, if extraction supports it.

**Valid MITRE:**
- Persistence technique mapping allowed where supported by the evidence.

**Prohibited:**
- Claiming initial access, exploitation, or impact without evidence.
- Inferring a complete attack chain beyond the supported stage.

**Mode notes:**
- Persistence evidence supports that stage, not the whole chain.

---

### S-08 Suspected command and control

**Summary:** Log contains external IPs or C2-related references, but not confirmed C2.

**Input:**
- `openPorts: [443]`
- `misconfigurations: []`
- `logSnippet: 'outbound connection to 203.0.113.50'`
- `intelligenceLevel: 'HIGH'`

**Expected findings:**
- Exposure finding for port 443.
- Extracted external IP.

**Expected evidence:**
- IP: extracted, not verified malicious.
- Any C2 conclusion: INFERRED at most, and only after threat-intel correlation is noted as required.

**Valid MITRE:**
- C2-related mappings may be hypothetical/inferred and must be labelled as requiring correlation.

**Prohibited:**
- Claiming confirmed C2 from IP presence alone.
- Marking C2 stage OBSERVED unless there is direct C2 framework evidence in the log.

**Mode notes:**
- This is a common false-positive trap. Presence of an external IP is not C2.

---

### S-09 Confirmed data exfiltration

**Summary:** Log contains exfiltration-pattern evidence.

**Input:**
- `openPorts: [445]`
- `misconfigurations: []`
- `logSnippet: 'data exfiltration detected'`
- `intelligenceLevel: 'HIGH'`

**Expected findings:**
- Exposure finding for port 445.
- Behavioral indicator: data exfiltration pattern.

**Expected evidence:**
- Exfiltration indicator: OBSERVED from log, if extraction supports it.

**Valid MITRE:**
- Exfiltration/impact technique mapping allowed where supported by the evidence.

**Prohibited:**
- Claiming the exfiltration succeeded to a specific destination or with specific data without evidence.
- Marking unrelated stages OBSERVED.

**Mode notes:**
- Exfiltration evidence may justify impact-stage language, but only for that stage.

---

### S-10 Multi-stage attack scenario

**Summary:** Log contains evidence for more than one stage, e.g. execution plus persistence.

**Input:**
- `openPorts: [445]`
- `misconfigurations: ['SMBv1 enabled']`
- `logSnippet: 'command execution detected\npersistence mechanism installed'`
- `intelligenceLevel: 'HIGH'`

**Expected findings:**
- Exposure finding for port 445.
- Misconfiguration match if the string matches a supported pattern.
- Behavioral indicators for execution and persistence if extraction supports them.

**Expected evidence:**
- Each observed stage must be individually evidenced.
- Exposure and misconfig remain separate evidence classes from observed telemetry.

**Valid MITRE:**
- Technique mapping per evidenced stage only.
- Lateral movement / exploitation mappings only where evidence supports them.

**Prohibited:**
- Assuming later stages from earlier ones without evidence.
- Marking unsupported stages OBSERVED.
- Treating one evidenced stage as proof of a full attack chain.

**Mode notes:**
- Multi-stage evidence is the only case where multiple stages may be observed, and only for the evidenced stages.

---

### S-11 Conflicting and incomplete telemetry

**Summary:** Log contains both suspicious and benign signals, or incomplete signals that do not resolve to a clear conclusion.

**Input:**
- `openPorts: [80, 443]`
- `misconfigurations: ['MFA not enabled']`
- `logSnippet: 'failed login attempt\nadmin logged in from trusted IP'`
- `intelligenceLevel: 'HIGH'`

**Expected findings:**
- Exposure findings for ports 80 and 443.
- Misconfiguration match if supported.
- Failed-login indicator if extraction supports it.
- Successful login indicator if extraction supports it.

**Expected evidence:**
- Each indicator classified by its actual strength.
- Conflicting signals must not be resolved by assuming the worst.

**Valid MITRE:**
- Only where individual signals support it.

**Prohibited:**
- Collapsing conflicting telemetry into a single unsupported compromise conclusion.
- Treating incomplete telemetry as proof of absence or proof of presence.

**Mode notes:**
- Incomplete telemetry should reduce confidence and accuracy, not increase narrative certainty.

---

## Per-mode expectations

### LOW
- Minimal narrative.
- No MITRE matrix.
- No detailed evidence classification UI.
- Still must not fabricate observations.
- Still must not mark any stage OBSERVED without evidence.

### MEDIUM
- Moderate narrative.
- May show selected MITRE / exposure analysis.
- Must preserve evidence-tier distinctions for any content shown.

### HIGH
- Full exposure analysis.
- Full MITRE mapping where evidence supports it.
- Full kill chain with correct evidence tiers.
- Must make the observed/inferred/hypothetical distinction clearest here, because this is where misuse risk is highest.

---

## Pass criteria

A scenario passes when:

1. All expected findings are present with correct evidence classification.
2. All prohibited conclusions are absent from the result and from the rendered output.
3. Any MITRE mapping present is behaviorally valid and correctly tiered.
4. Confidence, risk, and accuracy values do not imply more evidence than exists.
5. The result is identical in evidentiary meaning across LOW/MEDIUM/HIGH, differing only in presentation/detail.
6. Every finding has an explicit provenance path.

---

## Suggested regression harness shape

For each scenario, assert:

- `result.verifiedFindings` contains only what the scenario allows.
- `result.inferredRisks` does not contain prohibited threat assertions for that scenario.
- `result.killChain` stage statuses match the allowed evidence tiers.
- `result.ATTACKMappings` contains only valid mappings and no observed mapping unsupported by evidence.
- `result.iocList` does not present extracted entities as verified malicious without enrichment.
- `result.confidenceScore` and `result.accuracyAssessment` are consistent with evidence richness.
- `normalizeResult(result)` does not change evidentiary meaning.
- For each mode, render output does not introduce prohibited conclusions through presentation.

---

## Out of scope for this dataset

- Remote API behavior.
- UI visual design unrelated to evidence/confidence/MITRE accuracy.
- Non-ETH tools in the repo.

---

## Notes for implementation

- Start by asserting the invariant violations that this dataset is designed to catch.
- Add fixtures as deterministic inputs; do not rely on live logs or network.
- When a scenario is currently failing, treat that as an accuracy defect to fix, not as a reason to weaken the dataset.
- Do not weaken MITRE mapping rules just to make scenarios pass.
- Do not convert inferred content into observed content to satisfy any stakeholder expectation.
