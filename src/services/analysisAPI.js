/**
 * analysisAPI.js — CyberEDT ETH Engine v3.0
 *
 * ┌─ 6-Layer Intelligence Architecture ────────────────────────────────────────┐
 * │  L1  Data Acquisition     — parse, extract, classify all inputs            │
 * │  L2  Evidence Validation  — validate IOCs, CVEs, hashes, chain integrity   │
 * │  L3  Threat Correlation   — port/misconfig/log combination analysis        │
 * │  L4  MITRE ATT&CK Mapping — evidence-gated technique selection             │
 * │  L5  Predictive Modeling  — 7-phase kill chain, always present             │
 * │  L6  Risk Scoring         — exposure × exploitability × likelihood         │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * Evidence Classification:
 *   VERIFIED    — directly observed in provided data
 *   INFERRED    — logically derived from known TTP patterns
 *   HYPOTHETICAL — possible future attacker action
 *
 * Predictive Labels (sub-findings):
 *   POSSIBLE (< 40% likelihood)
 *   POTENTIAL (40–70% likelihood)
 *   LIKELY    (> 70% likelihood)
 *   CONFIRMED — only when log evidence directly supports it
 */

import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// ═══════════════════════════════════════════════════════════════════════════════
// INFRASTRUCTURE (Axios, Auth, Error Handling) — unchanged
// ═══════════════════════════════════════════════════════════════════════════════

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.cyberedt.io/v1',
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json', 'X-Client-App': 'CyberEDT-ETH/3.0' },
    withCredentials: false,
});

apiClient.interceptors.request.use(
    (config) => {
        try {
            const { sessionToken, apiKey } = useAuthStore.getState();
            const token = sessionToken || apiKey;
            if (token) config.headers['Authorization'] = `Bearer ${token}`;
        } catch (e) { console.debug('Auth store not hydrated:', e); return config; }
        return config;
    },
    (error) => Promise.reject(error)
);

function buildApiError(axiosError) {
    const status = axiosError?.response?.status;
    const serverMsg = axiosError?.response?.data?.message || axiosError?.response?.data?.error;
    const retryAfter = axiosError?.response?.headers?.['retry-after'];
    let message, code;
    switch (status) {
        case 400: message = serverMsg || 'Invalid request.'; code = 'BAD_REQUEST'; break;
        case 401: message = 'Authentication required.'; code = 'UNAUTHORIZED';
            try { useAuthStore.getState().clearSession?.(); } catch { console.debug('Unable to clear auth session after 401'); }
            break;
        case 403: message = 'Access denied.'; code = 'FORBIDDEN'; break;
        case 422: message = serverMsg || 'Validation failed.'; code = 'VALIDATION_ERROR'; break;
        case 429: {
            const w = retryAfter ? parseInt(retryAfter, 10) : null;
            message = w ? `Rate limited. Retry in ${w}s.` : 'Too many requests.';
            code = 'RATE_LIMITED'; break;
        }
        case 500: message = 'Engine internal error.'; code = 'SERVER_ERROR'; break;
        case 502: case 503: case 504: message = 'Service unavailable.'; code = 'SERVICE_UNAVAILABLE'; break;
        default:
            if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
                message = 'Request timed out.'; code = 'TIMEOUT';
            } else if (!axiosError.response) {
                message = 'No server response.'; code = 'NETWORK_ERROR';
            } else {
                message = serverMsg || axiosError.message || 'Unexpected error.'; code = 'UNKNOWN_ERROR';
            }
    }
    const err = new Error(message);
    Object.assign(err, { code, status: status ?? null, retryAfter: retryAfter ? parseInt(retryAfter, 10) : null });
    return err;
}

apiClient.interceptors.response.use(r => r, e => Promise.reject(buildApiError(e)));

export const runAttackSimulation  = (payload, signal) => apiClient.post('/analyze/attack-chain', payload, { signal }).then(r => r.data);
export const getMitreTechniques   = (ports)           => apiClient.get('/mitre/techniques', { params: { ports: ports.join(',') } }).then(r => r.data);
export const getCveContext        = (cveId)           => apiClient.get(`/intel/cve/${cveId}`).then(r => r.data);
export const checkApiHealth       = async ()          => { const t0 = Date.now(); const r = await apiClient.get('/health'); return { ...r.data, latencyMs: Date.now() - t0 }; };

// ═══════════════════════════════════════════════════════════════════════════════
// ██████████████████████████████████████████████████████████████████████████████
// ETH ENGINE v3 — EVIDENCE-BASED CYBER EXPOSURE INTELLIGENCE
// ██████████████████████████████████████████████████████████████████████████████
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// INTELLIGENCE DATABASES
// ─────────────────────────────────────────────────────────────────────────────

/** Port → Service intelligence with exploitability ratings */
const PORT_INTEL = {
    '21':    { service:'FTP',          proto:'TCP', risk:'high',     exploitability:0.72, cve:'CVE-2015-3306', category:'remote-access',  note:'Cleartext file transfer; anonymous login common on misconfigured hosts' },
    '22':    { service:'SSH',          proto:'TCP', risk:'medium',   exploitability:0.45, category:'remote-access',  note:'Encrypted remote shell; brute-force and stolen-key attacks are primary vectors' },
    '23':    { service:'Telnet',       proto:'TCP', risk:'critical', exploitability:0.91, category:'legacy',        note:'Cleartext remote access; no encryption, deprecated since 2002' },
    '25':    { service:'SMTP',         proto:'TCP', risk:'medium',   exploitability:0.38, category:'mail',           note:'Open relay misconfiguration enables phishing infrastructure abuse' },
    '53':    { service:'DNS',          proto:'UDP', risk:'medium',   exploitability:0.40, category:'infrastructure', note:'Zone transfer misconfiguration exposes internal hostnames' },
    '80':    { service:'HTTP',         proto:'TCP', risk:'medium',   exploitability:0.50, category:'web',            note:'Cleartext web traffic; credentials and session tokens exposed in transit' },
    '110':   { service:'POP3',         proto:'TCP', risk:'medium',   exploitability:0.35, category:'mail',           note:'Cleartext email retrieval; credential exposure risk' },
    '139':   { service:'NetBIOS',      proto:'TCP', risk:'high',     exploitability:0.68, category:'windows-smb',   note:'Legacy Windows network; NTLM relay and credential capture attacks' },
    '143':   { service:'IMAP',         proto:'TCP', risk:'medium',   exploitability:0.33, category:'mail',           note:'Email access; cleartext credential exposure without STARTTLS' },
    '389':   { service:'LDAP',         proto:'TCP', risk:'high',     exploitability:0.65, category:'directory',      note:'Unauthenticated LDAP queries can enumerate users, groups, and policies' },
    '443':   { service:'HTTPS',        proto:'TCP', risk:'low',      exploitability:0.25, category:'web',            note:'Encrypted web; risk profile depends on application security posture' },
    '445':   { service:'SMB',          proto:'TCP', risk:'critical', exploitability:0.88, cve:'CVE-2017-0144',  category:'windows-smb',   note:'EternalBlue (MS17-010), PrintNightmare (CVE-2021-34527) target this port' },
    '636':   { service:'LDAPS',        proto:'TCP', risk:'medium',   exploitability:0.30, category:'directory',      note:'TLS LDAP; risk depends on certificate validation and bind policies' },
    '1433':  { service:'MSSQL',        proto:'TCP', risk:'critical', exploitability:0.85, category:'database',       note:'SQL Server; public exposure enables direct database access and xp_cmdshell abuse' },
    '1521':  { service:'Oracle DB',    proto:'TCP', risk:'critical', exploitability:0.80, category:'database',       note:'Oracle listener; public exposure enables TNS poisoning and data exfiltration' },
    '3306':  { service:'MySQL',        proto:'TCP', risk:'critical', exploitability:0.82, category:'database',       note:'MySQL; public exposure with weak credentials enables full DB dump' },
    '3389':  { service:'RDP',          proto:'TCP', risk:'critical', exploitability:0.87, cve:'CVE-2019-0708', category:'remote-access',  note:'BlueKeep, credential brute-force, session hijacking — top ransomware ingress vector' },
    '5432':  { service:'PostgreSQL',   proto:'TCP', risk:'critical', exploitability:0.78, category:'database',       note:'PostgreSQL; public exposure enables COPY TO/FROM PROGRAM RCE' },
    '5900':  { service:'VNC',          proto:'TCP', risk:'high',     exploitability:0.75, category:'remote-access',  note:'VNC frequently lacks strong auth; common ransomware ingress path' },
    '6379':  { service:'Redis',        proto:'TCP', risk:'critical', exploitability:0.93, category:'database',       note:'No-auth Redis enables config writes for SSH key injection and RCE' },
    '8080':  { service:'HTTP-Alt',     proto:'TCP', risk:'medium',   exploitability:0.48, category:'web',            note:'Dev/admin panels often hosted here; frequently forgotten in firewall rules' },
    '8443':  { service:'HTTPS-Alt',    proto:'TCP', risk:'low',      exploitability:0.22, category:'web',            note:'Alternate HTTPS; risk profile similar to port 443' },
    '9200':  { service:'Elasticsearch',proto:'TCP', risk:'critical', exploitability:0.90, category:'database',       note:'No-auth ES clusters are a leading source of bulk data breach incidents' },
    '27017': { service:'MongoDB',      proto:'TCP', risk:'critical', exploitability:0.88, category:'database',       note:'No-auth MongoDB; ransomware groups routinely mass-scan and wipe/ransom' },
    '2375':  { service:'Docker API',   proto:'TCP', risk:'critical', exploitability:0.95, category:'infrastructure', note:'Unauthenticated Docker socket; immediate container escape and host compromise' },
    '2376':  { service:'Docker TLS',   proto:'TCP', risk:'high',     exploitability:0.60, category:'infrastructure', note:'TLS Docker daemon; risk depends on mutual TLS enforcement' },
    '4444':  { service:'Metasploit',   proto:'TCP', risk:'critical', exploitability:0.99, category:'attacker-tool',  note:'Default Metasploit handler port; presence is a strong C2 indicator' },
    '4899':  { service:'Radmin',       proto:'TCP', risk:'critical', exploitability:0.88, category:'remote-access',  note:'Remote Administrator; historically exploited by banking trojans' },
    '11211': { service:'Memcached',    proto:'UDP', risk:'high',     exploitability:0.80, category:'database',       note:'Amplification DDoS source; data exposure without authentication' },
    '161':   { service:'SNMP',         proto:'UDP', risk:'high',     exploitability:0.65, category:'infrastructure', note:'Exposed SNMP service enables rapid network and system reconnaissance.' },
    '2049':  { service:'NFS',          proto:'TCP', risk:'high',     exploitability:0.80, category:'database',       note:'Exposed Network File System allows mounting directories and data exfiltration without authentication.' },
    '5985':  { service:'WinRM HTTP',   proto:'TCP', risk:'critical', exploitability:0.85, category:'remote-access',  note:'Windows Remote Management over HTTP; cleartext authentication and remote administration vector.' },
    '5986':  { service:'WinRM HTTPS',  proto:'TCP', risk:'high',     exploitability:0.50, category:'remote-access',  note:'Windows Remote Management over HTTPS; encrypted remote administration, risk depends on password strength.' },
    '6443':  { service:'Kubernetes API', proto:'TCP', risk:'critical', exploitability:0.95, category:'infrastructure', note:'Kubernetes API Server; public exposure enables cluster control operations.' },
    '7001':  { service:'WebLogic',     proto:'TCP', risk:'critical', exploitability:0.88, category:'web',            note:'Oracle WebLogic Server; frequently targeted for Java deserialization vulnerabilities (CVE-2020-14882).' },
    '8888':  { service:'Jupyter',      proto:'TCP', risk:'critical', exploitability:0.90, category:'web',            note:'Jupyter Notebook environment; public exposure allows arbitrary code execution via web kernels.' },
    '10250': { service:'Kubelet API',  proto:'TCP', risk:'critical', exploitability:0.92, category:'infrastructure', note:'Kubernetes Kubelet API; public unauthenticated access enables command execution in containers.' },
};

