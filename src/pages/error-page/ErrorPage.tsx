import { FallbackProps } from "react-error-boundary"



export const ErrorPage = ({error,resetErrorBoundary}:FallbackProps) => {
  // useEffect(() => {
  //   console.error(error)
  // }, [error])
  console.log(error)
  return (
    <section className="fixed inset-0 flex justify-center items-center  h-screen w-full p-4">
      <div className="flex flex-col gap-4 text-center rounded border-2 border-alert p-4">
        <p className=" text-[160px] leading-none  font-bold">{error.cause ?? 500}</p>
        <h1>{error?.message ?? "unknown error"}</h1>
        <p>something went wrong try again later</p>
        <button className=" capitalize py-4 hover:bg-rose-600 transition-colors font-semibold bg-rose-500 text-white" onClick={resetErrorBoundary}>restart application</button>
      </div>
    </section>
  )
}
