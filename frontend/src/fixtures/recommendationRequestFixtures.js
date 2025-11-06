const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 2,
    requesterEmail: "req@gmail.com",
    professorEmail: "prof@ucsb.edu",
    explanation: "need rec",
    dateRequested: "2025-11-04T12:12:00Z",
    dateNeeded: "2025-12-04T12:12:00Z",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 2,
      requesterEmail: "req@gmail.com",
      professorEmail: "prof@ucsb.edu",
      explanation: "need rec",
      dateRequested: "2025-11-04T12:12:00Z",
      dateNeeded: "2025-12-04T12:12:00Z",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "requester@ucsb.edu",
      professorEmail: "professor@ucsb.edu",
      explanation: "need recommendation",
      dateRequested: "2025-11-05T12:12:00Z",
      dateNeeded: "2025-12-05T12:12:00Z",
      done: false,
    },
    {
      id: 4,
      requesterEmail: "requester1234@ucsb.edu",
      professorEmail: "professor0987@ucsb.edu",
      explanation: "need recommendation for school",
      dateRequested: "2025-11-06T12:12:00Z",
      dateNeeded: "2025-12-07T12:12:00Z",
      done: true,
    },
  ],
};

export { recommendationRequestFixtures };
