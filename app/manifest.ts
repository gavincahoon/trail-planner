import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trail Planner",
    short_name: "TrailPlanner",
    description: "Plan your next backpacking trip.",
    start_url: "/",
    scope: "/",
    display: "fullscreen",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
