"use client"

// ── Add your photos to public/concorde-gallery/ and update these src paths ─────
const SLIDES = [
  { src: "/concorde-gallery/01.jpg" },
  { src: "/concorde-gallery/02.jpg" },
  { src: "/concorde-gallery/03.jpg" },
  { src: "/concorde-gallery/04.jpg" },
  { src: "/concorde-gallery/05.jpg" },
  { src: "/concorde-gallery/06.jpg" },
  { src: "/concorde-gallery/07.jpg" },
  { src: "/concorde-gallery/08.jpg" },
  { src: "/concorde-gallery/09.jpg" },
]

const N           = SLIDES.length
const ACCENT      = "#3b82f6"
const CARD_W      = 320
const CARD_H      = 208
const RADIUS      = 350      // distance from rotation axis to each card
const PERSPECTIVE = 700      // viewer distance — smaller = wider lens
const SHIFT       = 300      // pulls the rotation axis up to your viewing position
                             // (PERSPECTIVE − SHIFT − RADIUS > 0 keeps cards in front of camera)
const SPIN_S      = 34

export default function ConcordeGallery() {
  return (
    <section className="relative py-24 px-10 md:px-16 overflow-hidden" style={{ pointerEvents: "auto" }}>

      {/* Header */}
      <div className="c-fade mb-16 max-w-lg">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em]"
          style={{ color: ACCENT + "b3" }}>
          07 — Gallery
        </p>
        <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-[2.6rem]">
          Through the Window.
        </h2>
        <p className="mt-4 text-sm leading-[1.85] text-[#94a3b8]">
          Concorde across five decades — on the ground, in the air, and in the hangar.
        </p>
      </div>

      {/* Stage: full-viewport width so wraparound cards aren't clipped */}
      <div
        className="cg-stage relative left-1/2 -translate-x-1/2"
        style={{
          width:             "100vw",
          height:            CARD_H + 280,
          perspective:       PERSPECTIVE + "px",
          perspectiveOrigin: "center center",
        }}
      >
        {/* Shift wrapper — moves the rotor's pivot toward the camera, so the
            cylinder orbits the viewer instead of orbiting a far-off axis */}
        <div
          style={{
            position:       "absolute",
            left:           "50%",
            top:            "50%",
            width:          0,
            height:          0,
            transformStyle: "preserve-3d",
            transform:      `translateZ(${SHIFT}px)`,
          }}
        >
          {/* Rotor — the spinning element. Cards face INWARD toward this axis,
              which (after the shift) sits right at your viewing position */}
          <div
            className="cg-rotor"
            style={{
              position:        "absolute",
              transformStyle:  "preserve-3d",
              transformOrigin: "0 0 0",
            }}
          >
            {SLIDES.map((slide, i) => {
              const angle = (i / N) * 360
              return (
                <div
                  key={i}
                  className="absolute rounded-2xl"
                  style={{
                    width:              CARD_W,
                    height:             CARD_H,
                    left:               -CARD_W / 2,
                    top:                -CARD_H / 2,
                    backgroundImage:    `url(${slide.src})`,
                    backgroundSize:     "cover",
                    backgroundPosition: "center",
                    backgroundColor:    "#0a0f1a",
                    border:             "1px solid rgba(255,255,255,0.10)",
                    boxShadow:          "0 30px 80px rgba(0,0,0,0.85)",
                    transform:          `rotateY(${angle}deg) translateZ(-${RADIUS}px)`,
                    backfaceVisibility: "hidden",
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        .cg-rotor {
          animation: cg-spin ${SPIN_S}s linear infinite;
        }
        @keyframes cg-spin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cg-rotor { animation: none; }
        }
      `}</style>

    </section>
  )
}
