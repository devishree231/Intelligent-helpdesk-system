"""
Training and Knowledge Base dataset for Helpdesk AI Root-Cause Category Mapping.
Covers IT Support, Software Issue, Hardware Issue, Account Access, Network, and Others.
"""

TRAINING_DATA = [
    # Network Category
    {
        "text": "Unable to connect to office VPN. Cisco AnyConnect disconnects after a few seconds repeatedly.",
        "category": "Network",
        "root_cause_path": "Network > VPN > VPN Server Issue",
        "root_cause": "VPN server issue",
        "priority": "High",
        "solution": "Restart VPN client / verify server endpoint gateway status / flush local DNS cache",
        "support_team": "Network Operations"
    },
    {
        "text": "VPN connection issue. Keeps dropping connection when accessing intranet tools.",
        "category": "Network",
        "root_cause_path": "Network > VPN > Configuration Issue",
        "root_cause": "VPN configuration issue",
        "priority": "High",
        "solution": "Update VPN client profile certificate and reconnect to secondary gateway",
        "support_team": "Network Operations"
    },
    {
        "text": "Wi-Fi keeps dropping in the 3rd floor conference room. Signal strength is erratic.",
        "category": "Network",
        "root_cause_path": "Network > Wireless LAN > Access Point Congestion",
        "root_cause": "AP Congestion / Channel interference",
        "priority": "Medium",
        "solution": "Reboot 3rd floor AP and adjust 5GHz channel allocation",
        "support_team": "Network Operations"
    },
    {
        "text": "Ethernet wall port 14B not providing IP address, getting 169.254 APIPA address.",
        "category": "Network",
        "root_cause_path": "Network > Switchport > DHCP Lease Failure",
        "root_cause": "DHCP scope exhausted",
        "priority": "Medium",
        "solution": "Clear stale DHCP leases and verify switch port VLAN 20 configuration",
        "support_team": "Network Operations"
    },
    {
        "text": "Slow internet speeds across the entire engineering department, latency over 400ms.",
        "category": "Network",
        "root_cause_path": "Network > Firewall > Bandwidth Saturation",
        "root_cause": "Bandwidth saturation / High traffic load",
        "priority": "High",
        "solution": "Check Palo Alto firewall bandwidth graph and throttle rogue bulk downloads",
        "support_team": "Network Operations"
    },
    {
        "text": "Cannot access internal GitLab server or Docker registry from office network.",
        "category": "Network",
        "root_cause_path": "Network > DNS > Internal DNS Resolution",
        "root_cause": "Internal DNS lookup failure",
        "priority": "High",
        "solution": "Verify CoreDNS forwarding rule on primary domain controller",
        "support_team": "Network Operations"
    },

    # Hardware Issue
    {
        "text": "Laptop not turning on. Power LED blinks twice then stays black, charger plugged in.",
        "category": "Hardware Issue",
        "root_cause_path": "Hardware > Laptop > Power / Motherboard Failure",
        "root_cause": "Power supply or Motherboard failure",
        "priority": "Medium",
        "solution": "Perform hard flea-power discharge (hold power button 30s) or dispatch field technician for battery swap",
        "support_team": "End-User Hardware Support"
    },
    {
        "text": "Laptop battery drains in 45 minutes and laptop chassis gets extremely hot.",
        "category": "Hardware Issue",
        "root_cause_path": "Hardware > Battery > Cell Degradation",
        "root_cause": "Degraded battery health",
        "priority": "Medium",
        "solution": "Run battery diagnostic in BIOS and schedule battery replacement",
        "support_team": "End-User Hardware Support"
    },
    {
        "text": "External monitor Dell U2720Q flickering continuously via USB-C cable.",
        "category": "Hardware Issue",
        "root_cause_path": "Hardware > Peripherals > Defective Cable / Port",
        "root_cause": "Faulty USB-C DisplayPort cable",
        "priority": "Low",
        "solution": "Replace USB-C cable and update Intel Iris Xe display drivers",
        "support_team": "IT Helpdesk"
    },
    {
        "text": "Keyboard keys E, R, and T are unresponsive on Lenovo ThinkPad.",
        "category": "Hardware Issue",
        "root_cause_path": "Hardware > Laptop > Keyboard Hardware Failure",
        "root_cause": "Physical keyboard membrane failure",
        "priority": "Medium",
        "solution": "Replace laptop keyboard assembly under manufacturer warranty",
        "support_team": "End-User Hardware Support"
    },
    {
        "text": "Blue screen of death (BSOD) with error WHEA_UNCORRECTABLE_ERROR repeatedly.",
        "category": "Hardware Issue",
        "root_cause_path": "Hardware > Memory / Storage > Faulty NVMe SSD or RAM",
        "root_cause": "Hardware memory or storage sector defect",
        "priority": "High",
        "solution": "Run MemTest86 and Dell SupportAssist hardware scan; reseat RAM module",
        "support_team": "End-User Hardware Support"
    },

    # Account Access
    {
        "text": "Password reset request for corporate active directory and email login.",
        "category": "Account Access",
        "root_cause_path": "Account Access > Active Directory > Expired Credentials",
        "root_cause": "Password expired / locked account",
        "priority": "Low",
        "solution": "Verify identity via manager confirmation and trigger self-service SSPR reset link",
        "support_team": "Identity & Access Management"
    },
    {
        "text": "Locked out of Okta SSO after multiple failed attempts. MFA push not arriving.",
        "category": "Account Access",
        "root_cause_path": "Account Access > Okta SSO > MFA Desynchronization",
        "root_cause": "MFA push token out of sync",
        "priority": "Medium",
        "solution": "Reset Okta Verify token and send temporary bypass code",
        "support_team": "Identity & Access Management"
    },
    {
        "text": "Email not syncing on Outlook mobile app, getting authentication token expired error.",
        "category": "Account Access",
        "root_cause_path": "Account Access > Microsoft 365 > Modern Auth Token",
        "root_cause": "Corrupted OAuth token in Intune Company Portal",
        "priority": "Low",
        "solution": "Remove corporate account from device, re-enroll via MS Authenticator",
        "support_team": "Identity & Access Management"
    },
    {
        "text": "Need access permissions to the AWS Production S3 bucket for finance audit.",
        "category": "Account Access",
        "root_cause_path": "Account Access > IAM > Privilege Request",
        "root_cause": "Missing IAM role assignment",
        "priority": "Medium",
        "solution": "Request approval from Security Lead via Jira Service Desk workflow",
        "support_team": "Security & IAM"
    },
    {
        "text": "New hire account onboarding: Slack, GitHub organization, and Google Workspace invite.",
        "category": "Account Access",
        "root_cause_path": "Account Access > Onboarding > Provisioning Pipeline",
        "root_cause": "Pending automated provisioning job",
        "priority": "Medium",
        "solution": "Rerun SCIM provisioning sync from Workday to Okta",
        "support_team": "IT Helpdesk"
    },

    # Software Issue
    {
        "text": "Software installation error: Docker Desktop fails with Hyper-V WSL2 kernel missing.",
        "category": "Software Issue",
        "root_cause_path": "Software Issue > Developer Tools > Missing WSL2 Kernel",
        "root_cause": "WSL2 Linux kernel update package required",
        "priority": "Medium",
        "solution": "Run 'wsl --update' in elevated PowerShell and enable Virtual Machine Platform",
        "support_team": "Application Support"
    },
    {
        "text": "Microsoft Teams crashing immediately on startup after latest Windows update.",
        "category": "Software Issue",
        "root_cause_path": "Software Issue > Collaboration > Corrupted App Cache",
        "root_cause": "Corrupted Teams Electron app cache",
        "priority": "Medium",
        "solution": "Clear %appdata%\\Microsoft\\Teams folder and reinstall latest MSIX package",
        "support_team": "Application Support"
    },
    {
        "text": "Excel crashes when running macros containing Visual Basic scripts.",
        "category": "Software Issue",
        "root_cause_path": "Software Issue > Office Suite > Macro Security Policy",
        "root_cause": "Blocked VBA macros due to trust center policy",
        "priority": "Low",
        "solution": "Unblock file in Windows Explorer properties and check digital signature",
        "support_team": "Application Support"
    },
    {
        "text": "IntelliJ IDEA freezes during Maven re-indexing with OutOfMemoryError.",
        "category": "Software Issue",
        "root_cause_path": "Software Issue > IDE > JVM Heap Allocation",
        "root_cause": "Insufficient JVM maximum heap size (-Xmx)",
        "priority": "Medium",
        "solution": "Increase heap memory to 4096MB in Help > Change Memory Settings",
        "support_team": "Application Support"
    },
    {
        "text": "Google Chrome showing 'Aw, Snap!' error code STATUS_ACCESS_VIOLATION on web apps.",
        "category": "Software Issue",
        "root_cause_path": "Software Issue > Browser > Extension Conflict",
        "root_cause": "Conflicting enterprise security browser extension",
        "priority": "Low",
        "solution": "Disable third-party extensions and clear browser site data / cookies",
        "support_team": "IT Helpdesk"
    },

    # IT Support
    {
        "text": "Need dual monitor setup assistance and HDMI to USB-C docking station configuration.",
        "category": "IT Support",
        "root_cause_path": "IT Support > Workstation Setup > Display Docking Configuration",
        "root_cause": "Workstation docking configuration",
        "priority": "Low",
        "solution": "Install DisplayLink driver and connect monitors to DisplayPort 1 and 2 on dock",
        "support_team": "IT Helpdesk"
    },
    {
        "text": "Conference room Zoom Rooms speaker and microphone not detected.",
        "category": "IT Support",
        "root_cause_path": "IT Support > AV Systems > USB Hub Disconnect",
        "root_cause": "AV soundbar USB hub power disconnect",
        "priority": "High",
        "solution": "Power cycle Logitech MeetUp soundbar and restart Zoom Room controller tablet",
        "support_team": "IT Helpdesk"
    },
    {
        "text": "Office badge reader not granting access to Server Room B door.",
        "category": "IT Support",
        "root_cause_path": "IT Support > Physical Security > Badge RFID Permission",
        "root_cause": "RFID access permission expired in Lenel OnGuard",
        "priority": "Medium",
        "solution": "Submit badge access request signed by datacenter manager",
        "support_team": "Facilities & Physical Security"
    },
    {
        "text": "Office printer Canon C5535i showing 'Paper Jam in Finisher Tray 3'.",
        "category": "IT Support",
        "root_cause_path": "IT Support > Printing > Hardware Jam",
        "root_cause": "Roller paper jam in output tray",
        "priority": "Low",
        "solution": "Open side door A, release green latch, clear paper fragments, and close firmly",
        "support_team": "IT Helpdesk"
    },
    {
        "text": "Request for ergonomic chair and wireless ergonomic vertical mouse.",
        "category": "IT Support",
        "root_cause_path": "IT Support > Procurement > Ergonomic Asset Request",
        "root_cause": "Equipment procurement request",
        "priority": "Low",
        "solution": "Route procurement ticket to office manager for department budget approval",
        "support_team": "IT Helpdesk"
    },

    # Others
    {
        "text": "Air conditioning in server room is leaking water and temperature is 82F.",
        "category": "Others",
        "root_cause_path": "Others > Facilities > HVAC Failure",
        "root_cause": "Server room HVAC condenser leak",
        "priority": "High",
        "solution": "Urgent facilities escalation for HVAC contractor maintenance",
        "support_team": "Facilities"
    },
    {
        "text": "Question about company work from home technology stipend reimbursement policy.",
        "category": "Others",
        "root_cause_path": "Others > Policy > HR Expense Inquiry",
        "root_cause": "HR Policy inquiry",
        "priority": "Low",
        "solution": "Refer to Confluence People Ops WFH Stipend Guidelines 2026",
        "support_team": "Human Resources"
    }
]