/** Misconfiguration pattern database */
const MISCONFIG_DB = [
    { id:'AUTH-001', pattern:/(default credentials?|admin:admin|admin:password|password:?123|unchanged.*default|default.*password)/i,
      category:'Authentication', risk:'critical', exploitability:0.95,
      finding:'Default or unchanged credentials identified',
      detail:'Default credentials require zero exploitation skill; direct authentication is possible with publicly documented passwords.',
      mitre:'T1078.001', amplifies:['remote-access','database','web'], severityDelta:35 },

    { id:'AUTH-002', pattern:/(no mfa|without mfa|mfa.*disabled|no multi.?factor|no two.?factor|2fa.*disabled)/i,
      category:'Authentication', risk:'high', exploitability:0.80,
      finding:'Multi-factor authentication not enforced',
      detail:'MFA absence increases credential-based initial access probability by removing the second authentication barrier.',
      mitre:'T1110', amplifies:['remote-access','web'], severityDelta:25 },

    { id:'AUTH-003', pattern:/(no rate limit|rate.?limit.*disabled|brute.?force.*allowed|unlimited.*login)/i,
      category:'Authentication', risk:'high', exploitability:0.82,
      finding:'Authentication rate limiting absent',
      detail:'Without rate limiting, credential brute-force attacks can proceed at high velocity against any exposed service.',
      mitre:'T1110.003', amplifies:['remote-access','web'], severityDelta:20 },

    { id:'PATCH-001', pattern:/(unpatched|outdated software|old version|end.?of.?life|eol|no.*patch|missing.*patch|legacy.*software)/i,
      category:'Patch Management', risk:'high', exploitability:0.75,
      finding:'Unpatched or end-of-life software components identified',
      detail:'Unpatched systems may be vulnerable to n-day exploits with publicly available proof-of-concept code.',
      mitre:'T1190', amplifies:['web','windows-smb','database'], severityDelta:28 },

    { id:'PROTO-001', pattern:/(telnet.*enabled|telnet.*running|telnet.*open|using.*telnet)/i,
      category:'Insecure Protocol', risk:'critical', exploitability:0.91,
      finding:'Telnet cleartext remote access enabled',
      detail:'Telnet transmits all data in cleartext; any network-position adversary can capture credentials and session content.',
      mitre:'T1040', amplifies:['remote-access','legacy'], severityDelta:30 },

    { id:'PROTO-002', pattern:/(ftp.*anonymous|anonymous.*ftp|ftp.*no.*auth|ftp.*unauthenticated)/i,
      category:'Insecure Protocol', risk:'high', exploitability:0.85,
      finding:'Anonymous FTP access enabled',
      detail:'Anonymous FTP allows unauthenticated read or write access; commonly exploited for malware staging.',
      mitre:'T1078.004', amplifies:['legacy'], severityDelta:25 },

    { id:'PROTO-003', pattern:/(smb.?v1|smbv1|smb1|smb.*version.*1|cifs.*legacy)/i,
      category:'Insecure Protocol', risk:'critical', exploitability:0.88,
      finding:'SMBv1 protocol active (CVE-2017-0144 exposure)',
      detail:'SMBv1 is associated with EternalBlue. This vulnerability enabled WannaCry and NotPetya global outbreaks.',
      mitre:'T1210', cve:'CVE-2017-0144', amplifies:['windows-smb'], severityDelta:35 },

    { id:'CLOUD-001', pattern:/(public.*s3|open.*bucket|s3.*public|bucket.*public|publicly.*accessible.*bucket)/i,
      category:'Cloud Misconfiguration', risk:'high', exploitability:0.88,
      finding:'Public cloud storage bucket detected',
      detail:'Publicly accessible buckets have been the root cause of multiple large-scale breach incidents.',
      mitre:'T1530', amplifies:['infrastructure'], severityDelta:28 },

    { id:'NOAUTH-001', pattern:/(redis.*no.*auth|unauthenticated.*redis|redis.*no.*password|redis.*open)/i,
      category:'Authentication', risk:'critical', exploitability:0.93,
      finding:'Redis service running without authentication',
      detail:'Unauthenticated Redis enables SLAVEOF/CONFIG attacks that write SSH keys or cron jobs for RCE.',
      mitre:'T1190', amplifies:['database'], severityDelta:35 },

    { id:'NOAUTH-002', pattern:/(mongo.*no.*auth|unauthenticated.*mongo|mongodb.*open|elastic.*no.*auth)/i,
      category:'Authentication', risk:'critical', exploitability:0.90,
      finding:'NoSQL database running without authentication',
      detail:'Unauthenticated NoSQL databases are ransomed or exfiltrated within hours of internet exposure (Shodan indexing).',
      mitre:'T1190', amplifies:['database'], severityDelta:35 },

    { id:'NET-001', pattern:/(no.*firewall|firewall.*disabled|0\.0\.0\.0\/0|any.*any|open.*to.*internet|no.*acl)/i,
      category:'Network Security', risk:'high', exploitability:0.78,
      finding:'Permissive or absent network access controls',
      detail:'Unrestricted inbound access eliminates perimeter defense; all exposed services are directly reachable.',
      mitre:'T1595', amplifies:['remote-access','database','web'], severityDelta:20 },

    { id:'NET-002', pattern:/(admin.*panel.*exposed|admin.*internet|admin.*public|management.*exposed)/i,
      category:'Network Security', risk:'high', exploitability:0.80,
      finding:'Administrative interface exposed to internet',
      detail:'Internet-accessible admin panels dramatically increase the impact of any authentication bypass.',
      mitre:'T1133', amplifies:['web','remote-access'], severityDelta:25 },

    { id:'CRYPTO-001', pattern:/(ssl.?v3|sslv3|tls.?1\.0|tls1\.0|weak.*tls|rc4|null.*cipher|export.*cipher)/i,
      category:'Cryptography', risk:'high', exploitability:0.70,
      finding:'Deprecated TLS version or weak cipher suite configured',
      detail:'SSLv3 and TLS 1.0 are vulnerable to POODLE and BEAST downgrade attacks.',
      mitre:'T1040', amplifies:['web','mail'], severityDelta:18 },

    { id:'APP-001', pattern:/(debug.*mode|development.*mode|verbose.*error|stack.*trace.*exposed)/i,
      category:'Application Security', risk:'medium', exploitability:0.55,
      finding:'Debug or verbose error mode active in production',
      detail:'Debug mode exposes stack traces, environment variables, and internal paths to unauthenticated users.',
      mitre:'T1592.002', amplifies:['web'], severityDelta:15 },

    { id:'APP-002', pattern:/(directory.*listing|directory.*browsing|autoindex.*on|index.*enabled)/i,
      category:'Application Security', risk:'medium', exploitability:0.60,
      finding:'Web server directory listing enabled',
      detail:'Exposed directory listings reveal application structure, configuration files, and backup archives.',
      mitre:'T1083', amplifies:['web'], severityDelta:12 },

    { id:'APP-003', pattern:/(cors.*wildcard|open.*cors|access.control.allow.origin.*\*)/i,
      category:'Application Security', risk:'medium', exploitability:0.52,
      finding:'Wildcard CORS policy configured',
      detail:'Overly permissive CORS enables cross-origin credential theft from authenticated browsers.',
      mitre:'T1185', amplifies:['web'], severityDelta:12 },

    { id:'DNS-001', pattern:/(zone.*transfer|axfr.*allowed|dns.*any.*transfer|open.*resolver)/i,
      category:'DNS Security', risk:'high', exploitability:0.72,
      finding:'DNS zone transfer or open resolver misconfiguration',
      detail:'Zone transfer exposes complete internal DNS topology; open resolvers enable amplification attacks.',
      mitre:'T1590.002', amplifies:['infrastructure'], severityDelta:20 },

    { id:'APP-004', pattern:/(jenkins.*script.*console|script.*console.*enabled)/i,
      category:'Application Security', risk:'critical', exploitability:0.95,
      finding:'Jenkins script console enabled and exposed',
      detail:'The Jenkins script console allows execution of arbitrary Groovy scripts on the master node, leading directly to RCE.',
      mitre:'T1059.007', amplifies:['web'], severityDelta:35 },

    { id:'AD-001', pattern:/(unconstrained.*delegation)/i,
      category:'Identity & Access', risk:'critical', exploitability:0.85,
      finding:'Unconstrained delegation configured on service accounts',
      detail:'Unconstrained delegation allows a compromised service to impersonate any user (including Domain Admins) to any other service.',
      mitre:'T1558.003', amplifies:['infrastructure'], severityDelta:30 },

    { id:'AD-002', pattern:/(weak.*kerberos|kerberoast|weak.*service.*account)/i,
      category:'Identity & Access', risk:'high', exploitability:0.80,
      finding:'Weak Kerberos encryption or service account passwords',
      detail:'Weakly encrypted SPN tickets can be extracted offline and cracked, exposing privileged service account credentials (Kerberoasting).',
      mitre:'T1558.003', amplifies:['infrastructure'], severityDelta:25 },

    { id:'AUTH-004', pattern:/(weak.*password|dictionary.*password|password.*policy.*weak)/i,
      category:'Authentication', risk:'high', exploitability:0.85,
      finding:'Weak password policy or easily guessable passwords in use',
      detail:'Weak passwords are highly susceptible to brute-force and credential stuffing attacks, bypassing authentication controls.',
      mitre:'T1110.001', amplifies:['remote-access','web','database'], severityDelta:25 },

    { id:'NOAUTH-003', pattern:/(jupyter.*no.*auth|unauthenticated.*jupyter|jupyter.*no.*token|jupyter.*default.*password)/i,
      category:'Authentication', risk:'critical', exploitability:0.90,
      finding:'Jupyter Notebook running without token or authentication',
      detail:'Unauthenticated Jupyter environments allow direct execution of commands and scripting payloads via active kernels.',
      mitre:'T1190', amplifies:['web'], severityDelta:35 },

    { id:'KUBE-001', pattern:/(anonymous.*kubelet|kubelet.*anonymous|kubernetes.*api.*unauthenticated|public.*kube.*api)/i,
      category:'Authentication', risk:'critical', exploitability:0.95,
      finding:'Kubernetes Kubelet or API server allows anonymous unauthenticated access',
      detail:'Anonymous access to the Kubelet API or Kubernetes API server allows remote command execution inside pods and cluster-wide takeover.',
      mitre:'T1610', amplifies:['infrastructure'], severityDelta:35 },

    { id:'SYS-005', pattern:/(nfs.*export.*permissive|permissive.*nfs.*export|public.*nfs|nfs.*no.*auth|exposed.*nfs.*mount|nfs.*world.*readable)/i,
      category:'Network Security', risk:'high', exploitability:0.80,
      finding:'Permissive NFS export or exposed NFS mount points',
      detail:'Exposed Network File System mounts with loose access constraints allow any network client to mount and exfiltrate internal files.',
      mitre:'T1005', amplifies:['database'], severityDelta:28 },

    { id:'SYS-004', pattern:/(git.*exposed|\.git.*accessible|exposed.*\.git|git.*leak)/i,
      category:'Application Security', risk:'high', exploitability:0.85,
      finding:'Git repository directory (.git) publicly exposed',
      detail:'Exposed .git directories allow download of the entire source code history, which frequently leads to the harvest of hardcoded keys and credentials.',
      mitre:'T1552.001', amplifies:['web'], severityDelta:30 },

    { id:'API-001', pattern:/(exposed.*swagger|public.*swagger|open.*api.*doc|jwt.*secret|hardcoded.*key|leak.*key|exposed.*api.*key)/i,
      category:'Application Security', risk:'high', exploitability:0.80,
      finding:'Exposed API Swagger documentation or hardcoded secrets',
      detail:'Public API documentation reveals internal service structures and query options, significantly reducing reconnaissance cost for API tampering.',
      mitre:'T1592.002', amplifies:['web'], severityDelta:22 },

    { id:'AUTH-005', pattern:/(snmp.*community.*string|snmp.*default.*public|snmp.*default.*private)/i,
      category:'Authentication', risk:'high', exploitability:0.82,
      finding:'Default SNMP community strings configured',
      detail:'SNMP services using default community strings (like public or private) allow unauthorized system queries, disclosing hardware details and system statistics.',
      mitre:'T1592', amplifies:['infrastructure'], severityDelta:20 },
];

