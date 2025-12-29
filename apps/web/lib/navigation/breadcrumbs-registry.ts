type Params = Record<string, string>;

export type BreadcrumbLabels = {
  projectName?: string;
  fileName?: string;
};

export type BreadcrumbContext = {
  params: Params;
  labels?: BreadcrumbLabels;
};

export type BreadcrumbMatch = {
  config: BreadcrumbConfig;
  params: Params;
};

export type BreadcrumbConfig = {
  id: string;
  pattern: string;
  crumbs: CrumbDefinition[];
};

export type CrumbDefinition = {
  id: string;
  label: string | ((ctx: BreadcrumbContext) => string);
  href?: string | ((ctx: BreadcrumbContext) => string | undefined);
};

export type ResolvedBreadcrumb = {
  id: string;
  label: string;
  href?: string;
  isCurrent: boolean;
};

const breadcrumbRegistry: BreadcrumbConfig[] = [
  {
    id: "dashboard",
    pattern: "/dashboard",
    crumbs: [
      { id: "home", label: "Início", href: "/dashboard" },
    ],
  },
  {
    id: "projects",
    pattern: "/projects",
    crumbs: [
      { id: "home", label: "Início", href: "/dashboard" },
      { id: "projects", label: "Projetos" },
    ],
  },
  {
    id: "project-root",
    pattern: "/projects/:projectId",
    crumbs: [
      { id: "home", label: "Início", href: "/dashboard" },
      { id: "projects", label: "Projetos", href: "/projects" },
      {
        id: "project",
        label: ({ labels, params }) =>
          labels?.projectName ?? `Projeto ${shortId(params.projectId)}`,
      },
    ],
  },
  {
    id: "project-files",
    pattern: "/projects/:projectId/files",
    crumbs: [
      { id: "home", label: "Início", href: "/dashboard" },
      { id: "projects", label: "Projetos", href: "/projects" },
      {
        id: "project",
        label: ({ labels, params }) =>
          labels?.projectName ?? `Projeto ${shortId(params.projectId)}`,
      },
      {
        id: "files",
        label: "Arquivos",
        href: ({ params }) => `/projects/${params.projectId}/files`,
      },
    ],
  },
  {
    id: "file-detail",
    pattern: "/projects/:projectId/files/:fileId",
    crumbs: [
      { id: "home", label: "Início", href: "/dashboard" },
      { id: "projects", label: "Projetos", href: "/projects" },
      {
        id: "project",
        label: ({ labels, params }) =>
          labels?.projectName ?? `Projeto ${shortId(params.projectId)}`,
        href: ({ params }) => `/projects/${params.projectId}/files`,
      },
      {
        id: "files",
        label: "Arquivos",
        href: ({ params }) => `/projects/${params.projectId}/files`,
      },
      {
        id: "file",
        label: ({ labels, params }) =>
          labels?.fileName ?? `Arquivo ${shortId(params.fileId)}`,
      },
    ],
  },
];

export function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  const withLeadingSlash = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;
  if (withLeadingSlash !== "/" && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.slice(0, -1);
  }
  return withLeadingSlash;
}

export function matchBreadcrumbConfig(pathname: string): BreadcrumbMatch | null {
  const normalized = normalizePathname(pathname);

  for (const config of breadcrumbRegistry) {
    const params = matchPattern(config.pattern, normalized);
    if (params) {
      return { config, params };
    }
  }

  return null;
}

export function resolveBreadcrumbs(
  pathname: string,
  options?: { labels?: BreadcrumbLabels; match?: BreadcrumbMatch | null }
): ResolvedBreadcrumb[] {
  const normalized = normalizePathname(pathname);
  const match = options?.match ?? matchBreadcrumbConfig(normalized);

  if (match) {
    return resolveFromConfig(match, options?.labels);
  }

  return buildFallbackBreadcrumbs(normalized);
}

function resolveFromConfig(
  match: BreadcrumbMatch,
  labels?: BreadcrumbLabels
): ResolvedBreadcrumb[] {
  const ctx: BreadcrumbContext = { params: match.params, labels };

  return match.config.crumbs.map((crumb, index, arr) => {
    const isCurrent = index === arr.length - 1;
    return {
      id: crumb.id,
      label: typeof crumb.label === "function" ? crumb.label(ctx) : crumb.label,
      href:
        isCurrent || !crumb.href
          ? undefined
          : typeof crumb.href === "function"
            ? crumb.href(ctx)
            : crumb.href,
      isCurrent,
    };
  });
}

function buildFallbackBreadcrumbs(pathname: string): ResolvedBreadcrumb[] {
  const normalized = normalizePathname(pathname);
  const segments = normalized.split("/").filter(Boolean);

  const crumbs: ResolvedBreadcrumb[] = [
    { id: "home", label: "Início", href: "/dashboard", isCurrent: segments.length === 0 },
  ];

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const label = humanizeSegment(segment);
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    crumbs.push({
      id: `${index}-${segment}`,
      label,
      href: isLast ? undefined : href,
      isCurrent: isLast,
    });
  });

  return crumbs;
}

function matchPattern(pattern: string, pathname: string): Params | null {
  const patternParts = normalizePathname(pattern).split("/").filter(Boolean);
  const pathParts = normalizePathname(pathname).split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: Params = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(":")) {
      const paramName = patternPart.slice(1);
      if (!pathPart) return null;
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params;
}

function humanizeSegment(segment: string): string {
  if (!segment) return "";
  const maybeId = shortId(segment);
  if (maybeId !== segment) return `Item ${maybeId}`;
  const withSpaces = segment.replace(/[-_]+/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function shortId(value: string): string {
  if (!value) return "";
  if (value.length > 12) return value.slice(0, 8);
  return value;
}

