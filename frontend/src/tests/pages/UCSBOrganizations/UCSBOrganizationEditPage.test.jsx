import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationEditPage";

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
      orgCode: "SKY",
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;
describe("UCSBOrganizationEditPage tests", () => {

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
        .onGet("/api/ucsborganization", { params: { orgCode: "SKY" } })
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
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSB Organization");
      expect(
        screen.queryByTestId("UCSBOrganization-orgCode"),
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
        .onGet("/api/ucsborganization", { params: { orgCode: "SKY" } })
        .reply(200, {
          orgCode: "SKY",
          orgTranslationShort: "SKYDIVING CLUB",
          orgTranslation: "SKYDIVING CLUB AT UCSB",
          inactive: false, 
        });
      axiosMock.onPut("/api/ucsborganization").reply(200, {
        orgCode: "SKY",
        orgTranslationShort: "SKY DIVE CLUB",
        orgTranslation: "SKY DIVE CLUB @ UCSB",
        inactive: true,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBOrganizationForm-orgCode");

      const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
      const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
      const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
      const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");

      const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

      expect(orgCodeField).toBeInTheDocument();
      expect(orgCodeField).toHaveValue("SKY");

      expect(orgTranslationShortField).toBeInTheDocument();
      expect(orgTranslationShortField).toHaveValue("SKYDIVING CLUB");

      expect(orgTranslationField).toBeInTheDocument();
      expect(orgTranslationField).toHaveValue("SKYDIVING CLUB AT UCSB");

      expect(inactiveField).toBeInTheDocument();
      expect(inactiveField).toHaveValue("false");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(orgTranslationShortField, {
        target: { value: "SKY DIVE CLUB" },
      });
      fireEvent.change(orgTranslationField, {
        target: { value: "SKY DIVE CLUB @ UCSB" },
      });
      fireEvent.change(inactiveField, {
        target: { value: "true" },
      });
      fireEvent.click(submitButton);

      await waitFor(() =>
        expect(mockToast).toHaveBeenCalledWith(
          "UCSB Organization Updated - orgCode: SKY orgTranslationShort: SKY DIVE CLUB"
        )
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganizations" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ orgCode: "SKY" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          orgTranslationShort: "SKY DIVE CLUB",
          orgTranslation: "SKY DIVE CLUB @ UCSB",
          inactive: "true",
        }),
      ); // posted object
    });
  });
});
