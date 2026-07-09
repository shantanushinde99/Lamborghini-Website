# Lamborghini Revuelto: The Ultimate Digital Experience

![Launch Control](./assets/LAUNCH%20CONTROL.gif)

Welcome to the **Lamborghini Revuelto (LB744)** interactive digital experience. This project pushes the boundaries of modern web technologies to deliver an Awwwards-level, high-fidelity 3D scrubbing journey through the first V12 Hybrid HPEV Super Sports Car. 

Designed without compromise, the site uses a master scroll orchestrator over a massive `2700vh` virtual canvas. As you scroll, 9 distinct cinematic phases unfold seamlessly through perfectly synced frame sequences and physical spring mechanics.

---

## 🏁 Key Technical Features

- **Master Scroll Architecture:** A single `framer-motion` scroll hook controls everything, ensuring zero desync between the 3D car rotation and the UI overlays.
- **Cinematic Letterboxing:** Widescreen bars clamp down dynamically during high-speed phases like *Launch Control*.
- **Velocity-Reactive Telemetry:** A custom dashboard that reacts to the *speed* of your scroll, spiking the RPMs to 9,500 and shifting gears accordingly.
- **Glitch Physics:** Fighter-jet style HUD recalibration effects on phase transitions.
- **Dynamic 3D Floor Grid:** A perspective-warped wireframe floor tied to the scroll wheel to simulate extreme wind-tunnel speed.
- **Magnetic Navigation:** Links that use `useSpring` to physically pull toward your cursor, adding weight and gravity to the UI.

---

## ⚡ Performance & Architecture

- **ImageKit CDN Integration:** All 2,000+ high-resolution `.webp` image frames, the 3D `.glb` preloader model, and the V12 `.mp3` audio files are globally distributed and streamed directly via ImageKit CDN for lightning-fast asset delivery.
- **Dynamic Audio-Sync Physics:** The `Exhaust.mp3` playback rate dynamically shifts based on your actual scroll velocity, automatically pitching the audio up or down so the V12 sound perfectly matches the exact visual frame.
- **Massively Scalable (500+ Users/ms):** The architecture has been rigorously load-tested using a custom backend script. The CDN and static-site infrastructure can comfortably handle 500+ simultaneous users hitting the assets *at the exact same millisecond* without rate-limiting.
- **Cloudflare Pages Deployment:** The entire Next.js application is configured for Static Site Generation (SSG) via `next.config.ts` and deployed at the edge on Cloudflare Pages for zero-latency HTML delivery.

### System Architecture

```mermaid
graph TD
    User(["🌐 Website Visitor"]) -->|"HTTPS / Edge"| CF["⚡ Cloudflare Pages"]
    
    subgraph Frontend["Frontend Application"]
        CF -->|"Serves"| Next["Next.js Static HTML"]
        Next -->|"Mounts"| Canvas["🏎️ RevueltoScrollCanvas"]
        Next -->|"Mounts"| Audio["🔊 Audio Sync Engine"]
    end
    
    subgraph CDN["Global CDN Infrastructure"]
        Canvas -->|"Fetches 2000+ .webp frames"| IK["🖼️ ImageKit CDN"]
        Audio -->|"Fetches Exhaust.mp3"| IK
    end

    User -->|"Scrolls Mouse/Touch"| Framer["Framer Motion Engine"]
    Framer -->|"Calculates Progress & Phase"| Canvas
    Framer -->|"Dynamic Pitch Shifting"| Audio
```

---

## 01 / ORIGIN: The Hero

The Revuelto rewrites the rules. A naturally aspirated V12 combined with three electric motors.

| Profile View | Angled View |
|:---:|:---:|
| <img src="./assets/hero_exterior_0.webp" width="400"/> | <img src="./assets/hero_exterior_120.webp" width="400"/> |

---

## 02 / ILLUMINATION: DRL Awakening

The iconic Y-shaped daytime running lights with adaptive matrix LED optics.

| Front Face | Lights Active |
|:---:|:---:|
| <img src="./assets/led_drl_awakening_0.webp" width="400"/> | <img src="./assets/led_drl_awakening_120.webp" width="400"/> |

---

## 03 / COCKPIT: Digital Command

A driver-centric HMI featuring 3 distinct displays and 4 transformative drive modes.

| Dashboard | Displays |
|:---:|:---:|
| <img src="./assets/digital_cockpit_0.webp" width="400"/> | <img src="./assets/digital_cockpit_120.webp" width="400"/> |

---

## 04 / LAUNCH: Control

0–100 km/h in 2.5 seconds. 9,500 RPM redline paired with E-AWD.

| Pre-Launch | Catapult |
|:---:|:---:|
| <img src="./assets/launch_control_0.webp" width="400"/> | <img src="./assets/launch_control_120.webp" width="400"/> |

---

## 05 / AERO: Active Aerodynamics

Real-time CFD-validated aerodynamics generating massive downforce and a Cd of 0.35.

| Spoiler Down | Spoiler Deployed |
|:---:|:---:|
| <img src="./assets/active_aerodynamics_0.webp" width="400"/> | <img src="./assets/active_aerodynamics_120.webp" width="400"/> |

---

## 06 / POWERTRAIN: L545 V12 Hybrid

6.5-litre V12 producing 825 CV, plus 190 CV from the e-motors. Total output: 1,015 CV.

| Engine Cover | V12 Revealed |
|:---:|:---:|
| <img src="./assets/engine_reveal_0.webp" width="400"/> | <img src="./assets/engine_reveal_120.webp" width="400"/> |

---

## 07 / EXHAUST: The Symphony

A naturally aspirated V12 scream that no turbocharger can replicate.

| Exhaust Pipes | Heat Blur |
|:---:|:---:|
| <img src="./assets/frames_exhaust_0.webp" width="400"/> | <img src="./assets/frames_exhaust_120.webp" width="400"/> |

---

## 08 / BRAKES: Stopping Power

Next-generation CCB+ carbon ceramic brakes with 410mm rotors and 10-piston calipers.

| Wheel Spin | Braking Force |
|:---:|:---:|
| <img src="./assets/front_wheel_spin_0.webp" width="400"/> | <img src="./assets/front_wheel_spin_120.webp" width="400"/> |

---

## 09 / FINALE: Without Compromise

The most complete super sports car ever engineered by Lamborghini.

| Final Stance | Legacy |
|:---:|:---:|
| <img src="./assets/final_hero_0.webp" width="400"/> | <img src="./assets/final_hero_120.webp" width="400"/> |

---

*“To build the future, you must first rewrite the past.”*
