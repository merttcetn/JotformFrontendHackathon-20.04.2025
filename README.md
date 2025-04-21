# Jotform Frontend Hackathon Project

## User Information

- **Name**: Mert Çetin

## Project Description

This project is an e-commerce web application developed for the Jotform Frontend Hackathon. It integrates with Jotform APIs to fetch product information and handle payment transactions. It features a responsive user interface that includes product listing, shopping cart functionality, and a checkout process.

## Core Features

- Product display with images, descriptions, and pricing  
- Add/remove functionality in the shopping cart  
- Responsive design for both mobile and desktop  
- State management using Redux  
- Similar product recommendations for each item  
- Real-time total price calculation in the cart  
- Category-based filtering and search feature  
- Dynamic page title based on Jotform form data  

## Dynamic Page Title

The application automatically updates the page title based on the form data fetched from Jotform. This allows different form IDs to display their respective titles on the page.

![Dynamic Page Title](screenshots/dynamic_title.png)

## Search and Filter Features

Users can filter products by category or use the search bar to find specific items on the products page. This feature allows users to quickly find what they're looking for.

![Product Filtering and Search](screenshots/product_filter_search.png)

## Similar Products Feature

In the product detail modal, a list of similar products is displayed. This helps users discover other items they might be interested in.

![Similar Products](screenshots/similar_products.png)

## Dynamic Total Price Calculation

When the quantity of products in the shopping cart changes, the total price is automatically updated. This ensures that users always see the current total amount.

![Total Price Calculation](screenshots/total_price.png)

## Form ID Variations

The application dynamically changes the modal design based on the used form ID:

### Changing the Form ID

You must manually change the form ID in the `App.js` file:

![Changing Form ID](screenshots/to_change_form_id.png)

### Form ID 2 Modal Design

![Form ID 2 Modal Design](screenshots/form_id_2_modal.png)

### Form ID 3 Modal Design

![Form ID 3 Modal Design](screenshots/form_id_3_modal.png)

To see different designs, change the form ID in `App.js`:

```javascript
// Available form IDs: FORM_ID_1, FORM_ID_2, FORM_ID_3
const selectedFORM_ID = FORM_ID_3; // Change to the desired form ID
```

## Technologies Used

- React 19  
- React Router for navigation  
- Redux for state management  
- Material UI components  
- Jotform API integration  

## Getting Started

To run the project locally:

1. Clone the repository  
2. Navigate to the project directory:  
    ```bash
    cd frontend_jotform
    ```
3. Install dependencies:  
    ```bash
    npm install
    ```
4. Start the development server:  
    ```bash
    npm start
    ```
5. Open your browser and go to:  
    [http://localhost:3000](http://localhost:3000)

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
