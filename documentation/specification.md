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
| 01        | **Auth**           | —                       | —      | —     | —                         | —                                                                                                         | —        |          |
|           | └─ Register        | /auth/signup            | A-0001      | User Registration       | ❌                         | ❌                                                                                                         | 🟢        |          |
|           | └─ Login           | /auth/login             | A-0002      | User Login              | ❌                         | ❌                                                                                                         | 🟢        |          |
| 02        | **Todo List**      | —                       | —     | —       | —                         | —                                                                                                         | —        |          |
|           | └─ All Todos       | /home/all               | TL-0001     | Display All Todos       | [✅](#tl-0001---all-todos)                         | [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/02_TL/02_TL-0001-all-todos.spec.ts)                                                                                                         | 🔴        |          |
|           | └─ Active Todos    | /home/active            | TL-0002     | Display Active Todos    | [✅](#tl-0002---active-todos)                         | [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/02_TL/02_TL-0002-active-todos.spec.ts)                                                                                                         | 🟠        |          |
|           | └─ Completed Todos | /home/completed         | TL-0003     | Display Completed Todos | [✅](#tl-0003---completed-todos)                         | [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/02_TL/02_TL-0003-completed-todos.spec.ts)                                                                                                         | 🟠        |          |
|           | └─ Add Todo        | /home/(all \| active \| completed)               | TL-0004     | Add new Todo            | [✅](#tl-0004---add-todo)  | [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/02_TL/02_TL-0004-add-todo.spec.ts) | 🔴        |          |
|           | └─ Edit Todo       | /home/(all \| active \| completed)               | TL-0005     | Edit a Todo             | [✅](#tl-0005---edit-todo) | [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/02_TL/02_TL-0005-edit-todo.spec.ts)                                                                                                         | 🔴        |          |
|           | └─ Toggle Todo completion       | /home/(all \| active \| completed)               | TL-0006     | Toggle Todo Completion             | [✅](#tl-0006---toggle-todo-completion) | [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/02_TL/02_TL-0006-toggle-todo-completion.spec.ts)                                                                                                         | 🔴        |          |
|           | └─ Delete Todo Item       | /home/(all \| active \| completed)               | TL-0007     | Delete Todo Item             | [✅](#tl-0007---delete-todo-item) |   [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/02_TL/02_TL-0007-delete-todo-item.spec.ts)| 🔴        |          |
| 03        | **Todo**           | —           | —      | —           | —                         | —                                                                                                         | —        |          |
|         | └─ Todo Details           | /todo/:todoId           | T-0001      | View Todo Details           | [✅](#t-0001---view-todo-details)                         | [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/03_T/03_T-0001-view-todo-details.spec.ts)                                                                                                         | 🟢        |          |
|           | └─ Edit Todo Content           | /todo/:todoId           | T-0002      | Edit Todo Content           | [✅](#t-0002---edit-todo-content)                         | ❌                                                                                                         | 🟢        |          |
|           | └─ Toggle Todo Completion           | /todo/:todoId           | T-0003      | Toggle Todo Completion           | [✅](#t-0003---toggle-todo-completion)                         | ❌                                                                                                         | 🟢        |          |
|           | └─ Delete Todo           | /todo/:todoId           | T-0004      | Delete Todo           | [✅](#t-0004---delete-todo)                         | [✅](https://github.com/idembele70/todo-angular-seventeen/blob/main/e2e/03_T/03_T-0004-delete-todo.spec.ts)                                                      | 🟢        |          |
| 04        | **Not Found**      | /\*                     | NF-0000     | Not Found View          | [✅](#nf-0000---not-found-view)                         | ❌                                                                                                         | 🟢        |          |

Note: All the paths will follow the **BaseURL**:

- **Local environment:** http://localhost:4200/todo-angular-seventeen/
- **Production (GitHub Pages):** https://idembele70.github.io/todo-angular-seventeen/

## Use cases

### Todo List

#### TL-0001 - All Todos

##### Quick Description:

- The application must allow the user to view to all todos.

##### Preconditions:

- The user is on the Todo List page (`/home/all`).

##### Nominal Process:

- None.

##### Alternative Flows:

- None.

##### Postconditions:

-  The **All Todos** page displays all todo items.

#### TL-0002 - Active Todos

##### Quick Description:

- The application must allow the user to view only todos that have not been marked as completed.

##### Preconditions:

- The user is on the Todo List page (`/home/all`).

##### Nominal Process:

1. The user navigates to the Active Todos page (`/home/active`).

##### Alternative Flows:

- None.

##### Postconditions:

-  The **Active Todos** page displays only todo items that have not been marked as completed.

#### TL-0003 - Completed Todos

##### Quick Description:

- The application must allow the user to view only todos that have been marked as completed.

##### Preconditions:

- The user is on the Todo List page (`/home/completed`).

##### Nominal Process:

1. The user navigates to the Completed Todos page (`/home/completed`).

##### Alternative Flows:

- None.

##### Postconditions:

-  The **Completed Todos** page displays only todo items that have been marked as completed.

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

##### Alternative Flows:

- Instead of clicking the `Add` button, the user may press the `Enter` key to add the todo.

##### Postconditions:

- The input field cleared after the todo is added.
- The `Add` button becomes disabled.
- The new todo appears in the list below.

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

##### Postconditions:

- If the todo was updated:
   - The editable field disappears.
   - The checkbox & delete button become visible again.
   - The todo displays the updated content.
- If the todo was deleted:
   - The item no longer appears in the list.

#### TL-0006 - Toggle Todo Completion

##### Quick Description:

- The application should allow the user to toggle a todo item's completion status.

##### Preconditions:

- The user is on the Todo List page (`/home/(all| active|completed)`).
- At least one todo row exists in the list.

##### Nominal Process:

1. The user clicks the checkbox of a todo item.

##### Alternative Flows:

- None.

##### Postconditions:

   - The UI reflects the updated completion state of the todo item:
      - **If todo is completed:**
         - The **checkbox** is checked.
         - The **content** is displayed with a **strikethrough** effect.
      - **If the todo is incomplete:**
         - The **checkbox** is unchecked.
         - The **content** appears without **strikethrough**.

#### TL-0007 - Delete Todo Item

##### Quick Description:

- The application should allow the user to delete a todo item from the list.

##### Preconditions:

- The user is on the Todo List page (`/home/(all | active | completed)`).
- At least one todo item is displayed.

##### Nominal Process:

1. The user hovers over the todo item row.
2. The close button becomes visible.
3. The user clicks the close button.

##### Alternative Flows:

- None.

##### Postconditions:

- The selected todo item is removed from the list.

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

##### Postconditions:

- The **Todo Details** page displays the following information and controls:
   - **Todo Information:**
      - **ID** of the todo.
      - **Content** of the todo.
      - **Status** of the todo (e.g., "done", "not done").
      - **Creation date** of the todo.
      - **Last update date** of the todo.
   - **Actions**:
      - An **input field** pre-filled with the content, followed by a **"Save"** button.
  - A **button** to toggle completion status.
  - A **"Delete"** button to remove the todo.

#### T-0002 - Edit Todo content

##### Quick Description:

- The application should allow the user to edit the content of a todo item.

##### Preconditions:

- The user is on todo detail page (`/todo/:id`)

##### Nominal Process:

1. Modify the content by typing into the input field.
2. The new content is confirmed by one of the following actions:
   - Pressing `Enter` key
   - Clicking outside the input field (blur event).
   - Clicking the save button.
3. The updated content is saved.

##### Alternative Flows:

- **Empty Input on Confirm**
   - If the user confirms with and empty input:
      - The todo item is deleted.
      - The user is redirected to the Todo List page (`/home/all`)

##### Postconditions:

- The following fields of the todo item are updated:
   -  **Content** — the modified text.
   -  **Updated time** — reflects the last modification time.

#### T-0003 - Toggle Todo Completion

##### Quick Description:

- The application should allow the user to toggle completion status of a todo item (mark it as completed or not completed).

##### Preconditions:

- The user is on Todo Detail Page (`/todo/:id`)

##### Nominal Process:

1. If the Todo is **incomplete**:
   - The users clicks the the button labeled "**Completed**".
2. If the Todo is **complete**:
   - The user clicks the button labelled "**Incomplete**".

##### Alternative Flows:

- None.

##### Postconditions:

- The UI reflects the updated completion status:
   - **Updated time** — reflects the last modification time.
   - If the todo becomes **completed**:
      - A Paragraph displays the text: "**This todo is done**"
      - The button label changes to "**Incomplete**"
   - If the todo becomes **incomplete**:
      - A paragraph displays the text: "**This done is not done**"
      - The button label changes to "**Complete**"

#### T-0004 - Delete Todo

##### Quick Description:

- The application should allow the user to delete a todo item.

##### Preconditions:

- The user is on Todo Detail Page (`/todo/:id`)

##### Nominal Process:

1. The user clicks on the button labeled `Delete`.

##### Alternative Flows:

- None.

##### Postconditions:

- The todo item is deleted.
- The user is redirected to the Todo List page `/home/all`

---

### Not Found

#### NF-0000 - Not Found View

##### Quick Description:

- The application should display a Not Found page when the user navigates to an unknown route.

##### Preconditions:

- The user is navigating through the application or manually entering a URL in the browser's address bar.

##### Nominal Process:

1. The user enters a non-existent route in the browser's address bar.

##### Alternative Flows:

- None.

##### Postconditions:

- The user is redirected to the dedicated Not Found page (`/not-found`).
- The user sees the message: "Page not found".

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

##### Postconditions:

- [What should be true after the process is completed?]

---
