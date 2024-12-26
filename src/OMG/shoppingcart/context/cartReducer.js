const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART_ITEMS":
      return {
        ...state,
        cartItems: action.payload,
        cartQuantity: action.payload.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "ADD_TO_CART": {
      const product = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.uniqueItemId === product.uniqueItemId
      );

      if (existingItemIndex > -1) {
        // If item with the same ID and size exists, update its quantity
        const updatedCartItems = state.cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
        return {
          ...state,
          cartItems: updatedCartItems,
        };
      } else {
        // If item doesn't exist, add to cart
        return {
          ...state,
          cartItems: [...state.cartItems, product],
        };
      }
    }

    case "INIT_CART": {
      return {
        ...state,
        cartItems: action.payload || [],
      };
    }

    case "TOGGLE_CART": {
      return {
        ...state,
        isCartOpen: !state.isCartOpen,
      };
    }

    case "REMOVE_FROM_CART": {
      const { itemId, size } = action.payload;
      const uniqueItemId = `${itemId}-${size}`;

      const updatedCartItems = state.cartItems.filter(
        (item) => item.uniqueItemId !== uniqueItemId
      );

      return {
        ...state,
        cartItems: updatedCartItems,
      };
    }

    case "INCREMENT": {
      const { uniqueItemId } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.uniqueItemId === uniqueItemId
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        ),
      };
    }

    case "DECREMENT": {
      const { uniqueItemId } = action.payload;
      return {
        ...state,
        cartItems: state.cartItems
          .map((item) =>
            item.uniqueItemId === uniqueItemId
              ? { ...item, quantity: Math.max((item.quantity || 0) - 1, 0) }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case "CLEAR_CART": {
      return {
        ...state,
        cartItems: [],
      };
    }

    default:
      return state;
  }
};

export default cartReducer;