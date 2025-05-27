export default function ActivationWarning() {
    return (
        <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                <div className="p-4 md:p-5 text-center">
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Access to this page is restricted to{" "}
                        <span className="font-semibold text-blue-600 dark:text-blue-400">active members</span> only.{" "}
                        Your account is currently inactive, so you are not allowed to view the content on this page.{" "}
                        <br /><br />
                        To proceed, please{" "}
                        <span className="font-semibold text-green-600 dark:text-green-400">activate your account</span> by completing the required steps.{" "}
                        Once your account is active, you will have full access to the features and information available here.
                        <br /><br />
                        If you believe this is a mistake or have already completed your activation, please refresh the page or contact support.
                    </h3>
                </div>
            </div>
        </div>
    );
}
