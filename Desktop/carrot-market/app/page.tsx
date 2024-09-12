import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center flex-col p-5 dark:bg-gray-700">
      <div className="bg-white w-full shadow-lg p-5 rounded-3xl max-w-screen-sm mb-5 dark:bg-gray-600">
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

      <div className="bg-white shadow-lg p-5 rounded-3xl w-full max-w-screen-sm flex flex-col gap-2 ">
        <input
          className="w-full rounded-full h-12 bg-gray-200 pl-5 outline-none ring ring-orange-300 ring-offset-2 focus:ring-offset-blue-300 ring-transparent placeholder:drop-shadow-md"
          type="text"
          placeholder="Search here..."
        />
        <button className="bg-black bg-opacity-40  text-white py-2 rounded-full active:scale-90 focus:scale-90 transition-transform font-medium outline-none">
          Search
        </button>
      </div>
    </main>
  );
}
