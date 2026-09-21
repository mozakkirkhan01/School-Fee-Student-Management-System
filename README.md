# 🏫  School Fee & Student Management System

A web-based **School Fee & Student Management System** developed for **schools** to simplify student administration, fee configuration, installment generation, fee collection, receipt management, outstanding fee tracking, reporting, SMS reminders, and staff access control.

The system provides a centralized platform for managing the complete school fee lifecycle—from student registration and fee setup to payment collection, receipts, ledgers, pending dues, and financial reports.

---

## 📌 Project Overview

The ** School Fee & Student Management System** is designed to reduce manual work involved in maintaining student and fee records.

School administrators can manage:

* Students and parents
* Academic years and sessions
* Classes and sections
* Fee heads and fee structures
* Student fee installments
* Fee collection
* Discounts and fines
* Payment modes
* Fee receipts
* Pending dues
* Student ledgers
* Monthly and daily collections
* Fee reminder SMS
* Staff accounts
* Roles and permissions

The application follows a role-based administration structure so different staff members can be provided access according to their responsibilities.

---

# ✨ Features

## 👨‍🎓 Student Management

Manage complete student information from a centralized student master.

Features include:

* Add new students
* Update student information
* Delete/manage student records
* Admission number management
* Academic session mapping
* Class assignment
* Section assignment
* Gender information
* Blood group
* Student status
* Class-wise filtering
* Section-wise filtering
* Student search

Sections are dynamically filtered according to the selected class.

---

## 👨‍👩‍👧 Parent Management

Maintain parent/guardian information associated with students.

Features include:

* Parent registration
* Parent information management
* Student-parent association
* Retrieve parent information by student
* Update parent details

---

## 🎓 Academic Management

The system provides academic masters required for student and fee management.

### Academic Year

Create and manage different academic years.

### Session Management

Manage school academic sessions.

### Class Management

Create and maintain school classes.

### Section Management

Create sections and associate them with appropriate classes.

---

# 💰 Fee Management

Fee management is the core module of the application.

## Fee Head

Administrators can define different categories of school fees.

Examples may include:

* Tuition Fee
* Admission Fee
* Examination Fee
* Annual Fee
* Development Fee
* Other school charges

---

## Fee Structure

Configure fee structures according to academic requirements.

Fee structures can be associated with:

* Academic Year
* Class
* Fee Head
* Amount
* Due date/day
* Late fee applicability
* Status

This allows different classes and academic years to maintain independent fee structures.

---

## 📅 Fee Installment Generation

The system provides installment generation for student fees.

Administrators can generate fee installments based on the configured fee structure.

This helps maintain individual student dues and allows payments to be tracked against specific installments.

---

# 💳 Fee Collection

The **Collect Fee** module provides the main payment workflow.

### Fee Collection Process

1. Search for a student.
2. Select the required student.
3. Load pending fee installments.
4. Select one or multiple installments.
5. Calculate the outstanding amount.
6. Apply discount when applicable.
7. Apply fine when applicable.
8. Select payment mode.
9. Enter transaction reference/remarks.
10. Save the payment.
11. Generate a receipt number.

### Payment Calculation

```text
Pending Fee Amount
        -
Discount Amount
        +
Fine Amount
        =
Net Payable Amount
```

The system automatically refreshes the student's remaining pending fees after successful payment.

---

# 🧾 Fee Receipt Management

Every successful fee payment can be associated with a receipt.

Features include:

* Receipt number
* Student information
* Payment information
* Fee installment details
* Discount information
* Fine information
* Payment mode
* Transaction details
* Receipt search
* Date-wise receipt filtering
* Receipt viewing
* Printable fee receipt

---

# 📖 Student Ledger

The Student Ledger provides a consolidated view of an individual student's fee activity.

It can be used to review:

* Fee installments
* Amount payable
* Payments
* Discounts
* Fines
* Outstanding dues
* Student fee history

This helps administrators quickly understand a student's financial position.

---

# 📊 Fee Reports

The system contains reporting modules for monitoring school fee collections.

## Pending Fee Report

View students with outstanding fees and pending installments.

## Daily Collection Report

Monitor fee collections for a selected day/date range.

## Monthly Collection Report

Analyze fee collection on a monthly basis.

These reports help school administrators track collections and outstanding amounts.

---

# 📱 Fee Reminder & SMS Management

The system contains functionality for sending and tracking fee reminders.

### SMS Template

Create and maintain reusable SMS templates.

### Fee Reminder SMS

Identify students with outstanding fees and queue fee reminder messages.

### SMS Logs

Maintain SMS communication history for monitoring reminder activity.

---

# 💵 Payment Mode Management

Administrators can configure supported payment modes.

Examples:

* Cash
* UPI
* Bank Transfer
* Card
* Cheque
* Other payment methods

Transaction references can also be recorded during fee collection.

---

# 👨‍💼 Staff Management

Maintain school staff records and administrative users.

Modules include:

* Staff
* Department
* Designation
* Staff Login
* Change Password

---

# 🔐 Role-Based Access Control

The application contains a configurable authorization system.

Administrative modules include:

* Role
* Menu
* Page
* Page Group
* Role Menu
* Staff Login

