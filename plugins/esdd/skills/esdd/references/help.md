# Help

Show this when `/esdd` is invoked without a valid action.

## Usage

```text
/esdd <action> [change-name|description] [flags]
```

## Commands

| Command    | Usage                                                                         | Key flags              |
| ---------- | ----------------------------------------------------------------------------- | ---------------------- |
| `init`     | `/esdd init`                                                                  | —                      |
| `document` | `/esdd document --domain <name>[:<description>] [--domain ...] --scan <glob>` | `--domain`, `--scan`   |
| `explore`  | `/esdd explore [topic]`                                                       | —                      |
| `new`      | `/esdd new [change-name] [--fast] [--workflow <name>]`                        | `--fast`, `--workflow` |
| `continue` | `/esdd continue [change-name] [--fast]`                                       | `--fast`               |
| `apply`    | `/esdd apply [change-name] [--fast]`                                          | `--fast`               |
| `verify`   | `/esdd verify [change-name]`                                                  | —                      |
| `archive`  | `/esdd archive [change-name] [--skip-verify]`                                 | `--skip-verify`        |
| `view`     | `/esdd view`                                                                  | —                      |

## Notes

- `change-name` is a short kebab-case identifier like `add-oauth-support`
- `new` still asks the user what they want to build. The optional `change-name` only controls the directory name
- For `document`, `--scan` is required and `:<description>` is optional
