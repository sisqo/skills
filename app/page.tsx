import { getSkills } from "@/lib/skills";

export default async function Home() {
  const skills = await getSkills();

  return (
    <div className="min-h-screen px-6 py-16 sm:px-12">
      <main className="mx-auto flex max-w-2xl flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">skills</h1>
          <p className="text-base text-black/70 dark:text-white/70">
            A personal collection of Claude Code skills, each packaged as its
            own installable plugin.
          </p>
        </header>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Add the marketplace</h2>
          <p className="text-sm text-black/60 dark:text-white/60">
            One-time step. Install individual skills below afterwards.
          </p>
          <div className="rounded-lg border border-black/10 bg-black/[.02] p-4 font-mono text-sm dark:border-white/15 dark:bg-white/[.03]">
            /plugin marketplace add sisqo/skills
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Skills</h2>
          {skills.length === 0 ? (
            <p className="text-sm text-black/60 dark:text-white/60">
              No skills yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {skills.map((skill) => (
                <li
                  key={`${skill.pluginSlug}/${skill.slug}`}
                  className="rounded-lg border border-black/10 p-4 dark:border-white/15"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-mono text-base font-semibold">
                      {skill.name}
                    </h3>
                    {skill.version && (
                      <span className="text-xs text-black/50 dark:text-white/50">
                        v{skill.version}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-black/70 dark:text-white/70">
                    {skill.description}
                  </p>

                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                      Install
                    </p>
                    <div className="mt-1 rounded-md border border-black/10 bg-black/[.02] p-3 font-mono text-xs dark:border-white/15 dark:bg-white/[.03]">
                      /plugin install {skill.pluginName}@skills
                    </div>
                  </div>

                  {skill.userInvocable && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-black/50 dark:text-white/50">
                        Usage
                      </p>
                      <div className="mt-1 rounded-md border border-black/10 bg-black/[.02] p-3 font-mono text-xs dark:border-white/15 dark:bg-white/[.03]">
                        /{skill.name}
                        {skill.argumentHint ? ` ${skill.argumentHint}` : ""}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
