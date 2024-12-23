# Remix Contact App with Strapi Backend

This is a fully functional contact management application built using Remix as the front-end and Strapi as the backend. The app allows users to create, update, delete, and search contacts, with real-time updates and optimized API interactions.

## Features

- **Create Contact**: Add new contacts with essential details.
- **Update Contact**: Edit contact information with prefilled forms.
- **Delete Contact**: Remove contacts seamlessly with confirmation prompts.
- **Search Contacts**: Real-time search functionality with optimized API calls.
- **Favorite Contacts**: Mark contacts as favorites and update them instantly.
- **Error Handling**: Custom error boundaries for better user feedback.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/syakirurahman/remix-strapi.git
   cd remix-strapi
   ```


2. Install Strapi dependencies and run the backend:
   ```bash
   cd strapi-backend
   npm install
   npm run develop
   ```

4. Run the Remix app:
   ```bash
   cd ../remix
   npm run dev
   ```

5. Access the app at `http://localhost:5173`.

## Optimization Challenges

This project includes areas for improvement:
- **Debounced Search**: Optimize API calls to trigger only when the user stops typing.
- **Highlight Selected Contact**: Use `NavLink` to style the active and pending states.
- **Prevent Page Reloads**: Use `useFetcher` to handle actions without refreshing the page.
- **Enhanced Error Handling**: Display Strapi error messages in the `ErrorBoundary`.

Explore the code and enhance the functionality on your own!
