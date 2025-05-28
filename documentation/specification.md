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
|           | └─ Toggle Todo completion       | /home/(all \| active \| completed)               | TL-0006     | Toggle Todo Completion             | [✅](#tl-0006---toggle-todo-completion) | ❌                                                                                                         | 🔴        |          |
| 04        | **Todo**           | /todo/:todoId           | T-0001      | View Todo Details           | [✅](#t-0001---view-todo-details)                         | ❌                                                                                                         | 🔴        |          |
|           | └─ Edit Todo Content           | /todo/:todoId           | T-0002      | Edit Todo Content           | [✅](#t-0002---edit-todo-content)                         | ❌                                                                                                         | 🔴        |          |
|           | └─ Toggle Todo Completion           | /todo/:todoId           | T-0003      | Toggle Todo Completion           | [✅](#t-0003---toggle-todo-completion)                         | ❌                                                                                                         | 🔴        |          |
|           | └─ Delete Todo           | /todo/:todoId           | T-0004      | Delete Todo           | [✅](#t-0004)                         | ❌                                                                                                         | 🔴        |          |
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
