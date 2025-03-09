# Wallet API

This project is a Nest.js application that provides wallet-related functionalities. It allows users to create, retrieve, update, and delete wallets.

## Installation

To get started with the Wallet API, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/wallet-api.git
   ```

2. Navigate to the project directory:
   ```
   cd wallet-api
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Running the Application

To run the application in development mode, use the following command:
```
npm run start:dev
```

The application will start on `http://localhost:3000`.

## API Endpoints

### Wallets

- **Create a Wallet**
  - `POST /wallet`
  - Request Body: `CreateWalletDto`

- **Get All Wallets**
  - `GET /wallet`

- **Get a Wallet by ID**
  - `GET /wallet/:id`

- **Update a Wallet**
  - `PUT /wallet/:id`
  - Request Body: `CreateWalletDto`

- **Delete a Wallet**
  - `DELETE /wallet/:id`

## Testing

To run the end-to-end tests, use the following command:
```
npm run test:e2e
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.