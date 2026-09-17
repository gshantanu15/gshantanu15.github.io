# Portfolio Site Content Draft

Status: **Awaiting user approval. Do not use in production yet.**

This document is the editorial source of truth for the portfolio rebuild. Text in editorial notes is not public website copy.

## Global identity and navigation

**Site name:** Shantanu Garg

**Primary navigation:** Home · Work · About

**Contact links:** Email · LinkedIn · GitHub

**Footer:**

> Shantanu Garg · Graduate Professional from Tampere University  
> Built with semantic HTML, CSS, and a little JavaScript.

## Home

### Metadata

**Page title:** Shantanu Garg — Graduate Professional

**Description:** Portfolio of Shantanu Garg, a Tampere University Computer Science graduate working across practical AI, web applications, APIs, and collaborative product development.

### Hero

**Eyebrow:** Computer Science · Tampere, Finland

**Headline:** Shantanu Garg.

**Subheading:** Graduate Professional from Tampere University.

**Introduction:**

> I am a Computer Science graduate with a minor in Machine Learning and Signal Processing. I build practical software across AI, web applications, and APIs, and I value thoughtful teamwork from early product decisions through testing and delivery.

**Primary action:** View selected work

**Secondary action:** About and experience

### Selected work introduction

**Heading:** Selected work

> A focused selection of independent and collaborative projects that reflects how I approach product thinking, implementation, testing, and iteration.

### Featured project: Voice Agent Lab

**Label:** AI · Voice systems

**Summary:**

> A consent-first bilingual voice-agent prototype for real-estate lead qualification. I designed its conversation flow, retrieval-backed knowledge behavior, and safety guardrails around a Python integration with Retell AI, with conversational evaluations recorded using Sarvam AI.

**Action:** Read the project story

### Featured project: Counsel

**Label:** In development · Full stack

**Summary:**

> A practice-management application in development for school academic counsellors. The work has strengthened my skills in product scoping, full-stack development, API design, privacy-aware thinking, and reliable testing.

**Action:** Read the project story

### Featured project: AI-assisted Object Recognition in AR

**Label:** Demola · Team project

**Summary:**

> A collaborative augmented-reality project exploring how physical objects can be recognized and paired with aligned digital twins. I contributed to the 3D asset flow through Tripo3D API integration and manual end-to-end testing.

**Action:** Read the project story

### Featured project: Satellites - Parallel Programming Simulation

**Label:** Tampere University coursework · Parallel computing

**Summary:**

> An individual course project that parallelizes a satellite simulation’s CPU-side orbital physics with OpenMP and moves its per-pixel rendering workload to OpenCL, targeting GPU execution when available.

**Action:** Read the project story

**Demo:** Show a silent, side-by-side comparison of the sequential reference and parallel implementation directly in the card. Use a static poster when JavaScript is unavailable or reduced motion is requested.

**Section action:** View all projects

### Experience preview

**Heading:** Recent experience

**8Bit Arcade — Junior Developer · June 2024–February 2025**

> Contributed to a Next.js platform and developer portal, working across TypeScript, authentication, automated communications, cloud-hosted assets, and collaborative delivery practices.

**PHZ Full Stack Oy — Summer Intern · May–August 2022**

> Developed a Python API that supported automated document-signing workflows and integrated it with existing command-line processes.

**Action:** View experience and education

### Education preview

**Heading:** Education

**Tampere University — Computer Science graduate, 2026**

> Minor in Machine Learning and Signal Processing. My bachelor's thesis examined how multi-agent frameworks can support requirements-engineering work.

**Thesis:** *Comparative Analysis of Multi-Agent Frameworks for Requirements Engineering*

**Action:** Read about the thesis

### Contact callout

**Heading:** Let’s connect

> If you would like to discuss a role, a project, or a shared technical interest, the best ways to reach me are by email or LinkedIn.

**Actions:** Email me · LinkedIn · GitHub

## Work

### Metadata

**Page title:** Work — Shantanu Garg

**Description:** Selected AI, parallel computing, API, full-stack, AR, and frontend projects by Shantanu Garg.

### Introduction

**Eyebrow:** Selected work

**Heading:** Projects shaped by practical problems.

> These projects span independent development, team delivery, and work in progress. Each entry focuses on the problem, my contribution, and the capabilities developed along the way.

### Voice Agent Lab

**Label:** Independent project · AI and voice systems

**Context:**

