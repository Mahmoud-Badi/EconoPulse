# Interview Process

> An unstructured interview is a coin flip with extra steps. Structured interviews with predefined rubrics, consistent questions, and independent scoring are 2-5x more predictive of job performance. This template designs your entire interview pipeline — from recruiter screen to offer — and equips every interviewer with the tools to evaluate candidates fairly and consistently.

---

## 1. Interview Pipeline Stages

### Pipeline Overview

| Stage | Duration | Interviewer(s) | Purpose | Pass Rate (Target) |
|-------|----------|----------------|---------|-------------------|
| 1. Application Review | Async | Hiring manager or recruiter | Filter on minimum qualifications | 20-30% |
| 2. Recruiter / Founder Screen | 30 min (phone/video) | Recruiter or founder | Motivation, logistics, high-level fit | 50-60% |
| 3. Technical Phone Screen | 45-60 min (video) | Senior engineer | Technical competence, problem-solving | 40-50% |
| 4. Technical Deep Dive | 60-90 min (video or on-site) | 2 engineers | Coding ability or system design | 40-50% |
| 5. Culture / Values Interview | 45 min (video or on-site) | Cross-functional interviewer | Behavioral alignment, collaboration | 70-80% |
| 6. Hiring Manager Conversation | 30 min (video) | Hiring manager | Mutual evaluation, questions, close | 80-90% |
| 7. Reference Checks | Async (3 calls) | Hiring manager or recruiter | Verify performance claims | 85-90% |
| 8. Debrief & Decision | 30-60 min (internal) | All interviewers | Structured decision meeting | — |

<!-- IF {{INTERVIEW_ROUNDS}} == "3" -->
**Compressed pipeline (3 rounds):** Combine stages 2+3 into a single technical screen, run stage 4 as the second round, and combine stages 5+6 as the third round. Skip formal reference checks only for referral candidates.
<!-- ENDIF -->

<!-- IF {{INTERVIEW_ROUNDS}} == "4" -->
**Standard pipeline (4 rounds):** Stage 1 (screen), Stage 2 (technical phone), Stage 3 (technical deep dive), Stage 4 (culture + hiring manager combined).
<!-- ENDIF -->

<!-- IF {{INTERVIEW_ROUNDS}} == "5" -->
**Full pipeline (5 rounds):** All stages as described above, with reference checks running in parallel with the debrief.
<!-- ENDIF -->

### Pipeline Timing SLAs

| Transition | Maximum Elapsed Time |
|------------|---------------------|
| Application → Screen decision | 5 business days |
| Screen → Technical phone | 5 business days |
| Technical phone → Deep dive | 7 business days |
| Deep dive → Culture interview | 3 business days |
| Culture → Debrief | 2 business days |
| Debrief → Offer/Reject | 1 business day |
| **Total pipeline (application to offer)** | **15-20 business days** |

**Warning:** Every day of delay increases the probability of losing the candidate by approximately 1-2%. Top candidates have multiple processes running simultaneously. Speed is a competitive advantage.

---

## 2. Interviewer Training

Every person who conducts interviews at {{PROJECT_NAME}} must complete this training before interviewing candidates alone.

### Required Training Topics

| Topic | Format | Duration | Key Takeaway |
|-------|--------|----------|-------------|
| **Structured interviewing basics** | Doc + discussion | 30 min | Why structure beats gut feeling. How to use rubrics. |
| **Bias awareness** | Doc + examples | 30 min | Common biases (halo, similarity, anchoring) and how to mitigate them. |
| **Scorecard calibration** | Live practice | 60 min | Score a mock candidate independently, then compare and discuss. |
| **Legal boundaries** | Doc | 15 min | Questions you cannot ask (age, family status, religion, disability, etc.). |
| **Candidate experience** | Doc | 15 min | How to make the interview a positive experience regardless of outcome. |
| **Shadow interview** | Live | 1-2 interviews | Observe an experienced interviewer before conducting one alone. |

