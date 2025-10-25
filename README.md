Lip-Sync Sanity Viewer

Small React/R3F tool to QA avatar lip-sync against a fixed MP3 using an explicit viseme timeline. Works on desktop, tablet, and mobile.

Features

Ready Player Me GLB with Oculus Visemes

Deterministic viseme driving (no ML)

Live QA panel: audio level, recent visemes, morph mapping, coverage

Global offset (ms) and optional audio-energy mouth amplitude

Pinch/scroll zoom, “Fit” recenter, safe mobile layout

One-click JSON report for stakeholders

Quick Start
# Node 18+
npm i
npm start


Place your audio in public/ and update AUDIO_PATH in VisemePlayer.jsx if needed.
Model URL is set via MODEL_PATH (RPM link with ?morphTargets=Oculus%20Visemes).

Scripts

npm start – dev server

npm run build – production build

npm run preview – serve the build (add any static server)

Controls

Play/Pause – starts/stops audio and visemes

Fit – reframe camera around avatar

Show/Hide QA – toggle QA panel
Keyboard: Space play/pause, F fit, Q QA.
Mouse/touch: Orbit drag, wheel/pinch to zoom.

QA Report (exported JSON)
{
  "generatedAt": "ISO date",
  "audio": "/file.mp3",
  "model": "https://...glb?morphTargets=Oculus%20Visemes",
  "progressPct": 42,
  "audioLevel": 0.031,
  "threshold": 0.035,
  "offsetMs": 0,
  "energyAmp": false,
  "currentViseme": "E",
  "recent": ["E","DD","E", "..."],
  "morphTarget": { "morphName": "viseme_E", "morphIndex": 7, "influence": 1 },
  "visemeCoverage": { "expectedCount": 8, "availableCount": 8, "missing": [] },
  "hints": ["…actionable strings…"]
}

Swap Assets

Audio: put MP3 in public/, set AUDIO_PATH.

Model: set MODEL_PATH to your RPM GLB with Oculus Visemes enabled.

Timeline: replace visemeData with { time: seconds, viseme: "E|DD|SS|FF|aa|oh|ou|PP|sil" }.

Troubleshooting

Mouth not moving: model lacks viseme morphs. Use an RPM export with Oculus Visemes; keep the ?morphTargets=Oculus%20Visemes query.

Audio plays but no levels: browser blocked AudioContext. Press Play once; the app resumes the context automatically.

Sync early/late: adjust Offset (ms) in QA. Typical ±80–120 ms.

Wrong viseme names: aliases handled (O→oh, U→ou, A→aa, E/IH). Report shows unmapped visemes.

Tech

React 18, @react-three/fiber, drei, three.js. No backend, no ML.

License

MIT.