> Outbound voice agents need to qualify leads without losing consent, conversational flexibility, or control over the facts they communicate.

**Providers:**

> Retell AI is used for the outbound-call Python integration. Sarvam AI was used for the published conversational evaluations; the demo recordings are evidence of the conversation design and are not recordings of the Retell integration.

**My role:**

> I developed a consent-first prototype and its conversation contract for bilingual English-Hindi real-estate lead qualification.

**What I did:**

- Designed a permission-first opening and a qualification flow that tracks information supplied out of order.
- Created retrieval-backed behavior for concise answers grounded in a curated project knowledge base.
- Added opt-out handling, prompt-manipulation guardrails, safe spoken-language formatting, and structured post-call outcomes.
- Optionally, the Python integration can be used with validation, secret-safe error handling, dependency injection, and network-free tests.

**Result:**

> The repository provides an executable prototype and a set of consented evaluation recordings covering normal, bilingual, early-exit, knowledge-retrieval, and adversarial conversations.

**Demo recording:** Bilingual English-Hindi evaluation recorded with Sarvam AI. The participant consented to publication.

**Capabilities:** Python · Retell AI · Sarvam AI · Conversation design · Retrieval · Safety and testing

**Link:** [View the Voice Agent Lab repository](https://github.com/gshantanu15/voice-agent-lab)

### Counsel

**Label:** In development · Full-stack product

**Context:**

> School academic counsellors need a focused way to coordinate student work without turning a sensitive, relationship-driven practice into a generic administration system.

**My role:**

> I am contributing to the development of a practice-management application shaped around the day-to-day needs of academic counsellors.

**What I am developing:**

- Turning a broad product idea into a deliberately scoped application.
- Building experience across connected frontend, backend, and data concerns.
- Applying API design, privacy-aware thinking, and role-sensitive product decisions.
- Strengthening testing and delivery practices while the application continues to evolve.

**Current outcome:**

> The application is in development. Its scope and presentation may change as the product is heavily tested and refined.

**Capabilities:** Product scoping · Full-stack development · API design · Privacy awareness · Testing

**Public link:** None at launch.

### AI-assisted Object Recognition in AR

**Label:** Demola · Collaborative project

**Situation:**

> The team explored how real-world objects could be recognized and tracked so aligned digital twins could be displayed in augmented reality, with potential value for industrial use cases.

**Task:**

> My responsibility focused on supporting the 3D asset flow and helping verify that the experience worked coherently from one end of the system to the other.

**Action:**

- Integrated the Tripo3D API into the project workflow.
- Supported the path from source imagery to usable 3D assets.
- Supported object-recognition training with Vuforia Engine and integration into the Unity application with its C# backend.
- Performed manual end-to-end testing and collaborated with the wider team to identify integration issues and move the shared demonstration toward completion.

**Result:**

> The team delivered a successful demonstration that received a positive response and encouraging delivery feedback from the customer. Achieving that outcome depended on close teamwork across the AR experience, API integration, 3D assets, object-recognition training, Unity/C# development, and end-to-end testing.

**Capabilities:** Augmented reality · Unity/C# · Vuforia Engine · Tripo3D API · 3D asset workflows · E2E testing

**Public link:** None at launch.

### Smart Expense Tracker API

**Label:** Independent project · Backend API

**Context:**

> A small expense tracker provides a clear way to practise the fundamentals of creating a REST API service.

**My role:**

> I built a basic FastAPI service for recording and summarizing personal expenses.

**What I did:**

- Implemented create, list, filter, total, and delete REST operations.
- Added straightforward input validation and JSON-based persistence.
- Documented local and Docker-based ways to run and test the service.

**Result:**

> This is intentionally a basic project that demonstrates how a simple REST API service can be created with FastAPI.

**Capabilities:** Python · FastAPI · REST · pytest · Docker · Persistence

**Link:** [View the Smart Expense Tracker API repository](https://github.com/gshantanu15/diligent_expense_tracker_api_2026)

### FlipOff

**Label:** Enhanced open-source fork · Frontend

**Lead:** A forked implementation to make a more realistic and interactive browser-based split-flap display.

**Context:**

> FlipOff turns a browser or television into a retro split-flap display without requiring specialized hardware.

**My role:**

> I extended an existing open-source project into a more realistic and interactive web experience while retaining clear attribution to the original work.

**Major enhancements I implemented:**

> The main focus of this project is the set of frontend and interaction improvements added to the original implementation.

- Reworked the active tile into a multi-part split-flap animation with a visible center hinge.
- Added custom message entry, wrapping, splitting, and vertical centering for a 22-by-5 board.
- Added per-tile audio variation, keyboard controls, fullscreen behavior, and a volume toggle.
- Refined responsive presentation across mobile screens, browsers, and large displays.

**Result:**

> The enhanced fork is published as a static web application and can also run locally without a build step.

**Capabilities:** HTML · CSS · JavaScript · Animation · Web audio · Responsive design

**Links:** [Open the live project](https://gshantanu15.github.io/flipoff-forked/) · [View the enhanced fork](https://github.com/gshantanu15/flipoff-forked)

**Attribution:** Enhanced fork of the original FlipOff project; the repository retains the original implementation and license information.

### Satellites - Parallel Programming Simulation

**Label:** Tampere University coursework · Parallel computing

**Lead:** A satellite simulation that distributes computation-heavy orbital physics and pixel rendering across parallel CPU and OpenCL workloads.

**Context:**

> The supplied simulation models 64 satellites moving around a mouse-controlled black hole and calculates the colour of every pixel in a 1920-by-1024 display. Repeated physics updates and per-pixel colour calculations make both stages computationally demanding.

**My role:**

> I completed the exercise individually during a Parallel Computing course at Tampere University, working from university-provided starter code and implementing the parallelization and optimization work within that foundation.

**What I did:**

- Parallelized the satellite physics loop with OpenMP while keeping each satellite’s temporary position and velocity independent during an update.
- Implemented the per-pixel rendering workload as a two-dimensional OpenCL kernel, targeting a GPU when available and retaining the program’s CPU-device fallback.
- Reduced repeated work in the physics calculation by precomputing the time step and simplifying the distance and acceleration calculations.
- Configured release-oriented compiler options including optimization, fast floating-point behavior, AVX2, and OpenMP support.
- Used the supplied sequential reference routines and early-frame comparisons to check satellite state and rendered-pixel correctness.
- Retained reporting for physics, rendering, and total frame latency so the sequential and parallel paths can be compared on the same machine.

**Validation and result:**

> The completed implementation combines OpenMP for CPU-side physics with OpenCL for per-pixel rendering and SDL2 for display. Its built-in checks compare the first frames with the supplied sequential reference before regular execution continues. Published performance wording must be limited to measurements reproduced with the same seed, scene settings, resolution, and hardware; do not claim a numerical speed-up unless that comparison has been verified.

**Demo:** A silent, side-by-side comparison of the sequential reference and parallel implementation using the same deterministic seed and scene settings. Label both sides clearly. Show reproduced latency values only if the benchmark is stable and the OpenCL device is identified; otherwise omit numerical values and present the media as an implementation demonstration.

**Capabilities:** C · OpenMP · OpenCL · SDL2 · Parallel computing · Performance optimization

**Public link:** None at launch.

**Attribution:** Individual course exercise built by parallelizing and optimizing Tampere University-provided starter code. Do not publish the starter-code authors’ email addresses, project source, or executable.

### Work page closing callout

**Heading:** Interested in how I work?

> My experience and education show the broader path behind these projects—from collaborative delivery to research and student leadership.

**Action:** About and experience

## About

### Metadata

**Page title:** About — Shantanu Garg

**Description:** Experience, education, leadership, and earlier activities of Shantanu Garg.

### Introduction

**Eyebrow:** About

**Heading:** I learn by building, testing, and working with others.

> I am a Computer Science graduate from Tampere University with a minor in Machine Learning and Signal Processing. My experience spans web development, APIs, applied AI, collaborative product work, and student leadership. My interests include work involving AI and machine learning, as well as sustainability practices. I am currently exploring cybersecurity in an increasingly volatile AI era.

**Editorial note:** Do not repeat the portrait on the About page. The circular portrait remains on Home.

#### At a glance

Present a compact editorial fact panel beside the About introduction on desktop, without an additional portrait or decorative image.

- **Graduate:** Computer Science · 2026
- **Minor:** Machine Learning and Signal Processing
- **Building:** Practical AI, web, and API products
- **Exploring:** Cybersecurity in the AI era
- **Interested in:** AI, machine learning, and sustainability

### Experience

**Heading:** Experience

#### 8Bit Arcade

**Role:** Junior Developer  
**Period:** June 2024–February 2025

> I contributed to the migration of static content into a dynamic Next.js platform and helped develop a portal for game developers. My work included TypeScript, authentication and authorization, automated email communications, cloud-hosted assets, and collaborative trunk-based delivery.

**Capabilities:** Next.js · TypeScript · Authentication · AWS services · Team delivery

#### PHZ Full Stack Oy

**Role:** Summer Intern  
**Period:** May–August 2022

> I developed a Python API that supported automated document-signing workflows and connected it with existing shell-based processes. The internship strengthened my experience in API development, Python, workflow automation, and system integration.

**Capabilities:** Python · API development · Automation · System integration

### Education

**Heading:** Education

#### Tampere University

**Qualification:** Computer Science graduate, 2026  
**Minor:** Machine Learning and Signal Processing

> My studies combined software development with machine learning and signal-processing foundations. They culminated in a bachelor's thesis examining how agent-based AI frameworks can support requirements-engineering work.

#### Bachelor’s thesis

**Title:** Comparative Analysis of Multi-Agent Frameworks for Requirements Engineering

> An analytical, literature-based comparison of LangChain and AutoGen for supporting requirements-engineering tasks. The thesis considers how different agent structures, coordination approaches, and framework capabilities relate to the iterative and reliability-sensitive nature of requirements work.

**Topics:** Requirements engineering · Multi-agent systems · Agentic AI · Framework comparison

**Public link:** https://trepo.tuni.fi/handle/10024/237688

### Leadership

**Heading:** Leadership

#### TaSciEn — Tampere Science and Engineering Students’ Association

**Chairperson · 2023**

> Led the board, represented international bachelor’s students, supported association goals, and helped new students integrate into university life.

**Treasurer · 2022**

> Supported the association’s financial administration and gained practical experience in responsibility, coordination, and student-led governance.

### Earlier activities

**Heading:** Earlier activities

> Before university, sustainability, service, and cultural exchange were recurring parts of my school life. I served on Vidyashilp Academy’s Fairtrade Steering Committee, participated in activities connected with environmental sustainability and the Sustainable Development Goals, raised funds supporting free cataract surgery, and joined a student exchange programme in Hannover, Germany, in September 2019.

**Editorial note requiring confirmation:** Confirm the exact name and wording of the SDG-related activities before this paragraph is approved for production. The other statements preserve claims from the existing portfolio.

### Early hardware work

**Heading:** Early hardware work

> Before university, I used school and summer projects to explore energy systems, electronics, and physical computing. These small builds helped me turn theory into hands-on experimentation.

#### Solar-Powered Induction Cooktop

> A school product concept combining solar energy with semiconductor-based induction cooking. I presented the prototype at the Innovision Product Launch event, where it received first place, and extended my learning through short industry exposure to solar-energy and semiconductor work.

**Capabilities:** Product prototyping · Solar energy · Semiconductor concepts

**Visual:** A fixed-size manual carousel using all three original prototype photographs from the legacy portfolio.

#### Full-Wave Bridge Rectifier

> A physics project that converted alternating current to direct current using a PCB, diodes, a transformer, capacitor, switch, LED, and connecting terminals. I tested the circuit with a laboratory oscilloscope and compared the output waveform with and without capacitor filtering.

**Capabilities:** Electronics · PCB assembly · Oscilloscope testing · AC/DC conversion

**Visual:** A fixed-size manual carousel using all seven original build, testing, and oscilloscope photographs from the legacy portfolio.

#### Raspberry Pi Robotic Car

> A battery-powered robotic car programmed in Python and built around a Raspberry Pi 3, motors, a breadboard, sensors, and a buzzer. The sensor-driven behavior alerted when the car detected an obstacle, giving me an early introduction to physical computing and iterative prototyping.

**Capabilities:** Python · Raspberry Pi · Sensors · Physical prototyping

**Visual:** A fixed-size manual carousel using all three original car photographs from the legacy portfolio.

**Placement:** Present these as three compact cards on About after Earlier activities. Keep them separate from the selected professional Work page, and move Contact to section 06. Each card and its 4:3 media frame must remain fixed in size while visitors manually cycle photographs; do not autoplay.

### Contact

**Anchor:** `contact`

**Heading:** Get in touch

> The best way to reach me is by email. You can also find my professional profile and public work through LinkedIn and GitHub.

**Actions:** Email me · LinkedIn · GitHub

**Do not publish:** Phone number, Instagram, Telegram, contact form, or résumé button.
