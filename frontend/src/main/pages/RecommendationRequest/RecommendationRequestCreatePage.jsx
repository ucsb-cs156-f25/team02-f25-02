import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({ storybook = false }) {
  const addZ = (string) => `${string}Z`;

  const objectToAxiosParams = (recommendationrequest) => ({
    url: "/api/recommendationrequest/post",
    method: "POST",
    params: {
      requesterEmail: recommendationrequest.requesterEmail,
      professorEmail: recommendationrequest.professorEmail,
      explanation: recommendationrequest.explanation,
      dateRequested: addZ(recommendationrequest.dateRequested),
      dateNeeded: addZ(recommendationrequest.dateNeeded),
      done: recommendationrequest.done,
    },
  });

  const onSuccess = (recommendationrequest) => {
    toast(
      `New recommendation request Created - id: ${recommendationrequest.id} requesterEmail: ${recommendationrequest.requesterEmail}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/recommendationrequest/all"], // mutation makes this key stale so that pages relying on it reload
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
        <h1>Create New Recommendation Request</h1>
        <RecommendationRequestForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
