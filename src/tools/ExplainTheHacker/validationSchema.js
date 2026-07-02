import { z } from 'zod';
import DOMPurify from 'dompurify';

// ─── Sanitization Helpers ─────────────────────────────────────────────────────

/** Strip all HTML tags from a string using DOMPurify */
export function stripHtml(str) {
    if (typeof str !== 'string') return '';
    return DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
}

/** Strip scripts and dangerous tags using standard DOMPurify defaults */
export function stripScripts(str) {
    if (typeof str !== 'string') return '';
    return DOMPurify.sanitize(str).trim();
}

// ─── Port Validation ──────────────────────────────────────────────────────────

/** Returns true if a value is a valid port number (integer 1–65535) */
export function isValidPort(value) {
    const n = Number(value);
    return Number.isInteger(n) && n >= 1 && n <= 65535;
}

// ─── Zod Schema ───────────────────────────────────────────────────────────────

export const attackSimulationSchema = z.object({

    // Open Ports: array of integer strings, 1–65535, max 50 entries
    openPorts: z
        .array(
            z
                .string()
                .regex(/^\d+$/, 'Ports must be numeric.')
                .refine((v) => isValidPort(v), 'Port must be between 1 and 65535.')
        )
        .min(1, 'Add at least one open port.')
        .max(50, 'Maximum 50 ports allowed.'),

    // Misconfigurations: array of sanitized strings, max 20 entries
    misconfigurations: z
        .array(
            z
                .string()
                .min(1, 'Misconfiguration entry cannot be empty.')
                .max(200, 'Each entry must be under 200 characters.')
                .transform(stripHtml)
        )
        .max(20, 'Maximum 20 misconfiguration entries allowed.')
        .default([]),

    // Log Snippet: editor — strip scripts, max 500000 chars
    logSnippet: z
        .string()
        .max(500000, 'Log snippet must be under 500000 characters.')
        .transform(stripScripts)
        .optional()
        .or(z.literal('')),

    // Intelligence Level (LOW, MEDIUM, HIGH, LE)
    intelligenceLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'LE']).default('LOW'),
});

// ─── Default Form Values ──────────────────────────────────────────────────────

export const defaultFormValues = {
    openPorts: [],   // string[]
    misconfigurations: [],  // string[]
    logSnippet: '',   // string
    intelligenceLevel: 'LOW', // 'LOW' | 'MEDIUM' | 'HIGH' | 'LE'
};

// ─── Preset port lists for quick-add ─────────────────────────────────────────

export const PORT_PRESETS = [
    {
        label: 'Web Server',
        ports: ['80', '443', '8080', '8443'],
        description: 'HTTP/HTTPS + alternates',
    },
    {
        label: 'Remote Access',
        ports: ['22', '23', '3389', '5900'],
        description: 'SSH, Telnet, RDP, VNC',
    },
    {
        label: 'Database',
        ports: ['1433', '3306', '5432', '27017', '6379'],
        description: 'MSSQL, MySQL, Postgres, Mongo, Redis',
    },
    {
        label: 'Mail',
        ports: ['25', '110', '143', '465', '587', '993', '995'],
        description: 'SMTP, POP3, IMAP',
    },
    {
        label: 'Infrastructure & Dev Tools',
        ports: ['161', '2049', '5985', '5986', '6443', '7001', '8888', '10250'],
        description: 'SNMP, NFS, WinRM, K8s, WebLogic, Jupyter',
    },
];

// ─── Common misconfiguration suggestions ─────────────────────────────────────

