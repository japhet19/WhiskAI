<instructions_for_run_test>
    ultrathink: Formulate a `TestExecutionStrategy`. This includes: (a) `TestCommandDiscovery` (how to find or get the test command, e.g., user prompt, config file), (b) `ResultParsingApproach` (how to determine success/failure from output), (c) `ArtifactManagement` (where to store detailed logs/reports, e.g., `./tests/results/timestamp_test_run.log`).

    1.  <role_adoption>Adopt Role: "You are a Quality Assurance Engineer."</role_adoption>
    2.  <parse_input>Parse `action_args` for optional test scope (e.g., "all", "specific_suite", "path/to/test_file.py"). Let this be `TestScope`. Default to "all" if empty.</parse_input>
    3.  <determine_test_command_plan>
        Propose plan: "I need to determine the command to run your tests.
        a. I will check for a project-specific test command in `./.claude/memory/project_config.md` (e.g., under a `test_command:` key).
        b. If not found, I will ask you: 'What is the command to run your tests (e.g., `pytest`, `npm test`, `go test ./...`)? Please include any default arguments for running all tests.'
        c. I will then adapt this command based on the `TestScope` if provided.
        Shall I proceed? (y/n)". If 'n', stop.
        </determine_test_command_plan>
    4.  <determine_test_command_execution>On 'y' for plan:
        a.  Attempt to read `./.claude/memory/project_config.md`. If it exists and contains a `test_command: ActualTestCommand`, use `ActualTestCommand`.
        b.  If not found, ask user for the `BaseTestCommand`. If not provided, report "Error: Test command not specified." and stop.
        c.  Let `FinalTestCommand` be the `BaseTestCommand` (or `ActualTestCommand`). If `TestScope` is not "all", append `TestScope` to `FinalTestCommand` (user to ensure their command handles this).
        d.  Report to user: "I will use the command: `{FinalTestCommand}`."
        </determine_test_command_execution>
    5.  <prepare_results_directory_plan>
        Propose: "I will ensure the test results directory `./tests/results/` exists. I will also create a timestamped file for this test run's output, e.g., `./tests/results/YYYYMMDD_HHMMSS_test_run.log`. Shall I proceed? (y/n)". If 'n', stop.
        </prepare_results_directory_plan>
    6.  <prepare_results_directory_execution>On 'y' for plan:
        a.  Ensure `./tests/results/` exists (it should if project setup was run).
        b.  Generate `Timestamp = {Current DateTime YYYYMMDD_HHMMSS}`.
        c.  Let `LogFilePath = ./.tests/results/{Timestamp}_test_run.log`.
        </prepare_results_directory_execution>
    7.  <execute_tests_plan>
        Propose: "I will now execute `{FinalTestCommand}`. The output will be captured to `{LogFilePath}` and also displayed. Shall I proceed? (y/n)". If 'n', stop.
        </execute_tests_plan>
    8.  <execute_tests_execution>On 'y' for plan:
        a.  Run `{FinalTestCommand}` using your bash tool. Pipe stdout and stderr to `{LogFilePath}` and also display live output if possible, or a summary upon completion.
        b.  If the command execution itself fails (e.g., command not found), report this error and stop.
        c.  Determine success/failure:
            i.  If exit code is 0, assume success.
            ii. If exit code is non-zero, assume failure.
            (More sophisticated parsing of test runner output could be added here later if needed, as part of `ResultParsingApproach` from `ultrathink`).
        </execute_tests_execution>
    9.  <report_results>
        If successful: Report: "Tests completed successfully. Full log at `{LogFilePath}`."
        If failed: Report: "Tests failed. See details below and full log at `{LogFilePath}`." (Include a snippet of the error output if available and concise).
        </report_results>
    10. <post_action>
        Suggest: "If tests failed, you might want to create a task to fix them (`/create_task "Fix test failures from run {Timestamp}"`) or start a debugging session (`/debug_issue "Investigate test failures from {Timestamp}, see {LogFilePath}"`)."
        </post_action>
    <stop/>
</instructions_for_run_test>
