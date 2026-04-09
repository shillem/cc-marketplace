import { relative, resolve } from "path";
import { domainsPath, output, outputError } from "../lib/fs-utils.mjs";
import { Config } from "../lib/config.mjs";
import { parseArg, parseDomain } from "../lib/init.mjs";

export function run(args) {
  const argInstruction = args.includes("--instruction");
  const argRegister = parseArg(args, "--register");

  if (!argInstruction && !argRegister) {
    outputError("Usage: cli.mjs document --instruction | --register <name:description>");
    process.exit(1);
  }

  const config = new Config();
  const schema = config.schema();

  if (!schema.document) {
    outputError(`Workflow '${schema.workflow}' does not support document bootstrap`);
    process.exit(1);
  }

  if (argInstruction) {
    const cwd = process.cwd();

    output({
      instruction: schema.document.instruction,
      templatePath: relative(cwd, schema.document.template),
      domainsPath: relative(cwd, domainsPath())
    });
  } else {
    const { name, description } = parseDomain(argRegister);

    if (!name) {
      outputError("Domain name is required");
      process.exit(1);
    }

    const existing = config.domains.find(d => d.name === name);
    const status = existing ? "updated" : "added";
    const mergedDescription = description || existing?.description || "";

    config.updateConfig({
      domains: [{ name, description: mergedDescription }]
    });

    output({
      name,
      description: mergedDescription,
      outputPath: relative(process.cwd(), resolve(domainsPath(), name + ".md")),
      status
    });
  }
}
