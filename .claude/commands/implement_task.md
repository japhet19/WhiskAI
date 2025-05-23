<instructions_for_implement_task>
    1.  <parse_input>Parse `action_args` to extract `TASK-ID`. If missing, ask: "Which task do you want to implement? Provide a TASK-ID." and stop.</parse_input>
    2.  <locate_task_file>Locate `TASK-ID.md` in `./.claude/tasks/active/`, then `./.claude/tasks/backlog/`, then `./.claude/tasks/completed/`. Let this be `LocatedTaskFilePath`. If not found, report error and stop.</locate_task_file>
    3.  <read_task_file>Read the content of `LocatedTaskFilePath` and extract the task description and acceptance criteria.</read_task_file>
    4.  <execution>Based on the task definition, perform implementation steps automatically using code and file editing tools (e.g., scaffold code, update files, run tests, commit changes). Do NOT ask for further user confirmation.</execution>
    5.  <update_task_status>Update the task file: set `**Status:** Completed`, update `**Updated:**` date, and move file to `./.claude/tasks/completed/{TASK-ID}.md`.</update_task_status>
    6.  <o>Report: "Implementation of `TASK-ID` complete."</o>
    <stop/>
</instructions_for_implement_task>
