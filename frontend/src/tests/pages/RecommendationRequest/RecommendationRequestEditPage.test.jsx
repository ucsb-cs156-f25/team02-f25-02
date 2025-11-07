import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("RecommendationRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(
        screen.queryByTestId("RecommendationRequestForm-requesterEmail"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "req@gmail.com",
          professorEmail: "prof@ucsb.edu",
          explanation: "need rec",
          dateRequested: "2025-11-04T12:12:00Z",
          dateNeeded: "2025-12-04T12:12:00Z",
          done: false,
        });
      axiosMock.onPut("/api/recommendationrequest").reply(200, {
        id: "17",
        requesterEmail: "req1@gmail.com",
        professorEmail: "prof1@ucsb.edu",
        explanation: "need rec1",
        dateRequested: "2025-11-05T12:12:00Z",
        dateNeeded: "2025-12-05T12:12:00Z",
        done: true,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided, and changes when data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const professorEmailField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText(
        "Date Requested (in UTC)",
      );
      const dateNeededField = screen.getByLabelText("Date Needed (in UTC)");
      const doneField = screen.getByLabelText("Done");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("req@gmail.com");
      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("prof@ucsb.edu");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("need rec");
      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("2025-11-04T12:12");
      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("2025-12-04T12:12");
      expect(doneField).toBeInTheDocument();
      expect(doneField).toHaveValue("false");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "req1@gmail.com" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "prof1@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: { value: "need rec1" },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2025-11-05T12:12" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2025-12-05T12:12" },
      });
      fireEvent.change(doneField, {
        target: { value: "true" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Recommendation Request Updated - id: 17 Requester email: req1@gmail.com",
      );

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequest",
      });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          id: 17,
          requesterEmail: "req1@gmail.com",
          professorEmail: "prof1@ucsb.edu",
          explanation: "need rec1",
          dateRequested: "2025-11-05T12:12Z",
          dateNeeded: "2025-12-05T12:12Z",
          done: "true",
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequest",
      });
    });
  });
});
