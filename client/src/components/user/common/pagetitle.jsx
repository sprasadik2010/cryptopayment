export default function PageTitle({ title }) {
    return (
        <div className="flex justify-center bg-gray-50 py-4">
            <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400 uppercase">
                {title}
            </h3>
        </div>
    );
}