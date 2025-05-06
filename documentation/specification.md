# Todo Angular Seventeenth Specification

## Description:

A todo app inspired by **TodoMVC**, built using Angular, Typescript, RxJS and Bootstrap. This app allows users to:

- Register and log in
- Create, complete, delete tasks
- Manage their personal todo list in a reactive and user-friendly interface

## Target Audience:

This application is designed for anyone looking to efficiently organize their tasks, from students managing assignments to professionals tracking work-related to-dos.

## Goals:

To provide a simple, intuitive, and user-friendly platform for managing daily tasks.
The app aims to enhance personal productivity and organization through a clean interface and responsive experience.

## Glossary:

| Symbol | Meaning             | Additional Context                   |
| ------ | ------------------- | ------------------------------------ |
| ✅     | Done                | Task is completed successfully.      |
| ❌     | Undone              | Task is not yet completed.           |
| 🟢     | Priority 3 - Low    | Feature used occasionally (monthly). |
| 🟠     | Priority 2 - Medium | Feature used regularly (weekly).     |
| 🔴     | Priority 1 - High   | Feature used frequently (daily).     |

## Use Case Overview

| Serial No | Pages              | Related Path (Page URL) | Unique Code | Functionality Name      | Documentation | Automated Test | Criticity | Comments |
| --------- | ------------------ | ----------------------- | ----------- | ----------------------- | ------------- | -------------- | --------- | -------- |
| 01        | **Auth**           | —                       | A-0000      | User Authentication     | ❌            | ❌             | 🟢        |          |
|           | └─ Register        | /auth/signup            | A-0001      | User Registration       | ❌            | ❌             | 🟢        |          |
|           | └─ Login           | /auth/login             | A-0002      | User Login              | ❌            | ❌             | 🟢        |          |
| 03        | **Todo List**      | —                       | TL-0000     | Display Todo List       | ❌            | ❌             | 🔴        |          |
|           | └─ All Todos       | /#/all                  | TL-0001     | Display All Todos       | ❌            | ❌             | 🔴        |          |
|           | └─ Active Todos    | /#/active               | TL-0002     | Display Active Todos    | ❌            | ❌             | 🔴        |          |
|           | └─ Completed Todos | /#/completed            | TL-0003     | Display Completed Todos | ❌            | ❌             | 🔴        |          |
| 04        | **Todo**           | /todo/:todoId           | T-0001      | Manage a Todo           | ❌            | ❌             | 🟠        |          |
| 05        | **Not Found**      | /\*                     | NF-0001     | Page Not Found          | ❌            | ❌             | 🟢        |          |

Note: All the paths will follow the **BaseURL**:

- **Local environment:** http://locahost:4200
- **Production (GitHub Pages):** https://idembele70.github.io/todo-angular-seventeen/

## Use cases

### [Page Name]

#### [Unique Code] - [Use case Title]

##### Quick Description:

- [Briefly describe the purpose of this use case.]

##### Preconditions:

- [List any conditions that must be met before executing this use case.]

##### Nominal Process:

1. Navigate to `[Page URL]`.
2. [ Describe step-by-step user actions.]
3. Expected outcome or system response.

##### Alternative Flows:

- [Describe any variations or error handling flows.]

#### Postconditions:

- [What should be true after the process is completed?]

---
