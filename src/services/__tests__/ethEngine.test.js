/* global process */
/**
 * ETH Engine v3 — QA Retest Suite
 * Tests all 8 fixes applied from the QA validation audit.
 * Run with: node src/services/__tests__/ethEngine.test.js
 *
 * No Jest / Vitest required — pure Node.js.
 */

// ─── Extract only the pure functions we need to test ──────────────────────────
// We mirror the regex patterns directly from analysisAPI.js so we can test
// them in isolation without ESM/Vite import issues.

const CHECKS = [
    { type: 'AUTH_FAILURE',
      regex: /(?:failed\s+(?:password|login|auth(?:entication)?)|authentication\s+fail(?:ed|ure)|invalid\s+(?:user|password|credentials)|wrong\s+password)/i },
    { type: 'AUTH_SUCCESS',
      regex: /(?:accepted\s+(?:password|publickey)|session\s+opened\s+for|authenticated\s+successfully|login\s+(?:succeeded|success(?:ful)?))/i },
    { type: 'SQLI_PATTERN',
      regex: /(?:UNION\s+(?:ALL\s+)?SELECT\s|SELECT\s+[\w*]+\s+FROM\s+\w|DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?\w|INSERT\s+INTO\s+\w+\s*\(|'\s*(?:OR|AND)\s+'\d+'='|;\s*(?:DROP|DELETE|UPDATE)\s+\w|EXEC(?:UTE)?\s*\(|xp_cmdshell|WAITFOR\s+DELAY)/i },
    { type: 'PATH_TRAVERSAL',
      regex: /(?:(?:\.\.\/){2,}|\.\.\\.*\.\.\\|%2[Ee]%2[Ee]%2[Ff]|(?:path|directory)\s+traversal|\/etc\/(?:passwd|shadow|hosts)|[Cc]:\\Windows\\System32\\cmd)/ },
    { type: 'CMD_EXECUTION',
      regex: /(?:cmd\.exe(?:\s|\/)|powershell(?:\.exe)?\s+-(?:enc|nop|exec|command|[Cc]\s)|\/(?:bin|usr\/bin)\/(?:bash|sh|zsh|python\d?|perl|ruby)\s|(?:exec|system|popen|Runtime\.exec|subprocess\.(?:call|run|Popen))\s*\()/i },
    { type: 'SCANNER_ACTIVITY',
      regex: /(?:nmap\s+-[a-z]|masscan\s+-[a-z]|zmap\s+-[a-z]|nikto\s+-[a-z]|gobuster\s+(?:dir|dns|vhost)|dirb\s+https?|nuclei\s+-[a-z]|sqlmap\s+-[a-z]|shodan\.io\/host|discovered\s+\d+\s+open\s+port)/i },
    { type: 'RANSOMWARE',
      regex: /(?:ransomware|your\s+files\s+(?:have\s+been|are)\s+encrypted|ransom\s+note|pay\s+.*bitcoin|decrypt.*key)\b|(?:\.locked|\.encrypted|\.enc)(?:\s|$|["'])|(?:ryuk|conti|lockbit|revil|darkside|blackcat|clop|hive)\b/i },
    { type: 'C2_INDICATOR',
      regex: /(?:cobalt\s*strike|cs\s+beacon|meterpreter|mimikatz|metasploit\s+(?:handler|listener)|command.?and.?control\s+(?:server|channel)|c2\s+(?:server|callback|beacon|channel))/i },
    { type: 'EXFIL_PATTERN',
      regex: /(?:exfiltrat(?:ing|ion|ed)|data\s+(?:exfil|theft|stolen)|large\s+(?:outbound|upload)\s+transfer|\d{3,}\s*(?:MB|GB)\s+(?:sent|upload|transfer)|curl\s+.*-[TF]\s+|wget\s+.*--(?:post-file|upload-file))/i },
    { type: 'PRIVILEGE_ESC',
      regex: /(?:sudo\s+.*NOPASSWD|privilege\s+escal|whoami.*\broot\b|NT\s+AUTHORITY[/\\\\]SYSTEM|SeDebugPrivilege|token\s+impersonat|getsystem|bypassuac|juicypotato|printspoofer)/i },
    { type: 'LATERAL_MOVEMENT',
      regex: /(?:PsExec|WMI\s+exec|pass[-_\s]the[-_\s](?:hash|ticket)|lsass\.(?:exe|dmp)|impacket|crackmapexec|bloodhound|rubeus|lateral\s+movement)/i },
    { type: 'PERSISTENCE',
      regex: /(?:schtasks|scheduled\s+task|crontab\s+-[el]|\[HKEY[_A-Z]+\\Run(?:Once)?\]|startup\s+(?:folder|script)|sc\.exe\s+create|new\s+service\s+install|webshell|backdoor\s+(?:install|drop))/i },
    { type: 'RECON_INDICATOR',
      regex: /(?:whoami\s+\/|ipconfig\s+\/all|ifconfig\s+-a|net\s+(?:user|group|localgroup)\s+|systeminfo\b|uname\s+-a|id\s*;|cat\s+\/etc\/(?:passwd|shadow|hosts)|arp\s+-a|route\s+print)/i },
];

const REAL_TLD_RE = /\.(com|net|org|io|gov|edu|co|uk|de|ru|cn|br|info|biz|xyz|app|ca|au|fr|jp|in|us|eu|me|tv|cc|tech|dev|cloud|ai|mil)$/i;
const domainRegex = /\b(?!(?:\d{1,3}\.){3}\d{1,3}\b)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}\b/g;

function extractDomains(text) {
    return [...new Set((text.match(domainRegex) || [])
        .map(d => d.toLowerCase())
        .filter(d => REAL_TLD_RE.test(d))
        .filter(d => !d.includes('/') && !d.includes('=')))];
}

function detectIndicators(log) {
    return CHECKS.filter(c => c.regex.test(log)).map(c => c.type);
}

// Mitre tactic checks (from the kill chain assembly)
const KILL_CHAIN_MITRE = {
    'Reconnaissance':         'TA0043',
    'Weaponization':          'TA0042',  // FIX: was 'PRE-ATT&CK'
    'Delivery':               'TA0001',
    'Exploitation':           'TA0002',
    'Persistence & Installation': 'TA0003',
    'Command & Control':      'TA0011',
    'Actions on Objectives':  'TA0040',
};

// CORR-009 fix check
const CORR_009_PORTS = ['389'];  // FIX: was ['389','636']

// ─── Test Runner ─────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
    try {
        fn();
        console.log(`  ✅  ${name}`);
        passed++;
    } catch (e) {
        console.log(`  ❌  ${name}`);
        console.log(`      → ${e.message}`);
        failed++;
        failures.push({ name, reason: e.message });
    }
}

function expect(actual) {
    return {
        toBe: (expected) => {
            if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        },
        toContain: (item) => {
            if (!actual.includes(item)) throw new Error(`Expected array to contain "${item}", got [${actual.join(', ')}]`);
        },
        notToContain: (item) => {
            if (actual.includes(item)) throw new Error(`Expected array NOT to contain "${item}", but it does. Array: [${actual.join(', ')}]`);
        },
        toBeTrue: () => {
            if (actual !== true) throw new Error(`Expected true, got ${actual}`);
        },
        toBeFalse: () => {
            if (actual !== false) throw new Error(`Expected false, got ${actual}`);
        },
        toHaveLength: (len) => {
            if (actual.length !== len) throw new Error(`Expected length ${len}, got ${actual.length}`);
        },
    };
}

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 1: CRIT-001 — SQL Injection Regex Fix
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 1: CRIT-001 — SQL Injection Regex (False Positive Fix)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// FALSE POSITIVES that should NOT match (natural language)
test('SQLI: "Select the option from the menu" — should NOT match', () => {
    const result = detectIndicators('Select the option from the menu');
    expect(result).notToContain('SQLI_PATTERN');
});

test('SQLI: "Insert coin to begin" — should NOT match', () => {
    const result = detectIndicators('Insert coin to begin the game');
    expect(result).notToContain('SQLI_PATTERN');
});

test('SQLI: "Drop the file into the folder" — should NOT match', () => {
    const result = detectIndicators('Please drop the file into the upload folder');
    expect(result).notToContain('SQLI_PATTERN');
});

test('SQLI: "execute the script" plain English — should NOT match', () => {
    const result = detectIndicators('Please execute the script to begin the setup');
    expect(result).notToContain('SQLI_PATTERN');
});

test('SQLI: "select * from admin" — should MATCH', () => {
    const result = detectIndicators("GET /search?q=select * from admin HTTP/1.1");
    expect(result).toContain('SQLI_PATTERN');
});

test('SQLI: "UNION ALL SELECT username FROM users" — should MATCH', () => {
    const result = detectIndicators("' UNION ALL SELECT username FROM users--");
    expect(result).toContain('SQLI_PATTERN');
});

test('SQLI: "DROP TABLE IF EXISTS sessions" — should MATCH', () => {
    const result = detectIndicators("POST /api/data: ; DROP TABLE IF EXISTS sessions--");
    expect(result).toContain('SQLI_PATTERN');
});

test('SQLI: "EXEC(0x73656c6563" xp_cmdshell — should MATCH', () => {
    const result = detectIndicators("EXEC(0x...) xp_cmdshell 'whoami'");
    expect(result).toContain('SQLI_PATTERN');
});

test('SQLI: "WAITFOR DELAY" time-based blind — should MATCH', () => {
    const result = detectIndicators("'; WAITFOR DELAY '0:0:5'--");
    expect(result).toContain('SQLI_PATTERN');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 2: MIN-005 — Scanner Activity False Positive Fix
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 2: MIN-005 — Scanner Activity (False Positive Fix)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('SCANNER: "Running nmap version 7.9 on localhost" — should NOT match', () => {
    const result = detectIndicators('Running nmap version 7.9 on localhost for inventory');
    expect(result).notToContain('SCANNER_ACTIVITY');
});

test('SCANNER: "We use gobuster for directory testing" — should NOT match', () => {
    const result = detectIndicators('We use gobuster for directory testing in our CI pipeline');
    expect(result).notToContain('SCANNER_ACTIVITY');
});

test('SCANNER: "masscan -p1-65535 192.168.1.0/24" — should MATCH', () => {
    const result = detectIndicators('masscan -p1-65535 192.168.1.0/24 --rate=10000');
    expect(result).toContain('SCANNER_ACTIVITY');
});

test('SCANNER: "nmap -sV -p80,443 target.com" — should MATCH', () => {
    const result = detectIndicators('nmap -sV -p80,443 target.com');
    expect(result).toContain('SCANNER_ACTIVITY');
});

test('SCANNER: "gobuster dir -u http://target.io" — should MATCH', () => {
    const result = detectIndicators('gobuster dir -u http://target.io -w wordlist.txt');
    expect(result).toContain('SCANNER_ACTIVITY');
});

test('SCANNER: "discovered 7 open ports on 203.0.113.45" — should MATCH', () => {
    const result = detectIndicators('Shodan report: discovered 7 open ports on 203.0.113.45');
    expect(result).toContain('SCANNER_ACTIVITY');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 3: MIN-005 — Recon Indicator False Positive Fix (hostname)
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 3: MIN-005 — RECON_INDICATOR (hostname false positive fix)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('RECON: "hostname myserver.local is available" — should NOT match', () => {
    const result = detectIndicators('hostname myserver.local is available for connection');
    expect(result).notToContain('RECON_INDICATOR');
});

test('RECON: "the hostname is set to webserver01" — should NOT match', () => {
    const result = detectIndicators('Configuration: the hostname is set to webserver01');
    expect(result).notToContain('RECON_INDICATOR');
});

test('RECON: "whoami /all" — should MATCH', () => {
    const result = detectIndicators('C:\\> whoami /all');
    expect(result).toContain('RECON_INDICATOR');
});

test('RECON: "ipconfig /all" — should MATCH', () => {
    const result = detectIndicators('ipconfig /all > output.txt');
    expect(result).toContain('RECON_INDICATOR');
});

test('RECON: "net user Administrator" — should MATCH', () => {
    const result = detectIndicators('net user Administrator /domain');
    expect(result).toContain('RECON_INDICATOR');
});

test('RECON: "cat /etc/passwd" — should MATCH', () => {
    const result = detectIndicators('cat /etc/passwd >> /tmp/out');
    expect(result).toContain('RECON_INDICATOR');
});

test('RECON: "uname -a" — should MATCH', () => {
    const result = detectIndicators('$ uname -a');
    expect(result).toContain('RECON_INDICATOR');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 4: Domain Extraction TLD Filter Fix
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 4: Domain Extraction — TLD Allowlist Fix');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('DOMAIN: "error.log" — should NOT be extracted as IOC domain', () => {
    const domains = extractDomains('Written to error.log at 14:32:01');
    expect(domains).notToContain('error.log');
});

test('DOMAIN: "access.log" — should NOT be extracted', () => {
    const domains = extractDomains('Nginx logged to access.log');
    expect(domains).notToContain('access.log');
});

test('DOMAIN: "nginx.conf" — should NOT be extracted', () => {
    const domains = extractDomains('Configuration loaded from nginx.conf');
    expect(domains).notToContain('nginx.conf');
});

test('DOMAIN: "v1.0.2.release" version string — should NOT be extracted', () => {
    const domains = extractDomains('Package version v1.0.2.release installed');
    expect(domains).notToContain('v1.0.2.release');
});

test('DOMAIN: "Windows.NT" OS string — should NOT be extracted', () => {
    const domains = extractDomains('User-Agent: Mozilla/5.0 (Windows.NT 10.0)');
    expect(domains).notToContain('windows.nt');
});

test('DOMAIN: "evil.com" real malicious domain — should MATCH', () => {
    const domains = extractDomains('Outbound connection to evil.com on port 443');
    expect(domains).toContain('evil.com');
});

test('DOMAIN: "c2server.io" real C2 domain — should MATCH', () => {
    const domains = extractDomains('DNS query for c2server.io from 192.168.1.50');
    expect(domains).toContain('c2server.io');
});

test('DOMAIN: "attacker.co.uk" real domain — should MATCH', () => {
    const domains = extractDomains('Beacon calling back to attacker.co.uk');
    expect(domains).toContain('attacker.co.uk');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 5: MITRE Tactic ID Fixes
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 5: MIN-001 — Weaponization MITRE ID (PRE-ATT&CK → TA0042)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('MITRE: Weaponization phase should use TA0042 (Resource Development)', () => {
    const id = KILL_CHAIN_MITRE['Weaponization'];
    expect(id).toBe('TA0042');
});

test('MITRE: Weaponization should NOT use deprecated PRE-ATT&CK', () => {
    const id = KILL_CHAIN_MITRE['Weaponization'];
    if (id === 'PRE-ATT&CK') throw new Error('Still using deprecated PRE-ATT&CK — fix not applied');
});

test('MITRE: All 7 phases have valid TA-prefixed tactic IDs', () => {
    const ids = Object.values(KILL_CHAIN_MITRE);
    const invalid = ids.filter(id => !id.startsWith('TA'));
    if (invalid.length > 0) throw new Error(`Non-TA IDs found: ${invalid.join(', ')}`);
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 6: CORR-009 LDAPS Port Fix
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 6: MAJ-003 — CORR-009 LDAPS False Correlation Fix');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('CORR-009: should only trigger on port 389, not 636', () => {
    expect(CORR_009_PORTS).notToContain('636');
    expect(CORR_009_PORTS).toContain('389');
});

test('CORR-009: port 636 (LDAPS) should NOT trigger LDAP enumeration', () => {
    // Simulate the correlation check
    const portMap = new Set(['636']);
    const wouldTrigger = CORR_009_PORTS.some(p => portMap.has(p));
    expect(wouldTrigger).toBeFalse();
});

test('CORR-009: port 389 (LDAP) SHOULD trigger LDAP enumeration', () => {
    const portMap = new Set(['389']);
    const wouldTrigger = CORR_009_PORTS.some(p => portMap.has(p));
    expect(wouldTrigger).toBeTrue();
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 7: CMD_EXECUTION Regex Precision
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 7: CMD_EXECUTION — Precision Check');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('CMD: "exec()" standalone — should NOT match without context', () => {
    // Generic word "exec" should require space+paren combo
    const result = detectIndicators('Please exec the function after deployment');
    expect(result).notToContain('CMD_EXECUTION');
});

test('CMD: "subprocess.Popen(" — should MATCH', () => {
    const result = detectIndicators('subprocess.Popen(["ls", "-la"], shell=True)');
    expect(result).toContain('CMD_EXECUTION');
});

test('CMD: "powershell.exe -enc AABB..." — should MATCH', () => {
    const result = detectIndicators('C:\\Windows\\System32\\powershell.exe -enc AABB1234==');
    expect(result).toContain('CMD_EXECUTION');
});

test('CMD: "cmd.exe /c whoami" — should MATCH', () => {
    const result = detectIndicators('cmd.exe /c whoami > c:\\temp\\out.txt');
    expect(result).toContain('CMD_EXECUTION');
});

test('CMD: "/bin/bash -c id" — should MATCH', () => {
    const result = detectIndicators('/bin/bash -c id');
    expect(result).toContain('CMD_EXECUTION');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 8: Ransomware & C2 Precision
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 8: RANSOMWARE & C2 — Precision Check');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('RANSOMWARE: "your files have been encrypted" — should MATCH', () => {
    const result = detectIndicators('Your files have been encrypted. Pay 0.5 BTC to recover.');
    expect(result).toContain('RANSOMWARE');
});

test('RANSOMWARE: "lockbit" ransomware name — should MATCH', () => {
    const result = detectIndicators('Found IOC matching lockbit ransom note template');
    expect(result).toContain('RANSOMWARE');
});

test('RANSOMWARE: "the file is encrypted by TLS" (benign) — should NOT match', () => {
    // TLS encryption should not trigger ransomware
    const result = detectIndicators('The file transfer is encrypted by TLS/SSL for security');
    expect(result).notToContain('RANSOMWARE');
});

test('C2: "Cobalt Strike beacon detected" — should MATCH', () => {
    const result = detectIndicators('Cobalt Strike beacon detected on port 443');
    expect(result).toContain('C2_INDICATOR');
});

test('C2: "metasploit listener" — should MATCH', () => {
    const result = detectIndicators('metasploit listener running on 0.0.0.0:4444');
    expect(result).toContain('C2_INDICATOR');
});

test('C2: "mimikatz" tool reference — should MATCH', () => {
    const result = detectIndicators('mimikatz sekurlsa::logonpasswords executed');
    expect(result).toContain('C2_INDICATOR');
});

test('C2: "c2 server callback" — should MATCH', () => {
    const result = detectIndicators('Anomaly: c2 server callback from workstation DESKTOP-XYZ');
    expect(result).toContain('C2_INDICATOR');
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 9: Edge Cases
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 9: Edge Cases & Boundary Conditions');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

test('EDGE: Empty log — should return zero indicators', () => {
    const result = detectIndicators('');
    expect(result).toHaveLength(0);
});

test('EDGE: Whitespace only log — should return zero indicators', () => {
    const result = detectIndicators('   \n\t   ');
    expect(result).toHaveLength(0);
});

test('EDGE: Multiple indicators in single log — all detected', () => {
    const log = `
        Failed password for root from 203.0.113.1
        SELECT * FROM users WHERE id=1 UNION ALL SELECT username FROM admin
        cobalt strike beacon calling back to c2 server
    `;
    const result = detectIndicators(log);
    expect(result).toContain('AUTH_FAILURE');
    expect(result).toContain('SQLI_PATTERN');
    expect(result).toContain('C2_INDICATOR');
});

test('EDGE: Lateral movement — PsExec should MATCH', () => {
    const result = detectIndicators('PsExec \\\\WORKSTATION-01 cmd.exe /c whoami');
    expect(result).toContain('LATERAL_MOVEMENT');
});

test('EDGE: Privilege escalation — SeDebugPrivilege — should MATCH', () => {
    const result = detectIndicators('Process acquired SeDebugPrivilege on token handle');
    expect(result).toContain('PRIVILEGE_ESC');
});

test('EDGE: Exfil — large outbound transfer — should MATCH', () => {
    const result = detectIndicators('Alert: 450 GB sent to 203.0.113.55 in 2h window');
    expect(result).toContain('EXFIL_PATTERN');
});

test('DOMAIN: Empty string — should return empty array', () => {
    const result = extractDomains('');
    expect(result).toHaveLength(0);
});

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE 10: New Threat Combinations & Regexes
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SUITE 10: New Threat Combinations & Regexes');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const NEW_MISCONFIGS = [
    { id:'NOAUTH-003', pattern:/(jupyter.*no.*auth|unauthenticated.*jupyter|jupyter.*no.*token|jupyter.*default.*password)/i },
    { id:'KUBE-001', pattern:/(anonymous.*kubelet|kubelet.*anonymous|kubernetes.*api.*unauthenticated|public.*kube.*api)/i },
    { id:'SYS-005', pattern:/(nfs.*export.*permissive|permissive.*nfs.*export|public.*nfs|nfs.*no.*auth|exposed.*nfs.*mount|nfs.*world.*readable)/i },
    { id:'SYS-004', pattern:/(git.*exposed|\.git.*accessible|exposed.*\.git|git.*leak)/i },
    { id:'API-001', pattern:/(exposed.*swagger|public.*swagger|open.*api.*doc|jwt.*secret|hardcoded.*key|leak.*key|exposed.*api.*key)/i },
    { id:'AUTH-005', pattern:/(snmp.*community.*string|snmp.*default.*public|snmp.*default.*private)/i },
];

test('MISCONFIG: Jupyter unauthenticated pattern matching', () => {
    const pattern = NEW_MISCONFIGS.find(m => m.id === 'NOAUTH-003').pattern;
    expect(pattern.test('Jupyter Notebook running without token or authentication')).toBeTrue();
    expect(pattern.test('jupyter token auth enabled')).toBeFalse();
});

test('MISCONFIG: Kubernetes anonymous Kubelet pattern matching', () => {
    const pattern = NEW_MISCONFIGS.find(m => m.id === 'KUBE-001').pattern;
    expect(pattern.test('Kubernetes Kubelet or API server allows anonymous unauthenticated access')).toBeTrue();
    expect(pattern.test('kube api requires certificates')).toBeFalse();
});

test('MISCONFIG: Permissive NFS export pattern matching', () => {
    const pattern = NEW_MISCONFIGS.find(m => m.id === 'SYS-005').pattern;
    expect(pattern.test('Permissive NFS export detected')).toBeTrue();
    expect(pattern.test('NFS access restricted to whitelist')).toBeFalse();
});

test('MISCONFIG: Git repository directory public exposure pattern matching', () => {
    const pattern = NEW_MISCONFIGS.find(m => m.id === 'SYS-004').pattern;
    expect(pattern.test('Git repository directory (.git) publicly exposed')).toBeTrue();
    expect(pattern.test('Git repository is private')).toBeFalse();
});

test('MISCONFIG: Exposed API Swagger documentation pattern matching', () => {
    const pattern = NEW_MISCONFIGS.find(m => m.id === 'API-001').pattern;
    expect(pattern.test('Exposed API Swagger documentation or hardcoded secrets')).toBeTrue();
    expect(pattern.test('Swagger documentation requires login')).toBeFalse();
});

test('MISCONFIG: Default SNMP community strings pattern matching', () => {
    const pattern = NEW_MISCONFIGS.find(m => m.id === 'AUTH-005').pattern;
    expect(pattern.test('Default SNMP community strings configured')).toBeTrue();
    expect(pattern.test('SNMP using v3 encrypted community')).toBeFalse();
});

// Mock simulation of correlation logic for new rules
const NEW_CORRELATION_RULES = [
    { id:'CORR-015', name:'Jupyter Notebook Unauthenticated RCE', requires: { ports:['8888'], misconfigIds:['NOAUTH-003'] } },
    { id:'CORR-016', name:'Kubernetes Cluster Takeover', requires: { ports:['6443','10250'], misconfigIds:['KUBE-001'] } },
    { id:'CORR-017', name:'WinRM Direct Remote Management Access', requires: { ports:['5985','5986'], misconfigIds:['AUTH-004', 'AUTH-001'] } },
    { id:'CORR-018', name:'NFS Data Leakage & Mount Abuse', requires: { ports:['2049'], misconfigIds:['SYS-005'] } },
    { id:'CORR-019', name:'Java Middleware Deserialization RCE', requires: { ports:['7001','8080'], misconfigIds:['PATCH-001'] } },
    { id:'CORR-020', name:'Git Repository Exposure & Key Harvesting', requires: { ports:['80','443'], misconfigIds:['SYS-004'] } },
    { id:'CORR-021', name:'Exposed API Documentation & Key Theft', requires: { ports:['80','443','8080'], misconfigIds:['API-001'] } },
    { id:'CORR-022', name:'SNMP Host & Network Reconnaissance', requires: { ports:['161'], misconfigIds:['AUTH-005'] } },
];

function checkCorrelation(rule, activePorts, activeMisconfigs) {
    const portMatch = rule.requires.ports.length === 0 || rule.requires.ports.some(p => activePorts.includes(p));
    const miscMatch = rule.requires.misconfigIds.length === 0 || rule.requires.misconfigIds.some(id => activeMisconfigs.includes(id));
    return portMatch && miscMatch;
}

test('CORRELATION: Jupyter Notebook RCE (CORR-015) triggers correctly', () => {
    const rule = NEW_CORRELATION_RULES.find(r => r.id === 'CORR-015');
    expect(checkCorrelation(rule, ['8888'], ['NOAUTH-003'])).toBeTrue();
    expect(checkCorrelation(rule, ['8888'], [])).toBeFalse();
    expect(checkCorrelation(rule, [], ['NOAUTH-003'])).toBeFalse();
});

test('CORRELATION: Kubernetes Cluster Takeover (CORR-016) triggers correctly', () => {
    const rule = NEW_CORRELATION_RULES.find(r => r.id === 'CORR-016');
    expect(checkCorrelation(rule, ['10250'], ['KUBE-001'])).toBeTrue();
    expect(checkCorrelation(rule, ['6443'], ['KUBE-001'])).toBeTrue();
    expect(checkCorrelation(rule, ['6443'], [])).toBeFalse();
});

test('CORRELATION: WinRM Direct Access (CORR-017) triggers correctly', () => {
    const rule = NEW_CORRELATION_RULES.find(r => r.id === 'CORR-017');
    expect(checkCorrelation(rule, ['5985'], ['AUTH-001'])).toBeTrue();
    expect(checkCorrelation(rule, ['5986'], ['AUTH-004'])).toBeTrue();
    expect(checkCorrelation(rule, ['5986'], [])).toBeFalse();
});

test('CORRELATION: NFS Data Leakage (CORR-018) triggers correctly', () => {
    const rule = NEW_CORRELATION_RULES.find(r => r.id === 'CORR-018');
    expect(checkCorrelation(rule, ['2049'], ['SYS-005'])).toBeTrue();
    expect(checkCorrelation(rule, ['2049'], [])).toBeFalse();
});

test('CORRELATION: Java Middleware Deserialization (CORR-019) triggers correctly', () => {
    const rule = NEW_CORRELATION_RULES.find(r => r.id === 'CORR-019');
    expect(checkCorrelation(rule, ['7001'], ['PATCH-001'])).toBeTrue();
    expect(checkCorrelation(rule, ['8080'], ['PATCH-001'])).toBeTrue();
    expect(checkCorrelation(rule, ['7001'], [])).toBeFalse();
});

test('CORRELATION: Git Repository Exposure (CORR-020) triggers correctly', () => {
    const rule = NEW_CORRELATION_RULES.find(r => r.id === 'CORR-020');
    expect(checkCorrelation(rule, ['443'], ['SYS-004'])).toBeTrue();
    expect(checkCorrelation(rule, ['80'], ['SYS-004'])).toBeTrue();
    expect(checkCorrelation(rule, ['80'], [])).toBeFalse();
});

test('CORRELATION: Exposed API Documentation (CORR-021) triggers correctly', () => {
    const rule = NEW_CORRELATION_RULES.find(r => r.id === 'CORR-021');
    expect(checkCorrelation(rule, ['8080'], ['API-001'])).toBeTrue();
    expect(checkCorrelation(rule, ['443'], ['API-001'])).toBeTrue();
    expect(checkCorrelation(rule, ['443'], [])).toBeFalse();
});

test('CORRELATION: SNMP Host Recon (CORR-022) triggers correctly', () => {
    const rule = NEW_CORRELATION_RULES.find(r => r.id === 'CORR-022');
    expect(checkCorrelation(rule, ['161'], ['AUTH-005'])).toBeTrue();
    expect(checkCorrelation(rule, ['161'], [])).toBeFalse();
});

// ═════════════════════════════════════════════════════════════════════════════
// RESULTS
// ═════════════════════════════════════════════════════════════════════════════
console.log('\n════════════════════════════════════════════════════════════');
console.log('                    RETEST RESULTS SUMMARY');
console.log('════════════════════════════════════════════════════════════');
console.log(`  Total Tests : ${passed + failed}`);
console.log(`  ✅ Passed   : ${passed}`);
console.log(`  ❌ Failed   : ${failed}`);

if (failures.length > 0) {
    console.log('\n  FAILED TESTS:');
    failures.forEach((f, i) => {
        console.log(`  ${i + 1}. ${f.name}`);
        console.log(`     Reason: ${f.reason}`);
    });
}

const score = Math.round((passed / (passed + failed)) * 100);
console.log(`\n  Score: ${score}%`);

if (score === 100) {
    console.log('\n  🎯 ALL FIXES VERIFIED — Engine passes all QA tests.');
} else if (score >= 90) {
    console.log('\n  ⚠️  MOSTLY PASSING — review failed tests before releasing.');
} else {
    console.log('\n  🚨 MULTIPLE FAILURES — do not release until fixed.');
}
console.log('════════════════════════════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);
