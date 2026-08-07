import { render, screen } from "@testing-library/react";

import DepartmentPageRenderer from "@/components/department/DepartmentPageRenderer";
import type { DepartmentPage } from "@/types/departments";

jest.mock("@/components/memberList", () => ({
  MemberList: ({
    memberRows,
    title,
    subtitle,
  }: {
    memberRows: unknown[];
    title?: string;
    subtitle?: string;
  }) => (
    <div data-testid="member-list">
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <span>{memberRows.length} rows</span>
    </div>
  ),
}));

jest.mock("@/components/initiatives", () => ({
  InitiativeList: () => <div data-testid="initiative-list" />,
  InitiativeCard: ({ title }: { title: string }) => (
    <div data-testid="initiative-card">{title}</div>
  ),
}));

jest.mock("@/components/department/MarkdownSection", () => ({
  MarkdownSection: ({ content }: { content: string }) => (
    <div data-testid="markdown-section">{content}</div>
  ),
}));

jest.mock("@/components/department/ProjectGallerySection", () => ({
  ProjectGallerySection: () => <div data-testid="project-gallery" />,
}));

const page: DepartmentPage = {
  id: "page-1",
  name: "Department of Infrastructure",
  tagline: "We make the tools that let UTMIST members be awesome!",
  slug: "department-of-infrastructure",
  sections: [
    {
      component: "text_section",
      data: {
        heading: "What do we do?",
        body: "We build internal tools for UTMIST.",
      },
    },
    {
      component: "member_list",
      data: {
        title: "Our Team",
        subtitle: "Meet the people behind the work",
        departments: '["Administration"]',
      },
    },
  ],
};

describe("Department page renderer", () => {
  it("renders the page header and configured sections", () => {
    render(
      <DepartmentPageRenderer
        page={page}
        memberRowsBySlotKey={{
          "1": [
            {
              Year: 2024,
              "First Name": "Jane",
              "Last Name": "Doe",
              "UofT Email": "jane@example.com",
              Position: "President",
              Department: "Administration",
            },
          ],
        }}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Department of Infrastructure" })
    ).toBeInTheDocument();
    expect(screen.getByText("What do we do?")).toBeInTheDocument();
    expect(screen.getByTestId("member-list")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Our Team" })).toBeInTheDocument();
    expect(screen.getByText("Meet the people behind the work")).toBeInTheDocument();
    expect(screen.getByText("1 rows")).toBeInTheDocument();
  });
});
