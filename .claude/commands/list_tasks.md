<instructions_for_list_tasks>
    1.  <parse_input>Parse `action_args` for an optional status filter (e.g., 'active', 'backlog', 'completed', or 'all'). Default to 'all' if no filter or invalid filter provided. Let this be `StatusFilter`.</parse_input>
    2.  <build_command_plan>Propose plan: "I will list tasks by:
        a. Determining target directories: `DirPattern` based on `StatusFilter` (e.g., `./.claude/tasks/active/` for 'active', or `./.claude/tasks/{active,backlog,completed}/` for 'all').
        b. Running `grep -H -E '^# Task:|^**Status:**|^**ID:**' DirPattern/TASK-*.md` to get filename, ID, title, and status for each task. (Note: This grep needs refinement to correctly parse and associate ID/Title/Status per file if they are not on consecutive lines or in a specific order. A safer method might be to `ls` the files then read each one.)
        c. Alternatively, I will run `ls DirPattern/TASK-*.md` and then for each file, read its content to extract ID, Title, and Status.
        I will proceed with the `ls` then read-each-file approach for reliability. Shall I proceed? (y/n)". If 'n', stop.</build_command_plan>
    3.  <execution_list>On 'y' for plan:
        a.  Determine target directory/directories based on `StatusFilter`.
        b.  Run `ls [target_directories]/TASK-*.md` using your bash tool. Capture the list of filenames.
        c.  If `ls` fails or returns no files, report "No tasks found for filter: `{StatusFilter}`." and stop.
        d.  Initialize an empty list for output. For each task file found:
            i.  Read its content using your file reading tool.
            ii. Extract the Task ID (from `**ID:** TASK-XXX`), Status (from `**Status:** YYY`), and Title (first line: `# Task: ZZZ`).
            iii.Add to your list: `TASK-ID | Status | Title`.
        e.  Present the formatted list. If list is empty after processing, state "No tasks found or could not read details for filter: `{StatusFilter}`."
        </execution_list>
</instructions_for_list_tasks>
