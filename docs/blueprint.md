# **App Name**: DataGrid Navigator

## Core Features:

- Profile Display: Displays user profile data fetched from the API. It only shows the first record, and the information isn't editable.
- Paginated Data Grid: Displays paginated comments data with customizable page sizes (10, 50, 100 records per page) and custom pagination logic, without relying on external libraries.
- Partial Search: Enables users to search for comments using partial matching on the 'name', 'email', and 'phone' fields. Implemented using custom search logic.
- Sortable Columns: Sort the 'Post ID', 'Name', and 'Email' columns in ascending or descending order, cycling through no sort, ascending, and descending states upon repeated clicks.
- Client-Side Persistence: Persists the current search query, sort order, current page, and selected page size in the client's browser using local storage, preserving the app state across page reloads.
- Smooth navigation: Navigate smoothly between the user Profile and the Comments Dashboard using React Router

## Style Guidelines:

- Primary color: Deep sky blue (#00BFFF) for a clean and modern look, taken from the design agency 'Ocular'
- Background color: Light gray (#E0E0E0), provides a neutral backdrop that does not distract from the data.
- Accent color: Lavender (#E6E6FA) for interactive elements like buttons and links, ensuring they stand out without overwhelming the interface.
- Body: 'Inter' (sans-serif) for its modern and readable design; Headline: 'Space Grotesk' (sans-serif) for headlines and short amounts of body text; if longer text is anticipated, use 'Inter' for body
- Responsive layout: The app layout will adjust dynamically to fit different screen sizes, ensuring a seamless experience on both desktop and mobile devices.
- Consistent iconography: Use a consistent set of icons throughout the app to represent actions and data types. All the icons need to be in filled mode
- Smooth transitions: Apply subtle animations to page transitions and data updates to provide a polished and engaging user experience.