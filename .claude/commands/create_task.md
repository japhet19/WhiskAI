<instructions_for_create_task>
    <!-- Create a new task file in ./.claude/tasks/backlog/ -->
    1.  <parse_input>Parse `action_args` as the task description. If empty, ask: "What is the description for this new task?" and stop if not provided. Let's call this `TaskDescription`.</parse_input>
    2.  <id_generation_plan>Propose plan for ID generation: "I will generate a new task ID by: a) Listing all `TASK-XXX.md` files in `./.claude/tasks/{active,backlog,completed}/`. b) Finding the highest existing numeric ID. c) Incrementing it by 1 (or starting at 001 if none exist). Shall I proceed with ID generation? (y/n)". If 'n', stop.</id_generation_plan>
    3.  <id_execution>On 'y' for ID generation:
        a.  Run `ls ./.claude/tasks/active/ ./.claude/tasks/backlog/ ./.claude/tasks/completed/` using your bash tool. Filter output for filenames matching `TASK-[0-9][0-9][0-9].md`.
        b.  If the bash command fails, report error and stop this `create_task` action.
        c.  From matching filenames, parse the three-digit numeric part (e.g., `TASK-007.md` -> `007`).
        d.  Identify the highest number. If no tasks exist, new number is `1`; else `highest_number + 1`.
        e.  Format as a three-digit string (e.g., `1` -> `001`). This is `FormattedID`.
        f.  The new Task ID is `TASK-{FormattedID}`. Report this generated ID to the user.
        </id_execution>
    4.  <file_content_proposal>
        Propose content for `./.claude/tasks/backlog/TASK-{FormattedID}.md`:
        ```markdown
        # Task: {TaskDescription}
        
        **ID:** TASK-{FormattedID}
        **Status:** Backlog
        **Created:** {Current Date YYYY-MM-DD} <!-- Obtain current date -->
        **Updated:** {Current Date YYYY-MM-DD}
        **Depends On:** [Optional: TASK-XXX, TASK-YYY]
        **Blocks:** [Optional: TASK-ZZZ]
        **Priority:** Medium
        **Effort Estimate (hours):** 
        **Assigned To:** Self
        
        ## Description
        {TaskDescription}
        
        ## Acceptance Criteria
        - [ ] Criterion 1
        - [ ] Criterion 2
        
        ## Notes
        -
        ```
        </file_content_proposal>
    5.  <confirmation>Ask: "Shall I create the task file `./.claude/tasks/backlog/TASK-{FormattedID}.md` with the content shown above using my file creation tool? (y/n)".</confirmation>
    6.  <execution>Upon 'y' confirmation, instruct your file creation tool to create `./.claude/tasks/backlog/TASK-{FormattedID}.md` with the specified content. Report success or failure. If failure, ask 'stop/retry/ignore'.</execution>
    7.  <o>If successful, report: "Task `TASK-{FormattedID}` created in backlog: `{TaskDescription}`."</o>
    <next_action>
        Ask: "Task TASK-{FormattedID} created. What would you like to do next? Options: (update_task / list_tasks / set_active_task / done)"
    </next_action>
    <stop/>
</instructions_for_create_task>