/** Threat correlation rules — combinations that elevate risk above their individual sum */
const CORRELATION_RULES = [
    {
        id:'CORR-001', name:'RDP Ransomware Ingress Path',
        requires: { ports:['3389'], misconfigIds:['AUTH-002', 'AUTH-004', 'AUTH-001'] },
        threat:'Exposed RDP without MFA is a primary ransomware initial access vector. The addition of weak passwords (if present) dramatically increases vulnerability to brute-force or credential stuffing.',
        likelihood:'LIKELY', confidenceBoost:25, riskBoost:30, mitre:'T1133',
        targetedBy:['Conti', 'REvil', 'LockBit', 'Black Basta'],
    },
    {
        id:'CORR-002', name:'EternalBlue Wormable Propagation',
        requires: { ports:['445'], misconfigIds:['PROTO-003'] },
        threat:'SMBv1 + port 445 exposure recreates the exact conditions exploited by WannaCry (2017) and NotPetya. Wormable lateral propagation risk is critical.',
        likelihood:'LIKELY', confidenceBoost:30, riskBoost:35, mitre:'T1210',
        cve:'CVE-2017-0144', targetedBy:['WannaCry', 'NotPetya', 'EternalBlue campaigns'],
    },
    {
        id:'CORR-003', name:'Redis RCE via Config Write',
        requires: { ports:['6379'], misconfigIds:['NOAUTH-001'] },
        threat:'Unauthenticated Redis with SLAVEOF/CONFIG access enables SSH key injection or cron-based RCE without any exploit.',
        likelihood:'LIKELY', confidenceBoost:28, riskBoost:32, mitre:'T1190',
        targetedBy:['Cryptominer campaigns', 'Redis-targeting worms'],
    },
    {
        id:'CORR-004', name:'Database Credential Harvest Path',
        requires: { ports:['3306','5432','1433'], misconfigIds:['AUTH-001'] },
        threat:'Public database with default credentials enables direct unauthenticated dump of all stored data.',
        likelihood:'LIKELY', confidenceBoost:30, riskBoost:35, mitre:'T1078.001',
        targetedBy:['Data broker operations', 'SQL injection campaigns'],
    },
    {
        id:'CORR-005', name:'Docker API Full Host Compromise',
        requires: { ports:['2375'], misconfigIds:[] },
        threat:'Unauthenticated Docker socket enables privileged container creation with host filesystem mount — equivalent to root shell on the host.',
        likelihood:'LIKELY', confidenceBoost:35, riskBoost:40, mitre:'T1610',
        targetedBy:['Cryptominers', 'TeamTNT', 'Kinsing'],
    },
    {
        id:'CORR-006', name:'SSH Credential Brute-Force Risk',
        requires: { ports:['22'], misconfigIds:['AUTH-003'] },
        threat:'SSH without rate limiting enables high-velocity credential stuffing from botnet infrastructure.',
        likelihood:'POTENTIAL', confidenceBoost:18, riskBoost:20, mitre:'T1110.003',
        targetedBy:['Mirai variants', 'SSH brute-force botnets'],
    },
    {
        id:'CORR-007', name:'Telnet Credential Interception',
        requires: { ports:['23'], misconfigIds:['PROTO-001'] },
        threat:'Active Telnet service transmits credentials in cleartext; any network-path attacker passively captures authentication.',
        likelihood:'POTENTIAL', confidenceBoost:22, riskBoost:25, mitre:'T1040',
        targetedBy:['Network-position attackers', 'ISP-level surveillance'],
    },
    {
        id:'CORR-008', name:'VNC Ransomware Delivery Channel',
        requires: { ports:['5900'], misconfigIds:['AUTH-002'] },
        threat:'VNC without MFA has been documented as a ransomware delivery channel by multiple threat groups.',
        likelihood:'POTENTIAL', confidenceBoost:20, riskBoost:22, mitre:'T1021.005',
        targetedBy:['Dharma', 'Phobos', 'SamSam ransomware groups'],
    },
    {
        id:'CORR-009', name:'LDAP User Enumeration for Targeting',
        requires: { ports:['389'], misconfigIds:[] },
        threat:'Unauthenticated plaintext LDAP (port 389) allows complete Active Directory user, group, and policy enumeration for targeted attack planning.',
        likelihood:'POTENTIAL', confidenceBoost:15, riskBoost:18, mitre:'T1087.002',
        targetedBy:['APT groups', 'Initial access brokers'],
    },
    {
        id:'CORR-010', name:'Unpatched Web Application Exploitation',
        requires: { ports:['80','443','8080','8443'], misconfigIds:['PATCH-001'] },
        threat:'Internet-facing web applications with unpatched dependencies are primary targets for automated vulnerability scanners and exploit kits.',
        likelihood:'POTENTIAL', confidenceBoost:20, riskBoost:22, mitre:'T1190',
        targetedBy:['Automated exploit scanners', 'Web shell deployment campaigns'],
    },
    {
        id:'CORR-011', name:'Elasticsearch Data Exposure',
        requires: { ports:['9200'], misconfigIds:[] },
        threat:'Open Elasticsearch clusters are indexed by Shodan within minutes of exposure. Mass data collection is the primary threat.',
        likelihood:'LIKELY', confidenceBoost:28, riskBoost:30, mitre:'T1530',
        targetedBy:['Automated data harvesting', 'Ransom-oriented data theft'],
    },
    {
        id:'CORR-012', name:'MongoDB Ransom Attack Pattern',
        requires: { ports:['27017'], misconfigIds:[] },
        threat:'Exposed MongoDB without auth is a known ransomware target — attackers wipe data and leave ransom notes.',
        likelihood:'LIKELY', confidenceBoost:28, riskBoost:30, mitre:'T1485',
        targetedBy:['MongoDB ransom campaigns', 'Automated wipe-and-ransom bots'],
    },
    {
        id:'CORR-013', name:'Jenkins CI/CD Pipeline RCE',
        requires: { ports:['8080','80','443'], misconfigIds:['APP-004'] },
        threat:'Public Jenkins exposure combined with an enabled script console enables immediate, unauthenticated remote code execution (RCE) and CI/CD pipeline compromise.',
        likelihood:'LIKELY', confidenceBoost:35, riskBoost:38, mitre:'T1059.007',
        targetedBy:['Initial Access Brokers', 'Nation-state actors', 'Ransomware affiliates'],
    },
    {
        id:'CORR-014', name:'Active Directory Privilege Escalation Path',
        requires: { ports:['389','636'], misconfigIds:['AD-001', 'AD-002'] },
        threat:'LDAP exposure combined with unconstrained delegation and weak Kerberos configurations facilitates Kerberoasting and rapid privilege escalation to Domain Admin.',
        likelihood:'LIKELY', confidenceBoost:32, riskBoost:40, mitre:'T1558.003',
        targetedBy:['Advanced Persistent Threats (APTs)', 'Ransomware operators'],
    },
    {
        id:'CORR-015', name:'Jupyter Notebook Unauthenticated RCE',
        requires: { ports:['8888'], misconfigIds:['NOAUTH-003'] },
        threat:'Unauthenticated Jupyter Notebook exposure allows attackers to execute arbitrary code in a web kernel, a common entry point for cryptominers and footholds.',
        likelihood:'LIKELY', confidenceBoost:28, riskBoost:32, mitre:'T1190',
        targetedBy:['Cryptominer botnets', 'Initial access brokers'],
    },
    {
        id:'CORR-016', name:'Kubernetes Cluster Takeover',
        requires: { ports:['6443','10250'], misconfigIds:['KUBE-001'] },
        threat:'Publicly exposed Kubernetes API or Kubelet allowing anonymous access enables full cluster compromise, container escape, and execution of arbitrary workloads.',
        likelihood:'LIKELY', confidenceBoost:35, riskBoost:40, mitre:'T1610',
        targetedBy:['Cryptominers', 'TeamTNT', 'Kinsing'],
    },
    {
        id:'CORR-017', name:'WinRM Direct Remote Management Access',
        requires: { ports:['5985','5986'], misconfigIds:['AUTH-004', 'AUTH-001'] },
        threat:'Exposed WinRM ports combined with default credentials or weak passwords serve as a direct remote access or lateral movement vector.',
        likelihood:'LIKELY', confidenceBoost:30, riskBoost:35, mitre:'T1021.006',
        targetedBy:['Ransomware operators', 'Internal lateral movement campaigns'],
    },
    {
        id:'CORR-018', name:'NFS Data Leakage & Mount Abuse',
        requires: { ports:['2049'], misconfigIds:['SYS-005'] },
        threat:'Exposed NFS port with permissive exports allows unauthenticated remote directory mounts, enabling bulk exfiltration of system and database files.',
        likelihood:'LIKELY', confidenceBoost:25, riskBoost:28, mitre:'T1005',
        targetedBy:['Data extortion groups', 'Data harvesting operations'],
    },
    {
        id:'CORR-019', name:'Java Middleware Deserialization RCE',
        requires: { ports:['7001','8080'], misconfigIds:['PATCH-001'] },
        threat:'Outdated Oracle WebLogic or Java application middleware is highly vulnerable to remote code execution (RCE) via object deserialization (e.g. CVE-2020-14882).',
        likelihood:'LIKELY', confidenceBoost:30, riskBoost:35, mitre:'T1190',
        targetedBy:['APT groups', 'Automated exploit botnets'],
    },
    {
        id:'CORR-020', name:'Git Repository Exposure & Key Harvesting',
        requires: { ports:['80','443'], misconfigIds:['SYS-004'] },
        threat:'Public exposure of the `.git` directory on a production web server allows download of the entire source code history, revealing database passwords and API keys.',
        likelihood:'LIKELY', confidenceBoost:28, riskBoost:30, mitre:'T1552.001',
        targetedBy:['Scrapers', 'Credential harvesting bots', 'APT groups'],
    },
    {
        id:'CORR-021', name:'Exposed API Documentation & Key Theft',
        requires: { ports:['80','443','8080'], misconfigIds:['API-001'] },
        threat:'Exposed Swagger/OpenAPI documentation outlines endpoint parameters and security rules, aiding targeted parameters tampering and API abuse.',
        likelihood:'POTENTIAL', confidenceBoost:20, riskBoost:22, mitre:'T1592.002',
        targetedBy:['API scanning operations', 'Web-focused threat actors'],
    },
    {
        id:'CORR-022', name:'SNMP Host & Network Reconnaissance',
        requires: { ports:['161'], misconfigIds:['AUTH-005'] },
        threat:'Exposed SNMP service using default community strings (like public/private) allows querying system descriptions, network interfaces, and running services.',
        likelihood:'POTENTIAL', confidenceBoost:22, riskBoost:24, mitre:'T1592',
        targetedBy:['External scanners', 'Reconnaissance campaigns'],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 1: DATA ACQUISITION
// ─────────────────────────────────────────────────────────────────────────────

function acquireData(payload) {
    const { openPorts = [], misconfigurations = [], logSnippet = '' } = payload;

    // ── UNKNOWN PORT HANDLING FRAMEWORK — Phase 1: Data Acquisition ──────────
    // Map ports to intelligence profiles, tagging unknown ones explicitly.
    const portMap = new Map();
    const unknownPortsList = [];
    const knownPortsList   = [];

    openPorts.forEach(port => {
        const knownIntel = PORT_INTEL[port];
        if (knownIntel) {
            portMap.set(String(port), { ...knownIntel, isUnknownPort: false });
            knownPortsList.push(String(port));
        } else {
            // Unknown port — use minimal generic profile, never fabricate service details
            portMap.set(String(port), {
                service: `Unknown(${port})`,
                proto: 'TCP',
                risk: 'medium',
                exploitability: 0.30,  // Lower than known-port default to avoid inflating risk
                category: 'unknown',
                note: 'Non-standard port; service identity unknown without banner analysis. ETH analysis limited to generic network-layer risks.',
                isUnknownPort: true,
            });
            unknownPortsList.push(String(port));
        }
    });

    // ── UNKNOWN PORT HANDLING FRAMEWORK — Phase 2: Misconfig Classification ─
    // Track which user-supplied misconfig text was NOT matched in the DB.
    const miscStr = misconfigurations.join('\n');
    const matchedMisconfigs = MISCONFIG_DB.filter(m => m.pattern.test(miscStr));
    const misconfigIds = new Set(matchedMisconfigs.map(m => m.id));

    // Find unmatched misconfiguration entries (user typed something unknown)
    const unmatchedMisconfigs = misconfigurations.filter(
        entry => !MISCONFIG_DB.some(m => m.pattern.test(entry))
    );

    // Extract log telemetry
    const logData = extractLogTelemetry(logSnippet);

    return {
        portMap,
        matchedMisconfigs,
        misconfigIds,
        logData,
        // Framework metadata
        unknownPortsList,
        knownPortsList,
        unmatchedMisconfigs,
    };
}

function extractLogTelemetry(logSnippet) {
    if (!logSnippet?.trim()) {
        return { ips:[], domains:[], hashes:[], urls:[], emails:[], ja3:[], yara:[], hasLog:false, indicators:[], rawLog:'' };
    }

    // Validated extractors
    const publicIpRegex = /\b(?:(?!10\.|172\.(?:1[6-9]|2\d|3[01])\.|192\.168\.|127\.|0\.|169\.254\.|224\.|240\.)(?:[1-9]\d{0,2}\.){3}[1-9]\d{0,2})\b/g;
    const hashRegex     = /\b(?:[a-fA-F0-9]{32}|[a-fA-F0-9]{40}|[a-fA-F0-9]{64})\b/g;
    const urlRegex      = /\bhttps?:\/\/[^\s"'<>]{10,200}/g;
    const domainRegex   = /\b(?!(?:\d{1,3}\.){3}\d{1,3}\b)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}\b/g;
    const emailRegex    = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}\b/gi;
    const ja3Regex      = /\bja3(?:_hash)?[=:\s]+([a-fA-F0-9]{32})\b/gi;
    const yaraRegex     = /\brule\s+[A-Za-z_][A-Za-z0-9_]*\s*\{/g;

    const ips    = [...new Set((logSnippet.match(publicIpRegex) || []).filter(ip => {
        const parts = ip.split('.').map(Number);
        return parts.every(p => p >= 0 && p <= 255);
    }))];
    const hashes = [...new Set(logSnippet.match(hashRegex) || [])];
    const urls   = [...new Set((logSnippet.match(urlRegex) || []))].slice(0, 6);
    const emails = [...new Set(logSnippet.match(emailRegex) || [])].slice(0, 8);
    const ja3    = [...new Set([...logSnippet.matchAll(ja3Regex)].map(m => m[1].toLowerCase()))].slice(0, 8);
    const yara   = [...new Set((logSnippet.match(yaraRegex) || []).map(r => r.replace(/^rule\s+/, '').replace(/\s*\{$/, '')))].slice(0, 5);
    const urlHosts = urls.map(u => { try { return new URL(u).hostname; } catch { return null; } }).filter(Boolean);
    // QA-FIX: Filter domains against known real TLDs to avoid false positives
    // from file extensions (.log, .conf), version strings (v1.0.2.release), OS names (Windows.NT)
    const REAL_TLD_RE = /\.(com|net|org|io|gov|edu|co|uk|de|ru|cn|br|info|biz|xyz|app|ca|au|fr|jp|in|us|eu|me|tv|cc|tech|dev|cloud|ai|mil)$/i;
    const domains = [...new Set([...(logSnippet.match(domainRegex) || []), ...urlHosts]
        .map(d => d.toLowerCase())
        .filter(d => REAL_TLD_RE.test(d))
        .filter(d => !d.includes('/') && !d.includes('='))
        .filter(d => !emails.some(e => e.toLowerCase().endsWith(`@${d}`)))
        .filter(d => !['localhost'].includes(d)))].slice(0, 10);

    // Behavioral indicators
    const indicators = [];

    const checks = [
        // AUTH: require credential-specific failure context
        { type:'AUTH_FAILURE',
          regex:/(?:failed\s+(?:password|login|auth(?:entication)?)|authentication\s+fail(?:ed|ure)|invalid\s+(?:user|password|credentials)|wrong\s+password)/i,
          desc:'Authentication failure events detected in log data', ttp:'T1110', severity:'medium' },
        { type:'AUTH_SUCCESS',
          regex:/(?:accepted\s+(?:password|publickey)|session\s+opened\s+for|authenticated\s+successfully|login\s+(?:succeeded|success(?:ful)?))/i,
          desc:'Successful authentication events detected in log data', ttp:'T1078', severity:'high' },
        // QA-FIX (CRIT-001): Tightened — require SQL structural markers to prevent false positives
        // from natural language containing "select", "from", "insert", etc.
        { type:'SQLI_PATTERN',
          regex:/(?:UNION\s+(?:ALL\s+)?SELECT\s|SELECT\s+[\w*]+\s+FROM\s+\w|DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?\w|INSERT\s+INTO\s+\w+\s*\(|'\s*(?:OR|AND)\s+'\d+'='|;\s*(?:DROP|DELETE|UPDATE)\s+\w|EXEC(?:UTE)?\s*\(|xp_cmdshell|WAITFOR\s+DELAY)/i,
          desc:'SQL injection structural patterns detected in log entries', ttp:'T1190', severity:'high' },
        { type:'PATH_TRAVERSAL',
          regex:/(?:(?:\.\.\/){2,}|\.\.\\.*\.\.\\|%2[Ee]%2[Ee]%2[Ff]|(?:path|directory)\s+traversal|\/etc\/(?:passwd|shadow|hosts)|[Cc]:\\Windows\\System32\\cmd)/,
          desc:'Path traversal attempt patterns found in log data', ttp:'T1083', severity:'high' },
        { type:'CMD_EXECUTION',
          regex:/(?:cmd\.exe(?:\s|\/)|powershell(?:\.exe)?\s+-(?:enc|nop|exec|command|[Cc]\s)|\/(?:bin|usr\/bin)\/(?:bash|sh|zsh|python\d?|perl|ruby)\s|(?:exec|system|popen|Runtime\.exec|subprocess\.(?:call|run|Popen))\s*\()/i,
          desc:'Command interpreter invocation strings identified in log data', ttp:'T1059', severity:'critical' },
        // QA-FIX (MIN-005): Scanner detection now requires operational context (scan args or network result)
        // to avoid triggering on tool name mentions in documentation or admin notes
        { type:'SCANNER_ACTIVITY',
          regex:/(?:nmap\s+-[a-z]|masscan\s+-[a-z]|zmap\s+-[a-z]|nikto\s+-[a-z]|gobuster\s+(?:dir|dns|vhost)|dirb\s+https?|nuclei\s+-[a-z]|sqlmap\s+-[a-z]|shodan\.io\/host|discovered\s+\d+\s+open\s+port)/i,
          desc:'Security scanning tool activity patterns detected in log data (source context unknown — may represent self-initiated or external scan)', ttp:'T1595', severity:'medium' },
        { type:'RANSOMWARE',
          regex:/(?:ransomware|your\s+files\s+(?:have\s+been|are)\s+encrypted|ransom\s+note|pay\s+.*bitcoin|decrypt.*key)\b|(?:\.locked|\.encrypted|\.enc)(?:\s|$|["'])|(?:ryuk|conti|lockbit|revil|darkside|blackcat|clop|hive)\b/i,
          desc:'Ransomware-associated strings or file extension patterns in log data', ttp:'T1486', severity:'critical' },
        { type:'C2_INDICATOR',
          regex:/(?:cobalt\s*strike|cs\s+beacon|meterpreter|mimikatz|metasploit\s+(?:handler|listener)|command.?and.?control\s+(?:server|channel)|c2\s+(?:server|callback|beacon|channel))/i,
          desc:'Command-and-control tool references identified in log data', ttp:'T1071', severity:'critical' },
        { type:'EXFIL_PATTERN',
          regex:/(?:exfiltrat(?:ing|ion|ed)|data\s+(?:exfil|theft|stolen)|large\s+(?:outbound|upload)\s+transfer|\d{3,}\s*(?:MB|GB)\s+(?:sent|upload|transfer)|curl\s+.*-[TF]\s+|wget\s+.*--(?:post-file|upload-file))/i,
          desc:'Data exfiltration-associated patterns found in log data', ttp:'T1041', severity:'critical' },
        { type:'PRIVILEGE_ESC',
          regex:/(?:sudo\s+.*NOPASSWD|privilege\s+escal|whoami.*\broot\b|NT\s+AUTHORITY[/\\\\]SYSTEM|SeDebugPrivilege|token\s+impersonat|getsystem|bypassuac|juicypotato|printspoofer)/i,
          desc:'Privilege escalation indicators identified in log data', ttp:'T1068', severity:'critical' },
        { type:'LATERAL_MOVEMENT',
          regex:/(?:PsExec|WMI\s+exec|pass[-_\s]the[-_\s](?:hash|ticket)|lsass\.(?:exe|dmp)|impacket|crackmapexec|bloodhound|rubeus|lateral\s+movement)/i,
          desc:'Lateral movement tool or technique patterns in log data', ttp:'T1021', severity:'critical' },
        { type:'PERSISTENCE',
          regex:/(?:schtasks|scheduled\s+task|crontab\s+-[el]|\[HKEY[_A-Z]+\\Run(?:Once)?\]|startup\s+(?:folder|script)|sc\.exe\s+create|new\s+service\s+install|webshell|backdoor\s+(?:install|drop))/i,
          desc:'Persistence mechanism installation patterns in log data', ttp:'T1053', severity:'high' },
        // QA-FIX (MIN-005): 'hostname' alone removed — requires command-execution context
        { type:'RECON_INDICATOR',
          regex:/(?:whoami\s+\/|ipconfig\s+\/all|ifconfig\s+-a|net\s+(?:user|group|localgroup)\s+|systeminfo\b|uname\s+-a|id\s*;|cat\s+\/etc\/(?:passwd|shadow|hosts)|arp\s+-a|route\s+print)/i,
          desc:'Post-access reconnaissance command patterns in log data', ttp:'T1082', severity:'high' },
    ];

    checks.forEach(({ type, regex, desc, ttp, severity }) => {
        if (regex.test(logSnippet)) {
            indicators.push({ type, description: desc, ttp, severity, evidenceType:'verified' });
        }
    });

    return { ips, domains, hashes, urls, emails, ja3, yara, hasLog:true, indicators, rawLog:logSnippet };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 2: EVIDENCE VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function validateEvidence(portMap, matchedMisconfigs, logData, frameworkMeta = {}) {
    const validationResults = { passed:[], failed:[], warnings:[] };
    const { unknownPortsList = [], knownPortsList = [], unmatchedMisconfigs = [] } = frameworkMeta;

    // ── UNKNOWN PORT HANDLING FRAMEWORK — Phase 3: Evidence Validation ───────
    // Inject structured framework warnings per the UX rules spec.

    // Rule UX-1: Unknown ports in submitted scan
    unknownPortsList.forEach(port => {
        validationResults.warnings.push(
            `Port ${port} not found in ETH knowledge base. Valid network port, but no specific threat profile exists. ` +
            `Analysis limited to generic network-layer risks. If you know the service running on port ${port}, specify it for targeted analysis.`
        );
    });

    // Rule UX-2: Unmatched misconfiguration entries
    unmatchedMisconfigs.forEach(entry => {
        validationResults.warnings.push(
            `Misconfiguration not recognized in ETH knowledge base: "${entry.slice(0, 80)}${entry.length > 80 ? '…' : ''}". ` +
            `Defaulting to general service exposure analysis. Recognized patterns include default credentials, unpatched software, open CORS, SMBv1, and similar.`
        );
    });

    // Rule UX-3: All ports unknown — escalate to a consolidated warning
    if (unknownPortsList.length > 0 && knownPortsList.length === 0 && matchedMisconfigs.length === 0) {
        validationResults.warnings.push(
            `Insufficient information for targeted attacker analysis. No known ports or misconfigurations were recognized. ` +
            `ETH is providing generic network exposure context only. Add a recognized service or misconfiguration for a full threat profile.`
        );
    }

    // Rule UX-4: Service-driven analysis (unknown port + known service context via misconfig)
    if (unknownPortsList.length > 0 && knownPortsList.length === 0 && matchedMisconfigs.length > 0) {
        validationResults.warnings.push(
            `Non-standard port(s) detected (${unknownPortsList.join(', ')}). ETH is proceeding with misconfig-driven analysis ` +
            `based on the recognized configuration weaknesses provided.`
        );
    }

    // Hash validation — full MD5, SHA1, SHA256 only. Truncated hashes excluded.
    logData.hashes.forEach(h => {
        if (/^(?:[a-fA-F0-9]{32}|[a-fA-F0-9]{40}|[a-fA-F0-9]{64})$/.test(h)) {
            validationResults.passed.push(`Hash ${h.slice(0,8)}... passes full hash format validation`);
        } else {
            validationResults.failed.push(`Hash ${h.slice(0,8)}... failed SHA256 format check — excluded from IOCs`);
        }
    });
    const validHashes = logData.hashes.filter(h => /^(?:[a-fA-F0-9]{32}|[a-fA-F0-9]{40}|[a-fA-F0-9]{64})$/.test(h));

    // Validate port ranges (hard reject out-of-range)
    portMap.forEach((_, port) => {
        const n = parseInt(port);
        if (n < 1 || n > 65535) {
            validationResults.failed.push(`Port ${port} is outside valid range 1–65535`);
            portMap.delete(port);
        }
    });

    // Contradiction detection — flag impossible combinations
    const contradictions = [];
    if (portMap.has('443') && matchedMisconfigs.some(m => m.id === 'CRYPTO-001') && !portMap.has('80')) {
        contradictions.push('TLS misconfiguration flagged but only HTTPS port active — verify TLS configuration details');
    }

    // CVE–service consistency check
    matchedMisconfigs.forEach(m => {
        if (m.cve === 'CVE-2017-0144' && !portMap.has('445') && !portMap.has('139')) {
            validationResults.warnings.push('EternalBlue (CVE-2017-0144) referenced but SMB port not in scope — mapping confidence reduced');
        }
    });

    return { ...validationResults, validHashes, contradictions };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 3: THREAT CORRELATION
// ─────────────────────────────────────────────────────────────────────────────

function correlateThreatSignals(portMap, misconfigIds, logData) {
    const activeCorrelations = [];
    let correlationBoost = 0;

    CORRELATION_RULES.forEach(rule => {
        const portMatch = rule.requires.ports.length === 0 ||
            rule.requires.ports.some(p => portMap.has(p));
        const miscMatch = rule.requires.misconfigIds.length === 0 ||
            rule.requires.misconfigIds.some(id => misconfigIds.has(id));

        if (portMatch && miscMatch) {
            activeCorrelations.push(rule);
            correlationBoost += rule.riskBoost * 0.3; // partial aggregation to avoid ceiling inflation
        }
    });

    // Service category analysis
    const categories = new Set([...portMap.values()].map(p => p.category));
    const hasRemoteAccess = categories.has('remote-access');
    const hasDatabase     = categories.has('database');
    const hasWeb          = categories.has('web');
    const hasSMB          = categories.has('windows-smb');
    const hasLegacy       = categories.has('legacy');
    const hasInfrastructure = categories.has('infrastructure');

    // Log indicator analysis
    const hasActiveThreat = logData.indicators.some(i =>
        ['CMD_EXECUTION','RANSOMWARE','C2_INDICATOR','PRIVILEGE_ESC','LATERAL_MOVEMENT'].includes(i.type)
    );
    const hasBruteForce   = logData.indicators.some(i => i.type === 'AUTH_FAILURE');
    const hasSuccessfulAuth = logData.indicators.some(i => i.type === 'AUTH_SUCCESS');
    const hasWebAttack    = logData.indicators.some(i => ['SQLI_PATTERN','PATH_TRAVERSAL'].includes(i.type));
    const hasPersistence  = logData.indicators.some(i => i.type === 'PERSISTENCE');
    const hasRecon        = logData.indicators.some(i => i.type === 'RECON_INDICATOR');
    const hasExfil        = logData.indicators.some(i => i.type === 'EXFIL_PATTERN');

    return {
        activeCorrelations,
        correlationBoost: Math.min(correlationBoost, 35),
        categories,
        hasRemoteAccess, hasDatabase, hasWeb, hasSMB, hasLegacy, hasInfrastructure,
        hasActiveThreat, hasBruteForce, hasSuccessfulAuth, hasWebAttack,
        hasPersistence, hasRecon, hasExfil,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 4: MITRE ATT&CK MAPPING ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/** Create a technique entry with evidence classification */
function technique(id, name, description, evidenceType, generatedBecause, confidence = 'medium', predictiveLabel = null) {
    return { id, name, description, evidenceType, generatedBecause, confidence, predictiveLabel };
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 5: PREDICTIVE ATTACK MODELING — 7-PHASE KILL CHAIN (ALWAYS PRESENT)
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-disable no-unused-vars */
function buildKillChain(portMap, matchedMisconfigs, misconfigIds, logData, signals, validatedHashes) {
    const {
        hasRemoteAccess, hasDatabase, hasWeb, hasSMB, hasLegacy, hasInfrastructure,
        hasActiveThreat, hasBruteForce, hasSuccessfulAuth, hasWebAttack,
        hasPersistence, hasRecon, hasExfil, activeCorrelations,
        categories,
    } = signals;

    const portCount    = portMap.size;
    const miscCount    = matchedMisconfigs.length;
    const hasDefaultCreds = misconfigIds.has('AUTH-001');
    const hasNoMFA        = misconfigIds.has('AUTH-002');
    const hasUnpatched    = misconfigIds.has('PATCH-001');
    const hasSMBv1        = misconfigIds.has('PROTO-003');
    const hasNoRateLimit  = misconfigIds.has('AUTH-003');
    const hasPublicCloud  = misconfigIds.has('CLOUD-001');
    const hasNoAuthRedis  = misconfigIds.has('NOAUTH-001');
    const hasNoAuthMongo  = misconfigIds.has('NOAUTH-002');
    const hasNoAuthJupyter = misconfigIds.has('NOAUTH-003');
    const hasKubeletAPI   = misconfigIds.has('KUBE-001');
    const hasNFSMount     = misconfigIds.has('SYS-005');
    const hasGitExposed   = misconfigIds.has('SYS-004');
    const hasApiExposed   = misconfigIds.has('API-001');
    const hasSnmpDefault  = misconfigIds.has('AUTH-005');
    const hasLogTelemetry = logData.hasLog;

    const portList = [...portMap.entries()].map(([p, d]) => `${d.service} (${p})`).slice(0, 5).join(', ');

    // Helper: best evidence type across multiple options
    const bestEvidence = (...types) => {
        if (types.includes('verified')) return 'verified';
        if (types.includes('inferred')) return 'inferred';
        return 'hypothetical';
    };

    // ─── PHASE 1: RECONNAISSANCE ────────────────────────────────────────────────
    const phase1Techs = [];
    let phase1Evidence = 'inferred';

    if (logData.indicators.some(i => i.type === 'SCANNER_ACTIVITY')) {
        phase1Techs.push(technique(
            'T1595', 'Active Scanning',
            'Log data contains patterns consistent with scanning tool activity. Note: source context is unknown — this may represent external scanning or self-initiated security assessment. Correlation with source IPs is required to confirm hostile intent.',
            'verified', ['Scanner activity patterns in log data (source context unknown)'], 'medium', 'POTENTIAL'
        ));
        phase1Evidence = 'verified';
    }

    if (portCount > 0) {
        phase1Techs.push(technique(
            'T1595.001', 'Scanning IP Blocks',
            `${portCount} publicly accessible service port(s) [${portList}] constitute a discoverable attack surface. Internet-wide scanners (Shodan, Censys, Masscan) index such exposure within minutes to hours.`,
            'inferred', [`${portCount} service port(s) publicly exposed`], 'medium', 'LIKELY'
        ));
    }

    phase1Techs.push(technique(
        'T1592', 'Gather Victim Host Information',
        `Service banners on exposed port(s) disclose software versions enabling targeted exploit selection. ${hasRemoteAccess ? 'Remote access services (SSH/RDP/VNC) reveal OS and service version information.' : ''}${hasWeb ? ' Web service response headers may expose framework and server version.' : ''}`,
        'inferred', ['Service banner disclosure via exposed ports'], 'medium', 'LIKELY'
    ));

    // QA-FIX (MAJ-001): T1589.001 (Gather Victim Identity Info) belongs in TA0043 Recon.
    // Moved here from Weaponization phase where it was previously misplaced.
    if (hasDefaultCreds || hasNoMFA) {
        phase1Techs.push(technique(
            'T1589.001', 'Gather Victim Identity Information: Credentials',
            `Identified authentication configuration weaknesses (${[hasDefaultCreds && 'default credentials', hasNoMFA && 'absent MFA'].filter(Boolean).join(', ')}) indicate that credential intelligence for this environment may be trivially obtainable — either from public default password databases or low-effort credential stuffing operations.`,
            'inferred', [
                hasDefaultCreds ? 'Default credentials documented in public sources' : null,
                hasNoMFA ? 'No MFA — credential intelligence reduces attack cost significantly' : null,
            ].filter(Boolean), 'high', 'LIKELY'
        ));
    }

    if (hasWeb) {
        phase1Techs.push(technique(
            'T1598', 'Phishing for Information',
            'Internet-facing web presence enables social engineering reconnaissance — harvesting employee details, email formats, and organizational structure for targeted phishing.',
            'hypothetical', ['Web service provides external organizational footprint'], 'low', 'POSSIBLE'
        ));
    }

    // ─── PHASE 2: WEAPONIZATION ─────────────────────────────────────────────────
    const phase2Techs = [];
    let phase2Evidence = 'hypothetical';

    if (hasSMBv1 || activeCorrelations.some(c => c.id === 'CORR-002')) {
        phase2Techs.push(technique(
            'T1588.005', 'Obtain Capabilities: Exploits',
            'SMBv1 exposure (CVE-2017-0144) makes EternalBlue exploit modules directly applicable. These are publicly available in Metasploit and standalone PoC repositories.',
            'inferred', ['SMBv1 active on port 445', 'CVE-2017-0144 exploit publicly available'], 'high', 'LIKELY'
        ));
        phase2Evidence = 'inferred';
    }

    if (hasUnpatched && hasWeb) {
        phase2Techs.push(technique(
            'T1587.001', 'Develop Capabilities: Malware',
            'Unpatched web components may have corresponding public exploit code. Threat actors scan CVE databases for recently disclosed vulnerabilities matching detected software versions.',
            'inferred', ['Unpatched web service identified', 'N-day exploit availability is likely'], 'medium', 'POTENTIAL'
        ));
        if (phase2Evidence === 'hypothetical') phase2Evidence = 'inferred';
    }

    // QA-FIX: T1589.001 belongs in TA0043 (Reconnaissance), NOT Weaponization.
    // Authentication weakness modelling here uses T1586 (Compromise Accounts) which is TA0042.
    if (hasDefaultCreds || hasNoMFA) {
        phase2Techs.push(technique(
            'T1586', 'Compromise Accounts',
            'Identified authentication weaknesses (default credentials or absent MFA) dramatically reduce weaponization effort. An attacker may acquire or derive working credentials without any exploit, leveraging public default password lists or targeted credential stuffing.',
            'inferred', [
                hasDefaultCreds ? 'Default credentials identified — no exploit required' : null,
                hasNoMFA ? 'No MFA: credential stuffing is a viable low-effort attack' : null,
            ].filter(Boolean), 'high', 'LIKELY'
        ));
        if (phase2Evidence === 'hypothetical') phase2Evidence = 'inferred';
    }

    // Always include baseline weaponization
    phase2Techs.push(technique(
        'T1583', 'Acquire Infrastructure',
        'A threat actor targeting this environment would acquire attack infrastructure (VPS, domain fronting, proxy chains) during the weaponization phase to obscure attribution.',
        'hypothetical', ['Standard attacker operational security practice'], 'low', 'POSSIBLE'
    ));

    // ─── PHASE 3: DELIVERY ──────────────────────────────────────────────────────
    const phase3Techs = [];
    let phase3Evidence = 'inferred';

    if (hasWebAttack) {
        phase3Techs.push(technique(
            'T1190', 'Exploit Public-Facing Application',
            'Log telemetry contains web application attack patterns (SQL injection, path traversal). Active exploitation attempts against web-facing services are confirmed in the log data.',
            'verified', ['Web application attack patterns detected in logs'], 'high', 'CONFIRMED'
        ));
        phase3Evidence = 'verified';
    }

    if (hasRemoteAccess && (hasDefaultCreds || hasNoMFA || hasBruteForce)) {
        const deliveryEvidence = [];
        if (hasDefaultCreds) deliveryEvidence.push('Default credentials identified');
        if (hasNoMFA)        deliveryEvidence.push('MFA absent on remote access service');
        if (hasBruteForce)   deliveryEvidence.push('Brute-force attempts in logs');
        phase3Techs.push(technique(
            'T1133', 'External Remote Services',
            `Exposed remote access services (${[portMap.has('22') && 'SSH', portMap.has('3389') && 'RDP', portMap.has('5900') && 'VNC'].filter(Boolean).join('/')}) with identified authentication weaknesses represent a high-probability delivery vector.`,
            hasBruteForce ? 'verified' : 'inferred', deliveryEvidence, hasBruteForce ? 'high' : 'medium',
            hasBruteForce ? 'CONFIRMED' : 'LIKELY'
        ));
        if (phase3Evidence === 'inferred' || (phase3Evidence === 'hypothetical' && hasBruteForce)) {
            phase3Evidence = hasBruteForce ? 'verified' : 'inferred';
        }
    }

    if (hasLegacy) {
        phase3Techs.push(technique(
            'T1040', 'Network Sniffing',
            'Legacy cleartext protocol exposure (Telnet/FTP) enables passive credential capture by any network-path adversary without generating authentication logs on the target.',
            'inferred', ['Cleartext protocol exposure identified'], 'medium', 'POTENTIAL'
        ));
    }

    // QA-FIX (CRIT-002): T1530 is TA0009 Collection, NOT TA0001 Initial Access/Delivery.
    // Cloud storage access is now modelled only in Phase 7 (Actions on Objectives).
    // Delivery phase notes the presence of public cloud as an access enabler without mis-mapping the technique.

    // Always include phishing as a baseline delivery vector
    if (phase3Techs.length < 2) {
        phase3Techs.push(technique(
            'T1566.001', 'Spearphishing Attachment',
            'In environments without specific delivery evidence, targeted phishing against personnel is the statistically most common initial access delivery method. This is a baseline threat model, not a confirmed delivery vector.',
            'hypothetical', ['No specific delivery evidence identified; baseline threat modelling applied'], 'low', 'POSSIBLE'
        ));
        if (phase3Evidence === 'hypothetical') phase3Evidence = 'hypothetical';
    }

    // ─── PHASE 4: EXPLOITATION ──────────────────────────────────────────────────
    const phase4Techs = [];
    let phase4Evidence = 'hypothetical';
    let phase4Confidence = 'low';

    if (logData.indicators.some(i => i.type === 'CMD_EXECUTION')) {
        phase4Techs.push(technique(
            'T1059', 'Command and Scripting Interpreter',
            'Log data contains command interpreter invocation strings. This is direct evidence of code execution activity on systems in scope — requires immediate investigation to determine authorization.',
            'verified', ['Command interpreter activity in log data'], 'high', 'CONFIRMED'
        ));
        phase4Evidence = 'verified'; phase4Confidence = 'high';
    }

    // QA-FIX (MAJ-004): T1505.003 (Web Shell) maps to TA0003 Persistence, NOT Exploitation.
    // Removed from Phase 4; web attack evidence in Phase 4 now uses T1190 (attempt) instead.
    if (hasWebAttack && phase4Evidence === 'hypothetical') {
        // Web attack patterns suggest exploitation attempts, not confirmed web shell installation
        phase4Evidence = 'inferred';
        phase4Confidence = 'medium';
    }

    if (hasSMBv1 && hasSMB) {
        phase4Techs.push(technique(
            'T1210', 'Exploitation of Remote Services',
            'SMBv1 active on port 445 creates conditions for EternalBlue (CVE-2017-0144) exploitation — a remote code execution vulnerability requiring no credentials.',
            'inferred', ['SMBv1 protocol active', 'Port 445 exposed'], 'high', 'LIKELY'
        ));
        if (phase4Evidence === 'hypothetical') { phase4Evidence = 'inferred'; phase4Confidence = 'high'; }
    }

    if (hasNoAuthRedis) {
        phase4Techs.push(technique(
            'T1190', 'Exploit Public-Facing Application',
            'Unauthenticated Redis enables CONFIG/SLAVEOF commands that write attacker-controlled content to arbitrary file paths — a no-exploit RCE path.',
            'inferred', ['Redis running without authentication', 'Port 6379 exposed'], 'high', 'LIKELY'
        ));
        if (phase4Evidence === 'hypothetical') { phase4Evidence = 'inferred'; phase4Confidence = 'high'; }
    }

    if (hasNoAuthJupyter) {
        phase4Techs.push(technique(
            'T1190', 'Exploit Public-Facing Application',
            'Unauthenticated Jupyter Notebook exposure allows attackers to directly invoke kernels and execute arbitrary code on the underlying host.',
            'inferred', ['Jupyter Notebook running without authentication', 'Port 8888 exposed'], 'high', 'LIKELY'
        ));
        if (phase4Evidence === 'hypothetical') { phase4Evidence = 'inferred'; phase4Confidence = 'high'; }
    }

    if (hasKubeletAPI) {
        phase4Techs.push(technique(
            'T1610', 'Deploy Container',
            'Exposed anonymous Kubernetes API or Kubelet allows attackers to schedule pods, bypass controls, and execute arbitrary commands in the container context.',
            'inferred', ['Kubernetes Kubelet or API server allows anonymous access', 'Port 6443/10250 exposed'], 'high', 'LIKELY'
        ));
        if (phase4Evidence === 'hypothetical') { phase4Evidence = 'inferred'; phase4Confidence = 'high'; }
    }

    if (hasDefaultCreds && (hasRemoteAccess || hasDatabase)) {
        phase4Techs.push(technique(
            'T1078.001', 'Valid Accounts: Default Accounts',
            'Default credentials eliminate the exploitation requirement — direct authenticated access to services is possible using publicly documented default username/password pairs.',
            'inferred', ['Default credentials identified', 'Target service publicly accessible'], 'high', 'LIKELY'
        ));
        if (phase4Evidence === 'hypothetical') { phase4Evidence = 'inferred'; phase4Confidence = 'high'; }
    }

    // Always include baseline exploitation scenario
    if (phase4Techs.length === 0) {
        phase4Techs.push(technique(
            'T1203', 'Exploitation for Client Execution',
            'Based on the identified attack surface, client-side exploitation (malicious document, browser exploit) represents a plausible delivery-to-execution path in environments with internet-facing web presence.',
            'hypothetical', ['Baseline exploitation scenario — no specific exploitation evidence identified'], 'low', 'POSSIBLE'
        ));
    }

    // ─── PHASE 5: INSTALLATION / PERSISTENCE ────────────────────────────────────
    const phase5Techs = [];
    let phase5Evidence = 'hypothetical';
    let phase5Confidence = 'low';

    if (logData.indicators.some(i => i.type === 'PERSISTENCE')) {
        phase5Techs.push(technique(
            'T1053', 'Scheduled Task/Job',
            'Log data contains persistence mechanism installation patterns (scheduled tasks, cron entries, startup scripts). This is direct evidence of persistence activity.',
            'verified', ['Persistence mechanism patterns in log data'], 'high', 'CONFIRMED'
        ));
        phase5Evidence = 'verified'; phase5Confidence = 'high';
    }

    // QA-FIX (MAJ-004): T1505.003 now correctly placed in Persistence (TA0003) per ATT&CK framework
    if (hasWebAttack || logData.indicators.some(i => i.type === 'CMD_EXECUTION')) {
        phase5Techs.push(technique(
            'T1505.003', 'Server-Side Web Shell (TA0003)',
            'Environments with active web attack or command execution evidence are at elevated risk of web shell installation — providing persistent, browser-based backdoor access that survives reboots and password changes. Verification requires file system or EDR telemetry.',
            'inferred', [
                hasWebAttack ? 'Web application attack patterns in logs' : null,
                logData.indicators.some(i => i.type === 'CMD_EXECUTION') ? 'Command execution evidence in logs' : null,
            ].filter(Boolean), 'medium', 'POTENTIAL'
        ));
        if (phase5Evidence === 'hypothetical') { phase5Evidence = 'inferred'; phase5Confidence = 'medium'; }
    }

    if (hasRemoteAccess || hasDefaultCreds) {
        phase5Techs.push(technique(
            'T1098.004', 'Account Manipulation: SSH Authorized Keys',
            'Following remote access compromise, adding SSH authorized keys is a standard persistence technique that bypasses password authentication and survives password changes.',
            hasNoAuthRedis ? 'inferred' : 'hypothetical',
            [hasNoAuthRedis ? 'Redis config-write enables SSH key injection' : 'Remote access compromise scenario — persistence is a predictable follow-on action'],
            hasNoAuthRedis ? 'high' : 'medium', hasNoAuthRedis ? 'LIKELY' : 'POTENTIAL'
        ));
        if (phase5Evidence === 'hypothetical' && hasNoAuthRedis) { phase5Evidence = 'inferred'; phase5Confidence = 'medium'; }
    }

    if (hasSMB || hasRemoteAccess) {
        phase5Techs.push(technique(
            'T1543.003', 'Create or Modify System Process: Windows Service',
            'Windows environments with SMB or RDP access are common targets for malicious service installation as a persistence mechanism.',
            'hypothetical', ['Windows service environments with remote access exposure'], 'low', 'POSSIBLE'
        ));
    }

    // Always have at least a hypothetical persistence entry
    if (phase5Techs.length === 0) {
        phase5Techs.push(technique(
            'T1547', 'Boot or Logon Autostart Execution',
            'Following any successful access, an attacker would establish persistence via autostart mechanisms. Specific persistence method depends on OS and access level obtained.',
            'hypothetical', ['Standard post-access attacker behavior — baseline persistence scenario'], 'low', 'POSSIBLE'
        ));
    }

    // ─── PHASE 6: COMMAND & CONTROL ─────────────────────────────────────────────
    const phase6Techs = [];
    let phase6Evidence = 'hypothetical';
    let phase6Confidence = 'low';
    const c2SupportingEvidence = [];

    if (logData.indicators.some(i => i.type === 'C2_INDICATOR')) {
        phase6Techs.push(technique(
            'T1071', 'Application Layer Protocol',
            'Log data contains direct references to command-and-control frameworks (Cobalt Strike, Metasploit, Meterpreter). This is high-confidence evidence of active C2 activity.',
            'verified', ['C2 framework references in log data'], 'high', 'CONFIRMED'
        ));
        phase6Evidence = 'verified'; phase6Confidence = 'high';
        c2SupportingEvidence.push('C2 tool references in log telemetry');
    }

    if (logData.ips.length > 0) {
        phase6Techs.push(technique(
            'T1071.001', 'Application Layer Protocol: Web Protocols',
            `${logData.ips.length} external IP address(es) extracted from log data [${logData.ips.slice(0,3).join(', ')}${logData.ips.length > 3 ? '...' : ''}]. These require reputation lookup against threat intelligence feeds to determine if they represent C2 infrastructure.`,
            'inferred', [`${logData.ips.length} external IP(s) extracted from logs`], 'medium', 'POTENTIAL'
        ));
        if (phase6Evidence === 'hypothetical') { phase6Evidence = 'inferred'; phase6Confidence = 'medium'; }
        c2SupportingEvidence.push(`${logData.ips.length} external IP(s) in logs`);
    }

    if (hasWeb || hasRemoteAccess) {
        phase6Techs.push(technique(
            'T1572', 'Protocol Tunneling',
            'Environments with web or remote access exposure are susceptible to C2 traffic tunneled over legitimate protocols (HTTPS, DNS, WebSockets) to evade detection.',
            'hypothetical', ['Internet-facing service presence enables protocol tunneling for C2'], 'low', 'POSSIBLE'
        ));
    }

    // Always include baseline C2 scenario
    if (phase6Techs.length === 0) {
        phase6Techs.push(technique(
            'T1102', 'Web Service',
            'Threat actors commonly establish C2 channels using legitimate web services (GitHub, Pastebin, cloud storage) to blend with normal traffic. Outbound traffic inspection is required to detect.',
            'hypothetical', ['Baseline C2 scenario — no specific C2 evidence identified'], 'low', 'POSSIBLE'
        ));
    }

    // ─── PHASE 7: ACTIONS ON OBJECTIVES ─────────────────────────────────────────
    const phase7Techs = [];
    let phase7Evidence = 'hypothetical';
    let phase7Confidence = 'low';
    const impactSupportingEvidence = [];

    if (logData.indicators.some(i => i.type === 'RANSOMWARE')) {
        phase7Techs.push(technique(
            'T1486', 'Data Encrypted for Impact',
            'Log data contains ransomware-associated strings, file extension patterns, or encryption activity. IMMEDIATE INCIDENT RESPONSE ACTION REQUIRED. Preserve log evidence and isolate affected systems.',
            'verified', ['Ransomware artifact patterns in log data'], 'high', 'CONFIRMED'
        ));
        phase7Evidence = 'verified'; phase7Confidence = 'high';
        impactSupportingEvidence.push('Ransomware artifacts in logs');
    }

    if (hasExfil) {
        phase7Techs.push(technique(
            'T1041', 'Exfiltration Over C2 Channel',
            'Log telemetry contains data exfiltration-associated patterns (large outbound transfers, exfil keyword references). Investigate transfer volume, destinations, and data classification of affected systems.',
            'verified', ['Data exfiltration patterns in log data'], 'high', 'CONFIRMED'
        ));
        if (phase7Evidence === 'hypothetical') { phase7Evidence = 'verified'; phase7Confidence = 'high'; }
        impactSupportingEvidence.push('Exfiltration patterns in logs');
    }

    if (hasDatabase) {
        const dbPorts = [...portMap.entries()].filter(([,d]) => d.category === 'database').map(([p,d]) => `${d.service}(${p})`);
        phase7Techs.push(technique(
            'T1005', 'Data from Local System',
            `${dbPorts.join(', ')} database service(s) are publicly accessible. Unauthorized access would enable complete data extraction. Impact severity depends on data classification and whether authentication is enforced.`,
            hasNoAuthRedis || hasNoAuthMongo ? 'inferred' : 'hypothetical',
            [hasNoAuthRedis || hasNoAuthMongo ? 'Unauthenticated database access confirmed' : 'Database service exposure creates data theft risk'],
            hasNoAuthRedis || hasNoAuthMongo ? 'high' : 'medium',
            hasNoAuthRedis || hasNoAuthMongo ? 'LIKELY' : 'POTENTIAL'
        ));
        if (phase7Evidence === 'hypothetical') {
            phase7Evidence = hasNoAuthRedis || hasNoAuthMongo ? 'inferred' : 'hypothetical';
            phase7Confidence = hasNoAuthRedis || hasNoAuthMongo ? 'high' : 'medium';
        }
    }

    if (activeCorrelations.some(c => ['CORR-001','CORR-002','CORR-008'].includes(c.id))) {
        phase7Techs.push(technique(
            'T1486', 'Data Encrypted for Impact (Ransomware Risk)',
            `The identified exposure profile (${activeCorrelations.filter(c => ['CORR-001','CORR-002','CORR-008'].includes(c.id)).map(c => c.name).join(', ')}) matches documented ransomware intrusion preconditions. Ransomware deployment is a plausible outcome if initial access is achieved.`,
            'inferred', activeCorrelations.filter(c => ['CORR-001','CORR-002','CORR-008'].includes(c.id)).map(c => c.threat),
            'medium', 'POTENTIAL'
        ));
        if (phase7Evidence === 'hypothetical') { phase7Evidence = 'inferred'; phase7Confidence = 'medium'; }
    }

    // Always include baseline impact scenario
    if (phase7Techs.length === 0) {
        phase7Techs.push(technique(
            'T1657', 'Financial Theft',
            'Without specific impact evidence, the most likely attacker objectives based on the exposed service profile would be data theft for financial gain or operational disruption. Impact assessment requires telemetry evidence.',
            'hypothetical', ['Baseline impact scenario — no specific impact evidence identified'], 'low', 'POSSIBLE'
        ));
        phase7Techs.push(technique(
            'T1565', 'Data Manipulation',
            'Internet-accessible services without strong authentication controls are at risk of unauthorized data modification — a non-destructive attack that may remain undetected for extended periods.',
            'hypothetical', ['Unauthenticated service access creates data integrity risk'], 'low', 'POSSIBLE'
        ));
    }

    // ─── ASSEMBLE KILL CHAIN ─────────────────────────────────────────────────────

    const phase1Conf = logData.indicators.some(i => i.type === 'SCANNER_ACTIVITY') ? 'high' : portCount > 0 ? 'medium' : 'low';
    const phase2Conf = (hasSMBv1 || hasDefaultCreds || hasNoMFA) ? 'medium' : 'low';

    return [
        {
            phase: 'Reconnaissance',
            mitreId: 'TA0043',
            riskLevel: phase1Conf === 'high' ? 'high' : 'medium',
            timeEstimate: '1–14 days',
            evidenceType: phase1Evidence,
            confidenceLevel: phase1Conf,
            confidenceScore: phase1Conf === 'high' ? 85 : phase1Conf === 'medium' ? 60 : 35,
            supportingEvidence: [
                portCount > 0 ? `${portCount} service port(s) publicly accessible` : 'No exposed ports identified',
                ...logData.indicators.filter(i => i.type === 'SCANNER_ACTIVITY').map(i => i.description),
            ],
            confidenceReasoning: portCount > 0
                ? `Attack surface is directly observable (${portCount} ports). Internet-wide scanners index this exposure automatically.`
                : 'No exposed ports detected; reconnaissance risk is assessed as low.',
            techniques: phase1Techs,
        },
        {
            phase: 'Weaponization',
            // QA-FIX (MIN-001): PRE-ATT&CK was deprecated in 2020 and merged into ATT&CK Enterprise.
            // TA0042 (Resource Development) is the correct current tactic for this phase.
            mitreId: 'TA0042',
            riskLevel: phase2Evidence === 'inferred' ? 'high' : 'medium',
            timeEstimate: '1–7 days',
            evidenceType: phase2Evidence,
            confidenceLevel: phase2Conf,
            confidenceScore: phase2Conf === 'high' ? 70 : phase2Conf === 'medium' ? 50 : 30,
            supportingEvidence: [
                hasSMBv1 ? 'SMBv1 active — EternalBlue exploit modules directly applicable' : null,
                hasUnpatched ? 'Unpatched components — n-day exploit code may be publicly available' : null,
                hasDefaultCreds ? 'Default credentials — weaponization may be unnecessary (direct access)' : null,
            ].filter(Boolean),
            confidenceReasoning: 'Weaponization activity occurs off-network and cannot be directly observed from target data alone.',
            techniques: phase2Techs,
        },
        {
            phase: 'Delivery',
            mitreId: 'TA0001',
            riskLevel: phase3Evidence === 'verified' ? 'critical' : phase3Evidence === 'inferred' ? 'high' : 'medium',
            timeEstimate: 'Hours to weeks',
            evidenceType: phase3Evidence,
            confidenceLevel: phase3Evidence === 'verified' ? 'high' : phase3Evidence === 'inferred' ? 'medium' : 'low',
            confidenceScore: phase3Evidence === 'verified' ? 90 : phase3Evidence === 'inferred' ? 65 : 35,
            supportingEvidence: [
                hasWebAttack ? 'Web application attack patterns confirmed in logs' : null,
                hasBruteForce ? 'Brute-force delivery attempts in logs' : null,
                hasRemoteAccess ? `Remote access service(s) exposed — direct delivery vector available` : null,
                hasLegacy ? 'Cleartext protocol exposure enables passive credential capture' : null,
            ].filter(Boolean),
            confidenceReasoning: phase3Evidence === 'verified'
                ? 'Log telemetry provides direct evidence of delivery attempts.'
                : phase3Evidence === 'inferred'
                ? 'Exposure profile and authentication weaknesses create high-probability delivery paths.'
                : 'No specific delivery evidence; phishing is the statistical baseline vector.',
            techniques: phase3Techs,
        },
        {
            phase: 'Exploitation',
            mitreId: 'TA0002',
            riskLevel: phase4Evidence === 'verified' ? 'critical' : phase4Evidence === 'inferred' ? 'high' : 'medium',
            timeEstimate: 'Minutes to hours',
            evidenceType: phase4Evidence,
            confidenceLevel: phase4Evidence === 'verified' ? 'high' : phase4Evidence === 'inferred' ? 'high' : 'low',
            confidenceScore: phase4Evidence === 'verified' ? 95 : phase4Evidence === 'inferred' ? 72 : 30,
            supportingEvidence: [
                logData.indicators.some(i => i.type === 'CMD_EXECUTION') ? 'Command execution activity in logs' : null,
                hasWebAttack ? 'Web exploitation patterns in logs' : null,
                hasSMBv1 ? 'EternalBlue applicable (SMBv1 + CVE-2017-0144)' : null,
                hasDefaultCreds ? 'Default credentials eliminate exploit requirement' : null,
                hasNoAuthRedis ? 'Redis CONFIG-write RCE path available' : null,
            ].filter(Boolean),
            confidenceReasoning: phase4Evidence === 'verified'
                ? 'Command execution evidence in logs indicates exploitation has occurred.'
                : phase4Evidence === 'inferred'
                ? 'Critical vulnerability conditions (SMBv1/default creds/no-auth services) make exploitation highly feasible.'
                : 'No exploitation evidence identified; scenario is based on exposure-profile threat modelling.',
            techniques: phase4Techs,
        },
        {
            phase: 'Persistence & Installation',
            mitreId: 'TA0003',
            riskLevel: phase5Evidence === 'verified' ? 'critical' : phase5Evidence === 'inferred' ? 'high' : 'medium',
            timeEstimate: '< 2 hours post-exploitation',
            evidenceType: phase5Evidence,
            confidenceLevel: phase5Evidence === 'verified' ? 'high' : phase5Evidence === 'inferred' ? 'medium' : 'low',
            confidenceScore: phase5Evidence === 'verified' ? 90 : phase5Evidence === 'inferred' ? 58 : 28,
            supportingEvidence: [
                logData.indicators.some(i => i.type === 'PERSISTENCE') ? 'Persistence installation patterns in logs' : null,
                hasNoAuthRedis ? 'Redis config-write enables SSH key injection persistence' : null,
                hasWebAttack ? 'Web attack evidence raises web shell persistence probability' : null,
            ].filter(Boolean),
            confidenceReasoning: phase5Evidence === 'verified'
                ? 'Persistence artifacts directly observed in log telemetry.'
                : 'Persistence is a predictable attacker follow-on action; specific mechanisms modelled from environment profile.',
            techniques: phase5Techs,
        },
        {
            phase: 'Command & Control',
            mitreId: 'TA0011',
            riskLevel: phase6Evidence === 'verified' ? 'critical' : phase6Evidence === 'inferred' ? 'high' : 'medium',
            timeEstimate: 'Established within minutes of access',
            evidenceType: phase6Evidence,
            confidenceLevel: phase6Evidence === 'verified' ? 'high' : phase6Evidence === 'inferred' ? 'medium' : 'low',
            confidenceScore: phase6Evidence === 'verified' ? 92 : phase6Evidence === 'inferred' ? 55 : 25,
            supportingEvidence: [
                ...c2SupportingEvidence,
                logData.ips.length > 0 ? `${logData.ips.length} external IP(s) extracted from logs` : null,
            ].filter(Boolean),
            confidenceReasoning: phase6Evidence === 'verified'
                ? 'C2 tool signatures directly observed in log data.'
                : phase6Evidence === 'inferred'
                ? 'External IPs in logs warrant threat intelligence correlation for C2 identification.'
                : 'No C2 evidence identified; channel modelled from environment attack surface.',
            techniques: phase6Techs,
        },
        {
            phase: 'Actions on Objectives',
            mitreId: 'TA0040',
            riskLevel: phase7Evidence === 'verified' ? 'critical' : phase7Evidence === 'inferred' ? 'high' : 'medium',
            timeEstimate: '2–72 hours post-persistence',
            evidenceType: phase7Evidence,
            confidenceLevel: phase7Evidence === 'verified' ? 'high' : phase7Evidence === 'inferred' ? 'medium' : 'low',
            confidenceScore: phase7Evidence === 'verified' ? 95 : phase7Evidence === 'inferred' ? 62 : 25,
            supportingEvidence: [
                ...impactSupportingEvidence,
                hasDatabase ? 'Database service exposure creates data exfiltration risk' : null,
                activeCorrelations.some(c => ['CORR-001','CORR-002'].includes(c.id)) ? 'Ransomware-associated exposure pattern identified' : null,
            ].filter(Boolean),
            confidenceReasoning: phase7Evidence === 'verified'
                ? 'Impact activity directly observed in telemetry — incident response required.'
                : phase7Evidence === 'inferred'
                ? 'Exposure profile and correlation rules indicate high-probability impact scenarios.'
                : 'No impact evidence identified; objectives modelled from attacker motivation patterns.',
            techniques: phase7Techs,
        },
    ];
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYER 6: RISK SCORING ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/* eslint-enable no-unused-vars */
// eslint-disable-next-line no-unused-vars
function calculateRisk(portMap, matchedMisconfigs, logData, signals) {
    let score = 0;
    const factors = [];

    // Attack surface score (each port weighted by exploitability)
    portMap.forEach((intel, port) => {
        const pts = Math.round(intel.exploitability * 14);
        score += pts;
        factors.push({ factor:`${intel.service} (${port}) exposure`, pts, category:'Attack Surface' });
    });

    // Misconfiguration amplifiers
    matchedMisconfigs.forEach(mc => {
        score += mc.severityDelta;
        factors.push({ factor:mc.finding, pts:mc.severityDelta, category:'Configuration Risk' });
    });

    // Correlation bonuses
    signals.activeCorrelations.forEach(rule => {
        const pts = Math.round(rule.riskBoost * 0.4);
        score += pts;
        factors.push({ factor:`Correlation: ${rule.name}`, pts, category:'Threat Correlation' });
    });

    // Log-evidence escalation
    logData.indicators.forEach(ind => {
        const pts = { critical:20, high:12, medium:6 }[ind.severity] || 5;
        score += pts;
        factors.push({ factor:ind.description, pts, category:'Telemetry Evidence' });
    });

    // IOC bonuses
    if (logData.ips.length > 0)    { score += 5;  factors.push({ factor:`${logData.ips.length} external IP(s) in logs`, pts:5, category:'IOC Evidence' }); }
    if (logData.hashes.length > 0) { score += 8;  factors.push({ factor:`${logData.hashes.length} file hash(es) in logs`, pts:8, category:'IOC Evidence' }); }

    const finalScore = Math.min(Math.max(score, 5), 99);
    const topFactors = [...factors].sort((a, b) => b.pts - a.pts).slice(0, 5);

    return { score:finalScore, factors, topFactors };
}

function calculateExposureRisk(portMap, matchedMisconfigs, logData, signals) {
    const factors = [];
    const add = (factor, score, category, weight, evidence) => {
        factors.push({ factor, score, category, weight, weightedScore: Math.round(score * weight), evidence });
    };

    const internetAccessible = portMap.size > 0 ? 100 : 15;
    const maxExploitability = Math.max(0, ...[...portMap.values()].map(p => p.exploitability || 0));
    const criticalPorts = [...portMap.entries()].filter(([, d]) => d.risk === 'critical');
    const remoteOrDb = [...portMap.values()].filter(d => ['remote-access','database','windows-smb','infrastructure'].includes(d.category));
    const authWeakness = matchedMisconfigs.filter(m => m.category === 'Authentication').length;
    const segmentationWeakness = (signals.hasSMB || signals.hasRemoteAccess || signals.hasDatabase) ? 72 : 35;
    const businessImpact = signals.hasDatabase ? 86 : signals.hasInfrastructure ? 82 : signals.hasRemoteAccess ? 68 : 45;
    const attackComplexity = matchedMisconfigs.some(m => ['AUTH-001','NOAUTH-001','NOAUTH-002'].includes(m.id)) ? 86 : maxExploitability > 0.80 ? 78 : 48;
    const privilegeLevel = matchedMisconfigs.some(m => m.id === 'AUTH-001') ? 78 : signals.hasRemoteAccess ? 62 : 38;
    const blastRadius = signals.hasSMB ? 84 : remoteOrDb.length >= 2 ? 72 : 42;
    const telemetryAnomaly = logData.indicators.length ? Math.min(45 + logData.indicators.length * 8, 88) : 20;

    add('Accessibility from internet', internetAccessible, 'Exposure Severity', 0.14, `${portMap.size} externally supplied port(s)`);
    add('Exploit likelihood', Math.round(maxExploitability * 100), 'Exploit Likelihood', 0.16, criticalPorts.length ? `${criticalPorts.length} critical exposed service(s)` : 'No critical service class identified');
    add('Attack complexity', attackComplexity, 'Attack Complexity', 0.12, attackComplexity >= 78 ? 'Low-complexity access condition identified' : 'Exploitability depends on service posture');
    add('Business impact', businessImpact, 'Business Impact', 0.14, signals.hasDatabase ? 'Data service exposed' : 'Impact estimated from service category');
    add('Privilege level', privilegeLevel, 'Privilege Level', 0.10, matchedMisconfigs.some(m => m.id === 'AUTH-001') ? 'Default credential weakness' : 'Privilege impact not confirmed');
    add('Blast radius', blastRadius, 'Blast Radius', 0.12, signals.hasSMB ? 'SMB exposure can increase propagation risk' : 'Blast radius depends on internal segmentation');
    add('Segmentation weakness', segmentationWeakness, 'Segmentation Weakness', 0.10, remoteOrDb.length ? 'Externally reachable administrative or data-plane service' : 'No administrative/data-plane service identified');
    add('Authentication control weakness', Math.min(authWeakness * 30, 90), 'Authentication Risk', 0.07, `${authWeakness} authentication finding(s)`);
    add('Telemetry anomaly score', telemetryAnomaly, 'Telemetry Context', 0.05, logData.hasLog ? `${logData.indicators.length} behavioral indicator(s)` : 'No telemetry provided');

    const score = Math.max(5, Math.min(99, Math.round(factors.reduce((sum, f) => sum + f.weightedScore, 0))));
    return {
        score,
        factors,
        topFactors:[...factors].sort((a, b) => b.weightedScore - a.weightedScore).slice(0, 6),
        riskAssessment:{
            overallScore:score,
            riskLevel:scoreToRiskLevel(score),
            scoringBasis:'Exposure, exploit likelihood, attack complexity, business impact, privilege level, blast radius, segmentation weakness, authentication posture, internet accessibility, and telemetry anomalies. Score does not assume compromise success.',
            dimensions:factors.map(({ category, score, weight, evidence }) => ({ category, score, weight, evidence })),
        },
    };
}

function calculateConfidence(portMap, matchedMisconfigs, logData, frameworkMeta = {}) {
    const { unknownPortsList = [], knownPortsList = [], unmatchedMisconfigs = [] } = frameworkMeta;

    // ── UNKNOWN PORT HANDLING FRAMEWORK — Confidence Model ───────────────────
    // Base score depends on how much KNOWN information we have to work with.
    // Full Confidence:    Known Port + Known Misconfig
    // Partial Confidence: Known Port only, OR Unknown Port + Known Misconfig
    // Low Confidence:     Unknown Port + Unknown/Missing Misconfig
    // No Analysis:        Nothing recognized (handled upstream by warning injection)

    const allPortsUnknown = knownPortsList.length === 0 && unknownPortsList.length > 0;
    const hasNoMisconfigs = matchedMisconfigs.length === 0;
    const hasUnmatchedMisconfigs = unmatchedMisconfigs.length > 0;

    // Determine base tier
    let base;
    if (!allPortsUnknown && !hasNoMisconfigs) {
        base = 72; // Full confidence tier: known port + known misconfig
    } else if (!allPortsUnknown && hasNoMisconfigs) {
        base = 58; // Partial confidence tier: known port, no misconfig
    } else if (allPortsUnknown && !hasNoMisconfigs) {
        base = 45; // Service-driven tier: unknown port + known misconfig
    } else {
        base = 28; // Low confidence tier: unknown port + no misconfig
    }

    // Bonuses for known data richness
    base += Math.min(knownPortsList.length * 4, 12);     // Known ports add meaningful signal
    base += Math.min(matchedMisconfigs.length * 3, 10);  // Matched misconfigs add context
    if (logData.hasLog) base += 8;
    base += Math.min(logData.indicators.length * 5, 10);
    if (logData.ips.length > 0)    base += 3;
    if (logData.hashes.length > 0) base += 5;

    // Penalties for unknown/unmatched entities
    base -= Math.min(unknownPortsList.length * 6, 18);   // Each unknown port reduces confidence
    base -= Math.min(hasUnmatchedMisconfigs ? unmatchedMisconfigs.length * 4 : 0, 12);

    return Math.min(Math.max(base, 8), 98);
}

function scoreToRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 35) return 'medium';
    return 'low';
}

function evidenceRank(type) {
    return { observed:3, verified:3, inferred:2, hypothetical:1 }[type] || 1;
}

function strongestEvidence(items) {
    return items.reduce((best, item) =>
        evidenceRank(item.evidenceType) > evidenceRank(best) ? item.evidenceType : best, 'hypothetical'
    ).replace('verified', 'observed');
}

function techniqueV4({ id, name, description, tactic, evidenceType = 'inferred', generatedBecause = [], confidence = 50 }) {
    return {
        id,
        name,
        tactic,
        description,
        evidenceType: evidenceType === 'verified' ? 'observed' : evidenceType,
        generatedBecause: generatedBecause.filter(Boolean),
        confidence: Math.max(0, Math.min(100, Math.round(confidence))),
    };
}

function buildEnterpriseAttackChain(portMap, matchedMisconfigs, misconfigIds, logData, signals) {
    const portCount = portMap.size;
    const exposedServices = [...portMap.entries()].map(([p, d]) => `${d.service} (${p}/tcp)`);
    const hasRemoteAccess = signals.hasRemoteAccess;
    const hasWeb = signals.hasWeb;
    const hasSMB = signals.hasSMB;
    const hasDatabase = signals.hasDatabase;
    const hasDefaultCreds = misconfigIds.has('AUTH-001');
    const hasNoMFA = misconfigIds.has('AUTH-002');
    const hasNoRateLimit = misconfigIds.has('AUTH-003');
    const hasUnpatched = misconfigIds.has('PATCH-001');
    const hasSMBv1 = misconfigIds.has('PROTO-003');
    const hasNoAuthData = misconfigIds.has('NOAUTH-001') || misconfigIds.has('NOAUTH-002') || misconfigIds.has('NOAUTH-003') || misconfigIds.has('KUBE-001') || misconfigIds.has('SYS-005');

    const hasExecutionEvidence = logData.indicators.some(i => i.type === 'CMD_EXECUTION');
    const hasPersistenceEvidence = logData.indicators.some(i => i.type === 'PERSISTENCE');
    const hasPrivilegeEvidence = logData.indicators.some(i => i.type === 'PRIVILEGE_ESC');
    const hasCredentialEvidence = logData.indicators.some(i => ['AUTH_FAILURE','AUTH_SUCCESS'].includes(i.type));
    const hasDiscoveryEvidence = logData.indicators.some(i => i.type === 'RECON_INDICATOR');
    const hasLateralEvidence = logData.indicators.some(i => i.type === 'LATERAL_MOVEMENT');
    const hasImpactEvidence = logData.indicators.some(i => ['RANSOMWARE','EXFIL_PATTERN'].includes(i.type));
    const hasInitialAccessRoute = hasRemoteAccess || hasWeb || hasSMB || hasDatabase || hasDefaultCreds || hasUnpatched || hasNoAuthData || signals.hasBruteForce || signals.hasWebAttack;

    const phases = [];
    const addPhase = ({ phase, tactic, mitreId, techniques, prerequisites = [], generatedBecause = [], likelihoodScore, evidenceType, confidence }) => {
        if (!techniques.length) return;
        const support = [...new Set(techniques.flatMap(t => t.generatedBecause).concat(generatedBecause).filter(Boolean))];
        const phaseEvidence = evidenceType || strongestEvidence(techniques);
        const phaseConfidence = confidence ?? Math.round(techniques.reduce((sum, t) => sum + t.confidence, 0) / techniques.length);
        phases.push({
            phase,
            tactic,
            mitreId,
            techniques,
            confidence: Math.max(0, Math.min(100, phaseConfidence)),
            confidenceLevel: phaseConfidence >= 75 ? 'high' : phaseConfidence >= 45 ? 'medium' : 'low',
            confidenceScore: Math.max(0, Math.min(100, phaseConfidence)),
            evidenceType: phaseEvidence,
            supportingEvidence: support.slice(0, 6),
            likelihoodScore: Math.max(0, Math.min(100, Math.round(likelihoodScore))),
            prerequisites,
            generatedBecause: support.slice(0, 6),
            riskLevel: scoreToRiskLevel(likelihoodScore),
            timeEstimate: phaseEvidence === 'observed' ? 'Observed in provided telemetry' : 'Scenario-dependent',
        });
    };

    addPhase({
        phase:'Reconnaissance',
        tactic:'Reconnaissance',
        mitreId:'TA0043',
        likelihoodScore: portCount > 0 ? 72 : 28,
        prerequisites:['Externally discoverable asset or submitted telemetry'],
        generatedBecause: [
            portCount > 0 ? `${portCount} publicly reachable service(s): ${exposedServices.slice(0, 4).join(', ')}` : null,
            logData.indicators.some(i => i.type === 'SCANNER_ACTIVITY') ? 'Scanner signatures observed in log data' : null,
        ],
        techniques:[
            ...(portCount > 0 ? [techniqueV4({
                id:'T1595.001', name:'Scanning IP Blocks', tactic:'Reconnaissance',
                description:'Publicly reachable services can be enumerated by internet-wide scanners and targeted reconnaissance.',
                evidenceType:'inferred', confidence:68,
                generatedBecause:[`${portCount} externally exposed service(s) identified`],
            })] : []),
            ...(logData.indicators.some(i => i.type === 'SCANNER_ACTIVITY') ? [techniqueV4({
                id:'T1595', name:'Active Scanning', tactic:'Reconnaissance',
                description:'Log telemetry includes scanner or assessment tool signatures, indicating active probing.',
                evidenceType:'observed', confidence:88,
                generatedBecause:['Scanner tool signatures present in logs'],
            })] : []),
            ...(portCount === 0 && !logData.indicators.some(i => i.type === 'SCANNER_ACTIVITY') ? [techniqueV4({
                id:'T1592', name:'Gather Victim Host Information', tactic:'Reconnaissance',
                description:'Reconnaissance is represented as a prerequisite phase; no external scanning evidence was provided.',
                evidenceType:'hypothetical', confidence:28,
                generatedBecause:['No externally exposed port or scanner telemetry was supplied'],
            })] : []),
        ],
    });

    if (!hasInitialAccessRoute) return phases;

    addPhase({
        phase:'Initial Access',
        tactic:'Initial Access',
        mitreId:'TA0001',
        likelihoodScore: Math.max(
            signals.hasWebAttack ? 82 : 0,
            signals.hasBruteForce ? 78 : 0,
            hasDefaultCreds ? 86 : 0,
            hasNoAuthData ? 84 : 0,
            hasRemoteAccess ? 62 : 0,
            hasWeb && hasUnpatched ? 74 : 0,
            hasSMBv1 ? 80 : 0,
            42
        ),
        prerequisites:['Reconnaissance has identified a reachable service or credential entry point'],
        generatedBecause:[
            signals.hasWebAttack ? 'Web attack patterns observed in telemetry' : null,
            signals.hasBruteForce ? 'Authentication failure pattern observed in telemetry' : null,
            hasDefaultCreds ? 'Default credential weakness identified' : null,
            hasRemoteAccess ? 'Remote access service exposed to the internet' : null,
            hasNoAuthData ? 'Unauthenticated data service exposure identified' : null,
        ],
        techniques:[
            ...(signals.hasWebAttack || (hasWeb && hasUnpatched) ? [techniqueV4({
                id:'T1190', name:'Exploit Public-Facing Application', tactic:'Initial Access',
                description:'Public web exposure with exploitation telemetry or patch weakness supports an initial-access path through the application tier.',
                evidenceType: signals.hasWebAttack ? 'observed' : 'inferred', confidence: signals.hasWebAttack ? 86 : 70,
                generatedBecause:[signals.hasWebAttack ? 'SQL injection or traversal patterns in logs' : null, hasUnpatched ? 'Unpatched web-facing component reported' : null],
            })] : []),
            ...(hasRemoteAccess || signals.hasBruteForce ? [techniqueV4({
                id:'T1133', name:'External Remote Services', tactic:'Initial Access',
                description:'Exposed SSH, RDP, VNC, or similar services provide a direct ingress path when authentication controls are weak.',
                evidenceType: signals.hasBruteForce ? 'observed' : 'inferred', confidence: signals.hasBruteForce ? 82 : 64,
                generatedBecause:[hasRemoteAccess ? 'External remote access port exposed' : null, signals.hasBruteForce ? 'Repeated authentication failures observed' : null, hasNoMFA ? 'MFA not enforced' : null],
            })] : []),
            ...(hasDefaultCreds ? [techniqueV4({
                id:'T1078.001', name:'Default Accounts', tactic:'Initial Access',
                description:'Default or unchanged credentials can allow authenticated access without exploit success.',
                evidenceType:'inferred', confidence:84,
                generatedBecause:['Default or unchanged credentials reported'],
            })] : []),
            ...(hasSMBv1 || (hasSMB && hasUnpatched) ? [techniqueV4({
                id:'T1210', name:'Exploitation of Remote Services', tactic:'Lateral Movement',
                description:'SMB exposure with legacy protocol or patch weakness creates a viable remote-service exploitation path.',
                evidenceType:'inferred', confidence:78,
                generatedBecause:[hasSMB ? 'SMB service exposed' : null, hasSMBv1 ? 'SMBv1 / CVE-2017-0144 condition reported' : null],
            })] : []),
        ],
    });

    const accessLikely = phases.at(-1)?.likelihoodScore >= 55 || logData.indicators.length > 0;
    if (!accessLikely) return phases;

    addPhase({
        phase:'Execution',
        tactic:'Execution',
        mitreId:'TA0002',
        likelihoodScore: hasExecutionEvidence ? 90 : (signals.hasWebAttack || hasDefaultCreds || hasNoAuthData || hasSMBv1 ? 66 : 38),
        prerequisites:['Initial access path exists', 'Attacker can deliver commands, exploit payloads, or authenticated actions'],
        generatedBecause:[
            hasExecutionEvidence ? 'Command interpreter strings observed in telemetry' : null,
            signals.hasWebAttack ? 'Web exploitation attempts may lead to server-side execution' : null,
            hasDefaultCreds ? 'Authenticated service access can enable administrative command execution' : null,
        ],
        techniques:[
            techniqueV4({
                id:'T1059', name:'Command and Scripting Interpreter', tactic:'Execution',
                description: hasExecutionEvidence
                    ? 'Command interpreter invocation appears in the submitted telemetry.'
                    : 'Execution is modelled only after an initial-access path; no command execution success is assumed.',
                evidenceType: hasExecutionEvidence ? 'observed' : 'hypothetical',
                confidence: hasExecutionEvidence ? 92 : 42,
                generatedBecause:[hasExecutionEvidence ? 'cmd, PowerShell, or shell invocation in logs' : 'Execution depends on successful initial access'],
            }),
        ],
    });

    addPhase({
        phase:'Persistence',
        tactic:'Persistence',
        mitreId:'TA0003',
        likelihoodScore: hasPersistenceEvidence ? 88 : (hasRemoteAccess || signals.hasWebAttack || hasNoAuthData ? 52 : 30),
        prerequisites:['Execution or authenticated administrative access is available'],
        generatedBecause:[
            hasPersistenceEvidence ? 'Persistence mechanism patterns observed' : null,
            signals.hasWebAttack ? 'Web-facing exploitation commonly enables web shell persistence if successful' : null,
            hasRemoteAccess ? 'Remote administration exposure can support account or key persistence after access' : null,
        ],
        techniques:[
            ...(hasPersistenceEvidence ? [techniqueV4({
                id:'T1053', name:'Scheduled Task/Job', tactic:'Persistence',
                description:'Telemetry includes scheduled task, cron, service, startup, or related persistence terms.',
                evidenceType:'observed', confidence:88,
                generatedBecause:['Persistence-related strings in logs'],
            })] : []),
            techniqueV4({
                id: signals.hasWebAttack ? 'T1505.003' : 'T1098.004',
                name: signals.hasWebAttack ? 'Server Software Component: Web Shell' : 'Account Manipulation: SSH Authorized Keys',
                tactic:'Persistence',
                description:'Persistence is represented as a follow-on risk gated behind execution or authenticated access, not as a confirmed event.',
                evidenceType: hasPersistenceEvidence ? 'observed' : 'hypothetical',
                confidence: hasPersistenceEvidence ? 78 : 38,
                generatedBecause:['Post-access persistence requires prior execution or administrative access'],
            }),
        ],
    });

    addPhase({
        phase:'Privilege Escalation',
        tactic:'Privilege Escalation',
        mitreId:'TA0004',
        likelihoodScore: hasPrivilegeEvidence ? 90 : (hasUnpatched || hasDefaultCreds ? 58 : 34),
        prerequisites:['Code execution or authenticated foothold exists', 'Local privilege boundary or privileged account path is present'],
        generatedBecause:[
            hasPrivilegeEvidence ? 'Privilege escalation indicators observed' : null,
            hasUnpatched ? 'Unpatched software increases local exploit likelihood' : null,
            hasDefaultCreds ? 'Default credentials may already provide elevated privileges' : null,
        ],
        techniques:[
            techniqueV4({
                id: hasUnpatched ? 'T1068' : 'T1548',
                name: hasUnpatched ? 'Exploitation for Privilege Escalation' : 'Abuse Elevation Control Mechanism',
                tactic:'Privilege Escalation',
                description:'Privilege escalation is assessed only after an execution foothold and is not used to inflate confirmed compromise.',
                evidenceType: hasPrivilegeEvidence ? 'observed' : 'hypothetical',
                confidence: hasPrivilegeEvidence ? 90 : (hasUnpatched ? 55 : 34),
                generatedBecause:[hasPrivilegeEvidence ? 'Privilege escalation strings in logs' : null, hasUnpatched ? 'Patch weakness reported' : null],
            }),
        ],
    });

    addPhase({
        phase:'Credential Access',
        tactic:'Credential Access',
        mitreId:'TA0006',
        likelihoodScore: hasCredentialEvidence ? 82 : (hasNoMFA || hasNoRateLimit || hasDefaultCreds ? 64 : 36),
        prerequisites:['Initial access, exposed authentication surface, or access to credential material'],
        generatedBecause:[
            hasCredentialEvidence ? 'Authentication telemetry observed' : null,
            hasNoRateLimit ? 'No rate limiting reported' : null,
            hasNoMFA ? 'MFA not enforced' : null,
            hasDefaultCreds ? 'Default credentials reported' : null,
        ],
        techniques:[
            techniqueV4({
                id: hasCredentialEvidence || hasNoRateLimit || hasNoMFA ? 'T1110' : 'T1555',
                name: hasCredentialEvidence || hasNoRateLimit || hasNoMFA ? 'Brute Force' : 'Credentials from Password Stores',
                tactic:'Credential Access',
                description:'Credential-access mapping is generated only where authentication evidence or prerequisite access makes it plausible.',
                evidenceType: hasCredentialEvidence ? 'observed' : 'inferred',
                confidence: hasCredentialEvidence ? 82 : 56,
                generatedBecause:[hasCredentialEvidence ? 'Authentication failures or successes in logs' : null, hasNoMFA ? 'Weak authentication control' : null, hasNoRateLimit ? 'Rate limiting absent' : null],
            }),
        ],
    });

    addPhase({
        phase:'Discovery',
        tactic:'Discovery',
        mitreId:'TA0007',
        likelihoodScore: hasDiscoveryEvidence ? 86 : 50,
        prerequisites:['A foothold or authenticated session exists'],
        generatedBecause:[hasDiscoveryEvidence ? 'Host/user/network discovery commands observed' : 'Discovery is a normal post-access step after foothold establishment'],
        techniques:[
            techniqueV4({
                id:'T1082', name:'System Information Discovery', tactic:'Discovery',
                description:'Discovery is included after access-oriented phases because attackers commonly enumerate host, user, and domain context before moving laterally.',
                evidenceType: hasDiscoveryEvidence ? 'observed' : 'hypothetical',
                confidence: hasDiscoveryEvidence ? 86 : 40,
                generatedBecause:[hasDiscoveryEvidence ? 'whoami, hostname, systeminfo, id, or similar commands in logs' : 'Requires successful foothold'],
            }),
        ],
    });

    if (hasSMB || hasRemoteAccess || hasLateralEvidence) {
        addPhase({
            phase:'Lateral Movement',
            tactic:'Lateral Movement',
            mitreId:'TA0008',
            likelihoodScore: hasLateralEvidence ? 90 : (hasSMB ? 64 : 48),
            prerequisites:['Credential access or privileged foothold exists', 'Reachable internal services are available'],
            generatedBecause:[
                hasLateralEvidence ? 'Lateral movement tooling observed' : null,
                hasSMB ? 'SMB exposure supports Windows lateral movement if credentials are obtained' : null,
                hasRemoteAccess ? 'Remote services can become lateral movement targets after credential access' : null,
            ],
            techniques:[
                techniqueV4({
                    id:'T1021', name:'Remote Services', tactic:'Lateral Movement',
                    description:'Lateral movement is gated behind credentials or privileged access; exposure alone does not imply internal propagation.',
                    evidenceType: hasLateralEvidence ? 'observed' : 'hypothetical',
                    confidence: hasLateralEvidence ? 90 : 42,
                    generatedBecause:[hasLateralEvidence ? 'PsExec, WMI, pass-the-hash, or similar strings in logs' : 'Requires credentials and internal reachability'],
                }),
            ],
        });
    }

    const impactPossible = hasImpactEvidence || hasDatabase || hasNoAuthData || signals.activeCorrelations.some(c => ['CORR-001','CORR-002','CORR-008','CORR-011','CORR-012','CORR-015','CORR-016','CORR-017','CORR-018','CORR-019','CORR-020'].includes(c.id));
    if (impactPossible) {
        addPhase({
            phase:'Impact',
            tactic:'Impact',
            mitreId:'TA0040',
            likelihoodScore: hasImpactEvidence ? 92 : (hasNoAuthData ? 76 : 54),
            prerequisites:['Prior access path exists', 'Attacker has sufficient privilege or data-plane access'],
            generatedBecause:[
                hasImpactEvidence ? 'Impact or exfiltration indicators observed' : null,
                hasDatabase ? 'Database exposure creates data access risk' : null,
                hasNoAuthData ? 'Unauthenticated data service exposure reported' : null,
                signals.activeCorrelations.some(c => ['CORR-001','CORR-002','CORR-008','CORR-017'].includes(c.id)) ? 'Exposure pattern aligns with ransomware intrusion preconditions' : null,
            ],
            techniques:[
                techniqueV4({
                    id: logData.indicators.some(i => i.type === 'RANSOMWARE') ? 'T1486' : hasDatabase ? 'T1005' : 'T1490',
                    name: logData.indicators.some(i => i.type === 'RANSOMWARE') ? 'Data Encrypted for Impact' : hasDatabase ? 'Data from Local System' : 'Inhibit System Recovery',
                    tactic:'Impact',
                    description: hasImpactEvidence
                        ? 'Telemetry includes impact-oriented terms and requires investigation; scope and success are not assumed.'
                        : 'Current exposure patterns align with intrusion paths commonly leveraged before data theft, extortion, or disruption.',
                    evidenceType: hasImpactEvidence ? 'observed' : 'inferred',
                    confidence: hasImpactEvidence ? 92 : 58,
                    generatedBecause:[hasImpactEvidence ? 'Ransomware or exfiltration patterns in logs' : null, hasDatabase ? 'Public database exposure' : null, hasNoAuthData ? 'Unauthenticated data service' : null],
                }),
            ],
        });
    }

    return phases;
}

function buildATTACKMappings(attackChain) {
    const seen = new Map();
    attackChain.forEach(phase => {
        phase.techniques.forEach(t => {
            if (!t.id || seen.has(t.id)) return;
            seen.set(t.id, {
                mitreId:t.id,
                tactic:t.tactic || phase.tactic,
                technique:t.name,
                confidence:t.confidence,
                evidenceType:t.evidenceType,
                generatedBecause:t.generatedBecause,
                phase:phase.phase,
            });
        });
    });
    return [...seen.values()].sort((a, b) => b.confidence - a.confidence);
}

// ─────────────────────────────────────────────────────────────────────────────
// IOC BUILDER (verified telemetry only — zero fabrication)
// ─────────────────────────────────────────────────────────────────────────────

function buildIOCs(logData, validHashes) {
    const iocList = [];
    const addIoc = (ioc) => {
        const reputationScore = ioc.verified ? 55 : 35;
        const anomalyScore = { critical:90, high:72, medium:48, low:25 }[ioc.severity] || 35;
        const confidence = Math.max(20, Math.min(95, Math.round((reputationScore * 0.35) + (anomalyScore * 0.45) + (ioc.validationScore ?? 70) * 0.20)));
        iocList.push({
            ...ioc,
            evidenceType:ioc.evidenceType === 'verified' ? 'observed' : (ioc.evidenceType || 'observed'),
            reputationScore,
            anomalyScore,
            confidence,
            falsePositiveNotes:ioc.falsePositiveNotes || 'Requires enrichment against enterprise allowlists and threat intelligence before containment.',
        });
    };

    logData.ips.slice(0, 5).forEach(ip => {
        addIoc({
            type:'IP Address', value:ip,
            label:'External IP extracted from logs — requires threat intel lookup (VirusTotal, AbuseIPDB)',
            severity:'medium', evidenceType:'verified', verified:false,
        });
    });

    validHashes.slice(0, 5).forEach(hash => {
        const type = hash.length === 64 ? 'SHA256 Hash' : hash.length === 40 ? 'SHA1 Hash' : 'MD5 Hash';
        addIoc({
            type, value:hash,
            label:'File hash extracted from logs — submit to VirusTotal/MISP for reputation analysis',
            severity:hash.length === 64 ? 'medium' : 'low', verified:false, validationScore:hash.length === 64 ? 95 : 78,
            falsePositiveNotes:'Cryptographic hashes are exact-match indicators; validate full hash context and file provenance.',
        });
    });

    logData.urls.slice(0, 3).forEach(url => {
        addIoc({
            type:'URL', value:url,
            label:'URL extracted from logs — verify intent, check URL reputation',
            severity:'medium', verified:false, validationScore:82,
            falsePositiveNotes:'URLs can be benign update, CDN, SSO, or SaaS endpoints; compare against proxy allowlists.',
        });
    });

    logData.domains.slice(0, 5).forEach(domain => {
        addIoc({
            type:'Domain', value:domain,
            label:'Domain extracted from logs; reputation and ownership enrichment required.',
            severity:'medium', verified:false, validationScore:78,
            falsePositiveNotes:'Domain indicators have high false-positive potential without DNS, WHOIS, and business-context enrichment.',
        });
    });

    logData.emails.slice(0, 5).forEach(email => {
        addIoc({
            type:'Email Indicator', value:email,
            label:'Email address extracted from telemetry; validate role, sender reputation, and message context.',
            severity:'low', verified:false, validationScore:75,
            falsePositiveNotes:'Email addresses may belong to legitimate users, aliases, ticketing systems, or notification senders.',
        });
    });

    logData.ja3.slice(0, 5).forEach(hash => {
        addIoc({
            type:'JA3 Fingerprint', value:hash,
            label:'JA3 TLS client fingerprint extracted from telemetry; correlate with destination, SNI, and process metadata.',
            severity:'medium', verified:false, validationScore:88,
            falsePositiveNotes:'JA3 fingerprints are shared by many clients and must be paired with network and host context.',
        });
    });

    logData.yara.slice(0, 5).forEach(ruleName => {
        addIoc({
            type:'YARA Signature', value:ruleName,
            label:'YARA rule name extracted from telemetry; review rule source and matched file context.',
            severity:'high', verified:true, validationScore:86,
            falsePositiveNotes:'YARA confidence depends on rule quality, match strings, and file metadata.',
        });
    });

    // Behavioral IOCs from log indicators
    logData.indicators.forEach(ind => {
        const map = {
            'SQLI_PATTERN':     { type:'Behavioral', value:'SQL injection pattern', label:'Web application injection attack pattern', severity:'high', verified:true },
            'AUTH_FAILURE':     { type:'Behavioral', value:'Repeated authentication failures', label:'Credential brute-force activity pattern', severity:'medium', verified:true },
            'CMD_EXECUTION':    { type:'Behavioral', value:'Shell/command interpreter invocation', label:'Command execution in log data', severity:'critical', verified:true },
            'RANSOMWARE':       { type:'Behavioral', value:'Ransomware artifact pattern', label:'File encryption or ransomware indicator', severity:'critical', verified:true },
            'C2_INDICATOR':     { type:'Behavioral', value:'C2 framework reference', label:'Command-and-control tool reference in logs', severity:'critical', verified:true },
            'PRIVILEGE_ESC':    { type:'Behavioral', value:'Privilege escalation pattern', label:'Privilege escalation indicator in logs', severity:'critical', verified:true },
            'LATERAL_MOVEMENT': { type:'Behavioral', value:'Lateral movement tool pattern', label:'Lateral movement technique reference in logs', severity:'critical', verified:true },
            'EXFIL_PATTERN':    { type:'Behavioral', value:'Data exfiltration pattern', label:'Data exfiltration indicator in logs', severity:'critical', verified:true },
            'PERSISTENCE':      { type:'Behavioral', value:'Persistence mechanism pattern', label:'Persistence installation indicator in logs', severity:'high', verified:true },
            'RECON_INDICATOR':  { type:'Behavioral', value:'Post-access reconnaissance', label:'Post-exploitation reconnaissance command in logs', severity:'high', verified:true },
        };
        const entry = map[ind.type];
        if (entry) addIoc({ ...entry, evidenceType:'observed', validationScore:90 });
    });

    return iocList;
}

// ─────────────────────────────────────────────────────────────────────────────
// MITIGATION BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildMitigations(portMap, matchedMisconfigs, misconfigIds, logData, signals) {
    const mitigations = [];
    const seen = new Set();
    const add = m => { if (!seen.has(m.id)) { seen.add(m.id); mitigations.push(m); } };

    // Emergency actions if active threat evidence
    if (logData.indicators.some(i => i.type === 'RANSOMWARE')) {
        add({ id:'INCIDENT-001', title:'Activate Incident Response Plan', priority:'critical',
            description:'Ransomware artifacts detected. Immediately isolate affected systems from the network, preserve volatile memory and log evidence, engage your IR team, and do not attempt to decrypt without expert guidance.' });
    }
    if (logData.indicators.some(i => ['C2_INDICATOR','CMD_EXECUTION','LATERAL_MOVEMENT'].includes(i.type))) {
        add({ id:'INCIDENT-002', title:'Contain Active Intrusion', priority:'critical',
            description:'Active intrusion indicators detected in log data. Implement network isolation of affected segments, block identified external IPs, and begin forensic preservation before remediation.' });
    }
    if (logData.indicators.some(i => i.type === 'EXFIL_PATTERN')) {
        add({ id:'INCIDENT-003', title:'Investigate Data Exfiltration', priority:'critical',
            description:'Data exfiltration patterns detected. Identify exfiltrated data classification, block outbound destinations, and engage legal/compliance teams for breach notification assessment.' });
    }

    // Correlation-driven mitigations
    signals.activeCorrelations.forEach(rule => {
        if (rule.id === 'CORR-001') add({ id:'MIT-RDP', title:'Restrict RDP Access', priority:'critical',
            description:'Place RDP behind a VPN gateway. Enable NLA, enforce MFA, restrict source IPs. Consider replacing with a zero-trust remote access solution. Monitor for BlueKeep (CVE-2019-0708) exposure.' });
        if (rule.id === 'CORR-002') add({ id:'MIT-SMBv1', title:'Disable SMBv1 Immediately', priority:'critical',
            description:'Disable SMBv1 across all systems: Set-SmbServerConfiguration -EnableSMB1Protocol $false. Enable SMB signing. Block ports 139/445 at the perimeter. This eliminates EternalBlue attack surface.' });
        if (rule.id === 'CORR-003') add({ id:'MIT-REDIS', title:'Secure Redis Configuration', priority:'critical',
            description:'Bind Redis to 127.0.0.1. Set requirepass in redis.conf. Rename or disable CONFIG/SLAVEOF commands. Implement firewall rules blocking port 6379 from internet access.' });
        if (rule.id === 'CORR-005') add({ id:'MIT-DOCKER', title:'Secure Docker API', priority:'critical',
            description:'Never expose Docker socket (2375) to the internet. Enforce TLS client authentication on port 2376. Use Docker socket proxy for limited access. Audit all running containers for unauthorized images.' });
        if (rule.id === 'CORR-011' || rule.id === 'CORR-012') add({ id:'MIT-NOSQL', title:'Secure NoSQL Database Exposure', priority:'critical',
            description:'Enable authentication on all MongoDB/Elasticsearch instances. Bind to private network interfaces only. Implement firewall rules. Rotate any existing API keys or admin credentials immediately.' });
        if (rule.id === 'CORR-015') add({ id:'MIT-JUPYTER', title:'Secure Jupyter Notebook Access', priority:'critical',
            description:'Configure Jupyter to require a secure token or password. Bind the service to 127.0.0.1 or a private VPN interface. Block port 8888 from direct public internet exposure.' });
        if (rule.id === 'CORR-016') add({ id:'MIT-KUBE', title:'Restrict Kubernetes API & Kubelet', priority:'critical',
            description:'Disable anonymous/unauthenticated access to the Kubernetes API server and Kubelet API. Enforce strong RBAC controls and firewall ports 6443/10250.' });
        if (rule.id === 'CORR-017') add({ id:'MIT-WINRM', title:'Secure WinRM Access', priority:'critical',
            description:'Enforce strong password policies. Disable WinRM HTTP (port 5985) and mandate WinRM HTTPS (port 5986) with client certificates. Restrict access to trusted IP ranges only.' });
        if (rule.id === 'CORR-018') add({ id:'MIT-NFS', title:'Secure NFS Exports', priority:'critical',
            description:'Block port 2049 at the network perimeter. Restrict NFS exports to authorized IP addresses/subnets and enable root squashing (all_squash).' });
        if (rule.id === 'CORR-019') add({ id:'MIT-JAVA-MIDDLEWARE', title:'Patch Middleware Vulnerabilities', priority:'critical',
            description:'Apply the latest vendor security patches for WebLogic/JBoss to resolve Java deserialization (RCE) flaws. Block management ports from public exposure.' });
        if (rule.id === 'CORR-020') add({ id:'MIT-GIT', title:'Deny Access to Git Directory', priority:'critical',
            description:'Configure the web server (Nginx/Apache) to explicitly block access to the .git directory. Rotate all API keys and secrets present in repository history.' });
        if (rule.id === 'CORR-021') add({ id:'MIT-SWAGGER', title:'Secure Swagger UI & API Docs', priority:'high',
            description:'Restrict public access to Swagger UI or OpenAPI schemas. Place documentation behind authentication and disable debugging/test endpoints in production.' });
        if (rule.id === 'CORR-022') add({ id:'MIT-SNMP', title:'Secure SNMP Configuration', priority:'high',
            description:'Disable SNMP if unnecessary. Otherwise, upgrade to SNMPv3 with encryption/auth. Replace default public/private community strings and firewall port 161.' });
    });

    // Misconfiguration remediations
    if (misconfigIds.has('AUTH-001')) add({ id:'M1027', title:'Rotate Default Credentials', priority:'critical',
        description:'Immediately change all default credentials. Implement a credential management policy. Scan for any remaining default passwords using tools like changeme or default-creds-cheat-sheet.' });
    if (misconfigIds.has('AUTH-002')) add({ id:'M1032', title:'Enforce Multi-Factor Authentication', priority:'critical',
        description:'Enable MFA on all internet-facing services, prioritizing remote access (VPN, RDP, SSH) and administrative interfaces. Use TOTP, push authentication, or hardware keys. Disable SMS-based MFA where feasible.' });
    if (misconfigIds.has('AUTH-003')) add({ id:'M1036', title:'Implement Authentication Rate Limiting', priority:'high',
        description:'Enable account lockout after 5 failed attempts. Implement CAPTCHA on web login forms. Deploy fail2ban or equivalent for SSH/RDP. Alert on IP addresses with >10 failed attempts per minute.' });
    if (misconfigIds.has('PATCH-001')) add({ id:'M1051', title:'Apply Security Patches', priority:'high',
        description:'Conduct an emergency patch assessment. Prioritize CVSS 9.0+ vulnerabilities on internet-facing systems. Establish a 72-hour patch cycle for critical/high CVEs. Enable automated patching where feasible.' });
    if (misconfigIds.has('CRYPTO-001')) add({ id:'M1054', title:'Upgrade TLS Configuration', priority:'high',
        description:'Disable SSLv3, TLS 1.0, and TLS 1.1. Enable only TLS 1.2/1.3. Remove RC4, NULL, EXPORT, and DES cipher suites. Implement HSTS with preloading. Use Mozilla SSL Configuration Generator as a reference.' });

    // Port-specific mitigations
    if (portMap.has('445')) add({ id:'M1037-SMB', title:'Firewall SMB Port 445', priority:'critical',
        description:'Block TCP 445 at the internet perimeter immediately. SMB should never be directly internet-accessible. Deploy internal network segmentation to limit SMB propagation between segments.' });
    if ([...portMap.keys()].some(p => ['3306','5432','1433','27017','9200','6379'].includes(p))) add({ id:'M1030-DB', title:'Remove Database Internet Exposure', priority:'critical',
        description:'Database services must not be directly internet-accessible. Migrate to private subnets, implement connection via application tier or VPN only, and enforce TLS + certificate-based authentication for all remote database connections.' });
    if (portMap.has('23')) add({ id:'M1042-TEL', title:'Disable Telnet Service', priority:'critical',
        description:'Disable Telnet immediately on all hosts. Replace with SSH for remote administration. All Telnet credentials should be considered compromised and rotated.' });

    // Universal baseline mitigations
    add({ id:'M1030', title:'Implement Network Segmentation', priority:'high',
        description:`Segment exposed services (${portMap.size} ports identified) from internal infrastructure using VLANs and ACLs. Apply zero-trust network principles. Limit east-west traffic with microsegmentation.` });
    add({ id:'M1049', title:'Deploy Endpoint Detection and Response (EDR)', priority:'high',
        description:'Implement an EDR solution with behavioral detection capability across all endpoints. Enable process, network, file system, and registry telemetry. Configure alerts for known attack techniques (MITRE ATT&CK coverage).' });
    add({ id:'M1016', title:'Continuous Vulnerability Scanning', priority:'medium',
        description:'Deploy authenticated vulnerability scanning against all internet-facing assets on a weekly cycle. Prioritize findings by CVSS score × public exploit availability. Integrate scan results with patch management workflow.' });
    add({ id:'M1032-SIEM', title:'Implement Centralized Log Management', priority:'medium',
        description:'Aggregate logs from all internet-facing services into a SIEM. Enable alerting for authentication anomalies, scan patterns, and data transfer spikes. Maintain log retention for minimum 90 days for forensic analysis.' });

    return mitigations.slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// SOC NARRATIVE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function buildNarrative(portMap, matchedMisconfigs, logData, signals, riskScore, activeCorrelations, frameworkMeta = {}) {
    const { hasActiveThreat, hasBruteForce, hasWebAttack } = signals;
    const { unknownPortsList = [], knownPortsList = [], unmatchedMisconfigs = [] } = frameworkMeta;

    const observed = [];
    const assessed = [];
    const modelled = [];
    const knowledgeGaps = [];

    portMap.forEach((d, p) => {
        if (d.isUnknownPort) {
            observed.push(`Port ${p}/tcp (service unknown — not in ETH knowledge base) is externally reachable`);
        } else {
            observed.push(`Publicly exposed ${d.service} service on ${p}/tcp`);
        }
    });
    matchedMisconfigs.forEach(m => observed.push(m.finding));
    logData.indicators.forEach(i => observed.push(`Log indicator: ${i.description}`));

    // Track knowledge gaps for narrative transparency
    unknownPortsList.forEach(p => knowledgeGaps.push(`Port ${p}: no service profile in ETH KB`));
    unmatchedMisconfigs.forEach(e => knowledgeGaps.push(`Misconfiguration "${e.slice(0,50)}…": no KB match`));

    if (activeCorrelations.length > 0) {
        activeCorrelations.forEach(c => assessed.push(c.threat.split('.')[0]));
    }

    if (!hasActiveThreat) {
        if (portMap.has('3389') || portMap.has('22')) modelled.push('Potential attacker behaviors may include password spraying and valid account abuse targeting exposed remote access services.');
        if (portMap.has('445')) modelled.push('Lateral movement propagation is a possible escalation path if an initial foothold is obtained.');
        if (signals.hasDatabase) modelled.push('Data exfiltration and database dumping represent a likely secondary objective following compromise.');
        if (unknownPortsList.length > 0 && knownPortsList.length === 0) {
            modelled.push('Without known service identification, attacker tool selection remains indeterminate. Generic port scanning, banner grabbing, and opportunistic exploitation are the most probable initial activities.');
        }
    }

    let narrative = '';

    // 0. KNOWLEDGE BASE STATUS (only when there are gaps)
    if (knowledgeGaps.length > 0) {
        narrative += '0. ETH KNOWLEDGE BASE STATUS\n';
        narrative += 'The following submitted entities are not present in the ETH knowledge base. Analysis confidence is reduced for these items:\n';
        narrative += '* ' + knowledgeGaps.join('\n* ') + '\n\n';
    }

    // 1. VERIFIED FINDINGS
    narrative += '1. VERIFIED FINDINGS\n';
    if (observed.length > 0) {
        narrative += 'Assessment identified:\n* ' + observed.join('\n* ') + '\n\n';
    } else {
        narrative += 'No confirmed exposure findings verified from provided telemetry.\n\n';
    }

    // 2. THREAT ASSESSMENT
    narrative += '2. THREAT ASSESSMENT\n';
    if (hasActiveThreat) {
        narrative += 'Active threat indicators and suspected compromise patterns were directly observed in telemetry. Immediate containment and incident response investigation is required.\n\n';
    } else if (hasBruteForce || hasWebAttack) {
        narrative += 'Log telemetry indicates active scanning, credential brute-forcing, or web exploitation attempts. These represent commonly targeted initial access vectors.\n\n';
    } else if (assessed.length > 0) {
        narrative += `Correlation of identified weaknesses suggests an elevated risk profile concerning: ${assessed.join(', ')}.\n\n`;
    } else if (unknownPortsList.length > 0 && knownPortsList.length === 0 && matchedMisconfigs.length === 0) {
        narrative += 'Insufficient data for specific threat correlation. All submitted ports are non-standard and no recognized misconfigurations were provided. Analysis is limited to generic network exposure principles.\n\n';
    } else {
        narrative += 'Current exposure presents standard background noise risk. No targeted threat correlation established.\n\n';
    }

    // 3. MODELLED SCENARIOS
    narrative += '3. MODELLED SCENARIOS\n';
    if (hasActiveThreat) {
        narrative += 'POTENTIAL: Attackers may establish persistence, deploy ransomware, or exfiltrate sensitive data if containment is not achieved.\n\n';
    } else if (modelled.length > 0) {
        narrative += `LIKELY: ${modelled.join(' ')}\n\n`;
    } else {
        narrative += 'POSSIBLE: Automated exploitation by opportunistic threat actors scanning for zero-day vulnerabilities.\n\n';
    }

    // 4. RISK POSTURE
    narrative += '4. RISK POSTURE\n';
    narrative += `Risk Score: ${riskScore}/100\n`;
    if (unknownPortsList.length > 0) {
        narrative += `Note: Risk score is reduced because ${unknownPortsList.length} port(s) (${unknownPortsList.join(', ')}) could not be matched to a known service profile. Score may increase if service context is provided.\n`;
    }
    narrative += 'Score reflects observed exposure severity, configuration weakness, and exploit feasibility. It does NOT represent confirmation of successful exploitation.\n\n';

    // 5. ANALYST NOTE
    narrative += '5. ANALYST NOTE\n';
    if (knowledgeGaps.length > 0) {
        narrative += `ETH was unable to generate specific threat intelligence for ${knowledgeGaps.length} item(s) due to missing knowledge base entries. ` +
            'No attacker behaviors have been fabricated. Returned findings are strictly evidence-based or derived from recognized service profiles. ';
    }
    narrative += 'This assessment represents an exposure and threat posture evaluation based on observed findings and predictive threat modeling. It should not be interpreted as confirmation of active compromise unless supported by direct telemetry or forensic evidence.';

    return narrative;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENGINE ORCHESTRATOR
// ─────────────────────────────────────────────────────────────────────────────

export async function runAttackSimulationMock(payload, signal) {
    // Realistic analysis latency
    await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, 2600);
        signal?.addEventListener('abort', () => {
            clearTimeout(timer);
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
        });
    });

    // ── L1: Data Acquisition ──────────────────────────────────────────────────
    const { portMap, matchedMisconfigs, misconfigIds, logData,
             unknownPortsList, knownPortsList, unmatchedMisconfigs } = acquireData(payload);

    // ── Framework metadata bundle — passed to all downstream layers ───────────
    const frameworkMeta = { unknownPortsList, knownPortsList, unmatchedMisconfigs };

    // ── L2: Evidence Validation ───────────────────────────────────────────────
    const { validHashes, contradictions, warnings: validationWarnings } = validateEvidence(portMap, matchedMisconfigs, logData, frameworkMeta);

    // ── L3: Threat Correlation ─────────────────────────────────────────────────
    const signals = correlateThreatSignals(portMap, misconfigIds, logData);

    // ── L4 + L5: MITRE Mapping + Kill Chain (always 7 phases) ─────────────────
    const attackChain = buildEnterpriseAttackChain(portMap, matchedMisconfigs, misconfigIds, logData, signals);
    const ATTACKMappings = buildATTACKMappings(attackChain);

    // ── L6: Risk Scoring ──────────────────────────────────────────────────────
    const { score: riskScore, topFactors, riskAssessment } = calculateExposureRisk(portMap, matchedMisconfigs, logData, signals);
    const confidenceScore = calculateConfidence(portMap, matchedMisconfigs, logData, frameworkMeta);

    // ── IOC Generation ────────────────────────────────────────────────────────
    const iocList = buildIOCs(logData, validHashes);

    // ── Mitigations ───────────────────────────────────────────────────────────
    const mitigations = buildMitigations(portMap, matchedMisconfigs, misconfigIds, logData, signals);

    // ── Narrative ──────────────────────────────────────────────────────────────
    const summary = buildNarrative(portMap, matchedMisconfigs, logData, signals, riskScore, signals.activeCorrelations, frameworkMeta);

    // ── Risk Breakdown ────────────────────────────────────────────────────────
    const riskBreakdown = riskAssessment.dimensions.map(d => ({
        category:d.category,
        score:Math.max(0, Math.min(d.score, 99)),
    }));

    // ── Detection Status ──────────────────────────────────────────────────────
    let detectionDifficulty;
    if (signals.hasActiveThreat) {
        detectionDifficulty = 'Active — Immediate Investigation Required';
    } else if (logData.indicators.length > 0) {
        detectionDifficulty = 'Telemetry Available — Threat Hunting Recommended';
    } else if (matchedMisconfigs.length >= 3 || signals.activeCorrelations.length >= 2) {
        detectionDifficulty = 'High Exposure — Proactive Hardening Required';
    } else {
        detectionDifficulty = 'Monitoring — Standard Patch and Harden Cycle';
    }

    const estimatedDwellTime = signals.hasActiveThreat
        ? 'Unknown — Active investigation required'
        : 'Not determinable without endpoint telemetry';

    return {
        id: `eth-v3-${Date.now()}`,
        timestamp: new Date().toISOString(),
        engineVersion: '3.0',
        riskScore,
        confidenceScore,
        summary,
        attackChain,      // Always exactly 7 phases
        iocList,
        mitigations,
        riskBreakdown,
        detectionDifficulty,
        estimatedDwellTime,
        affectedAssets: [
            ...[...portMap.entries()].map(([p, d]) => `${d.service} (${p}/tcp)`).slice(0, 4),
            matchedMisconfigs.length > 0 ? `${matchedMisconfigs.length} configuration weakness(es)` : null,
        ].filter(Boolean).slice(0, 5),

        verifiedFindings: [
            ...[...portMap.entries()].map(([p, d]) => ({
                type:'exposure',
                finding:`${d.service} exposed on ${p}/tcp`,
                evidence:`Submitted open port ${p}`,
                confidence:90,
            })),
            ...matchedMisconfigs.map(m => ({
                type:'misconfiguration',
                finding:m.finding,
                evidence:m.category,
                confidence:82,
            })),
            ...logData.indicators.map(i => ({
                type:'telemetry',
                finding:i.description,
                evidence:i.type,
                confidence:88,
            })),
        ],
        inferredRisks: signals.activeCorrelations.map(c => ({
            id:c.id,
            risk:c.name,
            likelihood:c.likelihood,
            generatedBecause:[c.threat],
            mitreId:c.mitre,
        })),
        hypotheticalScenarios: attackChain
            .filter(p => p.evidenceType === 'hypothetical')
            .map(p => ({
                phase:p.phase,
                scenario:p.techniques[0]?.description || 'Dependency-gated scenario',
                prerequisites:p.prerequisites,
                likelihoodScore:p.likelihoodScore,
            })),
        attackPaths: attackChain,
        ATTACKMappings,
        riskAssessment,
        remediationPriority: mitigations.map(m => ({
            id:m.id,
            title:m.title,
            priority:m.priority,
            rationale:m.description,
        })),

        // Evidence classification summary
        evidenceSummary: {
            observedFindings: [
                ...[...portMap.entries()].map(([p, d]) => `${d.service} (${p}) publicly accessible — ${d.note}`),
                ...matchedMisconfigs.map(m => `${m.finding} [${m.category}]`),
                ...logData.indicators.map(i => i.description),
            ].slice(0, 10),
            inferredRisks: signals.activeCorrelations.map(c =>
                `${c.name} [${c.likelihood}]: ${c.threat.slice(0, 120)}`
            ).slice(0, 6),
            hypotheticalScenarios: attackChain
                .filter(p => p.evidenceType === 'hypothetical')
                .map(p => `${p.phase}: ${p.techniques[0]?.description?.slice(0, 100) || 'Predictive scenario'}`)
                .slice(0, 4),
        },

        // Confidence metrics
        confidenceMetrics: {
            overallConfidence: confidenceScore,
            dataSources: [
                portMap.size > 0 ? `${portMap.size} port(s) analyzed` : null,
                matchedMisconfigs.length > 0 ? `${matchedMisconfigs.length} misconfiguration(s) matched` : null,
                logData.hasLog
                    ? `Log telemetry: ${logData.indicators.length} behavioral indicator(s) extracted`
                    : 'No log telemetry — confidence limited to exposure profile',
                signals.activeCorrelations.length > 0
                    ? `${signals.activeCorrelations.length} threat correlation rule(s) triggered`
                    : null,
            ].filter(Boolean),
        },

        // Correlation intelligence
        correlationIntelligence: signals.activeCorrelations.map(c => ({
            id: c.id,
            name: c.name,
            threat: c.threat,
            likelihood: c.likelihood,
            mitre: c.mitre,
            cve: c.cve || null,
            targetedBy: c.targetedBy,
            confidence: Math.min(50 + c.confidenceBoost, 99),
            generatedBecause: [
                ...c.requires.ports.map(p => portMap.has(p) ? `Port ${p} publicly exposed` : null),
                ...c.requires.misconfigIds.map(id => misconfigIds.has(id) ? (MISCONFIG_DB.find(m => m.id === id)?.finding || id) : null)
            ].filter(Boolean),
        })),

        // Validation metadata
        validationMetadata: {
            contradictions,
            warnings: validationWarnings,
            iocCount: {
                ips: logData.ips.length,
                domains: logData.domains.length,
                validHashes: validHashes.length,
                urls: logData.urls.length,
                emails: logData.emails.length,
                ja3: logData.ja3.length,
                yara: logData.yara.length,
            },
        },

        // ── UNKNOWN PORT HANDLING FRAMEWORK — Port Intelligence Status ────────
        // Exposed to UI for rendering framework warnings and confidence context.
        portIntelStatus: {
            knownPorts:          knownPortsList,
            unknownPorts:        unknownPortsList,
            unmatchedMisconfigs: unmatchedMisconfigs,
            allPortsUnknown:     knownPortsList.length === 0 && unknownPortsList.length > 0,
            hasUnknownEntities:  unknownPortsList.length > 0 || unmatchedMisconfigs.length > 0,
        },

        // Framework warnings surfaced from validateEvidence — for UI banner rendering
        frameworkWarnings: validationWarnings.filter(w =>
            w.includes('not found in ETH knowledge base') ||
            w.includes('not recognized in ETH knowledge base') ||
            w.includes('Insufficient information') ||
            w.includes('Non-standard port') ||
            w.includes('Defaulting to general')
        ),

        // Risk drivers
        topRiskFactors: topFactors,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export function analyzeAttackChain(payload, signal) {
    if (import.meta.env.VITE_USE_MOCK !== 'false') {
        return runAttackSimulationMock(payload, signal);
    }
    return runAttackSimulation(payload, signal);
}

export default apiClient;
