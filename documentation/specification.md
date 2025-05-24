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

| Serial No | Pages              | Related Path (Page URL) | Unique Code | Functionality Name      | Documentation              | Automated Test                                                                                             | Criticity | Comments |
| --------- | ------------------ | ----------------------- | ----------- | ----------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- | --------- | -------- |
| 01        | **Auth**           | —                       | A-0000      | User Authentication     | ❌                         | ❌                                                                                                         | 🟢        |          |
|           | └─ Register        | /auth/signup            | A-0001      | User Registration       | ❌                         | ❌                                                                                                         | 🟢        |          |
|           | └─ Login           | /auth/login             | A-0002      | User Login              | ❌                         | ❌                                                                                                         | 🟢        |          |
| 03        | **Todo List**      | —                       | TL-0000     | Display Todo List       | ❌                         | ❌                                                                                                         | 🔴        |          |
|           | └─ All Todos       | /home/all               | TL-0001     | Display All Todos       | ❌                         | ❌                                                                                                         | 🔴        |          |
|           | └─ Active Todos    | /home/active            | TL-0002     | Display Active Todos    | ❌                         | ❌                                                                                                         | 🔴        |          |
|           | └─ Completed Todos | /home/completed         | TL-0003     | Display Completed Todos | ❌                         | ❌                                                                                                         | 🔴        |          |
|           | └─ Add Todo        | /home/(all \| active \| completed)               | TL-0004     | Add new Todo            | [✅](#tl-0004---add-todo)  | [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/03_TL/03_TL-0004-add-todo.spec.ts) | 🔴        |          |
|           | └─ Edit Todo       | /home/(all \| active \| completed)               | TL-0005     | Edit a Todo             | [✅](#tl-0005---edit-todo) | ❌                                                                                                         | 🔴        |          |
| 04        | **Todo**           | /todo/:todoId           | T-0001      | View Todo Details           | [✅](#t-0001---view-todo-details)                         | ❌                                                                                                         | 🟠        |          |
| 05        | **Not Found**      | /\*                     | NF-0001     | Page Not Found          | ❌                         | ❌                                                                                                         | 🟢        |          |

Note: All the paths will follow the **BaseURL**:

- **Local environment:** http://locahost:4200
- **Production (GitHub Pages):** https://idembele70.github.io/todo-angular-seventeen/

## Use cases

### Todo List

#### TL-0004 - Add Todo

##### Quick Description:

- The application should allow the user to add a new todo item using the input field.

##### Preconditions:

- The user is on the Todo List page (`/home/(all| active|completed)`).
- The input field is empty.
- The 'Add' button is initially disabled.

##### Nominal Process:

1. Type a valid todo text into the input field.
2. Click the `Add` button.
3. Observe that the new todo appears in the list below.

##### Alternative Flows:

- Instead of clicking the `Add` button, the user may press the `Enter` key to add the todo.

#### TL-0005 - Edit Todo

##### Quick Description:

- The application should allow the user to edit the content of a todo by double-clicking on it.

##### Preconditions:

- The user is on the Todo List page (`/home/(all| active|completed)`).
- At least one todo row exists in the list.

##### Nominal Process:

1. Double-click on the content of a todo item.
2. The todo row switches to edit mode:
   - The checkbox and delete button are hidden.
   - An editable text input with the content as default value appears.
3. Type the new content into the editable field.
4. The user confirms by either:
   - Pressing the `Enter` key, or
   - Clicking outside the input field (blur event).
5. The updated content is saved, and the todo exits edit mode.

##### Alternative Flows:

- **Enter Edit Mode via Keyboard**
  - The user navigates to the label using Tab, then Presses the `E` key to enter edit mode.

- **Empty Input on Confirm**
  - If the user confirms with an empty input:
    - The todo item is deleted from the list.

#### Postconditions:

- If the todo was updated:
   - The editable field disappears.
   - The checkbox & delete button become visible again.
   - The todo displays the updated content.
- If the todo was deleted:
   - The item no longer appears in the list.

---

### Todo

#### T-0001 - View Todo Details

##### Quick Description:

- The application must allow the user to view detailed information about a specific todo item.

##### Preconditions:

- The user is currently on the Todo List page (`/home/(all| active|completed)`).
- At least one todo item is present in the list.

##### Nominal Process:

1. The user clicks on the content of a todo.
2. The application navigates to the corresponding Todo Details page: (`/todo/:id`).

##### Alternative Flows:

- None.

#### Postconditions:

- The following information is displayed on the Todo Details page:
  - The **content** of the todo.
  - The **ID** of the todo.
  - The **status** (e.g., active, completed).
  - A **checkbox** to toggle completion.
  - A **delete** button to remove the todo.

---

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
