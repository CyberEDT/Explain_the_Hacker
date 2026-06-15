export const ATTACK_PHASES = [
    {
        num: '01', label: 'RECON',
        color: '#00aaff',
        lines: ['PORT_SCAN ACTIVE', '> nmap -sV 192.168.1.0/24', 'HOST_DISCOVERY: 14 found'],
        barWidth: '60%',
    },
    {
        num: '02', label: 'WEAPONIZE',
        color: '#ffaa00',
        lines: ['PAYLOAD: COBALT_STRIKE.EXE', 'TARGET: HR_DEPT', 'SENT: [OK]'],
    },
    {
        num: '03', label: 'DELIVER',
        color: '#ffaa00',
        lines: ['PHISHING_MAIL_INIT...', 'TARGET: HR_DEPT', 'DELIVER_METHOD: EMAIL'],
    },
    {
        num: '04', label: 'EXPLOIT',
        color: '#ff0033',
        bg: 'rgba(255,0,51,0.15)',
        lines: ['CVE-2023-4822', 'EXECUTION_SUCCESSFUL', '> shell spawned'],
        isCritical: true,
    },
    {
        num: '05', label: 'INSTALL',
        color: '#ffaa00',
        lines: ['REGISTRY_KEY_ADDED', '> HKLM\\Run\\svchost32', 'PERSISTENCE: OK'],
    },
    {
        num: '06', label: 'C2',
        color: '#00ff9d',
        lines: ['HANDSHAKE_ESTABLISHED', '> beacon interval: 60s', 'CHANNEL: HTTPS/443'],
    },
    {
        num: '07', label: 'IMPACT',
        color: '#ff0033',
        isDashed: true,
        lines: ['DATA_EXFILTRATION', '> 2.4GB transferred', 'DEST: 185.220.101.x'],
    },
];

export const TACTICS = [
    {
        id: 'TA0001', name: 'INITIAL ACCESS',
        items: ['Phishing', 'Public-Facing Apps', 'Trusted Relationship'],
    },
    {
        id: 'TA0002', name: 'EXECUTION',
        items: ['Command Interpreter', 'Task Scheduling', 'User Execution'],
    },
    {
        id: 'TA0003', name: 'PERSISTENCE',
        items: ['Boot Logon Auto-start', 'Account Manipulation', 'Browser Extensions'],
    },
    {
        id: 'TA0004', name: 'PRIVILEGE ESCALATION',
        items: ['Token Manipulation', 'Bypass UAC', 'Sudo Abuse'],
    },
    {
        id: 'TA0005', name: 'DEFENSE EVASION',
        items: ['Obfuscated Files', 'Indicator Removal', 'Masquerading'],
    },
    {
        id: 'TA0006', name: 'CREDENTIAL ACCESS',
        items: ['Brute Force', 'OS Credential Dumping', 'Keylogging'],
    },
];
