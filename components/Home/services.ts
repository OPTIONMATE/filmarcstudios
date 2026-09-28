/**
 * FILMARC STUDIOS — services data.
 *
 * Five service groups in timeline order. Edit titles, descriptions, media or
 * order here — the timeline (ServicesSection.tsx) renders purely from this
 * array and needs no other changes.
 *
 * Descriptions are concise supporting copy, not claims about specific
 * completed projects. Every `image` is a still that ships in this repository
 * (public/images/services/, documented in public/images/README.md), so the
 * showcase depends on no third-party host: swap the file in place, or point
 * `image` at a delivered graded still, and nothing else changes.
 */

export interface Service {
  id: string;
  name: string;
  tagline: string;
  description: string;
  deliverables: readonly string[];
  image: string;
}

export const services: Service[] = [
  {
    id: "vfx",
    name: "VFX & Compositing",
    tagline: "The invisible craft that makes the impossible feel captured on glass.",
    description:
      "Photoreal visual effects, multi-pass compositing, clean plate reconstruction, crowd extension, and seamless digital environment work.",
    deliverables: ["Multi-layer comp", "Set extension", "Rotoscopy & prep", "Photoreal CGI integration"],
    image: "/images/services/vfx.jpg",
  },
  {
    id: "cgi",
    name: "CGI & Lookdev",
    tagline: "Synthetic realms and digital assets crafted from first wireframe to light bounce.",
    description:
      "Hard-surface vehicle rigs, creature sculpting, atmospheric dynamics, and physically-accurate lighting passes for narrative cinema.",
    deliverables: ["Houdini dynamics", "Creature animation", "Environment builds", "Lookdev & lighting"],
    image: "/images/services/cgi.jpg",
  },
  {
    id: "2d-animation",
    name: "2D Animation",
    tagline: "Handcrafted movement and distinctive illustration-led storytelling.",
    description:
      "Frame-by-frame character performance, graphic sequences, illustrative title openings, and expressive mixed-media films.",
    deliverables: ["Frame-by-frame", "Character design", "Art direction", "Title sequence design"],
    image: "/images/services/2d-animation.jpg",
  },
  {
    id: "3d-motion",
    name: "3D Motion Design",
    tagline: "Dimensional kinetic energy engineered for luxury brands and title craft.",
    description:
      "High-end product reveals, dynamic kinetic typography, surreal brand worlds, and broadcast identity packages.",
    deliverables: ["Product visuals", "Kinetic type", "Broadcast IDs", "Procedural animation"],
    image: "/images/services/3d-motion.jpg",
  },
  {
    id: "screen-production",
    name: "Screen Production",
    tagline: "From script breakdown and camera setups to theatrical master finish.",
    description:
      "On-set technical VFX supervision, live-action commercial direction, episodic content post-production, and final master grading.",
    deliverables: ["VFX supervision", "Live-action direction", "Color grading (ACES)", "Master finishing"],
    image: "/images/services/screen-production.jpg",
  },
];


