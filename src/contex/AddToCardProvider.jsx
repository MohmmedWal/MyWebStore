import { useEffect, useState } from "react";
import AddToCardContext from "./AddToCardContext";
const AddToCardProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCartItems = localStorage.getItem("cartItems");
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);
    const addToCart = (item, qty) => {
        const productInCart = cartItems.find((card) => card.id == item.id);
        if (productInCart) {
            const updatedCart = cartItems.map((card) => {
                if (card.id == item.id) {
                    return { ...card, qty: card.qty + qty };
                }
                return card;
            });
            setCartItems(updatedCart);


        } else {
            setCartItems([...cartItems, { ...item, qty }]);
        }

    }
    const deleatFromCart = (item) => {
        const productDel = cartItems.filter((card) => card.id != item.id)
        setCartItems(productDel)

    }




    return (
        <AddToCardContext.Provider value={{ cartItems, setCartItems, addToCart, deleatFromCart }}>
            {children}
        </AddToCardContext.Provider>
    );

}
export default AddToCardProvider;
