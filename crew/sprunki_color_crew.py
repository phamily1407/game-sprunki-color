"""
sprunki_color_crew.py
=====================
Team "Sprunki Color" — 3 AI teammates using Claude Sonnet 4.6.

Agents:
  1. Dev     — builds the React Native + Expo codebase
  2. QA      — reviews, tests, and validates output
  3. PM      — manages backlog, writes docs, runs ceremonies

Usage:
  python crew/sprunki_color_crew.py --task "build the ColorPalette component"
  python crew/sprunki_color_crew.py --ceremony planning
  python crew/sprunki_color_crew.py --ceremony retro --input "audio was buggy on web"

Requirements:
  pip install crewai crewai-tools langchain-anthropic python-dotenv

.env:
  ANTHROPIC_API_KEY=sk-ant-...
"""

import os
import argparse
from pathlib import Path
from dotenv import load_dotenv

from crewai import Agent, Task, Crew, Process
from crewai.tools import tool
from langchain_anthropic import ChatAnthropic

load_dotenv()

# ── Model — all agents use Sonnet 4.6 ─────────────────────────────────────
sonnet = ChatAnthropic(
    model="claude-sonnet-4-6",
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    max_tokens=8096,
)

# ── Project paths ──────────────────────────────────────────────────────────
ROOT     = Path(__file__).parent.parent
CLAUDE   = ROOT / "CLAUDE.md"
SPEC     = ROOT / "SPEC.md"
FDD      = ROOT / "docs" / "FDD.md"
BACKLOG  = ROOT / "BACKLOG.md"
SPRINTS  = ROOT / "sprints"
REVIEW   = SPRINTS / "REVIEW.md"
CHANGELOG = ROOT / "CHANGELOG.md"

def latest_sprint():
    files = sorted(SPRINTS.glob("SPRINT_*.md"))
    return files[-1] if files else None

def next_sprint_num():
    return len(list(SPRINTS.glob("SPRINT_*.md"))) + 1

# ── Tools ──────────────────────────────────────────────────────────────────
@tool("read_claude_md")
def read_claude_md() -> str:
    """Read CLAUDE.md — global project context and agent rules"""
    return CLAUDE.read_text()

@tool("read_spec")
def read_spec() -> str:
    """Read SPEC.md — full game design and technical specification"""
    return SPEC.read_text()

@tool("read_fdd")
def read_fdd() -> str:
    """Read FDD.md — functional design document"""
    return FDD.read_text()

@tool("read_backlog")
def read_backlog() -> str:
    """Read BACKLOG.md — product backlog with all stories"""
    return BACKLOG.read_text() if BACKLOG.exists() else "BACKLOG.md not found."

@tool("read_latest_sprint")
def read_latest_sprint() -> str:
    """Read the current sprint file"""
    f = latest_sprint()
    return f.read_text() if f else "No sprint file found."

@tool("write_file")
def write_file(file_path: str, content: str) -> str:
    """
    Write a file to the project.
    Allowed paths: src/, app/, crew/, docs/, sprints/
    """
    allowed = ["src/", "app/", "crew/", "docs/", "sprints/"]
    if not any(file_path.startswith(p) for p in allowed):
        return f"❌ BLOCKED: '{file_path}' is outside allowed scope. Allowed: {allowed}"
    full = ROOT / file_path
    full.parent.mkdir(parents=True, exist_ok=True)
    full.write_text(content)
    return f"✅ Written: {file_path} ({len(content)} chars)"

@tool("read_file")
def read_file(file_path: str) -> str:
    """Read any project file by relative path"""
    full = ROOT / file_path
    return full.read_text() if full.exists() else f"File not found: {file_path}"

@tool("update_backlog")
def update_backlog(content: str) -> str:
    """Update BACKLOG.md"""
    BACKLOG.write_text(content)
    return "✅ BACKLOG.md updated."

@tool("write_sprint")
def write_sprint(content: str) -> str:
    """Create a new sprint file"""
    n = next_sprint_num()
    path = SPRINTS / f"SPRINT_{n:02d}.md"
    path.write_text(content)
    return f"✅ Created: {path.name}"

@tool("update_sprint")
def update_sprint(content: str) -> str:
    """Update the current sprint file"""
    f = latest_sprint()
    if f:
        f.write_text(content)
        return f"✅ Updated: {f.name}"
    return "No sprint to update."

