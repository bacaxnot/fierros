type HelpEntry = {
  name: string;
  aliases: string[];
  description: string;
  args?: string;
};

export function HelpResult({ data }: { data: unknown }) {
  const entries = data as HelpEntry[];

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Type a command or just ask me anything in plain text.
      </p>
      <div className="divide-y">
        {entries.map((cmd) => (
          <div key={cmd.name} className="flex items-center justify-between py-2">
            <code className="text-sm">
              {cmd.name}
              {cmd.args ? ` [${cmd.args}]` : ""}
            </code>
            <span className="text-xs text-muted-foreground">
              {cmd.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
