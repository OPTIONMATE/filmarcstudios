/**
 * FILMARC STUDIOS — services data.
 *
 * Five service groups in timeline order. Edit titles, descriptions, media or
 * order here — the timeline (ServicesSection.tsx) renders purely from this
 * array and needs no other changes.
 *
 * Descriptions are concise supporting copy, not claims about specific
 * completed projects. Media paths are placeholders until graded stills are
 * delivered; swap `image` for the final asset per service.
 */

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
}

export const services: Service[] = [
  {
    id: "vfx",
    name: "VFX",
    description:
      "Visual effects, compositing, cleanup and seamless integration — the invisible craft that makes the impossible feel photographed.",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "cgi",
    name: "CGI",
    description:
      "Photorealistic or stylized computer-generated imagery and worlds, built from first pixel to final frame.",
    image:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "2d-animation",
    name: "2D Animation",
    description:
      "Illustration-led movement, character animation and visual storytelling with a hand-crafted feel.",
    image:
      "https://images.unsplash.com/photo-1614583225154-5fcdda07019e?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "3d-motion",
    name: "3D Animation & Motion Design",
    description:
      "3D movement, product visuals, titles and graphic motion — dimensional craft for screens of every size.",
    image:
      "https://images.unsplash.com/photo-1633101586622-7f4c6b9b1a15?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "screen-production",
    name: "Screen Production",
    description:
      "Films, web series and OTT-focused production — stories carried from concept to screen.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=85",
  },
];

