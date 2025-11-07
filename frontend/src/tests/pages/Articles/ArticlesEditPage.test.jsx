import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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
describe("ArticlesEditPage tests", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-title")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: 17,
        title:
          "King Charles strips his brother Andrew of ‘prince’ title and evicts him from royal mansion",
        url: "https://www.cnn.com/2025/10/30/europe/prince-andrew-title-and-honors-remove-latam-intl",
        explanation: "King Charles strips his brother of his royal titles",
        email: "agam@ucsb.edu",
        dateAdded: "2025-10-30T15:08",
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: 17,
        title:
          "EDIT: King Charles strips his brother Andrew of ‘prince’ title and evicts him from royal mansion",
        url: "https://www.cnnn.com/2025/10/30/europe/prince-andrew-title-and-honors-remove-latam-intl",
        explanation:
          "EDIT: King Charles strips his brother of his royal titles",
        email: "agamakkar@ucsb.edu",
        dateAdded: "2025-11-30T15:08",
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
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-id");

      const idField = screen.getByTestId("ArticleForm-id");
      const tittleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByLabelText("url");
      const explanationField = screen.getByLabelText("Explanation");
      const emailField = screen.getByLabelText("Email");
      const dateAddedField = screen.getByLabelText("Date Added (iso format)");

      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(tittleField).toBeInTheDocument();
      expect(tittleField).toHaveValue(
        "King Charles strips his brother Andrew of ‘prince’ title and evicts him from royal mansion",
      );
      expect(urlField).toBeInTheDocument();
      expect(urlField).toHaveValue(
        "https://www.cnn.com/2025/10/30/europe/prince-andrew-title-and-honors-remove-latam-intl",
      );
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue(
        "King Charles strips his brother of his royal titles",
      );
      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveValue("agam@ucsb.edu");
      expect(dateAddedField).toBeInTheDocument();
      expect(dateAddedField).toHaveValue("2025-10-30T15:08");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(tittleField, {
        target: {
          value:
            "EDIT: King Charles strips his brother Andrew of ‘prince’ title and evicts him from royal mansion",
        },
      });
      fireEvent.change(urlField, {
        target: {
          value:
            "https://www.cnnn.com/2025/10/30/europe/prince-andrew-title-and-honors-remove-latam-intl",
        },
      });
      fireEvent.change(explanationField, {
        target: {
          value: "EDIT: King Charles strips his brother of his royal titles",
        },
      });
      fireEvent.change(emailField, { target: { value: "agamakkar@ucsb.edu" } });
      fireEvent.change(dateAddedField, {
        target: { value: "2025-11-30T15:08" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 17 title: EDIT: King Charles strips his brother Andrew of ‘prince’ title and evicts him from royal mansion",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title:
            "EDIT: King Charles strips his brother Andrew of ‘prince’ title and evicts him from royal mansion",
          url: "https://www.cnnn.com/2025/10/30/europe/prince-andrew-title-and-honors-remove-latam-intl",
          explanation:
            "EDIT: King Charles strips his brother of his royal titles",
          email: "agamakkar@ucsb.edu",
          dateAdded: "2025-11-30T15:08",
        }),
      ); // posted object
      expect(mockNavigate).toBeCalledWith({ to: "/articles" });
    });
  });
});
