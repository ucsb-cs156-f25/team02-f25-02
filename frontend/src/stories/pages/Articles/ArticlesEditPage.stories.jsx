import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";
import { articlesFixtures } from "fixtures/articlesFixtures";

export default {
  title: "pages/Articles/ArticlesEditPage",
  component: ArticlesEditPage,
};

const Template = () => <ArticlesEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/articles", () => {
      return HttpResponse.json(articlesFixtures.threeArticles[0], {
        status: 200,
      });
    }),
    http.put("/api/articles", () => {
      return HttpResponse.json(
        {
          id: 17,
          title:
            "EDIT: King Charles strips his brother Andrew of ‘prince’ title and evicts him from royal mansion",
          url: "https://www.cnnn.com/2025/10/30/europe/prince-andrew-title-and-honors-remove-latam-intl",
          explanation:
            "EDIT: King Charles strips his brother of his royal titles",
          email: "agamakkar@ucsb.edu",
          dateAdded: "2025-11-30T15:08",
        },
        { status: 200 },
      );
    }),
  ],
};
