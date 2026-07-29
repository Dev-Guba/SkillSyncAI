'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Job_title_skills', [

      // Backend Developer
      { job_title_id: 1, skill_set_id: 7 }, // PHP
      { job_title_id: 1, skill_set_id: 11 }, // NodeJS
      { job_title_id: 1, skill_set_id: 12 }, // Express
      { job_title_id: 1, skill_set_id: 14 }, // MySQL
      { job_title_id: 1, skill_set_id: 15 }, // PostgreSQL
      { job_title_id: 1, skill_set_id: 16 }, // MongoDB
      { job_title_id: 1, skill_set_id: 18 }, // Git
      { job_title_id: 1, skill_set_id: 29 }, // REST
      { job_title_id: 1, skill_set_id: 19 }, // Docker

      // Frontend Developer
      { job_title_id: 2, skill_set_id: 5 }, // JavaScript
      { job_title_id: 2, skill_set_id: 6 }, // TypeScript
      { job_title_id: 2, skill_set_id: 10 }, // React
      { job_title_id: 2, skill_set_id: 8 }, // HTML
      { job_title_id: 2, skill_set_id: 9 }, // CSS
      { job_title_id: 2, skill_set_id: 26 }, // Tailwind
      { job_title_id: 2, skill_set_id: 18 }, // Git
      { job_title_id: 2, skill_set_id: 28 }, // Figma

      // Full Stack Developer
      { job_title_id: 3, skill_set_id: 5 }, // JavaScript
      { job_title_id: 3, skill_set_id: 6 }, // TypeScript
      { job_title_id: 3, skill_set_id: 10 }, // React
      { job_title_id: 3, skill_set_id: 11 }, // NodeJS
      { job_title_id: 3, skill_set_id: 12 }, // Express
      { job_title_id: 3, skill_set_id: 15 }, // PostgreSQL
      { job_title_id: 3, skill_set_id: 16 }, // MongoDB
      { job_title_id: 3, skill_set_id: 18 }, // Git
      { job_title_id: 3, skill_set_id: 19 }, // Docker
      { job_title_id: 3, skill_set_id: 29 }, // REST

      // Software Engineer
      { job_title_id: 4, skill_set_id: 2 }, // Java
      { job_title_id: 4, skill_set_id: 4 }, // C++
      { job_title_id: 4, skill_set_id: 1 }, // Python
      { job_title_id: 4, skill_set_id: 18 }, // Git
      { job_title_id: 4, skill_set_id: 19 }, // Docker
      { job_title_id: 4, skill_set_id: 29 }, // REST
      { job_title_id: 4, skill_set_id: 58 }, // SQL

      // Mobile Developer
      { job_title_id: 5, skill_set_id: 2 }, // Java
      { job_title_id: 5, skill_set_id: 33 }, // Kotlin
      { job_title_id: 5, skill_set_id: 34 }, // Swift
      { job_title_id: 5, skill_set_id: 18 }, // Git
      { job_title_id: 5, skill_set_id: 24 }, // Firebase

      // Web Developer
      { job_title_id: 6, skill_set_id: 8 }, // HTML
      { job_title_id: 6, skill_set_id: 9 }, // CSS
      { job_title_id: 6, skill_set_id: 5 }, // JavaScript
      { job_title_id: 6, skill_set_id: 7 }, // PHP
      { job_title_id: 6, skill_set_id: 10 }, // React
      { job_title_id: 6, skill_set_id: 18 }, // Git
      { job_title_id: 6, skill_set_id: 14 }, // MySQL

      // Data Analyst
      { job_title_id: 7, skill_set_id: 58 }, // SQL
      { job_title_id: 7, skill_set_id: 57 }, // Excel
      { job_title_id: 7, skill_set_id: 55 }, // PowerBI
      { job_title_id: 7, skill_set_id: 56 }, // Tableau
      { job_title_id: 7, skill_set_id: 1 }, // Python
      { job_title_id: 7, skill_set_id: 38 }, // Pandas

      // Data Scientist
      { job_title_id: 8, skill_set_id: 1 }, // Python
      { job_title_id: 8, skill_set_id: 41 }, // R
      { job_title_id: 8, skill_set_id: 38 }, // Pandas
      { job_title_id: 8, skill_set_id: 37 }, // NumPy
      { job_title_id: 8, skill_set_id: 94 }, // Scikit-learn
      { job_title_id: 8, skill_set_id: 35 }, // TensorFlow
      { job_title_id: 8, skill_set_id: 58 }, // SQL
      { job_title_id: 8, skill_set_id: 97 }, // Jupyter

      // Machine Learning Engineer
      { job_title_id: 9, skill_set_id: 1 }, // Python
      { job_title_id: 9, skill_set_id: 35 }, // TensorFlow
      { job_title_id: 9, skill_set_id: 36 }, // PyTorch
      { job_title_id: 9, skill_set_id: 37 }, // NumPy
      { job_title_id: 9, skill_set_id: 38 }, // Pandas
      { job_title_id: 9, skill_set_id: 94 }, // Scikit-learn
      { job_title_id: 9, skill_set_id: 19 }, // Docker
      { job_title_id: 9, skill_set_id: 18 }, // Git

      // AI Engineer
      { job_title_id: 10, skill_set_id: 1 }, // Python
      { job_title_id: 10, skill_set_id: 35 }, // TensorFlow
      { job_title_id: 10, skill_set_id: 36 }, // PyTorch
      { job_title_id: 10, skill_set_id: 46 }, // CUDA
      { job_title_id: 10, skill_set_id: 37 }, // NumPy
      { job_title_id: 10, skill_set_id: 19 }, // Docker
      { job_title_id: 10, skill_set_id: 18 }, // Git

      // DevOps Engineer
      { job_title_id: 11, skill_set_id: 19 }, // Docker
      { job_title_id: 11, skill_set_id: 42 }, // Kubernetes
      { job_title_id: 11, skill_set_id: 48 }, // Jenkins
      { job_title_id: 11, skill_set_id: 18 }, // Git
      { job_title_id: 11, skill_set_id: 22 }, // AWS
      { job_title_id: 11, skill_set_id: 23 }, // Azure
      { job_title_id: 11, skill_set_id: 92 }, // Terraform
      { job_title_id: 11, skill_set_id: 20 }, // Linux
      { job_title_id: 11, skill_set_id: 45 }, // Bash

      // Cloud Engineer
      { job_title_id: 12, skill_set_id: 22 }, // AWS
      { job_title_id: 12, skill_set_id: 23 }, // Azure
      { job_title_id: 12, skill_set_id: 19 }, // Docker
      { job_title_id: 12, skill_set_id: 42 }, // Kubernetes
      { job_title_id: 12, skill_set_id: 20 }, // Linux
      { job_title_id: 12, skill_set_id: 92 }, // Terraform
      { job_title_id: 12, skill_set_id: 18 }, // Git

      // Database Administrator
      { job_title_id: 13, skill_set_id: 14 }, // MySQL
      { job_title_id: 13, skill_set_id: 15 }, // PostgreSQL
      { job_title_id: 13, skill_set_id: 16 }, // MongoDB
      { job_title_id: 13, skill_set_id: 58 }, // SQL
      { job_title_id: 13, skill_set_id: 53 }, // Oracle
      { job_title_id: 13, skill_set_id: 17 }, // SQLite

      // Network Engineer
      { job_title_id: 14, skill_set_id: 115 }, // Cisco
      { job_title_id: 14, skill_set_id: 20 }, // Linux
      { job_title_id: 14, skill_set_id: 21 }, // Windows
      { job_title_id: 14, skill_set_id: 105 }, // Wireshark

      // Cybersecurity Analyst
      { job_title_id: 15, skill_set_id: 104 }, // Kali
      { job_title_id: 15, skill_set_id: 105 }, // Wireshark
      { job_title_id: 15, skill_set_id: 106 }, // Metasploit
      { job_title_id: 15, skill_set_id: 108 }, // Nmap
      { job_title_id: 15, skill_set_id: 112 }, // Splunk
      { job_title_id: 15, skill_set_id: 20 }, // Linux
      { job_title_id: 15, skill_set_id: 114 }, // PowerShell
      { job_title_id: 15, skill_set_id: 109 }, // Nessus

      // IT Support Specialist
      { job_title_id: 16, skill_set_id: 21 }, // Windows
      { job_title_id: 16, skill_set_id: 20 }, // Linux
      { job_title_id: 16, skill_set_id: 57 }, // Excel
      { job_title_id: 16, skill_set_id: 153 }, // Word
      { job_title_id: 16, skill_set_id: 67 }, // Teams
      { job_title_id: 16, skill_set_id: 190 }, // GoogleWorkspace

      // Quality Assurance Engineer
      { job_title_id: 17, skill_set_id: 18 }, // Git
      { job_title_id: 17, skill_set_id: 58 }, // SQL
      { job_title_id: 17, skill_set_id: 1 }, // Python
      { job_title_id: 17, skill_set_id: 19 }, // Docker
      { job_title_id: 17, skill_set_id: 62 }, // Jira

      // UI/UX Designer
      { job_title_id: 18, skill_set_id: 28 }, // Figma
      { job_title_id: 18, skill_set_id: 137 }, // Sketch
      { job_title_id: 18, skill_set_id: 136 }, // XD
      { job_title_id: 18, skill_set_id: 124 }, // Photoshop
      { job_title_id: 18, skill_set_id: 125 }, // Illustrator
      { job_title_id: 18, skill_set_id: 132 }, // Canva

      // Registered Nurse
      { job_title_id: 19, skill_set_id: 221 }, // Epic
      { job_title_id: 19, skill_set_id: 222 }, // Cerner
      { job_title_id: 19, skill_set_id: 230 }, // EMR
      { job_title_id: 19, skill_set_id: 231 }, // EHR
      { job_title_id: 19, skill_set_id: 232 }, // ICD10
      { job_title_id: 19, skill_set_id: 233 }, // HL7
      { job_title_id: 19, skill_set_id: 234 }, // ECG

      // Medical Technologist
      { job_title_id: 20, skill_set_id: 249 }, // LIMS
      { job_title_id: 20, skill_set_id: 254 }, // Microscopy
      { job_title_id: 20, skill_set_id: 253 }, // PCR
      { job_title_id: 20, skill_set_id: 252 }, // ELISA
      { job_title_id: 20, skill_set_id: 228 }, // DICOM
      { job_title_id: 20, skill_set_id: 233 }, // HL7

      // Pharmacist
      { job_title_id: 21, skill_set_id: 241 }, // RxNorm
      { job_title_id: 21, skill_set_id: 242 }, // Micromedex
      { job_title_id: 21, skill_set_id: 243 }, // Lexicomp
      { job_title_id: 21, skill_set_id: 244 }, // Medscape
      { job_title_id: 21, skill_set_id: 247 }, // Pharmacovigilance
      { job_title_id: 21, skill_set_id: 248 }, // LabWare

      // Healthcare Assistant
      { job_title_id: 22, skill_set_id: 230 }, // EMR
      { job_title_id: 22, skill_set_id: 231 }, // EHR
      { job_title_id: 22, skill_set_id: 57 }, // Excel
      { job_title_id: 22, skill_set_id: 153 }, // Word
      { job_title_id: 22, skill_set_id: 227 }, // Telehealth

      // Caregiver
      { job_title_id: 23, skill_set_id: 227 }, // Telehealth
      { job_title_id: 23, skill_set_id: 235 }, // PulseOximeter
      { job_title_id: 23, skill_set_id: 230 }, // EMR

      // Radiologic Technologist
      { job_title_id: 24, skill_set_id: 228 }, // DICOM
      { job_title_id: 24, skill_set_id: 229 }, // PACS
      { job_title_id: 24, skill_set_id: 236 }, // Ultrasound

      // Accountant
      { job_title_id: 25, skill_set_id: 149 }, // QuickBooks
      { job_title_id: 25, skill_set_id: 150 }, // Xero
      { job_title_id: 25, skill_set_id: 52 }, // SAP
      { job_title_id: 25, skill_set_id: 57 }, // Excel
      { job_title_id: 25, skill_set_id: 171 }, // VBA
      { job_title_id: 25, skill_set_id: 58 }, // SQL

      // Financial Analyst
      { job_title_id: 26, skill_set_id: 57 }, // Excel
      { job_title_id: 26, skill_set_id: 55 }, // PowerBI
      { job_title_id: 26, skill_set_id: 56 }, // Tableau
      { job_title_id: 26, skill_set_id: 176 }, // Bloomberg
      { job_title_id: 26, skill_set_id: 171 }, // VBA
      { job_title_id: 26, skill_set_id: 58 }, // SQL

      // Auditor
      { job_title_id: 27, skill_set_id: 57 }, // Excel
      { job_title_id: 27, skill_set_id: 174 }, // ACL
      { job_title_id: 27, skill_set_id: 175 }, // IDEA
      { job_title_id: 27, skill_set_id: 52 }, // SAP
      { job_title_id: 27, skill_set_id: 149 }, // QuickBooks

      // Business Analyst
      { job_title_id: 28, skill_set_id: 57 }, // Excel
      { job_title_id: 28, skill_set_id: 58 }, // SQL
      { job_title_id: 28, skill_set_id: 55 }, // PowerBI
      { job_title_id: 28, skill_set_id: 56 }, // Tableau
      { job_title_id: 28, skill_set_id: 62 }, // Jira
      { job_title_id: 28, skill_set_id: 64 }, // Visio

      // Human Resource Specialist
      { job_title_id: 29, skill_set_id: 57 }, // Excel
      { job_title_id: 29, skill_set_id: 153 }, // Word
      { job_title_id: 29, skill_set_id: 154 }, // PowerPoint
      { job_title_id: 29, skill_set_id: 67 }, // Teams
      { job_title_id: 29, skill_set_id: 156 }, // Slack

      // Administrative Assistant
      { job_title_id: 30, skill_set_id: 153 }, // Word
      { job_title_id: 30, skill_set_id: 57 }, // Excel
      { job_title_id: 30, skill_set_id: 154 }, // PowerPoint
      { job_title_id: 30, skill_set_id: 67 }, // Teams
      { job_title_id: 30, skill_set_id: 190 }, // GoogleWorkspace

      // Project Manager
      { job_title_id: 31, skill_set_id: 62 }, // Jira
      { job_title_id: 31, skill_set_id: 63 }, // Confluence
      { job_title_id: 31, skill_set_id: 264 }, // MSProject
      { job_title_id: 31, skill_set_id: 157 }, // Trello
      { job_title_id: 31, skill_set_id: 158 }, // Asana
      { job_title_id: 31, skill_set_id: 57 }, // Excel

      // Civil Engineer
      { job_title_id: 32, skill_set_id: 79 }, // AutoCAD
      { job_title_id: 32, skill_set_id: 257 }, // Civil3D
      { job_title_id: 32, skill_set_id: 258 }, // Revit
      { job_title_id: 32, skill_set_id: 259 }, // STAAD
      { job_title_id: 32, skill_set_id: 260 }, // ETABS
      { job_title_id: 32, skill_set_id: 261 }, // SAP2000
      { job_title_id: 32, skill_set_id: 40 }, // MATLAB

      // Electrical Engineer
      { job_title_id: 33, skill_set_id: 40 }, // MATLAB
      { job_title_id: 33, skill_set_id: 280 }, // Simulink
      { job_title_id: 33, skill_set_id: 79 }, // AutoCAD
      { job_title_id: 33, skill_set_id: 290 }, // ETAP
      { job_title_id: 33, skill_set_id: 287 }, // PLC
      { job_title_id: 33, skill_set_id: 68 }, // Arduino

      // Mechanical Engineer
      { job_title_id: 34, skill_set_id: 78 }, // SolidWorks
      { job_title_id: 34, skill_set_id: 79 }, // AutoCAD
      { job_title_id: 34, skill_set_id: 277 }, // CATIA
      { job_title_id: 34, skill_set_id: 271 }, // ANSYS
      { job_title_id: 34, skill_set_id: 40 }, // MATLAB
      { job_title_id: 34, skill_set_id: 280 }, // Simulink

      // Electronics Engineer
      { job_title_id: 35, skill_set_id: 68 }, // Arduino
      { job_title_id: 35, skill_set_id: 69 }, // RaspberryPi
      { job_title_id: 35, skill_set_id: 72 }, // Verilog
      { job_title_id: 35, skill_set_id: 80 }, // FPGA
      { job_title_id: 35, skill_set_id: 74 }, // Proteus
      { job_title_id: 35, skill_set_id: 76 }, // KiCad
      { job_title_id: 35, skill_set_id: 77 }, // Altium

      // Architect
      { job_title_id: 36, skill_set_id: 79 }, // AutoCAD
      { job_title_id: 36, skill_set_id: 258 }, // Revit
      { job_title_id: 36, skill_set_id: 262 }, // SketchUp
      { job_title_id: 36, skill_set_id: 144 }, // Rhino
      { job_title_id: 36, skill_set_id: 273 }, // Lumion

      // Teacher
      { job_title_id: 37, skill_set_id: 294 }, // GoogleClassroom
      { job_title_id: 37, skill_set_id: 295 }, // Moodle
      { job_title_id: 37, skill_set_id: 296 }, // Canvas
      { job_title_id: 37, skill_set_id: 154 }, // PowerPoint
      { job_title_id: 37, skill_set_id: 153 }, // Word
      { job_title_id: 37, skill_set_id: 164 }, // Zoom

      // College Instructor
      { job_title_id: 38, skill_set_id: 294 }, // GoogleClassroom
      { job_title_id: 38, skill_set_id: 295 }, // Moodle
      { job_title_id: 38, skill_set_id: 296 }, // Canvas
      { job_title_id: 38, skill_set_id: 154 }, // PowerPoint
      { job_title_id: 38, skill_set_id: 164 }, // Zoom
      { job_title_id: 38, skill_set_id: 298 }, // MicrosoftTeams

      // Training Specialist
      { job_title_id: 39, skill_set_id: 154 }, // PowerPoint
      { job_title_id: 39, skill_set_id: 164 }, // Zoom
      { job_title_id: 39, skill_set_id: 190 }, // GoogleWorkspace
      { job_title_id: 39, skill_set_id: 132 }, // Canva
      { job_title_id: 39, skill_set_id: 300 }, // Kahoot

      // Marketing Specialist
      { job_title_id: 40, skill_set_id: 132 }, // Canva
      { job_title_id: 40, skill_set_id: 159 }, // Mailchimp
      { job_title_id: 40, skill_set_id: 160 }, // GoogleAnalytics
      { job_title_id: 40, skill_set_id: 161 }, // MetaAds
      { job_title_id: 40, skill_set_id: 194 }, // Hootsuite

      // Sales Representative
      { job_title_id: 41, skill_set_id: 202 }, // CRM
      { job_title_id: 41, skill_set_id: 54 }, // Salesforce
      { job_title_id: 41, skill_set_id: 57 }, // Excel
      { job_title_id: 41, skill_set_id: 156 }, // Slack

      // Digital Marketing Specialist
      { job_title_id: 42, skill_set_id: 160 }, // GoogleAnalytics
      { job_title_id: 42, skill_set_id: 161 }, // MetaAds
      { job_title_id: 42, skill_set_id: 159 }, // Mailchimp
      { job_title_id: 42, skill_set_id: 194 }, // Hootsuite
      { job_title_id: 42, skill_set_id: 132 }, // Canva
      { job_title_id: 42, skill_set_id: 193 }, // TikTok
      { job_title_id: 42, skill_set_id: 192 }, // Instagram
      { job_title_id: 42, skill_set_id: 191 }, // Facebook

      // Content Creator
      { job_title_id: 43, skill_set_id: 132 }, // Canva
      { job_title_id: 43, skill_set_id: 127 }, // Premiere
      { job_title_id: 43, skill_set_id: 128 }, // AfterEffects
      { job_title_id: 43, skill_set_id: 148 }, // CapCut
      { job_title_id: 43, skill_set_id: 147 }, // OBS
      { job_title_id: 43, skill_set_id: 192 }, // Instagram
      { job_title_id: 43, skill_set_id: 193 }, // TikTok

      // Hotel Staff
      { job_title_id: 44, skill_set_id: 181 }, // Opera
      { job_title_id: 44, skill_set_id: 180 }, // Fidelio
      { job_title_id: 44, skill_set_id: 182 }, // Micros
      { job_title_id: 44, skill_set_id: 183 }, // POS
      { job_title_id: 44, skill_set_id: 57 }, // Excel

      // Chef
      { job_title_id: 45, skill_set_id: 183 }, // POS
      { job_title_id: 45, skill_set_id: 246 }, // Inventory
      { job_title_id: 45, skill_set_id: 57 }, // Excel

      // Customer Service Representative
      { job_title_id: 46, skill_set_id: 57 }, // Excel
      { job_title_id: 46, skill_set_id: 153 }, // Word
      { job_title_id: 46, skill_set_id: 67 }, // Teams
      { job_title_id: 46, skill_set_id: 156 }, // Slack
      { job_title_id: 46, skill_set_id: 202 }, // CRM

      // Forensic Investigator
      { job_title_id: 47, skill_set_id: 207 }, // AFIS
      { job_title_id: 47, skill_set_id: 216 }, // Fingerprint
      { job_title_id: 47, skill_set_id: 217 }, // Ballistics
      { job_title_id: 47, skill_set_id: 211 }, // Cellebrite
      { job_title_id: 47, skill_set_id: 212 }, // EnCase
      { job_title_id: 47, skill_set_id: 213 }, // FTK
      { job_title_id: 47, skill_set_id: 215 }, // MagnetAXIOM

      // Police Officer
      { job_title_id: 48, skill_set_id: 219 }, // CCTV
      { job_title_id: 48, skill_set_id: 220 }, // GPS
      { job_title_id: 48, skill_set_id: 218 }, // Biometrics
      { job_title_id: 48, skill_set_id: 208 }, // NCIC

      // Crime Scene Investigator
      { job_title_id: 49, skill_set_id: 216 }, // Fingerprint
      { job_title_id: 49, skill_set_id: 217 }, // Ballistics
      { job_title_id: 49, skill_set_id: 214 }, // Autopsy
      { job_title_id: 49, skill_set_id: 219 }, // CCTV
      { job_title_id: 49, skill_set_id: 210 }, // GIS

      // Correctional Officer
      { job_title_id: 50, skill_set_id: 219 }, // CCTV
      { job_title_id: 50, skill_set_id: 218 }, // Biometrics
      { job_title_id: 50, skill_set_id: 220 }, // GPS

      // Customs Officer
      { job_title_id: 51, skill_set_id: 220 }, // GPS
      { job_title_id: 51, skill_set_id: 218 }, // Biometrics
      { job_title_id: 51, skill_set_id: 219 }, // CCTV
      { job_title_id: 51, skill_set_id: 201 }, // ArcGIS

    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Job_title_skills', null, {});
  }
};