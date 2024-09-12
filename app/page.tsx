import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100  h-screen flex items-center justify-center flex-col p-5">
      <div className="bg-white  w-full shadow-lg p-5 rounded-3xl max-w-screen-sm mb-5 dark:bg-gray-600">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold -mb-1 dark:text-gray-300">
              In transit
            </span>
            <span className="text-4xl font-semibold dark:text-white">
              Cool blue
            </span>
          </div>
          <div className="size-12 bg-orange-500 rounded-full" />
        </div>

        <div className="my-2 flex items-center gap-2">
          <span className="bg-green-400 text-white uppercase px-2.5 py-1.5 text-xs font-medium rounded-full hover:bg-green-500 hover:scale-125 transition">
            Today
          </span>
          <span className="font-semibold dark:text-gray-100">9:30 ~ 10:30</span>
        </div>

        <div className="relative">
          <div className="bg-gray-200 w-full h-2 rounded-full absolute" />
          <div className="bg-green-400 w-2/3 h-2 rounded-full absolute " />
        </div>

        <div className="flex justify-between items-center mt-5 text-gray-600 dark:text-gray-300">
          <span>Expected</span>
          <span>Sorting Center</span>
          <span>In transit</span>
          <span className="text-gray-400 dark:text-gray-500">Delivered</span>
        </div>
      </div>

      <div className="bg-white shadow-lg  p-5 md:flex-row rounded-3xl w-full max-w-screen-sm flex flex-col gap-2 ring ring-transparent transition-shadow *:outline-none has-[:invalid]:ring-red-100 has-[:invalid]:ring ">
        <input
          className="w-full rounded-full h-10 bg-gray-200 pl-5  ring ring-transparent focus:ring-green-500 focus:ring-offset-2 transition-shadow placeholder:drop-shadow invalid:focus:ring-red-500 peer"
          type="text"
          required
          placeholder="Email address"
        />
        <span className=" font-medium hidden peer-invalid:block text-red-500">
          {" "}
          Email is required
        </span>
        <button className="bg-black peer-required:bg-green-500  to-purple-400 md:px-8 bg-opacity-40 peer-invalid:bg-red-100 text-white py-2 rounded-full active:scale-90 focus:scale-90 transition-transform font-medium ">
          Log In
        </button>
      </div>
    </main>
  );
}
