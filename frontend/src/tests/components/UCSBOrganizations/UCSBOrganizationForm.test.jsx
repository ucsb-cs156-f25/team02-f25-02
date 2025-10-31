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

  const expectedHeaders = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];
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
          <RestaurantForm initialContents={restaurantFixtures.oneRestaurant} />
        </Router>
      </QueryClientProvider>,
    );

  //   expect(await screen.findByText(/Create/)).toBeInTheDocument();

  //   expectedHeaders.forEach((headerText) => {
  //     const header = screen.getByText(headerText);
  //     expect(header).toBeInTheDocument();
  //   });

  //   expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
  //   expect(screen.getByText(`Id`)).toBeInTheDocument();
  // });

  // test("that navigate(-1) is called when Cancel is clicked", async () => {
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <Router>
  //         <RestaurantForm />
  //       </Router>
  //     </QueryClientProvider>,
  //   );
  //   expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
  //   const cancelButton = screen.getByTestId(`${testId}-cancel`);

  //   fireEvent.click(cancelButton);

  //   await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  // });

  // test("that the correct validations are performed", async () => {
  //   render(
  //     <QueryClientProvider client={queryClient}>
  //       <Router>
  //         <RestaurantForm />
  //       </Router>
  //     </QueryClientProvider>,
  //   );

  //   expect(await screen.findByText(/Create/)).toBeInTheDocument();
  //   const submitButton = screen.getByText(/Create/);
  //   fireEvent.click(submitButton);

  //   await screen.findByText(/Name is required/);
  //   expect(screen.getByText(/Description is required/)).toBeInTheDocument();

  //   const nameInput = screen.getByTestId(`${testId}-name`);
  //   fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
  //   });
  // });
});
