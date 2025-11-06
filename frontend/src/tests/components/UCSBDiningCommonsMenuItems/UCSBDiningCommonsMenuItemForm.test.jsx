import {
  _fireEvent,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemForm.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["DiningCommonsCode", "Name", "Station"];
  const testId = "UCSBDiningCommonsMenuItemForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm />
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
          <UCSBDiningCommonsMenuItemForm
            initialContents={
              ucsbDiningCommonsMenuItemFixtures.oneUCSBDiningCommonsMenuItem
            }
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBDiningCommonsMenuItemForm />
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
          <UCSBDiningCommonsMenuItemForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/diningCommonsCode is required/);
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    expect(screen.getByText(/station is required/)).toBeInTheDocument();

    const nameInput = screen.getByTestId(`${testId}-name`);
    fireEvent.change(nameInput, { target: { value: "a".repeat(256) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });
  });
});