KNOWLEDGE_BASE_ARTICLES = [
    {
        "id": "KB-101",
        "title": "Resolving Cisco AnyConnect & GlobalProtect VPN Connection Drops",
        "category": "Network",
        "root_cause": "VPN server issue / MTU packet fragmentation",
        "content": "Step 1: Check VPN gateway status at https://status.internal.net.\nStep 2: Restart Cisco AnyConnect / GlobalProtect client.\nStep 3: Open terminal and flush DNS with 'ipconfig /flushdns'.\nStep 4: If disconnecting every 10 seconds, lower MTU to 1300:\n  netsh interface ipv4 set subinterface \"Local Area Connection\" mtu=1300 store=persistent.\nStep 5: Contact Network Operations team if problem persists.",
        "tags": ["vpn", "network", "disconnect", "anyconnect", "gateway"],
        "views": 342,
        "likes": 88
    },
    {
        "id": "KB-102",
        "title": "Troubleshooting Laptop Power and Boot Failures",
        "category": "Hardware Issue",
        "root_cause": "Power supply or Motherboard failure / Static charge",
        "content": "Step 1: Disconnect the AC power adapter.\nStep 2: Disconnect all external USB drives, monitors, and docks.\nStep 3: Press and hold down the Power button for 30 consecutive seconds (hard reset to release flea power).\nStep 4: Reconnect only the AC power adapter.\nStep 5: Attempt to turn on the machine. If diagnostic LEDs blink, note the sequence (e.g. 2 amber, 3 white) and report to Hardware Support.",
        "tags": ["laptop", "hardware", "power", "boot", "black screen", "battery"],
        "views": 512,
        "likes": 129
    },
    {
        "id": "KB-103",
        "title": "Self-Service Password Reset and Okta MFA Resync Guide",
        "category": "Account Access",
        "root_cause": "Password expired / locked account / MFA desync",
        "content": "Step 1: Navigate to https://login.company.com/sspr.\nStep 2: Verify your identity via backup email or SMS code.\nStep 3: Set a new password meeting policy (14+ characters, alphanumeric + symbols).\nStep 4: For MFA token issues, open Okta Verify > Settings > Sync Clock. If device was changed, contact IT Helpdesk for MFA reprovisioning code.",
        "tags": ["password", "reset", "okta", "mfa", "login", "account", "locked"],
        "views": 890,
        "likes": 240
    },
    {
        "id": "KB-104",
        "title": "Fixing Docker Desktop WSL2 Kernel and Hyper-V Startup Errors",
        "category": "Software Issue",
        "root_cause": "WSL2 Linux kernel update package required",
        "content": "Step 1: Open PowerShell as Administrator.\nStep 2: Run 'wsl --update' to download latest Microsoft Linux kernel.\nStep 3: Run 'wsl --set-default-version 2'.\nStep 4: Enable Windows features: 'dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart'.\nStep 5: Restart the computer and launch Docker Desktop.",
        "tags": ["docker", "wsl2", "software", "windows", "virtualization", "hyper-v"],
        "views": 415,
        "likes": 95
    },
    {
        "id": "KB-105",
        "title": "Configuring Dual Monitors on Dell Thunderbolt Docking Stations",
        "category": "IT Support",
        "root_cause": "Workstation docking configuration / DisplayLink drivers",
        "content": "Step 1: Plug Thunderbolt cable into the high-power USB-C port marked with lightning bolt icon.\nStep 2: Connect first display to DisplayPort 1 and second display to HDMI port.\nStep 3: Install Dell DisplayLink docking station driver.\nStep 4: Press Win + P and select 'Extend' displays.",
        "tags": ["monitor", "dock", "dell", "display", "setup", "it support"],
        "views": 278,
        "likes": 64
    },
    {
        "id": "KB-106",
        "title": "Clearing Microsoft Teams and Outlook Local Cache",
        "category": "Software Issue",
        "root_cause": "Corrupted Teams Electron app cache",
        "content": "Step 1: Fully quit Microsoft Teams (right click in taskbar > Quit).\nStep 2: Press Win + R, type '%localappdata%\\Packages\\MSTeams_8wekyb3d8bbwe\\LocalCache\\Roaming\\Microsoft\\Teams' and delete contents.\nStep 3: Restart Microsoft Teams and sign in.",
        "tags": ["teams", "outlook", "cache", "crash", "microsoft"],
        "views": 620,
        "likes": 175
    }
]
