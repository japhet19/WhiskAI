<instructions_for_set_active_task>
    1.  <parse_input>Parse `action_args` for `TASK-ID`. If missing, report "Error: TASK-ID not provided for set_active_task." and stop.</parse_input>
    2.  <locate_task_file_plan>Propose plan: "I will:
        a. Locate `TASK-ID.md` in `./.claude/tasks/{active,backlog}/`.
        b. If found in backlog, ask to move to active status and directory.
        c. Read task title.
        d. Propose updating `./.claude/memory/active_context.md` to set focus.
        Shall I proceed? (y/n)". If 'n', stop.</locate_task_file_plan>
    3.  <locate_task_file_execution>On 'y' for plan: Verify `TASK-ID.md` exists. Check first in `./.claude/tasks/active/`, then `./.claude/tasks/backlog/`. Let `LocatedTaskFilePath` be its path.
        If not found, report "Error: Task `{TASK-ID}` not found in active or backlog tasks." and stop.
        If in `./.claude/tasks/backlog/`: Ask, "Task `{TASK-ID}` is in backlog. To set it as active focus, its status must be 'Active' and it must be in the active tasks directory. Shall I update its status and move it? (y/n)".
        If 'y':
            i.   <read_task_for_status_update>Read the content of `LocatedTaskFilePath` (the task file in backlog). Propose textual changes to update `**Status:**` to `**Status:** Active` and also update the `**Updated:**` field to the current date. Show original and new lines clearly.</read_task_for_status_update>
            ii.  <confirm_status_text_edit>Ask: "Shall I apply these status and date changes to `LocatedTaskFilePath` using my file editing tool? (y/n)".</confirm_status_text_edit>
            iii. <execute_status_text_edit>Upon 'y' for text edit: Instruct your file editing tool to apply changes. If failure, report error, ask 'stop/retry/ignore', and if not retrying successfully, stop `set_active_task`.</execute_status_text_edit>
            iv.  <propose_file_move>If textual edit was successful: Let `OldStatusDir` be the directory of `LocatedTaskFilePath` (e.g., `./.claude/tasks/backlog/`) and `NewStatusDir` be `./.claude/tasks/active/`. Propose: "Shall I move the task file from `OldStatusDir` to `NewStatusDir/{TASK-ID}.md` using my bash tool (`mv OldPath NewPath`)? (y/n)".</propose_file_move>
            v.   <execute_file_move>Upon 'y' for move: Run `mv LocatedTaskFilePath NewStatusDir/{TASK-ID}.md` using your bash tool. Report success or failure. If `mv` fails, report error (task file content changed but not moved, PM system might be inconsistent) and stop `set_active_task`.
            vi.  If move is successful, update `LocatedTaskFilePath` to point to the new path in the active directory for subsequent steps.
        If 'n': Report "Task `{TASK-ID}` cannot be set as active focus while in backlog without changing status." and stop.
        Let `FinalTaskPath` be the path to the task file (it should be in `./.claude/tasks/active/` now).
        </locate_task_file_execution>
    4.  <read_task_details>Read content of `FinalTaskPath`. Extract task description/title (line starting `# Task:`).</read_task_details>
    5.  <file_edit_proposal>Propose updating `./.claude/memory/active_context.md` with the following changes:
        - Change line `## Current Focus:` to `## Current Focus: Working on {TASK-ID} - [Task Description]`
        - Change line `## Active Task ID:` to `## Active Task ID: {TASK-ID}`
        Show all proposed changes clearly.</file_edit_proposal>
    6.  <confirmation>Ask: "Shall I apply this change to `./.claude/memory/active_context.md` using my file editing tool? (y/n)".</confirmation>
    7.  <execution>Upon 'y', instruct file editing tool to apply changes. Report success/failure.</execution>
    8.  <o>Report: "Active context updated. Current focus: `{TASK-ID}`." (Adjust if update failed).</o>
</instructions_for_set_active_task>
