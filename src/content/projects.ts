import type { Project } from './types'

/**
 * Every claim below is taken from the project's own case study (repository
 * documentation) and marked accordingly. Where an older figure and a current one
 * disagree, the current one is used. Nothing here is estimated.
 *
 * No "Live Demo" link exists on purpose: both projects run locally in Docker
 * Compose and were only ever exposed through temporary Cloudflare Quick Tunnel
 * URLs, which change on every start and are not permanent.
 */
const base = import.meta.env.BASE_URL

export const projects: Project[] = [
  {
    id: 'voxmind',
    number: '01',
    name: 'VoxMind',
    kicker: 'Conversational AI · Voice · Grounded RAG',
    tagline: ['A voice assistant that ', { em: 'shows its evidence' }, ' and says so when it has none.'],
    summary:
      'A multi-user platform that transcribes speech, separates speakers, reads emotional and language signals, and answers from your own documents with citations the application has verified.',
    accent: '#a9c2d8',
    poster: {
      src: `${base}media/voxmind-poster.webp`,
      alt: 'VoxMind workspace showing a question answered from an uploaded document with the retrieved source and citation.',
      width: 1280,
      height: 720,
    },
    video: { src: `${base}media/voxmind-demo.mp4`, duration: '1:41', caption: 'VoxMind demo recording, about 100 seconds' },
    links: {
      github: 'https://github.com/ananyasingh1618/VoxMind',
      caseStudy: `${base}case-studies/VOXMIND_CASE_STUDY.pdf`,
    },
    stack: ['FastAPI', 'React', 'PostgreSQL + pgvector', 'Celery + Redis', 'faster-whisper', 'Docker Compose'],
    glance: ['Backend tests', 'Smoke checks', 'Browser journey'],
    overview: {
      about: {
        what:
          'VoxMind is a conversational intelligence platform. A signed-in user can speak or type, upload audio and documents, and get back a speaker-labelled transcript, per-turn emotion and language signals, and answers grounded in the documents they uploaded, with the supporting evidence shown beside the answer.',
        problem:
          'The gap between a voice demo and a system you could rely on. A basic assistant transcribes and talks, but it does not show where an answer came from, does not separate speakers, does not admit when the source material lacks the answer, and rarely isolates one user’s data from another’s.',
        audience:
          'Settings where a spoken interaction or a set of documents has to be understood and answered from, such as support conversations, and where an unsupported answer is worse than “I don’t have that information.”',
        why:
          'Trust is enforced by the application, not requested from the model: citations are checked against what retrieval actually returned, invalid ones are dropped, and the grounded / partially grounded / ungrounded label is computed by code.',
      },
      features: [
        { title: 'Speech to speaker-labelled transcript', text: 'Audio is normalised with ffmpeg, transcribed with faster-whisper, and merged with pyannote speaker segments by a deterministic alignment step into speaker_0 / speaker_1 turns.' },
        { title: 'Emotion and language signals', text: 'A trained emotion classifier per speaker turn, RoBERTa sentiment, BERT entities, rule-based intent and topics, and a sentiment-versus-vocal-emotion divergence signal that is explicitly not a deception detector.' },
        { title: 'Grounded answers with validated citations', text: 'Hybrid retrieval (pgvector plus full-text, reciprocal rank fusion, cross-encoder rerank) feeds a forced tool-call to the LLM. Citations are validated against retrieved chunk IDs before anything is stored.' },
        { title: 'Refuses instead of inventing', text: 'When nothing relevant is retrieved the answer is marked ungrounded, and a guardrail layer can modify or block a response before it is stored or spoken.' },
        { title: 'Streaming voice loop', text: 'The voice endpoint streams Server-Sent Events as each real stage finishes (listening, transcribing, analysing, retrieving, speaking), with a measured timing breakdown and interrupt support.' },
        { title: 'Secure multi-user isolation', text: 'Ownership checks on every conversation-scoped resource (404 for someone else’s), rotating and reuse-detecting refresh tokens, CSRF protection and Redis-backed rate limiting.' },
        { title: 'Recoverable background work', text: 'Heavy ML stages run on Celery with retries, an idempotency guard, orphan fencing and scheduled reconciliation of abandoned runs.' },
      ],
      challenges: [
        { title: 'A reranker returning NaN', challenge: 'Every reranker score was NaN, which broke saving the retrieval trace as JSON.', solution: 'Two causes were traced separately: a tokenizer call given a list of pairs instead of two parallel lists, and a float32 NaN on this CPU backend. The call was fixed and the model loads in float64.' },
        { title: 'Jobs nobody waited for', challenge: 'Twelve call sites dispatched pipeline stages and checked status once. That was silently correct in-process and wrong under Celery, so tests never caught it.', solution: 'A bounded polling helper joined the task-runner contract and all twelve call sites now use it, so Celery runs through the same service code.' },
        { title: 'Recovering work from a lost worker', challenge: 'If a worker died and its broker message vanished, a job stayed “running” forever, and a late orphan could overwrite a later decision.', solution: 'An idempotent reconciliation scheduled by Celery Beat, compare-and-swap terminal writes, and a delivery-count cap. A hard worker kill was verified to recover.' },
        { title: 'A guardrail guarding the wrong field', challenge: 'The stored answer held raw model output, so a blocked answer’s safe replacement would never have reached the client.', solution: 'The guardrail now overwrites the answer with the approved text and moves the raw output to an audit-only column no client path reads, confirmed by integration tests.' },
        { title: 'Fitting the ML stack into a 4 GB VM', challenge: 'Loading the emotion2vec+ checkpoint peaked near 2.8 GB and the worker was OOM-killed every time.', solution: 'The active emotion model is selectable at deployment. The lighter ravdess-v1 model is deployed and verified end to end; emotion2vec+ as the active model was not verified.' },
        { title: 'A key that could reach the wrong provider', challenge: 'An OpenAI-SDK client without an explicit base URL follows the environment, so where a key was sent depended on how the process launched.', solution: 'All clients are built through one function that pins a base URL, and regression tests capture outgoing requests to assert each key reaches only its own host.' },
      ],
    },
    technical: {
      implementation: [
        { title: 'One pipeline contract', text: 'Every stage follows a common PipelineStage contract, so the same code runs in-process for development and tests or on the Celery worker. A stage that cannot run reports “unavailable” rather than inventing a result.' },
        { title: 'Hybrid retrieval', text: 'Cosine search in pgvector (ivfflat) and PostgreSQL full-text search are fused by reciprocal rank fusion (k = 60), reranked by a cross-encoder, and the top five chunks are returned. The full fusion trace is persisted for later inspection.' },
        { title: 'Grounding computed by code', text: 'The model must answer through a single forced tool call. Every citation is checked against retrieved chunk IDs, and the status is derived from that check. Retrieved chunks are scanned for prompt-injection patterns first.' },
        { title: 'Bounded context', text: 'One assembler builds the LLM context from the question, recent turns, a rolling summary, current-turn signals and retrieved chunks, trimmed to a token budget in a fixed order that never drops the question or instructions.' },
        { title: 'Stage-level streaming', text: 'Progress streams per stage over SSE. Token-by-token streaming is deliberately not implemented because the answer is a structured output that must be validated first.' },
      ],
      choices: [
        { group: 'Frontend', items: [{ name: 'React, TypeScript, Vite', why: 'Single-page app; the access token is held in memory only.' }, { name: 'MediaRecorder', why: 'Browser capture for the voice control.' }] },
        { group: 'Backend', items: [{ name: 'FastAPI', why: 'REST API plus the SSE voice loop; owns auth, ownership checks, rate limiting and guardrails.' }, { name: 'Celery worker + Beat', why: 'Model-heavy stages on two queues, with scheduled reconciliation. Only a job ID crosses the broker.' }] },
        { group: 'Database', items: [{ name: 'PostgreSQL 16 + pgvector', why: 'System of record, 384-dimension vectors and the authoritative status of every job.' }, { name: 'Redis', why: 'Celery broker and result backend, and the counters behind rate limiting.' }, { name: 'MinIO', why: 'S3-compatible storage behind an abstraction that also has a local-filesystem backend.' }] },
        { group: 'AI / ML', items: [{ name: 'faster-whisper (tiny, int8, CPU)', why: 'Speech-to-text without an external service or credential.' }, { name: 'pyannote.audio 3.1', why: 'Speaker diarization, gated on Hugging Face.' }, { name: 'Emotion classifier', why: 'Deployed model is ravdess-v1; emotion2vec+ is supported behind the same interface.' }, { name: 'all-MiniLM-L6-v2 + cross-encoder', why: 'Embeddings for semantic retrieval and a joint query-chunk reranker.' }, { name: 'OpenAI-compatible LLM client', why: 'Groq in the demo; an Anthropic provider is implemented and unit-tested but was not exercised live.' }, { name: 'facebook/mms-tts-eng', why: 'Local text-to-speech so the voice loop needs no external speech service.' }] },
        { group: 'Infrastructure', items: [{ name: 'Docker Compose + Caddy', why: 'Six services on a private network; only Caddy publishes a port, bound to 127.0.0.1.' }] },
        { group: 'Testing', items: [{ name: 'pytest, Vitest, ruff, mypy, oxlint', why: 'Backend tests run against real Postgres.' }, { name: 'GitHub Actions CI', why: 'Five runs across three pushed passes, all successful.' }] },
        { group: 'Deployment', items: [{ name: 'Local containers, optional Cloudflare Quick Tunnel', why: 'Costs nothing to run. The tunnel URL is temporary, so VoxMind is a demo hosted from a laptop, not an always-on service.' }] },
      ],
      architecture: {
        layers: [
          { name: 'Client', nodes: [{ label: 'React SPA', detail: 'Auth pages, conversation workspace, voice control, analytics, insights and evaluation dashboards. Access token in memory only.' }] },
          { name: 'Edge', nodes: [{ label: 'Caddy', detail: 'Serves the built frontend and reverse-proxies /api on one origin, bound to 127.0.0.1, rewriting X-Forwarded-For so the rate limiter cannot be spoofed.' }] },
          { name: 'API', nodes: [{ label: 'FastAPI', detail: 'Authentication, ownership checks, rate limiting, RAG orchestration, the guardrail layer and the SSE voice loop.' }] },
          { name: 'Workers & models', nodes: [
            { label: 'Celery worker + Beat', detail: 'Runs ML stages on two queues and schedules reconciliation of abandoned runs.' },
            { label: 'ML models (CPU)', detail: 'faster-whisper, pyannote, emotion classifier, sentiment and NER, MiniLM embeddings, cross-encoder, MMS-TTS.' },
            { label: 'LLM provider', detail: 'OpenAI-compatible API (Groq in the demo), called through a forced structured tool call.' },
          ] },
          { name: 'State', nodes: [
            { label: 'PostgreSQL + pgvector', detail: 'Users, conversations, transcripts, chunks with vector(384), retrieval traces, guardrail decisions, evaluation runs and pipeline_runs.' },
            { label: 'Redis', detail: 'Celery broker and results, plus rate-limit counters.' },
            { label: 'MinIO', detail: 'Uploaded audio, documents and emotion-model artifacts.' },
          ] },
        ],
        flowTitle: 'One voice turn',
        flow: [
          { label: 'Audio', detail: 'ffmpeg decodes to 16 kHz mono and validates.' },
          { label: 'Transcribe', detail: 'faster-whisper produces the transcript.' },
          { label: 'Speakers', detail: 'pyannote segments are aligned into turns.' },
          { label: 'Signals', detail: 'Emotion, sentiment, entities, intent, topics.' },
          { label: 'Retrieve', detail: 'Vector + full-text, fused, then reranked.' },
          { label: 'Generate', detail: 'Forced tool call to the LLM.' },
          { label: 'Validate', detail: 'Citations checked; grounding computed.' },
          { label: 'Guardrails', detail: 'Approve, modify or block.' },
          { label: 'Speak', detail: 'Local text-to-speech, stored in history.' },
        ],
        note: 'Components are exactly those in the VoxMind case study. Hover or focus a node for its role.',
      },
      metrics: [
        { value: 358, suffix: ' passed', label: 'Backend tests', result: '358 passed, 0 failed, 5 skipped (credential or broker gated), against real Postgres.', demonstrates: 'Source: final freeze pass. Broad regression coverage of auth, isolation, RAG and pipeline code.' },
        { value: 100, suffix: ' passed', label: 'ML tests', result: '100 passed, 0 failed.', demonstrates: 'Evaluation logic and ML utilities are unit tested. Source: final freeze pass.' },
        { value: 52, suffix: ' passed', label: 'Frontend tests', result: '52 passed (Vitest), 0 failed.', demonstrates: 'The UI layer is covered too. Source: final freeze pass.' },
        { value: 48, suffix: '/48', label: 'Smoke checks', result: '48 of 48 checks passed through a public Cloudflare Quick Tunnel over HTTPS.', demonstrates: 'Auth rotation, CSRF, cross-user 404, upload sniffing and rate limiting work on a real running stack.' },
        { value: 14, suffix: '/14', label: 'Browser journey', result: 'A scripted Chromium journey completed 14 of 14 steps end to end.', demonstrates: 'Account, ingest, grounded answer, audio transcription, emotion and a voice turn all worked together.' },
        { value: 0.05, decimals: 4, label: 'Speech-to-text WER', result: 'Average word error rate 0.0500 (CER 0.0363) with faster-whisper tiny on CPU.', demonstrates: 'Small benchmark: n = 5, and only one reference is independent ground truth. Stated in the source.' },
        { value: 0.6722, decimals: 4, label: 'Emotion accuracy', result: 'Accuracy 0.6722, macro-F1 0.6899 on a held-out, speaker-independent RAVDESS split (n = 180, 8 classes).', demonstrates: 'Realistic performance for the deployed ravdess-v1 model, reported without rounding up.' },
      ],
      metricsNote: 'Copied from the repository’s own documentation and case study. Benchmarks are small and labelled as such; nothing is a production claim.',
    },
  },
  {
    id: 'devforge',
    number: '02',
    name: 'DevForge',
    kicker: 'Full-stack AI · Retrieval · Evaluation',
    tagline: ['From idea to engineering docs, and code answers with ', { em: 'citations that cannot be fabricated' }, '.'],
    summary:
      'An AI workspace that turns a project idea into versioned requirements, PRD, architecture, epics and tasks, then answers questions about a connected GitHub repository, citing only sources retrieval actually returned.',
    accent: '#c9b8e6',
    poster: {
      src: `${base}media/devforge-poster.webp`,
      alt: 'DevForge requirements page with a project idea entered for a community library web app.',
      width: 1280,
      height: 800,
    },
    video: { src: `${base}media/devforge-demo.mp4`, duration: '2:50', caption: 'DevForge demo recording, 2 minutes 50 seconds' },
    links: {
      github: 'https://github.com/ananyasingh1618/DevForge',
      caseStudy: `${base}case-studies/DEVFORGE_CASE_STUDY.pdf`,
    },
    stack: ['React 19', 'Node + Express 5', 'PostgreSQL 16', 'FastAPI', 'tree-sitter', 'Docker Compose'],
    glance: ['Golden cases matched', 'Retrieval Recall@5', 'Invalid citations'],
    overview: {
      about: {
        what:
          'DevForge is a workspace that turns a project idea into a chain of structured, versioned engineering documents using a language model, and lets a user connect a GitHub repository to ask grounded, cited questions about the code and run an AI code review. It is a monorepo of a React frontend, a Node/Express API on PostgreSQL, and a Python FastAPI AI service.',
        problem:
          'Two things: turning an idea into requirements, PRD, architecture and tasks is slow and drifts apart when written by hand, and answers about code are only useful if they can be checked. Models describe code confidently, including code they have not seen.',
        audience:
          'Anyone who wants an idea drafted into traceable engineering documents, or wants questions about a repository answered with evidence they can verify.',
        why:
          'The goal was trustworthiness rather than breadth. Every AI capability fails honestly when a provider or credential is missing, and “every citation is real” holds by construction, not by prompt wording.',
      },
      features: [
        { title: 'Five-stage document chain', text: 'Requirements, PRD, architecture, epics and tasks, each generated from the active version of the previous one. Every stage is versioned, editable, comparable and can be regenerated.' },
        { title: 'Structured, validated output', text: 'Model output is constrained to a Pydantic schema and validated before it is returned. Invalid output is an error, never a partial result.' },
        { title: 'Repository indexing', text: 'Python, TypeScript and JavaScript are parsed with tree-sitter into symbols, chunked per symbol, and secret-shaped strings are redacted before anything is stored, embedded or prompted.' },
        { title: 'Cited code Q&A and review', text: 'Hybrid search finds sources; the model selects them by number and the API fills in paths and line ranges itself. With no evidence, a deterministic “insufficient evidence” answer is returned without calling the model.' },
        { title: 'Durable background jobs', text: 'Indexing, Q&A and review run as jobs in a PostgreSQL-backed queue with retries, timeouts, cooperative cancellation and crash recovery.' },
        { title: 'Multi-user isolation', text: 'Every project query filters by owner through one helper, re-checked by a second middleware. Foreign projects return 404, never 403, so existence is not leaked.' },
        { title: 'Evaluations page', text: 'An offline benchmark of 109 golden cases with regression gates, shown in the app itself.' },
      ],
      challenges: [
        { title: 'Citations that cannot be hallucinated', challenge: 'An answer with a fake file path is worse than no answer.', solution: 'The model outputs only source numbers; the API resolves paths and lines from its own retrieval records and drops findings without a valid citation. Invalid citations measured 0% in evaluation.' },
        { title: 'A benchmark that proved little', challenge: 'An early 14-case benchmark looked perfect but proved almost nothing.', solution: 'It grew to 67 retrieval, 21 Q&A and 21 review cases across three languages, with a benchmark audit and a hidden anti-overfitting fixture. That exposed two real ranking defects (no stopword filtering, no fuzzy matching), which were fixed and the cutoff re-tuned.' },
        { title: 'Durable jobs without a broker', challenge: 'Indexing and embedding can outlast a request, and adding Redis meant one more service to run and secure.', solution: 'An in-process worker claims jobs from PostgreSQL with SELECT … FOR UPDATE SKIP LOCKED, with retries, timeouts, cooperative cancellation and lease-expiry recovery. Cancellation is cooperative, not preemptive, and that is documented.' },
        { title: 'Real providers behave differently from their docs', challenge: 'Live runs exposed a hard 3-requests-per-minute Voyage cap and transient Gemini overloads.', solution: 'Bounded retry with backoff for embeddings, a per-call timeout and targeted retry for Gemini, and per-job-type timeouts, each fix committed after being reproduced live.' },
        { title: 'Honest failure over fake success', challenge: 'Demo-friendly fallbacks would hide real problems.', solution: 'Every AI path returns a real 503 or error when a credential is missing, and the UI shows disabled controls with dependency messages instead of buttons that would fail.' },
        { title: 'A rate limiter that saw one user', challenge: 'Behind a reverse proxy every client shared the proxy’s IP, so limits throttled everyone as one.', solution: 'A trusted-proxy hop setting and Caddy forwarding a single resolved client address. A probe confirmed per-client buckets, ineffective spoofed headers and a 429 after 20 auth calls.' },
      ],
    },
    technical: {
      implementation: [
        { title: 'Model selects numbers, API resolves citations', text: 'Structured output can only choose sources by number. It never returns a path, symbol or line. A confident answer citing zero valid sources is replaced by the insufficient-evidence answer, and empty evidence skips the model call entirely.' },
        { title: 'Hybrid retrieval with an adaptive cutoff', text: 'Semantic cosine similarity (dominant) is combined with token overlap, symbol matching and file-path matching. Results are kept only within a relative margin (0.78) of the top result, returning fewer, better sources instead of padding.' },
        { title: 'Retrieved code is untrusted data', text: 'At most 8 numbered excerpts and 16,000 characters are sent. Prompts instruct the model to ignore instruction-like text inside code and never repeat a secret. No tool use is granted to the model.' },
        { title: 'Structured-output layer', text: 'Requirements, PRD, architecture, epics, tasks, Q&A and review share one schema-validated layer. Gemini is preferred when configured, Claude is a supported alternative, and missing credentials return an honest 503.' },
        { title: 'Hardened production-style stack', text: 'Caddy is the only entry point, non-root and read-only with capabilities dropped, proxying an allowlist of API paths. Postgres, the API and the AI service publish no ports, and the API validates its environment at startup.' },
      ],
      choices: [
        { group: 'Frontend', items: [{ name: 'React 19, TypeScript, Vite', why: 'SPA that talks only to the API, same-origin in production.' }, { name: 'Tailwind CSS v4, React Router v7', why: 'Styling and routing.' }] },
        { group: 'Backend', items: [{ name: 'Node.js, Express 5, Prisma 7, Zod', why: 'The only service that touches PostgreSQL and GitHub; holds auth, ownership, citation resolution and the job worker.' }, { name: 'FastAPI + Pydantic', why: 'Puts model, parsing and embedding code next to the Python libraries that provide them, and keeps the model service free of user data.' }] },
        { group: 'Database', items: [{ name: 'PostgreSQL 16', why: 'State, sessions, versions, the job queue (SKIP LOCKED instead of Redis) and embeddings as Float[] with cosine in Node. That is fine at per-project scale, and pgvector is the documented upgrade path.' }] },
        { group: 'AI / ML', items: [{ name: 'Gemini (preferred) or Claude', why: 'A free tier lowers the barrier to run it; both sit behind one structured-output layer.' }, { name: 'Voyage voyage-code-3', why: 'Code embeddings, reused per commit.' }, { name: 'tree-sitter', why: 'Symbol extraction for Python, TypeScript and JavaScript.' }] },
        { group: 'Infrastructure', items: [{ name: 'Docker Compose + Caddy', why: 'A same-origin proxy avoids cross-site cookies and reduces CORS surface.' }, { name: 'bcrypt, AES-256-GCM, helmet, express-rate-limit', why: 'Passwords, token encryption at rest, headers and throttling. Sessions are opaque, hashed and revocable.' }] },
        { group: 'Testing', items: [{ name: 'Vitest, Testing Library, pytest, Playwright', why: 'Unit, component, service and browser checks, plus an offline deterministic evaluation harness.' }] },
        { group: 'Deployment', items: [{ name: 'Local production-style stack, optional Cloudflare Quick Tunnel', why: 'Reachable for a demo without paid hosting. The tunnel URL is temporary and is not published.' }] },
      ],
      architecture: {
        layers: [
          { name: 'Client', nodes: [{ label: 'React 19 SPA', detail: 'UI, forms, version viewers and editors, evidence display. Talks only to the API, same-origin /api in production.' }] },
          { name: 'Edge', nodes: [{ label: 'Caddy', detail: 'Serves the built SPA and proxies only an allowlist of /api paths, with a 1 MB body limit and security headers. Non-root, read-only.' }] },
          { name: 'Application', nodes: [{ label: 'API: Node, Express 5, Prisma 7', detail: 'Authentication, ownership, retrieval ranking, citation resolution, background jobs and all database access.' }] },
          { name: 'Services', nodes: [
            { label: 'PostgreSQL 16', detail: 'Sessions, versions, jobs, chunks and embeddings. Internal network only.' },
            { label: 'AI service: FastAPI', detail: 'Schema-validated model calls, tree-sitter parsing and embedding generation. Reachable only on the internal network.' },
            { label: 'GitHub REST API', detail: 'Accessed with the user’s token, host-pinned. Only the API talks to it.' },
          ] },
          { name: 'Providers', nodes: [
            { label: 'Gemini or Claude', detail: 'Text generation behind one structured-output layer. Gemini is preferred when configured.' },
            { label: 'Voyage embeddings', detail: 'voyage-code-3 code embeddings.' },
          ] },
        ],
        flowTitle: 'Citation-safe retrieval',
        flow: [
          { label: 'Index', detail: 'Connected repo parsed with tree-sitter into symbols.' },
          { label: 'Chunk + embed', detail: 'One chunk per symbol, embedded with voyage-code-3.' },
          { label: 'Retrieve', detail: 'Hybrid score with an adaptive cutoff.' },
          { label: 'Ask the model', detail: 'At most 8 numbered source excerpts.' },
          { label: 'Cite', detail: 'The model picks numbers; the API resolves file and lines.' },
          { label: 'No evidence?', detail: 'A local insufficient-evidence answer, with no model call.' },
        ],
        note: 'Components are exactly those in the DevForge case study. Hover or focus a node for its role.',
      },
      metrics: [
        { value: 106, suffix: '/109', label: 'Golden cases matched', result: '106 of 109 offline cases matched their exact expectation; all 13 regression gates passed.', demonstrates: 'The evaluation gates regressions. It uses mock providers and a fixture dataset.' },
        { value: 95.8, decimals: 1, suffix: '%', label: 'Retrieval Recall@5', result: 'Recall@5 95.8% (Recall@3 93.2%) over 64 answerable retrieval cases.', demonstrates: 'The hybrid ranking finds the right code. Measured with mock embeddings on a small benchmark.' },
        { value: 95.3, decimals: 1, suffix: '%', label: 'Retrieval MRR', result: 'MRR 95.3% with Precision@1 92.5%.', demonstrates: 'The correct source is usually ranked first. Same fixture benchmark.' },
        { value: 0, suffix: '%', label: 'Invalid citations', result: '0% invalid citations and 0% unsupported claims across 21 Q&A cases.', demonstrates: 'Citation grounding logic holds. Measured with hand-authored mock answers, so it tests the logic, not live model quality.' },
        { value: 483, suffix: ' passed', label: 'API tests', result: '483 passed (run 2026-09-20).', demonstrates: 'Includes ownership, authentication, rate-limit and secret-pattern tests.' },
        { value: 132, suffix: ' passed', label: 'Frontend tests', result: '132 passed. One timing-sensitive test flaked once under load and passed on rerun.', demonstrates: 'The UI is covered, and flakiness is reported rather than hidden.' },
        { value: 154, suffix: ' passed', label: 'AI-service tests', result: '154 passed (pytest); the evaluation package adds 168 passed.', demonstrates: 'Schema validation, parsing and provider handling are tested.' },
        { value: 67, suffix: '/67', label: 'Smoke and exposure checks', result: '67 of 67 checks passed against the local stack and its temporary public tunnel.', demonstrates: 'Isolation, traversal evasions, CORS and secret leakage were probed on a running deployment.' },
      ],
      metricsNote: 'From the DevForge case study, verified against repository commit cb6efe8 on 2026-09-20. The evaluation is offline and deterministic: a fixture benchmark, not proof of correctness on arbitrary code.',
    },
  },
]
