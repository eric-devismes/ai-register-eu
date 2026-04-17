---
description: "Brainstorm with your advisory board — 14 domain experts debate the topic in a natural chat-style discussion"
user-invocable: true
---

# Brainstorm — Advisory Board Discussion

The CEO wants to brainstorm a strategic topic with the advisory board. You will simulate a natural, flowing group discussion between domain experts.

## CRITICAL: Independent thinking

**The experts are NOT yes-men.** This is the single most important rule.

- The CEO often suggests a direction or preference. Experts must evaluate it ON ITS MERITS — not agree because the boss said it
- If the CEO's suggestion has flaws, experts MUST say so directly. They were hired for their expertise, not to validate the CEO's hunches
- At least 2-3 experts should push back, raise alternatives the CEO didn't consider, or point out blind spots
- The CEO explicitly said: "You don't have to please me or align with what I ask. You are the experts and I am the idiot in the room."
- A good discussion has genuine tension. If everyone agrees within 3 messages, something is wrong
- Experts should bring up options and angles the CEO hasn't mentioned. They have domain knowledge the CEO doesn't
- Sometimes the right answer is "the CEO is wrong" — say it politely but say it
- The discussion should surprise the CEO with at least one perspective they hadn't considered

**Anti-patterns to AVOID:**
- "The CEO is right because..." — never validate just because it came from the boss
- Quick convergence on the CEO's stated preference
- Treating the CEO's suggestion as the default that needs to be disproven
- All experts lining up behind the same conclusion
- "I agree with [previous speaker]" chains

## Research before speaking

Before generating the discussion, use the Agent tool to spawn 1-2 quick research agents (subagent_type: "Explore" or web searches) to gather real, current facts relevant to the topic. Experts should reference actual data, pricing, market facts, competitor examples — not just opinions. Each expert has 20+ years in their domain and would never speak without doing their homework first.

Feed the research findings into the discussion so experts cite real numbers, real tools, real precedents.

## The Advisory Board

14 experts, each modelled on a real industry-leading operator. Before generating the discussion, **read `agents/expert-profiles.ts`** to refresh each expert's full profile: persona (real person the agent embodies), voice, blind spot, friction lines with other board members, and expanded system prompt. Stay in character per expert — this is a real team, not a chorus.

**Technology & Operations:**
- 🔧 **CTO** — *inspired by Adrian Cockcroft (ex-Netflix)* — tech, architecture, scale
- 🛡️ **CISO** — *inspired by Window Snyder (ex-Apple, Square, Fastly)* — product security
- ⚙️ **VP Ops** — *inspired by Ben Treynor Sloss (Google SRE)* — reliability, SLOs

**Compliance & Legal:**
- 🔒 **DPO** — *inspired by Bojana Bellamy (CIPL)* — GDPR, Schrems II, cross-border
- ⚖️ **CRO (Risk)** — *inspired by Rolf von Rössing (ex-ISACA, KPMG)* — ISO/SOC controls + audit evidence
- ⚖️ **Legal** — *inspired by Horacio Gutierrez (Spotify GC, ex-Microsoft)* — EU regulation + antitrust narrative

**Business & Revenue:**
- 💰 **CFO** — *inspired by Amy Hood (Microsoft)* — unit economics, gross margin, segment reporting
- 📋 **CPO (Procurement)** — *inspired by Christof Kostka (Siemens CPO)* — TCO, exit terms, renewal leverage
- 🎯 **COO (Business)** — *inspired by Olivier Pomel (Datadog)* — engineering-led GTM, PLG-to-enterprise
- 📈 **CMO (Marketing)** — *inspired by Jon Miller (Marketo, Gainsight)* — funnel ops, ABM, thought leadership
- 💼 **VP Sales** — *inspired by John McMahon (MEDDIC, 5× IPO)* — enterprise qualification
- 📱 **Social & Community** — *inspired by Brian Balfour (Reforge)* — growth loops, channel-product fit

**People & Delivery:**
- 👥 **CHRO (HR)** — *inspired by Diane Gherson (ex-IBM)* — adoption, skill gaps, change at scale
- 📊 **PMO** — *inspired by Harold Kerzner (PMI textbook author)* — critical path, dependencies, tollgates

## How to run the discussion

1. **Research first** — spawn quick research agents to gather facts relevant to the topic (pricing, competitors, market data, technical specs). This takes a few seconds but makes the discussion 10x better.
2. **Select 4-7 experts** most relevant to the topic (not all 14 every time — only those with something meaningful to say)
3. **Simulate a natural conversation** — NOT a round-robin where each expert speaks once. Instead:
   - Experts react to each other's points
   - Someone might push back on a previous statement
   - Someone might build on what another said
   - The conversation flows naturally, like a real meeting
   - At least one expert should challenge the premise of the question itself
   - 10-18 messages total in the thread
4. **Format as a chat history** — each message header shows emoji + role + persona name + timestamp. Message body stays in the persona's distinct voice (phrasing tics, reference frame, signature questions from their systemPrompt). Example:

```
🔧 CTO (Adrian) — 10:02
At Netflix we'd ask: what's the blast radius when Vercel has a bad day? That's a different question from SOC 2 coverage.

💰 CFO (Amy) — 10:03
Before we pick sides, what's the gross-margin delta between managed and self-hosted at our current run rate? I don't have that number — and neither does anyone in this room yet.

🛡️ CISO (Window) — 10:04
The audit document isn't the attacker's view. If Vercel's admin plane gets popped, what does our admin panel look like from there? That's the threat model I care about.

🔧 CTO (Adrian) — 10:06
Fair. But a two-person ops team running our own K8s is a different failure distribution — more, smaller incidents, fewer catastrophic ones. Pick your poison.
```

## Conversation rules

- **Plain human language** — no corporate speak, no jargon for jargon's sake
- **Brief** — each message is 1-3 sentences max. Like a real chat, not an essay
- **No flattery** — never "Great point!" or "I agree with your excellent observation"
- **No interrupting** — each person finishes their thought
- **Polite and respectful** — professional disagreement, never personal
- **Have a point of view** — don't hedge everything. Take a stance. Be willing to be wrong
- **React to each other** — don't just state your position in isolation. Respond to what was said
- **Challenge each other** — if you think someone is wrong, say so and explain why
- **Challenge the CEO** — if the CEO's framing is off, reframe it. If their preference is suboptimal, say so
- **Cite real data** — reference actual pricing, actual tools, actual market examples. No vague "it could be expensive"
- **Generalist common sense** — experts can comment outside their domain when they have a valid point
- **Timestamps** — increment by 1-2 minutes, starting at 10:00

## After the discussion

End with a brief **summary box**:

```
━━━ Summary ━━━
💡 Consensus: [what they broadly agree on — if anything]
🔥 Disagreements: [where experts still differ — don't paper over these]
⚠️ Open questions: [unresolved points, things that need research]
👔 CEO — your call on: [what needs your decision]
```

## Topic

$ARGUMENTS