export const MISCONFIGURATION_SUGGESTIONS = [
    'Default credentials not changed',
    'MFA not enforced',
    'Weak password policies',
    'Weak service account passwords',
    'Hardcoded secrets in source code',
    'Admin panel exposed to internet',
    'Anonymous Authentication Allowed',
    'Admin Interface with Unchanged Default Password',
    'No Account Lockout + Weak Password Policy',
    'No Account Lockout / No fail2ban / Unlimited Login Attempts',
    'User postgres with password ',
    '',
    'Telnet enabled',
    'FTP anonymous access',
    'SMBv1 enabled',
    'RDP exposed to internet',
    'NFS mount exposed',
    'Cleartext protocols (HTTP, FTP) used',
    'Lack of network segmentation',
    'Anonymous Share Access Enabled',
    'Telnet Service Active (deprecated since 2002)',
    'PermitRootLogin yes in sshd_config',
    'VNC Server Running Without Password',
    'Community String: ',
    ' or ',
    'No Relay Restrictions Configured',
    'Management Interface Accessible Without VPN/Firewall',
    'SMBv1 Protocol Active (MS17-010)',
    'LDAP Anonymous Bind Allowed',
    'WinRM HTTP Enabled with Weak Password',
    'MFA Not Enforced on Remote Desktop',
    'SMB Signing Not Required on Domain Members',
    'AXFR Allowed from Any Source',
    'Public S3 bucket',
    'Overly permissive IAM roles',
    'Unencrypted data at rest',
    'Unauthenticated Redis',
    'Unauthenticated MongoDB',
    'Unauthenticated Elasticsearch/Kibana',
    'MySQL Bound to 0.0.0.0 with No Root Password',
    'No requirepass / No bind restriction',
    'MongoDB started without --auth flag',
    'xpack.security.enabled: false (default in older versions)',
    'Memcached Exposed on UDP Port 11211 (No Auth)',
    'Unconstrained delegation',
    'Weak Kerberos encryption',
    'Excessive privileges for service accounts',
    'Jenkins script console enabled',
    'Docker socket exposed',
    'Kubernetes dashboard public',
    'Groovy Script Console Accessible (Manage Jenkins → Script Console)',
    'Docker Daemon Exposed on TCP 2375 Without TLS',
    'NFS Export with *(rw,no_root_squash)',
    'Open CORS policy',
    'Debug mode enabled',
    'Weak TLS (SSLv3/TLS 1.0)',
    'Directory listing enabled',
    'No rate limiting',
    'Missing security headers (HSTS, CSP)',
    'Outdated third-party dependencies',
    'Insecure direct object references (IDOR)',
    'SSRF protection missing',
    'autoindex On (Web Server Directory Browsing)',
    'Application Running in DEBUG=True (Django/Flask/Rails)',
    'Access-Control-Allow-Origin: * with credentials',
    '.git Directory Publicly Accessible on Web Server',
    'Unparameterized Database Queries (No Prepared Statements)',
    'No SSRF Protection + IMDSv1 Cloud Metadata',
    'Swagger/OpenAPI UI Publicly Accessible',
    'CVE-2020-14882 / Java Deserialization via T3 Protocol',
    'Unpatched OS',
    'Wildcard DNS record',
    'Lack of log monitoring/alerting',
    'Jupyter Notebook running without token or authentication',
    'Kubernetes Kubelet or API server allows anonymous unauthenticated access',
    'Permissive NFS export',
    'Git repository directory (.git) publicly exposed',
    'Exposed API Swagger documentation or hardcoded secrets',
    'Default SNMP community strings configured',
    'Notebook Started Without --NotebookApp.token or password',
    'Community String: "public" or "private"',
    'User postgres with password "postgres"',
    '--anonymous-auth=true on API Server',
    'xp_cmdshell Stored Procedure Enabled for App User',
    '--anonymous-auth=true on Kubelet',
    'Service Accounts with Weak Kerberos Ticket Passwords + SPNs',
    'Computer or Service Account Configured for Unconstrained Kerberos Delegation',
    'NTLM Authentication Enabled + No Credential Guard',
    'Unpatched Exchange Server with Internet-Accessible OWA',
    'VPN Gateway Without MFA + Reused Credentials',
    'Exposed RDP + Weak Creds + No MFA + SMBv1 + No Backup Strategy',
    'IMDSv1 Enabled on AWS EC2 (Token-Optional Mode)',
    'Anonymous Kubelet + Privileged Container + Host Path Mount',
    'Pre-Authentication Disabled on User Accounts',
    'Open Recursive Resolver + No DNS Query Monitoring'
];
