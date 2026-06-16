export const KILL_CHAIN_STAGES = [
    {
        id: 'recon',
        num: '01',
        title: 'RECONNAISSANCE',
        color: '#00aaff',
        attackerQuestion: "What can I learn about the target?",
        mindset: "I need information before I attack. I'm looking for weak points, exposed infrastructure, and key personnel.",
        activities: [
            "Open Source Intelligence (OSINT)",
            "DNS & Network Enumeration",
            "Technology Stack Discovery",
            "Employee Profiling"
        ],
        outcomes: "A target list, identified vulnerabilities, and a potential entry path.",
        animationType: "scan"
    },
    {
        id: 'weaponization',
        num: '02',
        title: 'WEAPONIZATION',
        color: '#ffaa00',
        attackerQuestion: "What tools will I prepare?",
        mindset: "I need to pair a remote access malware with an exploit into a deliverable payload. The goal is to make it undetectable.",
        activities: [
            "Malware Creation & Customization",
            "Exploit Selection",
            "Payload Generation",
            "Obfuscation Techniques"
        ],
        outcomes: "A weaponized artifact ready to be delivered to the target.",
        animationType: "assemble"
    },
    {
        id: 'delivery',
        num: '03',
        title: 'DELIVERY',
        color: '#ffaa00',
        attackerQuestion: "How do I reach the target?",
        mindset: "I have the weapon. Now I need to deliver it to the target's environment without being blocked by security controls.",
        activities: [
            "Spear-phishing Campaigns",
            "Malicious Email Attachments",
            "Drive-by Downloads",
            "USB Drop Attacks"
        ],
        outcomes: "The weaponized payload is successfully transmitted to the target system.",
        animationType: "transmit"
    },
    {
        id: 'exploitation',
        num: '04',
        title: 'EXPLOITATION',
        color: '#ff0033',
        attackerQuestion: "How do I gain execution?",
        mindset: "The payload has arrived. Now I need to trigger it to exploit a vulnerability and run my code on their machine.",
        activities: [
            "Software Vulnerability Exploitation",
            "Credential Abuse",
            "Misconfiguration Abuse",
            "Social Engineering (User Execution)"
        ],
        outcomes: "Initial access and arbitrary code execution on the target system.",
        animationType: "breach"
    },
    {
        id: 'installation',
        num: '05',
        title: 'INSTALLATION',
        color: '#ffaa00',
        attackerQuestion: "How do I stay on the system?",
        mindset: "If they reboot or log off, I'll lose access. I need to install a backdoor to ensure I can get back in.",
        activities: [
            "Malware Installation (e.g., RATs, Web Shells)",
            "Persistence Mechanisms (Registry, Scheduled Tasks)",
            "Defense Evasion"
        ],
        outcomes: "A persistent presence inside the target environment.",
        animationType: "anchor"
    },
    {
        id: 'c2',
        num: '06',
        title: 'COMMAND & CONTROL',
        color: '#00ff9d',
        attackerQuestion: "How do I communicate with the victim?",
        mindset: "I need a hidden, reliable channel to send instructions to my malware and receive data back without triggering alerts.",
        activities: [
            "Establishing C2 Channels (HTTP/DNS/ICMP)",
            "Beaconing",
            "Interactive Remote Shells",
            "Domain Generation Algorithms (DGA)"
        ],
        outcomes: "A stable, two-way communication channel enabling remote control.",
        animationType: "pulse"
    },
    {
        id: 'impact',
        num: '07',
        title: 'ACTIONS ON OBJECTIVES',
        color: '#ff0033',
        attackerQuestion: "What am I here to achieve?",
        mindset: "I have access, persistence, and control. Now I execute the final phase of my mission.",
        activities: [
            "Data Exfiltration (Theft)",
            "Ransomware Deployment",
            "Data Destruction or Manipulation",
            "Espionage and Prolonged Surveillance"
        ],
        outcomes: "The attacker's ultimate goal is realized (financial gain, disruption, or espionage).",
        animationType: "execute"
    }
];

export const ATTACK_STORIES = [
    {
        id: 'ransomware',
        name: 'Ransomware Operation',
        steps: [
            { stage: 'recon', desc: 'Scan for vulnerable VPN endpoints.' },
            { stage: 'weaponization', desc: 'Acquire initial access broker credentials.' },
            { stage: 'delivery', desc: 'Login via VPN without MFA.' },
            { stage: 'exploitation', desc: 'Exploit PrintNightmare for SYSTEM privileges.' },
            { stage: 'installation', desc: 'Install Cobalt Strike beacons.' },
            { stage: 'c2', desc: 'Establish HTTPS beacons to actor infrastructure.' },
            { stage: 'impact', desc: 'Deploy ransomware binary and exfiltrate data.' }
        ]
    },
    {
        id: 'apt',
        name: 'APT Espionage Campaign',
        steps: [
            { stage: 'recon', desc: 'Profile target executives on LinkedIn.' },
            { stage: 'weaponization', desc: 'Create tailored zero-click malicious PDF.' },
            { stage: 'delivery', desc: 'Spear-phishing email to executive assistant.' },
            { stage: 'exploitation', desc: 'PDF triggers zero-day rendering exploit.' },
            { stage: 'installation', desc: 'Drop custom rootkit for deep persistence.' },
            { stage: 'c2', desc: 'DNS tunneling for stealthy communication.' },
            { stage: 'impact', desc: 'Silent, long-term theft of intellectual property.' }
        ]
    }
];