@tool("write_review")
def write_review(content: str) -> str:
    """Write QA review output to sprints/REVIEW.md"""
    REVIEW.write_text(content)
    return "✅ REVIEW.md written."

@tool("list_files")
def list_files(directory: str = ".") -> str:
    """List files in a directory"""
    target = ROOT / directory
    if not target.exists():
        return f"Directory not found: {directory}"
    files = [str(f.relative_to(ROOT)) for f in target.rglob("*") if f.is_file()]
    return "\n".join(sorted(files)[:50])

# ── Agent 1: Dev ───────────────────────────────────────────────────────────
dev = Agent(
    role="Dev",
    goal=(
        "Build the Sprunki Color React Native + Expo codebase. "
        "Write complete, working TypeScript — no placeholders, no TODOs. "
        "Every component must work on iOS, Android, AND web browser."
    ),
    backstory="""
    You are a senior React Native developer on the Sprunki Color team.
    You specialise in cross-platform Expo apps that run on mobile and web.
    
    Your personality: precise, thorough, pragmatic. You always:
    - Read CLAUDE.md before touching any file
    - Check SPEC.md for design rules
    - Check FDD.md for the feature you're building
    - Write TypeScript with strict types (never 'any')
    - Test mentally on iOS, Android, AND web before marking done
    - Never use banned libraries (react-native-skia, direct expo-av in components)
    - Keep touch targets minimum 72px
    - Never hardcode colors — always import from theme.ts
    
    You own: src/ and app/ directories only.
    You never touch: docs/, sprints/, BACKLOG.md, SPEC.md, CLAUDE.md
    """,
    llm=sonnet,
    tools=[read_claude_md, read_spec, read_fdd, read_latest_sprint, write_file, read_file, list_files],
    verbose=True,
    allow_delegation=False,
)

# ── Agent 2: QA ────────────────────────────────────────────────────────────
qa = Agent(
    role="QA",
    goal=(
        "Review all code written by Dev. Validate against SPEC and FDD. "
        "Output a structured REVIEW.md with clear pass/fail/warnings. "
        "Never fix code yourself — report only."
    ),
    backstory="""
    You are the QA engineer on the Sprunki Color team.
    You are methodical, detail-oriented, and child-safety focused.
    
    Your personality: thorough, uncompromising on quality, but constructive.
    
    You always:
    - Read CLAUDE.md first to understand all constraints
    - Check every component against SPEC.md design rules
    - Verify touch targets are >= 72px
    - Check no banned libraries are used
    - Verify web compatibility of every component
    - Check TypeScript types (no 'any' allowed)
    - Verify analytics events are fired per SPEC.md
    - Check audio goes through audioEngine.ts only
    - Test the web audio gate logic (browser autoplay policy)
    - Verify no fail states exist in the UI
    
    Your REVIEW.md format:
    # QA REVIEW — [task name]
    Date: [today]
    
    ## ✅ Passing
    - [list each criterion that passes]
    
    ## ❌ Failing  
    - [file:description] for each failure
    
    ## ⚠️ Warnings
    - [non-blocking issues]
    
    ## 🧒 Child safety check
    - Touch targets: [pass/fail]
    - No fail states: [pass/fail]
    - No dark themes: [pass/fail]
    
    ## Verdict: PASS ✅ / FAIL ❌
    ## If FAIL: [numbered list of exact fixes needed]
    
    You own: sprints/REVIEW.md only.
    You never write code. You never touch src/ or app/.
    """,
    llm=sonnet,
    tools=[read_claude_md, read_spec, read_fdd, read_latest_sprint, read_file, list_files, write_review],
    verbose=True,
    allow_delegation=False,
)