Permissions can be assigned according to staff roles.

Individual screens validate the logged-in user's menu permissions before allowing actions.

This allows administrators to control operations such as:

* View
* Add
* Update
* Delete

according to the user's assigned permissions.

---

# 🏢 Other Master Modules

The application also contains supporting master-data modules such as:

* Company
* State
* City
* Department
* Designation
* Payment Mode

---

# 🛠️ Technology Stack

## Frontend

* Angular 16
* TypeScript
* HTML5
* CSS3
* Bootstrap
* Angular Material
* PrimeNG
* PrimeFlex
* RxJS
* ngx-toastr
* ngx-pagination
* jQuery

## Utilities

* CryptoJS
* PDFMake
* XLSX
* FileSaver
* JSBarcode
* BWIP-JS

## Backend Integration

The frontend communicates with REST APIs following an ASP.NET Web API-style architecture.

API communication is centralized through Angular services.

---

# 🔄 Application Architecture

The application generally follows the following communication flow:

```text
Angular Component
        ↓
AppService
        ↓
Encrypted RequestModel
        ↓
REST API
        ↓
Business Logic
        ↓
Database
```

Request payloads are encrypted before being sent to the API.

Example:

```typescript
const obj: RequestModel = {
  request: this.localService.encrypt(
    JSON.stringify(payload)
  ).toString()
};

this.service.someApi(obj).subscribe(response => {
  // Handle API response
});
```

An application key is also passed through HTTP headers for API communication.

---

# 🔌 Major API Groups

The frontend integrates with API groups including:

```text
AcademicYear
ClassMaster
SectionMaster
SessionMaster

Student
Parent

FeeHead
FeeStructure
FeeInstallment
FeePayment
FeeReceipt
FeeReport

PaymentMode

SmsTemplate
Sms

Staff
StaffLogin
Department
Designation

Role
RoleMenu
Menu
Page
PageGroup

Company
State
City
```

---

# 📂 Major Frontend Modules

```text
src/app/admin/

├── academic-year
├── admin-dashboard
├── admin-login
├── admin-master
├── change-password
├── city
├── class-master
├── collect-fee
├── company
├── department
├── designation
├── fee-head
├── fee-receipt
├── fee-reminder-sms
├── fee-structure
├── generate-installment
├── menu
├── monthly-collection-report
├── page
├── page-group
├── parent
├── payment-mode
├── pending-fee-report
├── role
├── role-menu
├── section-master
├── session-master
├── sms-log
├── sms-template
├── staff
├── staff-login
├── state
├── student
└── student-ledger
```

---

# 🚀 Getting Started

## Prerequisites

Install:

* Node.js
* npm
* Angular CLI

Check your installed versions:

```bash
node --version
npm --version
ng version
```

---

## Clone the Repository

```bash
git clone https://github.com/mozakkirkhan01/School-Fee-Student-Management-System.git
```

Navigate to the project:

```bash
cd School-Fee-Student-Management-System
```

Install dependencies:

```bash
npm install
```

Start the Angular development server:

```bash
ng serve
```

Open:

```text
http://localhost:4200/
```

The application will automatically reload when source files are modified.

---

# 🔒 Security

The application implements:

* Staff authentication
* Role-based authorization
* Menu-level permissions
* Application-key-based API communication
* Encrypted request payloads
* Protected administrative functionality

> **Important:** Client-side encryption and application keys should complement, not replace, HTTPS, secure server-side authentication, authorization, input validation, and proper secret management.

---

# 🎯 Purpose

This project was developed to digitize and simplify **school's student fee administration process**.

The primary goals are to:

* Reduce manual fee records
* Improve payment tracking
* Quickly identify outstanding fees
* Maintain accurate student ledgers
* Generate fee receipts
* Improve financial reporting
* Automate fee reminders
* Centralize student information
* Control staff access through roles and permissions

---

# 🔮 Future Enhancements

Potential enhancements include:

* Advanced dashboard with fee analytics
* Student admission workflow
* Student promotion between academic sessions
* Scholarship and concession management
* Sibling discounts
* Automated late-fee calculation
* Transport fee management
* Fee refunds and payment cancellation
* Receipt cancellation with audit trail
* WhatsApp fee reminders
* Parent portal
* Student portal
* Online fee payment gateway
* UPI/QR payments
* Automated payment reconciliation
* Excel/PDF report exports
* Advanced defaulter analytics
* Audit logs
* Notification system
* Mobile-friendly dashboard
* Multi-school/multi-branch support

---

# 👨‍💻 Developer

**Md Mozakkir Khan**

Full Stack Developer

Primary technologies:

* Angular
* TypeScript
* C#
* ASP.NET Web API
* SQL Server
* Entity Framework / LINQ

---

## 📄 Project Status

**Active Development**

The system currently provides the core functionality required for student administration and school fee management, with additional ERP modules planned for future versions.

---

## ⭐ About This Repository

This repository contains the frontend source code for the ** School Fee & Student Management System**.

It demonstrates the implementation of a practical school administration application covering student management, fee configuration, installment generation, payment collection, receipts, outstanding fee tracking, reporting, SMS reminders, and role-based administration.
