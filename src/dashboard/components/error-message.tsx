import { InfoIcon as ExclamationCircle } from "lucide-react"

export const ErrorMessage = ({ message }: { message: string | undefined }) => {
  return (
    <div
      className="flex min-h-6 items-center space-x-2 px-3 text-rose-500"
      role="alert"
    >
      {message && (
        <>
          <ExclamationCircle className="h-4 w-4 flex-shrink-0" />
          <p className="pb-1 text-sm font-medium">{message}</p>
        </>
      )}
    </div>
  )
}