### Interviewer Dos and Don'ts

| Do | Don't |
|----|-------|
| Follow the scorecard for your interview stage | Freestyle with random questions |
| Score independently before the debrief | Discuss scores with other interviewers before the debrief |
| Take notes during the interview (with candidate's knowledge) | Score based on memory hours later |
| Ask the same core questions to every candidate for the same role | Change questions based on candidate's background |
| Evaluate evidence (what they said/did) not impressions (how you felt) | Use phrases like "I just had a good feeling about them" |
| Give the candidate time to think and respond | Fill silence or rescue them from difficult questions |
| End with time for candidate's questions (minimum 10 minutes) | Rush through without letting them evaluate you |

---

## 3. Scorecard Rubrics

### Universal Scoring Scale

All scorecards use a 1-5 scale with consistent definitions:

| Score | Label | Definition |
|-------|-------|-----------|
| 1 | **Strong No** | Significant concern. Clear evidence of misalignment or inability. Would actively argue against hiring. |
| 2 | **Lean No** | Below expectations. Some positive signals but meaningful gaps. Would not advocate for hiring. |
| 3 | **Neutral** | Meets minimum bar. No strong signals either way. Need more data or input from other interviewers. |
| 4 | **Lean Yes** | Above expectations. Clear strengths with minor gaps. Would support hiring. |
| 5 | **Strong Yes** | Exceptional. Top 10% of candidates seen for this role. Would advocate strongly for hiring. |

### Recruiter / Founder Screen Scorecard

| Competency | Question(s) | Score (1-5) | Notes |
|-----------|-------------|-------------|-------|
| **Motivation** | Why {{PROJECT_NAME}}? Why now? What are you looking for? | | |
| **Role alignment** | Walk me through your experience with [key skill]. How does it connect to this role? | | |
| **Communication clarity** | (Assessed throughout) Can they articulate thoughts clearly and concisely? | | |
| **Logistics fit** | Timeline, compensation expectations, work arrangement preferences | | |
| **Engagement** | Quality of questions they ask about the company and role | | |

**Pass criteria:** Average 3.0+, no competency scored 1.

### Technical Phone Screen Scorecard

| Competency | Question(s) | Score (1-5) | Notes |
|-----------|-------------|-------------|-------|
| **Problem decomposition** | Given a problem, can they break it into sub-problems? | | |
| **Technical depth** | Do they understand the technologies they claim expertise in? | | |
| **Code quality** | Is their code readable, maintainable, and correct? | | |
| **Communication** | Do they explain their approach before and during coding? | | |
| **Debugging** | When stuck, do they debug systematically? | | |

**Pass criteria:** Average 3.5+, no competency scored 1.

### Technical Deep Dive Scorecard

| Competency | Question(s) | Score (1-5) | Notes |
|-----------|-------------|-------------|-------|
| **Architecture thinking** | Can they design a system with appropriate components and boundaries? | | |
| **Trade-off analysis** | Do they consider and articulate trade-offs (consistency vs availability, speed vs accuracy)? | | |
| **Scale awareness** | Do they anticipate how the system behaves at 10x, 100x scale? | | |
| **Technical breadth** | Are they comfortable across the stack or dangerously narrow? | | |
| **Learning orientation** | When presented with an unfamiliar domain, do they ask good questions and adapt? | | |

**Pass criteria:** Average 3.5+, no competency scored below 2.

### Culture / Values Scorecard

| Competency | Question(s) | Score (1-5) | Notes |
|-----------|-------------|-------------|-------|
| **Ownership** | Tell me about a time you went beyond your role to solve a problem. | | |
| **Collaboration** | Describe working through a disagreement with a teammate. | | |
| **Growth mindset** | What is a skill you are actively developing? How? | | |
| **Resilience** | Describe a professional failure and what you learned. | | |
| **Alignment with values** | (Assessed throughout against {{PROJECT_NAME}}'s documented values) | | |

**Pass criteria:** Average 3.0+, no competency scored 1.

---

## 4. Take-Home vs Live Coding Decision Matrix

| Factor | Take-Home Favored | Live Coding Favored |
|--------|-------------------|---------------------|
| **Candidate anxiety** | Candidates perform better without live pressure | Candidate demonstrates composure under pressure |
| **Time investment** | 3-4 hours (candidate's schedule) | 60-90 minutes (scheduled with interviewer) |
| **Cheating risk** | Higher (can use AI, have help) | Lower (observed in real-time) |
| **Real-world signal** | Higher (reflects actual work conditions) | Lower (nobody codes with someone watching at work) |
| **Interviewer cost** | Low (async review) | High (1-2 engineers for 60-90 minutes) |
| **Completion rate** | 60-80% (some candidates drop out) | 95%+ (already scheduled) |
| **Evaluation consistency** | Higher (rubric applied to artifact) | Variable (depends on problem and interviewer) |
| **Best for level** | IC3+ (shows design judgment) | IC1-IC2 (fundamentals check) |

**Recommendation:** Use take-home for senior roles and live coding for junior/mid roles. Never use both — it is disrespectful of the candidate's time.

---

## 5. Interview Question Bank

### By Level

#### IC1 (Junior) Questions

| Category | Question | What Good Looks Like |
|----------|----------|---------------------|
| **Fundamentals** | Explain how HTTP request-response works from browser to server and back | Mentions DNS, TCP, request/response cycle, status codes |
| **Problem-solving** | [Simple algorithm problem — string manipulation, array traversal] | Correct solution, reasonable time complexity, tests edge cases |
| **Learning** | Walk me through how you learned [technology on resume]. What was hardest? | Shows self-directed learning, identifies specific challenges |
| **Collaboration** | How do you handle a code review with feedback you disagree with? | Seeks to understand, discusses respectfully, defers when appropriate |

#### IC2-IC3 (Mid-Senior) Questions

| Category | Question | What Good Looks Like |
|----------|----------|---------------------|
| **System design** | Design a URL shortener / notification system / rate limiter | Gathers requirements, considers scale, discusses trade-offs |
| **Technical judgment** | When would you choose a NoSQL database over SQL? Give a specific example. | Context-dependent answer, not dogmatic, considers data patterns |
| **Debugging** | Tell me about the hardest bug you have debugged. Walk me through your process. | Systematic approach, uses logging/tracing, considers hypotheses |
| **Influence** | Describe a time you changed a team's technical direction. How did you build consensus? | Evidence-based persuasion, empathy for opposing view, patience |

#### IC4+ (Staff+) Questions

| Category | Question | What Good Looks Like |
|----------|----------|---------------------|
| **Strategic thinking** | How would you evaluate whether to build or buy [system relevant to your product]? | Considers total cost of ownership, team capabilities, strategic importance, vendor risk |
| **Organizational impact** | Describe a technical initiative you led that affected multiple teams. How did you align them? | RFC process, stakeholder management, incremental buy-in |
| **Mentorship** | How do you develop senior engineers into staff-level contributors? | Specific mentoring examples, creates growth opportunities, provides constructive feedback |
| **Ambiguity** | You inherit a large codebase with no documentation and mounting customer complaints. What do you do in the first 2 weeks? | Prioritizes understanding over action, talks to people, identifies quick wins |

---

## 6. Debrief Process

### Debrief Meeting Structure (30-60 minutes)

1. **Individual scores first (5 min):** Each interviewer submits their scorecard BEFORE the debrief meeting. This prevents anchoring bias.
2. **Round-robin presentation (15-30 min):** Each interviewer presents their assessment, starting with the most junior interviewer (to prevent seniority bias). Share specific evidence, not feelings.
3. **Discussion (10-15 min):** Address disagreements, ask clarifying questions, identify blind spots.
4. **Decision (5 min):** Hiring manager makes the final call. Options: Strong Hire, Hire, No Hire, Need More Data.

### Decision Framework

| Outcome | Criteria | Action |
|---------|----------|--------|
| **Strong Hire** | Average score 4.0+ across all interviewers, no scores below 3 | Extend offer within 24 hours |
| **Hire** | Average score 3.5+, no more than one score of 2 (and not on a critical competency) | Extend offer within 48 hours |
| **No Hire** | Average score below 3.0, or any critical competency scored 1 | Reject with specific, kind feedback |
| **Need More Data** | Split decision (some strong yes, some strong no) | Additional interview focused on the contested area. Maximum one additional round. |

### Debrief Anti-Patterns

| Anti-Pattern | Why It Is Harmful | Fix |
|-------------|-------------------|-----|
| "I just did not get a good vibe" | Unfalsifiable, invites bias | Require specific behavioral evidence for every assessment |
| Discussing scores before the meeting | Anchoring bias — later opinions conform to first | Enforce written scorecard submission before meeting |
| Most senior person speaks first | Seniority bias — everyone conforms to the boss | Reverse seniority order for presentations |
| "Let's just take one more round to be sure" | Decision avoidance, wastes candidate's time | Maximum one additional round, decision within 48 hours |
| Rejecting a strong candidate because "we might find someone better" | The candidate you have is real, the hypothetical one is not | Evaluate against the bar, not against imagined alternatives |

---

## 7. Bias Mitigation Practices

### Structural Mitigations (Built Into Process)

| Mitigation | What It Prevents | How It Works |
|-----------|-----------------|-------------|
| **Standardized questions** | Inconsistency between candidates | Every candidate for the same role gets the same core questions |
| **Independent scoring** | Anchoring and conformity bias | Interviewers submit scores before seeing others' scores |
| **Structured rubrics** | Halo effect and gut feeling | Scoring is criterion-by-criterion, not holistic impression |
| **Diverse interview panels** | Similarity bias | At least one interviewer from a different demographic or functional background |
| **Resume blinding** | Name, school, and company bias | Remove names, photos, university names from initial review (if using ATS) |
| **Work sample tests** | Resume inflation | Evaluate actual work output, not claimed experience |

### Cognitive Biases to Watch For

| Bias | Description | Counter |
|------|------------|---------|
| **Halo effect** | One strong signal colors the entire assessment (e.g., "they went to MIT, so they must be great") | Score each competency independently. MIT does not guarantee debugging skills. |
| **Similarity bias** | Preferring candidates who remind you of yourself | Ask: "Would I score this the same if the candidate were from a completely different background?" |
| **Anchoring** | First impression disproportionately influences final assessment | Defer judgment until all evidence is collected. Re-evaluate initial impression at the end. |
| **Contrast effect** | Evaluating a candidate relative to the previous candidate instead of against the rubric | Always compare to the rubric, never to other candidates |
| **Confirmation bias** | Seeking evidence that confirms your initial impression | Actively look for disconfirming evidence after forming an impression |
| **Recency bias** | Remembering the end of the interview more than the beginning | Take notes throughout, review notes before scoring |

---

## Checklist

- [ ] Defined interview pipeline with {{INTERVIEW_ROUNDS}} stages and timing SLAs
- [ ] Trained all interviewers on structured interviewing, bias awareness, and legal boundaries
- [ ] Created scorecards for every interview stage with 1-5 scoring rubrics
- [ ] Built interview question bank organized by level and competency
- [ ] Chose take-home vs live coding approach based on the decision matrix
- [ ] Established debrief process with independent scoring and reverse-seniority presentation order
- [ ] Implemented at least 3 structural bias mitigations
- [ ] Documented interview process for candidates (transparency builds trust)
- [ ] Set up scorecard collection system (ATS, spreadsheet, or form) that enforces submission before debrief
- [ ] Scheduled quarterly interview process retrospective to identify and fix failure modes
