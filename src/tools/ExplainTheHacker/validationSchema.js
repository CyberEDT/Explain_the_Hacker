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

    // Log Snippet: textarea — strip scripts, max 5000 chars
    logSnippet: z
        .string()
        .max(5000, 'Log snippet must be under 5000 characters.')
        .transform(stripScripts)
        .optional()
        .or(z.literal('')),
});

// ─── Default Form Values ──────────────────────────────────────────────────────

export const defaultFormValues = {
    openPorts: [],   // string[]
    misconfigurations: [],  // string[]
    logSnippet: '',   // string
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
    // Authentication & Access
    'Default credentials not changed',
    'MFA not enforced',
    'Weak password policies',
    'Weak service account passwords',
    'Hardcoded secrets in source code',
    'Admin panel exposed to internet',
    
    // Network & Services
    'Telnet enabled',
    'FTP anonymous access',
    'SMBv1 enabled',
    'RDP exposed to internet',
    'NFS mount exposed',
    'Cleartext protocols (HTTP, FTP) used',
    'Lack of network segmentation',
    
    // Cloud & Infrastructure
    'Public S3 bucket',
    'Overly permissive IAM roles',
    'Unencrypted data at rest',
    
    // Databases & Cache
    'Unauthenticated Redis',
    'Unauthenticated MongoDB',
    'Unauthenticated Elasticsearch/Kibana',
    
    // Active Directory
    'Unconstrained delegation',
    'Weak Kerberos encryption',
    'Excessive privileges for service accounts',
    
    // Containers & CI/CD
    'Jenkins script console enabled',
    'Docker socket exposed',
    'Kubernetes dashboard public',
    
    // Web Application & Security
    'Open CORS policy',
    'Debug mode enabled',
    'Weak TLS (SSLv3/TLS 1.0)',
    'Directory listing enabled',
    'No rate limiting',
    'Missing security headers (HSTS, CSP)',
    'Outdated third-party dependencies',
    'Insecure direct object references (IDOR)',
    'SSRF protection missing',
    
    // Operations & Monitoring
    'Unpatched OS',
    'Wildcard DNS record',
    'Lack of log monitoring/alerting',
    
    // New Additions
    'Jupyter Notebook running without token or authentication',
    'Kubernetes Kubelet or API server allows anonymous unauthenticated access',
    'Permissive NFS export',
    'Git repository directory (.git) publicly exposed',
    'Exposed API Swagger documentation or hardcoded secrets',
    'Default SNMP community strings configured',
];
