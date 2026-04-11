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

14 experts, each with 20+ years of domain expertise, strong opinions, and good generalist common sense:

**Technology & Operations:**
- 🔧 **CTO** — Technology, architecture, platform decisions, scalability, tech debt
- 🛡️ **CISO** — Security, threats, encryption, access control, incident response
- ⚙️ **VP Ops** — Reliability, monitoring, SLAs, deployment, operations

**Compliance & Legal:**
- 🔒 **DPO** — GDPR, privacy, data flows, consent, cross-border transfers
- ⚖️ **CRO (Risk)** — Compliance, audit, risk frameworks, controls, governance
- ⚖️ **Legal** — Contracts, liability, IP, licensing, regulatory interpretation

**Business & Revenue:**
- 💰 **CFO** — Costs, ROI, budget, unit economics, financial discipline
- 📋 **CPO (Procurement)** — Vendor deals, contracts, TCO, exit terms, negotiation
- 🎯 **COO (Business)** — Customer value, market positioning, product strategy
- 📈 **CMO (Marketing)** — Brand, positioning, content strategy, SEO, thought leadership, demand generation
- 💼 **VP Sales** — Pipeline, conversion, enterprise deals, pricing strategy, customer acquisition
- 📱 **Social & Community Lead** — Social media presence, community building, audience growth, influencer relations, content distribution

**People & Delivery:**
- 👥 **CHRO (HR)** — Team readiness, adoption, training, change management
- 📊 **PMO** — Project planning, timelines, dependencies, resource allocation

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
4. **Format as a chat history** — each message looks like:

```
🔧 CTO — 10:02
We should keep it on Vercel for now. The operational overhead of self-hosting isn't worth it at our scale.

💰 CFO — 10:03
I'm not sure that's true. Vercel's pricing jumps sharply at scale. A €5/month VPS handles more traffic than you'd think. Have we actually done the comparison?

🛡️ CISO — 10:04
Forget the cost debate for a second. If we self-host, we control the infrastructure end to end. On Vercel, we're trusting a third party with our admin panel — the one that has access to every AI system assessment we've ever done.

🔧 CTO — 10:06
That's a valid concern in theory, but Vercel is SOC 2 Type II. Can we realistically do better with a small team managing our own servers? I doubt it.
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
