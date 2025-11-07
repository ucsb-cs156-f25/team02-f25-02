import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: recommendationRequests,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/recommendationrequest?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/recommendationrequest`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (recommendationRequests) => ({
    url: "/api/recommendationrequest",
    method: "PUT",
    params: {
      id: recommendationRequests.id,
    },
    data: {
      id: recommendationRequests.id,
      requesterEmail: recommendationRequests.requesterEmail,
      professorEmail: recommendationRequests.professorEmail,
      explanation: recommendationRequests.explanation,
      dateRequested: `${recommendationRequests.dateRequested}:00Z`,
      dateNeeded: `${recommendationRequests.dateNeeded}:00Z`,
      done: recommendationRequests.done,
    },
  });

  const onSuccess = (recommendationRequests) => {
    toast(
      `Recommendation Request Updated - id: ${recommendationRequests.id} Requester email: ${recommendationRequests.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/recommendationrequest?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequest" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Recommendation Request</h1>
        {recommendationRequests && (
          <RecommendationRequestForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={recommendationRequests}
          />
        )}
      </div>
    </BasicLayout>
  );
}
