const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: 27,
    reviewerEmail: "cgaucho@ucsb.edu",
    stars: 5,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "Great burrito, best I've ever had!",
  },
  threeReviews: [
    {
      id: 1,
      itemId: 27,
      reviewerEmail: "cgaucho@ucsb.edu",
      stars: 5,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "Great burrito, best I've ever had!",
    },
    {
      id: 2,
      itemId: 29,
      reviewerEmail: "ldelplaya@ucsb.edu",
      stars: 3,
      dateReviewed: "2022-04-03T12:00:00",
      comments: "It was okay, nothing special",
    },
    {
      id: 3,
      itemId: 30,
      reviewerEmail: "ceo@ucsb.edu",
      stars: 4,
      dateReviewed: "2022-07-04T12:00:00",
      comments: "Pretty good pizza, would recommend",
    },
  ],
};

export { menuItemReviewFixtures };
