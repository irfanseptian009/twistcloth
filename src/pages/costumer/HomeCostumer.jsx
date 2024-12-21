
import { FaSortAmountUp, FaCalendarAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchItems } from "../../store/features/items/Action";
import { Banner, Footer, ProductCard, ReviewCard } from "../../components/costumer";
import Collections from "./Collections";
import Shop from "./Shop";



const HomeCostumer = () => {

const dispatch = useDispatch();


useEffect(() => {
  dispatch(fetchItems());
}, [dispatch]);

  return (
    <>
      <div className="bg-gray-100">
        <Banner/>
      </div>
      <div className="container mx-auto mt-8 p-4">
        {/* Product Grid */}
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Products</h2>
        <div className="flex -mb-5 justify-end">
          {/* Sort by Price */}
          <div className="relative flex flex-row p-4">
            {" "}
            {/* Tambahkan relative untuk positioning ikon */}
            <label htmlFor="sort-by-price" className=" text-gray-700 ">
              <FaSortAmountUp className="w-5 h-6 " />
            </label>
            <select
              id="sort-by-price"
              name="sortByPrice"
              // onChange={handleChangeSorting}
              className=" -mt-1 block w-full ml-1 rounded-lg text-center bg-white border-gray-300 shadow-md focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50 appearance"
            >
              <option value="">None</option>
              <option value="highest">Highest</option>
              <option value="lowest">Lowest</option>
            </select>
          </div>

          {/* Sort by Date */}
          <div className="relative flex flex-row p-4">
            {" "}
            {/* Tambahkan relative untuk positioning ikon */}
            <label htmlFor="sort-by-date" className="block text-gray-700">
              <FaCalendarAlt className="w-5 h-6" />
            </label>
            <select
              id="sort-by-date"
              name="sortByDate"
              // onChange={handleChangeSorting}
              className="-mt-1 block w-full ml-2 rounded-lg text-center bg-white border-gray-300 shadow-md focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50   appearance"
            >
              <option value="">None</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 font-serif gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <ProductCard />
        </div>{" "}
        <div id="bestseller">
          <Shop />
        </div>
        <div id="collections">
          <Collections />
        </div>
        <div id="review">
          <ReviewCard />
        </div>
      </div>{" "}
      <Footer />
    </>
  )
}
export default HomeCostumer
