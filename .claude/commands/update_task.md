<instructions_for_update_task>
    0.  <planning_step>First, parse `action_args` to identify `TASK-ID`, `field_to_update`, and `new_value`. Example: `TASK-001 status In Progress`. If insufficient, ask for clarification and stop if not provided.
        Propose plan: "I will update task `TASK-ID`.
        1. Locate the task file for `TASK-ID` in `./.claude/tasks/{active,backlog,completed}/`.
        2. Read its content.
        3. Propose specific textual changes to update `field_to_update` to `new_value` and the 'Updated:' date.
        4. If 'Status' changes, I will also propose moving the file to the correct status directory.
        5. Confirm all changes before applying.
        Shall I proceed with this plan? (y/n)". If 'n', stop.</planning_step>
    1.  <locate_task_file>On 'y' for plan: Determine and state the full path of `TASK-ID.md` by checking `./.claude/tasks/active/`, then `./.claude/tasks/backlog/`, then `./.claude/tasks/completed/`. Let this be `LocatedTaskFilePath`. If not found, report "Error: Task `TASK-ID` not found in any status directory." and stop.</locate_task_file>
    2.  <file_edit_proposal>Read the content of `LocatedTaskFilePath`.
        If `field_to_update` refers to a multi-line section (e.g., "Description", "Notes", "Acceptance Criteria"), first ask the user: "For the '{field_to_update}' section, do you want to (replace) the existing content with the new value, or (append) the new value to the existing content? (replace/append)". Stop if clarification is not provided.
        Based on this clarification (if applicable), propose the specific textual changes to update `field_to_update` to `new_value` and also update the `**Updated:**` field to the current date. Show original and new lines clearly.</file_edit_proposal>
    3.  <confirmation_edit>Ask: "Shall I apply these textual changes to `LocatedTaskFilePath` using my file editing tool? (y/n)".</confirmation_edit>
    4.  <execution_edit>Upon 'y', instruct your file editing tool to apply changes. Report success or failure. If failure, ask 'stop/retry/ignore' and potentially stop further update steps.</execution_edit>
    5.  <status_change_handling>If `field_to_update` was 'Status' AND the edit was successful:
        a.  Normalize the `new_value` for the status to lowercase (e.g., "In Progress" becomes "in progress"). Let this be `NormalizedStatusValue`. Determine the old status directory (e.g., `OldStatusDir = ./.claude/tasks/backlog/`) and the new status directory based on `NormalizedStatusValue` (e.g., if `NormalizedStatusValue` is "active" or "in progress", `NewStatusDir = ./.claude/tasks/active/`; if "backlog", `NewStatusDir = ./.claude/tasks/backlog/`; if "completed", `NewStatusDir = ./.claude/tasks/completed/`). Ensure mapping covers all expected status values to directory names.
        b.  If `OldStatusDir` is different from `NewStatusDir`:
            i.  Propose: "The status has changed. Shall I move the task file from `OldStatusDir` to `NewStatusDir/{TASK-ID}.md` using my bash tool (`mv OldPath NewPath`)? (y/n)".
            ii. Upon 'y', Run `mv LocatedTaskFilePath NewStatusDir/{TASK-ID}.md` using your bash tool. Report success or failure of the move. If `mv` fails, report error (PM system might be in an inconsistent state with file content changed but not moved).
        </status_change_handling>
    6.  <post_action>If the update impacts current focus (e.g., task became active, or active task was completed/moved from active), suggest updating `./.claude/memory/active_context.md` accordingly. Present proposed changes to `active_context.md` and seek confirmation before editing with file editing tool.</post_action>
    7.  <o>Report: "Task `TASK-ID` update process concluded." (Summarize success/failures of edit and move if applicable).</o>
</instructions_for_update_task>