# ── Agent 3: PM ────────────────────────────────────────────────────────────
pm = Agent(
    role="PM",
    goal=(
        "Manage the Sprunki Color product backlog, run Agile ceremonies, "
        "write and maintain all documentation (BACKLOG, SPRINT files, FDD updates). "
        "Be the voice of the child user — always ask 'is this good for a 3-year-old?'"
    ),
    backstory="""
    You are the Product Manager on the Sprunki Color team.
    You are the advocate for the child user. Every decision you make,
    you ask: "Would a 3-year-old enjoy this? Would a parent trust this?"
    
    Your personality: organised, user-focused, clear communicator.
    You write documentation that both humans and AI agents can follow.
    
    Agile ceremonies you run:
    
    SPRINT PLANNING:
    1. Read BACKLOG.md and latest sprint retro
    2. Propose sprint goal (one sentence)
    3. Select 3-6 stories (max 2 Large effort)
    4. Write SPRINT_XX.md
    5. Update BACKLOG: mark selected stories In Progress
    6. Decompose stories into Dev tasks with file scope + acceptance criteria
    
    STANDUP (per session):
    1. Ask: done / doing / blocked
    2. Update sprint file standup log
    3. Identify next task for Dev or QA
    4. Output exact task + which agent + files in/out of scope
    
    SPRINT REVIEW + RETRO:
    1. List what shipped vs what didn't
    2. Write retro in sprint file
    3. Update BACKLOG (move to Done)
    4. Seed next sprint
    
    DOCUMENTATION:
    - Update FDD before Dev starts any new feature
    - Update BACKLOG after every ceremony
    - Keep SPEC.md accurate — never let it drift from reality
    
    You own: BACKLOG.md, sprints/*.md, docs/FDD.md
    You never write code. You never touch src/ or app/.
    
    Task delegation format (always use this):
    ---
    AGENT: Dev / QA
    TASK: [1-2 sentence description]
    FILES IN SCOPE: [exact list]
    FILES OUT OF SCOPE: [exact list]
    ACCEPTANCE CRITERIA:
    - [bullet list]
    CONTEXT: Read @CLAUDE.md, @SPEC.md, @docs/FDD.md section [X]
    ---
    """,
    llm=sonnet,
    tools=[read_claude_md, read_spec, read_fdd, read_backlog, read_latest_sprint,
           write_file, update_backlog, write_sprint, update_sprint, read_file],
    verbose=True,
    allow_delegation=False,
)

# ── Crew definition ────────────────────────────────────────────────────────
sprunki_color_crew = Crew(
    agents=[pm, dev, qa],
    process=Process.sequential,
    verbose=True,
    name="Sprunki Color Team",
)

# ── Workflow functions ─────────────────────────────────────────────────────

def run_dev_task(task_description: str):
    """PM plans → Dev builds → QA reviews"""

    plan_task = Task(
        description=f"""
        Read CLAUDE.md, SPEC.md, FDD.md, and the current sprint.

        Task from Product Owner: {task_description}

        1. Confirm this task is in the current sprint (or add it if urgent)
        2. Write a precise task brief for Dev using this format:
           AGENT: Dev
           TASK: [exact description]
           FILES IN SCOPE: [exact list]
           FILES OUT OF SCOPE: [exact list]
           ACCEPTANCE CRITERIA: [bullet list]
           CONTEXT: [which SPEC/FDD sections to read]
        3. Update sprint standup log
        """,
        agent=pm,
        expected_output="Task brief written for Dev with full acceptance criteria",
    )

    build_task = Task(
        description=f"""
        Read CLAUDE.md fully. Read the task brief from PM.

        Build the feature: {task_description}

        Rules:
        - Only touch files in src/ and app/
        - TypeScript strict — no 'any'
        - Minimum 72px touch targets
        - No banned libraries (check CLAUDE.md)
        - Test mentally on iOS, Android, AND web
        - No placeholders, no TODOs

        End with: "DEV COMPLETE — files written: [list]"
        """,
        agent=dev,
        expected_output="Complete TypeScript implementation with list of files written",
        context=[plan_task],
    )

    review_task = Task(
        description=f"""
        Read CLAUDE.md. Review the code written by Dev for: {task_description}

        Check against:
        - SPEC.md design rules (touch targets, colors, font sizes)
        - FDD.md acceptance criteria
        - No banned libraries
        - Web compatibility
        - TypeScript types
        - Child safety (no fail states, no dark themes)
        - Analytics events per SPEC.md

        Write complete REVIEW.md using your standard format.
        End with a clear PASS ✅ or FAIL ❌ verdict.
        """,
        agent=qa,
        expected_output="REVIEW.md written with PASS or FAIL verdict",
        context=[build_task],
    )

    crew = Crew(
        agents=[pm, dev, qa],
        tasks=[plan_task, build_task, review_task],
        process=Process.sequential,
        verbose=True,
    )
    return crew.kickoff()


