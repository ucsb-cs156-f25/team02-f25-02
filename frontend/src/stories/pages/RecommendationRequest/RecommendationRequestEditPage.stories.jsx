import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

export default {
  title: "pages/RecommendationRequest/RecommendationRequestEditPage",
  component: RecommendationRequestEditPage,
};

const Template = () => <RecommendationRequestEditPage storybook={true} />;

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
    http.get("/api/recommendationrequest", () => {
      return HttpResponse.json(
        recommendationRequestFixtures.threeRecommendationRequests[0],
        {
          status: 200,
        },
      );
    }),
    http.put("/api/recommendationrequest", () => {
      return HttpResponse.json(
        {
          id: "17",
          requesterEmail: "req1@gmail.com",
          professorEmail: "prof1@ucsb.edu",
          explanation: "need rec1",
          dateRequested: "2025-11-05T12:12:00Z",
          dateNeeded: "2025-12-05T12:12:00Z",
          done: true,
        },
        { status: 200 },
      );
    }),
  ],
};
