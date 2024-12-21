import { configureStore } from "firebase/firestore";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;