def run_ceremony(ceremony: str, user_input: str = ""):
    """Run an Agile ceremony: planning | standup | retro"""

    if ceremony == "planning":
        task = Task(
            description=f"""
            Run Sprint Planning for Sprunki Color.

            Product Owner context: {user_input or 'No specific input. Use backlog priorities.'}

            Steps:
            1. Read BACKLOG.md — find top priority stories
            2. Propose sprint goal (one sentence)
            3. Select 3-5 stories (max 2 Large effort items)
            4. Create SPRINT_XX.md using write_sprint tool
            5. Update BACKLOG.md to mark selected stories as In Progress
            6. Decompose each story into Dev tasks with full file scope
            7. Output: "Sprint [N] planned. Goal: [X]. Stories: [list]"
            """,
            agent=pm,
            expected_output="Sprint file created, BACKLOG updated, tasks decomposed",
        )

    elif ceremony == "standup":
        task = Task(
            description=f"""
            Run Daily Standup for Sprunki Color.

            Product Owner update: {user_input or 'No update provided.'}

            Steps:
            1. Read current sprint file
            2. Process the update: extract Done / Doing / Blocked
            3. Update standup log in sprint file
            4. Identify the next task for Dev or QA
            5. Write the next task brief (agent + files + criteria)
            6. End with: "Next: [agent] should [task]. Then [next step]."
            """,
            agent=pm,
            expected_output="Standup logged, next task defined with full brief",
        )

    elif ceremony == "retro":
        task = Task(
            description=f"""
            Run Sprint Retrospective for Sprunki Color.

            Product Owner feedback: {user_input or 'No specific feedback.'}

            Steps:
            1. Read the current sprint file
            2. List: ✅ what shipped / ❌ what didn't / why
            3. Write retro section in sprint file:
               - What went well
               - What to improve
               - Action items
            4. Update BACKLOG.md: mark completed items ✅ Done
            5. Propose top 3-5 items for next sprint
            6. Output: "Sprint closed. [N] items shipped. Next sprint: [top items]"
            """,
            agent=pm,
            expected_output="Retro written, backlog updated, next sprint seeded",
        )
    else:
        print(f"Unknown ceremony: {ceremony}. Use: planning | standup | retro")
        return

    crew = Crew(
        agents=[pm],
        tasks=[task],
        process=Process.sequential,
        verbose=True,
    )
    return crew.kickoff()


# ── CLI ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sprunki Color Team — AI Crew")
    parser.add_argument("--task", type=str, help="Dev task to build (PM → Dev → QA)")
    parser.add_argument("--ceremony", choices=["planning", "standup", "retro"],
                        help="Agile ceremony to run")
    parser.add_argument("--input", type=str, default="",
                        help="Product Owner context or update")
    args = parser.parse_args()

    print("\n🎨 Sprunki Color Team — powered by Claude Sonnet 4.6")
    print("=" * 60)

    if args.task:
        print(f"\n🛠️  Dev task: {args.task}\n")
        result = run_dev_task(args.task)
        print(f"\n✅ Done:\n{result}")

    elif args.ceremony:
        print(f"\n📋 Ceremony: {args.ceremony.upper()}\n")
        result = run_ceremony(args.ceremony, args.input)
        print(f"\n✅ Done:\n{result}")

    else:
        print("""
Usage examples:

  # Build a feature (PM plans → Dev builds → QA reviews)
  python crew/sprunki_color_crew.py --task "build the ColorPalette component"
  python crew/sprunki_color_crew.py --task "create the audio engine with Howler.js web support"
  python crew/sprunki_color_crew.py --task "build Blobby SVG character with 8 paintable zones"

  # Agile ceremonies
  python crew/sprunki_color_crew.py --ceremony planning
  python crew/sprunki_color_crew.py --ceremony planning --input "focus on audio this sprint"
  python crew/sprunki_color_crew.py --ceremony standup --input "audio engine done, starting ColorPalette"
  python crew/sprunki_color_crew.py --ceremony retro --input "web audio was tricky, rest went well"
        """)
