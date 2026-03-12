# apex-lsp

Salesforce Apex language server for Claude Code, providing code intelligence features like go-to-definition, find references, and error checking.

## Supported Extensions

`.cls`, `.trigger`, `.apex`

## Prerequisites

- Java 11 or later
- The Apex Language Server JAR (`apex-jorje-lsp.jar`)

The JAR is distributed as part of the [Salesforce Extensions for VS Code](https://marketplace.visualstudio.com/items?itemName=salesforce.salesforcedx-vscode).\
After installing the extension, the JAR is typically located at:

```
~/.vscode/extensions/salesforce.salesforcedx-vscode-apex-*/dist/apex-jorje-lsp.jar
```

## Installation

Set the `SF_LSP_APEX` environment variable to the full path of the JAR.

For example:

```bash
export SF_LSP_APEX=$(ls ~/.vscode/extensions/salesforce.salesforcedx-vscode-apex-*/dist/apex-jorje-lsp.jar | tail -1)
```

Add this to your shell profile to persist it across sessions.

## More Information

- [Apex Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/)
- [Salesforce Extensions for VS Code](https://developer.salesforce.com/tools/salesforcecli)
