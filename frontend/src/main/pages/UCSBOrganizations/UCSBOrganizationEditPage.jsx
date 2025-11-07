import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router";
import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { Navigate } from "react-router";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
  let { orgCode } = useParams();

  const {
    data: ucsbOrganization,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsborganization?orgCode=${orgCode}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsborganization`,
      params: {
        orgCode,
      },
    },
  );

  const objectToAxiosPutParams = (ucsbOrganization) => ({
    url: "/api/ucsborganization",
    method: "PUT",
    params: {
      orgCode: ucsbOrganization.orgCode,
    },
    data: {
      orgTranslationShort: ucsbOrganization.orgTranslationShort,
      orgTranslation: ucsbOrganization.orgTranslation,
      inactive: ucsbOrganization.inactive,
    },
  });

  const onSuccess = (ucsbOrganization) => {
    toast(
      `UCSB Organization Updated - orgCode: ${ucsbOrganization.orgCode} orgTranslationShort: ${ucsbOrganization.orgTranslationShort}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsborganization?orgCode=${orgCode}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate({
      ...data,
      inactive: data.inactive === "true", // "true"/"false" -> boolean
    });
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganizations" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSB Organization</h1>
        {ucsbOrganization && (
          <UCSBOrganizationForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={{
              ...ucsbOrganization,
              // make it "true"/"false" so RHF sees a non-empty value
              inactive: String(ucsbOrganization.inactive),
            }}
          />
        )}
      </div>
    </BasicLayout>
  );
}
