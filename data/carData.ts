export const revueltoData = {
  brand: "LAMBORGHINI",
  model: "REVUELTO",
  edition: "LB744",
  tagline: "The First V12 Hybrid HPEV Super Sports Car",
  year: "2024",
  price: "€517,770",
  origin: "Sant'Agata Bolognese, Italy",

  phases: [
    {
      id: "hero",
      scrollRange: [0, 0.11] as [number, number],
      folder: "hero_exterior",
      label: "01 / ORIGIN",
      title: "REVUELTO",
      subtitle: "LB744",
      description:
        "The Lamborghini Revuelto rewrites the rules of super sports cars. The first High Performance Electrified Vehicle to combine a naturally aspirated V12 with three electric motors, producing 1,015 CV of unbridled power.",
      accent: "1,015 CV COMBINED OUTPUT",
    },
    {
      id: "led",
      scrollRange: [0.11, 0.22] as [number, number],
      folder: "led_drl_awakening",
      label: "02 / ILLUMINATION",
      title: "DRL AWAKENING",
      subtitle: "Y-SHAPED SIGNATURE",
      description:
        "The iconic Y-shaped daytime running lights are pure Lamborghini DNA. Adaptive matrix LED optics with laser precision high beams illuminate the path ahead with surgical accuracy.",
      accent: "ADAPTIVE MATRIX LED OPTICS",
    },
    {
      id: "cockpit",
      scrollRange: [0.22, 0.33] as [number, number],
      folder: "digital_cockpit",
      label: "03 / COCKPIT",
      title: "DIGITAL COMMAND",
      subtitle: "DRIVER-CENTRIC HMI",
      description:
        "The cockpit is designed around the driver. A 12.3-inch instrument cluster, 8.4-inch central touchscreen, and a passenger display create an immersive digital environment. Four drive modes — CITTÀ, STRADA, SPORT, CORSA — transform the character completely.",
      accent: "4 DRIVE MODES · 3 DISPLAYS",
    },
    {
      id: "launch",
      scrollRange: [0.33, 0.44] as [number, number],
      folder: "launch_control",
      label: "04 / LAUNCH",
      title: "LAUNCH CONTROL",
      subtitle: "0–100 KM/H IN 2.5 SECONDS",
      description:
        "Engage Launch Control. The V12 holds at 9,000 RPM while three electric motors pre-load torque. Release the brake. 1,015 CV of combined force catapults you forward with a ferocity that redefines acceleration.",
      accent: "9,500 RPM REDLINE · E-AWD",
    },
    {
      id: "aero",
      scrollRange: [0.44, 0.55] as [number, number],
      folder: "active_aerodynamics",
      label: "05 / AERO",
      title: "ACTIVE AERO",
      subtitle: "AERODYNAMIC MASTERY",
      description:
        "Active aerodynamics adapt in real-time to speed, cornering forces, and braking loads. The underbody generates maximum downforce while the rear spoiler adjusts its angle continuously. Cd 0.35 in low-drag configuration.",
      accent: "REAL-TIME CFD-VALIDATED AERO",
    },
    {
      id: "engine",
      scrollRange: [0.55, 0.66] as [number, number],
      folder: "engine_reveal",
      label: "06 / POWERTRAIN",
      title: "L545 V12 HYBRID",
      subtitle: "825 CV + 3 E-MOTORS",
      description:
        "The naturally aspirated 6.5-litre V12 produces 825 CV at 9,250 RPM. Three electric motors add 190 CV for a combined 1,015 CV. The 8-speed dual-clutch transverse gearbox is an engineering masterpiece.",
      accent: "6,498 CC · 9,500 RPM REDLINE",
    },
    {
      id: "exhaust",
      scrollRange: [0.66, 0.77] as [number, number],
      folder: "frames_exhaust",
      label: "07 / EXHAUST",
      title: "THE V12 SOUND",
      subtitle: "MECHANICAL SYMPHONY",
      description:
        "The exhaust note of the Revuelto is unmistakable — a naturally aspirated V12 scream that no turbocharger can replicate. From a deep growl at idle to a spine-tingling howl at 9,500 RPM.",
      accent: "NATURALLY ASPIRATED · NO TURBOS",
    },
    {
      id: "brakes",
      scrollRange: [0.77, 0.88] as [number, number],
      folder: "front_wheel_spin",
      label: "08 / BRAKES",
      title: "STOPPING POWER",
      subtitle: "CARBON CERAMIC BRAKES+",
      description:
        "Next-generation CCB+ carbon ceramic brakes with 10-piston front calipers grip 410×38mm drilled rotors. Aerodynamic cooling ducts integrated into the suspension wishbones ensure fade-free performance.",
      accent: "410 MM ROTORS · 10-PISTON CALIPERS",
    },
    {
      id: "finale",
      scrollRange: [0.88, 1.0] as [number, number],
      folder: "final_hero",
      label: "09 / FINALE",
      title: "WITHOUT COMPROMISE",
      subtitle: "ENGINEERED",
      description:
        "Every surface, every component, every line of code in the Revuelto exists for one purpose: to create the most complete super sports car ever made by Lamborghini.",
      accent: "THE FUTURE OF THE V12",
    },
  ],

  specs: [
    { label: "Engine", value: "V12 NA", unit: "6.5 L" },
    { label: "Displacement", value: "6,498", unit: "CM³" },
    { label: "Combined Power", value: "1,015", unit: "CV" },
    { label: "Max Torque", value: "725", unit: "NM" },
    { label: "Dry Weight", value: "1,780", unit: "KG" },
    { label: "Top Speed", value: ">350", unit: "KM/H" },
    { label: "0-100 km/h", value: "2.5", unit: "SEC" },
    { label: "Transmission", value: "8", unit: "SPEED E-DCT" },
  ],

  navLinks: ["STORY", "SPECS", "FEATURES"],
};
