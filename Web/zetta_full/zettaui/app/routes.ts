import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("certifications", "routes/certifications/certifications.tsx"),
  route("contact", "routes/contact.tsx"),
  route("formations", "routes/formations/formations.tsx"),
  route("formations/:slug", "routes/formations/formation-detail.tsx"),
  route("blog", "routes/blog/blogs.tsx"),
  route("blog/:slug", "routes/blog/blog-details.tsx"),
  route("pfe", "routes/pfe.tsx"),

  // nested routes
  //   route("dashboard", "routes/dashboard.tsx", [
  //     route("finances", "routes/finances.tsx"),
  //   ]),

  // le resultat sera dashboard/finances et dans le dashboard on met le outlet

  //   adding a layout
  //   layout("routes/dashboard.tsx", [
  //   ...prefix("dashboard",[
  //     route("paiements", "routes/paiements.tsx"),
  //   ]),
  //     route("finances", "routes/finances.tsx"),
  //   ]),
] satisfies RouteConfig;
