import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.cart.push(action.payload);
        },
        deleteItem: (state, action) => {
            // payload = pizzaId ( We can use splice also as in redux can mutate state ) but avoided.
            state.cart = state.cart.filter(item => item.pizzaId !== action.payload);
        },
        increaseItemQuantity: (state, action) => {
            const item = state.cart.find(item => item.pizzaId === action.payload);
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice;
        },
        decreaseItemQuantity: (state, action) => {
            const item = state.cart.find(item => item.pizzaId === action.payload);
            item.quantity--;
            item.totalPrice = item.quantity * item.unitPrice;

            if (item.quantity === 0)
                // state.cart = state.cart.filter(item => item.pizzaId !== action.payload);
                cartSlice.caseReducers.deleteItem(state, action); // Can manually call "caseReducer" also.
        },
        clearCart: (state) => {
            state.cart = [];
        }
    }
});

// Selector functions start with "get" key-word. BUT haivng selector functions inside "slice" file is not recommended as it can cause performance issues in larger issues.  SO should use "reselect" library.
// As state is cart AND cart is property in that. SO used "state.cart.cart".
export const getTotalCartQuantity = (state) => state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);
export const getTotalCartPrice = (state) => state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);
export const getCart = state => state.cart.cart;
// Here "id" is argument.
export const getCurrentQuantityById = (id) => {
    return (state) =>
        state.cart.cart.find(item => item.pizzaId === id)?.quantity ?? 0;
}
export const { addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;