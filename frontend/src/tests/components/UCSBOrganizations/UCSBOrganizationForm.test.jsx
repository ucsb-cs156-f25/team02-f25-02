import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBOrganization tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "orgCode",
    "orgTranslationShort",
    "orgTranslation",
    "inactive",
  ];
  const testId = "UCSBOrganizationForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm
            initialContents={ucsbOrganizationFixtures.oneOrganization}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(screen.getByText(`orgCode`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/orgCode is required/);
    expect(
      screen.getByText(/orgTranslationShort is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/orgTranslation is required/)).toBeInTheDocument();
    expect(screen.getByText(/inactive is required/)).toBeInTheDocument();

    const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
    fireEvent.change(orgCodeInput, { target: { value: "a".repeat(4) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 3 characters/)).toBeInTheDocument();
    });

    const orgTranslationShortInput = screen.getByTestId(
      `${testId}-orgTranslationShort`,
    );
    fireEvent.change(orgTranslationShortInput, {
      target: { value: "a".repeat(16) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 15 characters/)).toBeInTheDocument();
    });
  });

  // --- BooleanLiteral killers: orgCode disabled logic ---
  test("orgCode is ENABLED when creating (no initialContents)", () => {
    render(<UCSBOrganizationForm submitAction={vi.fn()} />);
    expect(screen.getByLabelText(/orgCode/i)).toBeEnabled();
  });

  test("orgCode is DISABLED when editing (has initialContents)", () => {
    render(
      <UCSBOrganizationForm
        initialContents={{
          orgCode: "ABC",
          orgTranslationShort: "ENG",
          orgTranslation: "English",
          inactive: "false",
        }}
        submitAction={vi.fn()}
        buttonLabel="Update"
      />,
    );
    expect(screen.getByLabelText(/orgCode/i)).toBeDisabled();
  });

  // --- StringLiteral killers: assert testIds exist ---
  test("stable testIds exist for fields and submit button", () => {
    render(<UCSBOrganizationForm submitAction={vi.fn()} />);
    // These fail if Stryker mutates to empty strings
    expect(
      screen.getByTestId("UCSBOrganizationForm-orgTranslation"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("UCSBOrganizationForm-inactive"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("UCSBOrganizationForm-submit"),
    ).toBeInTheDocument();
  });
});
